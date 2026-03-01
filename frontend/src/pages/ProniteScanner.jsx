"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

// Generate an "Approved" beep sound using Web Audio API
const playApprovedSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play a pleasant success chime
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 chord
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.5);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.5);
    });

    // Speak "Approved"
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance("Approved");
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      setTimeout(() => window.speechSynthesis.speak(utterance), 400);
    }
  } catch (e) {
    console.error("Sound error:", e);
  }
};

const playErrorSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 200;
    osc.type = "square";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error("Sound error:", e);
  }
};

export default function ProniteScanner() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [result, setResult] = useState(null); // { success, message, data }
  const [lastScannedToken, setLastScannedToken] = useState(null);
  const lastScannedTokenRef = useRef(null);
  const handleQrDataRef = useRef(null);

  // Load jsQR library as fallback for browsers without BarcodeDetector
  useEffect(() => {
    if (!("BarcodeDetector" in window)) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
      script.async = true;
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  // Check scanner access
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }

    const checkAccess = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/pronites/check-scanner`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!data.success || !data.isScanner) {
          navigate("/", { replace: true });
          return;
        }
        setHasAccess(true);
      } catch (e) {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, [authLoading, isAuthenticated, navigate]);

  // Attach stream to video element once cameraActive renders the <video> tag
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((e) => console.error("Video play error:", e));
    }
  }, [cameraActive]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setResult(null);
      setLastScannedToken(null);
      lastScannedTokenRef.current = null;
      setCameraActive(true);
      setScanning(true);
    } catch (e) {
      console.error("Camera access denied:", e);
      // Try without facingMode constraint as fallback
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        setResult(null);
        setLastScannedToken(null);
        lastScannedTokenRef.current = null;
        setCameraActive(true);
        setScanning(true);
      } catch (e2) {
        alert("Camera access is required to scan QR codes. Please allow camera access and try again.");
      }
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setScanning(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // QR scanning loop using BarcodeDetector API or jsQR fallback
  useEffect(() => {
    if (!scanning || !cameraActive) return;

    let animFrameId;
    let barcodeDetector;
    if ("BarcodeDetector" in window) {
      barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] });
    }

    const scan = async () => {
      if (!videoRef.current || !canvasRef.current) {
        animFrameId = requestAnimationFrame(scan);
        return;
      }
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState < 2 || video.videoWidth === 0) {
        animFrameId = requestAnimationFrame(scan);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        if (barcodeDetector) {
          const barcodes = await barcodeDetector.detect(canvas);
          if (barcodes.length > 0) {
            handleQrDataRef.current?.(barcodes[0].rawValue);
            return; // stop loop after detection, handleQrData will setScanning(false)
          }
        } else if (window.jsQR) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = window.jsQR(imageData.data, canvas.width, canvas.height);
          if (code) {
            handleQrDataRef.current?.(code.data);
            return;
          }
        }
      } catch (e) {
        // Ignore scan errors
      }

      animFrameId = requestAnimationFrame(scan);
    };

    animFrameId = requestAnimationFrame(scan);
    return () => cancelAnimationFrame(animFrameId);
  }, [scanning, cameraActive]);

  const handleQrData = useCallback(async (rawData) => {
    // Prevent duplicate scans of the same QR
    if (rawData === lastScannedTokenRef.current) return;
    lastScannedTokenRef.current = rawData;
    setLastScannedToken(rawData);
    setScanning(false); // Pause scanning while processing

    try {
      const qrPayload = JSON.parse(rawData);
      const { token, registrationId, proniteId } = qrPayload;

      if (!token || !registrationId) {
        setResult({
          success: false,
          message: "Invalid QR code format",
        });
        playErrorSound();
        return;
      }

      const res = await fetch(`${API_BASE_URL}/pronites/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, registrationId, proniteId }),
      });

      const data = await res.json();

      if (data.success) {
        setResult({
          success: true,
          message: "Ticket verified successfully!",
          data: data.data,
        });
        playApprovedSound();
      } else {
        setResult({
          success: false,
          message: data.message || "Verification failed",
          data: data.data || null,
        });
        playErrorSound();
      }
    } catch (e) {
      setResult({
        success: false,
        message: "Invalid QR code",
      });
      playErrorSound();
    }
  }, []);

  // Keep ref in sync so the scan loop always calls the latest version
  useEffect(() => {
    handleQrDataRef.current = handleQrData;
  }, [handleQrData]);

  const handleScanAnother = () => {
    setResult(null);
    setLastScannedToken(null);
    lastScannedTokenRef.current = null;
    setScanning(true);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508]">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasAccess) return null;

  return (
    <div className="min-h-screen bg-[#050508] pt-14 md:pt-8 pb-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          <span className="text-purple-400">📸</span> QR Scanner
        </h1>
        <p className="text-sm text-white/50">
          Scan tickets at the venue entrance
        </p>
      </motion.div>

      <div className="max-w-lg mx-auto">
        {/* Camera View */}
        {!cameraActive && !result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-5xl">📷</span>
            </div>
            <p className="text-white/60 mb-6">
              Open your camera to start scanning tickets
            </p>
            <button
              onClick={startCamera}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold tracking-wider text-lg hover:from-purple-500 hover:to-pink-500 transition-all cursor-pointer"
            >
              START SCANNING
            </button>
          </motion.div>
        )}

        {cameraActive && (
          <div className="relative">
            {/* Video feed */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 w-full h-96 bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />

              {/* Scanning overlay */}
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    className="w-56 h-56 border-2 border-purple-400/60 rounded-2xl"
                    animate={{
                      borderColor: [
                        "rgba(147, 51, 234, 0.6)",
                        "rgba(147, 51, 234, 0.2)",
                        "rgba(147, 51, 234, 0.6)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {/* Scanning line */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-52 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                    animate={{ y: [-100, 100] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                </div>
              )}

              {/* Status indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    scanning ? "bg-green-400 animate-pulse" : "bg-yellow-400"
                  }`}
                />
                <span className="text-white text-xs font-medium">
                  {scanning ? "Scanning..." : "Processing..."}
                </span>
              </div>
            </div>

            {/* Stop button */}
            <button
              onClick={stopCamera}
              className="mt-4 w-full py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm hover:bg-red-500/30 transition-colors"
            >
              Stop Camera
            </button>

            {/* Hidden canvas for frame capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="mt-6"
            >
              <div
                className={`rounded-2xl border p-6 ${
                  result.success
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                {/* Status Icon */}
                <div className="text-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                      result.success ? "bg-green-500/20" : "bg-red-500/20"
                    }`}
                  >
                    <span className="text-5xl">
                      {result.success ? "✓" : "✕"}
                    </span>
                  </motion.div>
                  <h2
                    className={`mt-3 text-xl font-bold ${
                      result.success ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    {result.success ? "APPROVED" : "REJECTED"}
                  </h2>
                  <p className="text-white/50 text-sm mt-1">{result.message}</p>
                </div>

                {/* User Details */}
                {result.data?.user && (
                  <div className="rounded-xl bg-black/30 border border-white/10 p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      {result.data.user.avatar && (
                        <img
                          src={result.data.user.avatar}
                          alt="Avatar"
                          className="w-12 h-12 rounded-full border border-white/10"
                        />
                      )}
                      <div>
                        <p className="text-white font-semibold">
                          {result.data.user.name}
                        </p>
                        <p className="text-white/40 text-xs">
                          {result.data.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {result.data.user.collegeName && (
                        <div>
                          <p className="text-white/30">College</p>
                          <p className="text-white/70">
                            {result.data.user.collegeName}
                          </p>
                        </div>
                      )}
                      {result.data.user.contactNumber && (
                        <div>
                          <p className="text-white/30">Contact</p>
                          <p className="text-white/70">
                            {result.data.user.contactNumber}
                          </p>
                        </div>
                      )}
                      {result.data.pronite && (
                        <div>
                          <p className="text-white/30">Pronite</p>
                          <p className="text-white/70">
                            {result.data.pronite.title}
                          </p>
                        </div>
                      )}
                      {result.data.scannedAt && (
                        <div>
                          <p className="text-white/30">Scanned At</p>
                          <p className="text-white/70">
                            {new Date(result.data.scannedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Already scanned info */}
                {!result.success && result.data?.scannedAt && (
                  <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-3 mt-3">
                    <p className="text-yellow-300 text-xs">
                      Previously scanned at{" "}
                      {new Date(result.data.scannedAt).toLocaleString()} by{" "}
                      {result.data.scannedBy || "unknown"}
                    </p>
                  </div>
                )}

                {/* Scan Another Button */}
                <button
                  onClick={handleScanAnother}
                  className="mt-4 w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold tracking-wider hover:from-purple-500 hover:to-pink-500 transition-all cursor-pointer"
                >
                  SCAN ANOTHER TICKET
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
