"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

// ── Sounds ─────────────────────────────────────────────────────────────────

const playApprovedSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
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
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance("Approved");
      u.rate = 0.9;
      setTimeout(() => window.speechSynthesis.speak(u), 400);
    }
  } catch {}
};

const playErrorSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 220;
    osc.type = "square";
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
};

// ── Reason → human-readable config ─────────────────────────────────────────

const REJECTION_CONFIG = {
  already_scanned: {
    icon: "⚠️",
    title: "Already Checked In",
    color: "yellow",
    autoResumeMs: 4000,
  },
  wrong_pronite: {
    icon: "🚫",
    title: "Wrong Night",
    color: "orange",
    autoResumeMs: 3500,
  },
  not_found: {
    icon: "❌",
    title: "Unknown Ticket",
    color: "red",
    autoResumeMs: 3000,
  },
  invalid_qr: {
    icon: "❓",
    title: "Invalid QR",
    color: "red",
    autoResumeMs: 2500,
  },
  wrong_scanner: {
    icon: "🔒",
    title: "Wrong Scanner",
    color: "red",
    autoResumeMs: 3000,
  },
};

const colorMap = {
  green: {
    bg: "bg-green-500/15",
    border: "border-green-500/40",
    title: "text-green-300",
    badge: "bg-green-500/20 text-green-300",
  },
  yellow: {
    bg: "bg-yellow-500/15",
    border: "border-yellow-500/40",
    title: "text-yellow-300",
    badge: "bg-yellow-500/20 text-yellow-300",
  },
  orange: {
    bg: "bg-orange-500/15",
    border: "border-orange-500/40",
    title: "text-orange-300",
    badge: "bg-orange-500/20 text-orange-300",
  },
  red: {
    bg: "bg-red-500/15",
    border: "border-red-500/40",
    title: "text-red-300",
    badge: "bg-red-500/20 text-red-300",
  },
};

// ── Component ───────────────────────────────────────────────────────────────

export default function ProniteScanner() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const lastScannedRef = useRef(null);
  const handleQrDataRef = useRef(null);
  const autoResumeTimerRef = useRef(null);

  const [assignedPronites, setAssignedPronites] = useState([]);
  const [selectedProniteId, setSelectedProniteId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // { success, reason, message, data, autoResumeMs }

  // Load jsQR fallback
  useEffect(() => {
    if (!("BarcodeDetector" in window)) {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
      s.async = true;
      document.head.appendChild(s);
      return () => document.head.removeChild(s);
    }
  }, []);

  // Access check
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { navigate("/", { replace: true }); return; }

    const check = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/pronites/check-scanner`, { credentials: "include" });
        const data = await res.json();
        if (!data.success || !data.isScanner) { navigate("/", { replace: true }); return; }
        setAssignedPronites(data.pronites);
        if (data.pronites.length === 1) setSelectedProniteId(data.pronites[0]._id);
      } catch { navigate("/", { replace: true }); }
      finally { setPageLoading(false); }
    };
    check();
  }, [authLoading, isAuthenticated, navigate]);

  // Sync video stream
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive]);

  const resumeScanning = useCallback(() => {
    clearTimeout(autoResumeTimerRef.current);
    setResult(null);
    lastScannedRef.current = null;
    setScanning(true);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setResult(null);
      lastScannedRef.current = null;
      setCameraActive(true);
      setScanning(true);
    } catch {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        setResult(null);
        lastScannedRef.current = null;
        setCameraActive(true);
        setScanning(true);
      } catch {
        alert("Camera access is required to scan QR codes.");
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    clearTimeout(autoResumeTimerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
    setScanning(false);
    setResult(null);
    lastScannedRef.current = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  // QR scan loop — runs only while scanning=true
  useEffect(() => {
    if (!scanning || !cameraActive) return;

    let animId;
    let detector;
    if ("BarcodeDetector" in window) {
      detector = new BarcodeDetector({ formats: ["qr_code"] });
    }

    const tick = async () => {
      if (!videoRef.current || !canvasRef.current) { animId = requestAnimationFrame(tick); return; }
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video.readyState < 2 || video.videoWidth === 0) { animId = requestAnimationFrame(tick); return; }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        if (detector) {
          const codes = await detector.detect(canvas);
          if (codes.length > 0) { handleQrDataRef.current?.(codes[0].rawValue); return; }
        } else if (window.jsQR) {
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = window.jsQR(img.data, canvas.width, canvas.height);
          if (code) { handleQrDataRef.current?.(code.data); return; }
        }
      } catch {}

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [scanning, cameraActive]);

  // Handle decoded QR data
  const handleQrData = useCallback(
    async (raw) => {
      if (raw === lastScannedRef.current) return;
      lastScannedRef.current = raw;
      setScanning(false); // pause while processing

      let resultObj;

      try {
        const payload = JSON.parse(raw);
        const { token, sheetRegId, registrationId, proniteId } = payload;
        const regId = sheetRegId || registrationId;

        if (!token || !regId) {
          resultObj = { success: false, reason: "invalid_qr", message: "Not a valid ticket QR code", autoResumeMs: 2500 };
          playErrorSound();
        } else if (proniteId && selectedProniteId && proniteId !== selectedProniteId) {
          const wrongName = assignedPronites.find((p) => p._id === selectedProniteId)?.title || "tonight's pronite";
          resultObj = {
            success: false,
            reason: "wrong_scanner",
            message: `This ticket is not for ${wrongName}`,
            autoResumeMs: 3000,
          };
          playErrorSound();
        } else {
          const res = await fetch(`${API_BASE_URL}/pronites/scan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ token, sheetRegId: regId, proniteId: proniteId || selectedProniteId }),
          });
          const data = await res.json();

          const cfg = data.success
            ? { autoResumeMs: 4000 }
            : REJECTION_CONFIG[data.reason] || { autoResumeMs: 3000 };

          resultObj = {
            success: data.success,
            reason: data.reason || null,
            message: data.message,
            data: data.data || null,
            autoResumeMs: cfg.autoResumeMs,
          };

          data.success ? playApprovedSound() : playErrorSound();
        }
      } catch {
        resultObj = { success: false, reason: "invalid_qr", message: "Could not read QR code", autoResumeMs: 2500 };
        playErrorSound();
      }

      setResult(resultObj);

      // Auto-resume after a delay
      autoResumeTimerRef.current = setTimeout(() => {
        setResult(null);
        lastScannedRef.current = null;
        setScanning(true);
      }, resultObj.autoResumeMs);
    },
    [selectedProniteId, assignedPronites]
  );

  useEffect(() => { handleQrDataRef.current = handleQrData; }, [handleQrData]);

  if (pageLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508]">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const selectedPronite = assignedPronites.find((p) => p._id === selectedProniteId);
  const resultCfg = result
    ? result.success
      ? { icon: "✓", title: "Approved", color: "green", ...result }
      : { ...(REJECTION_CONFIG[result.reason] || { icon: "✕", title: "Rejected", color: "red", autoResumeMs: 3000 }), ...result }
    : null;
  const colors = resultCfg ? colorMap[resultCfg.color] : null;

  return (
    <div className="min-h-screen bg-[#050508] pt-14 md:pt-8 pb-8 px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-center">
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 text-white/60 hover:text-white/80 mb-3">
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-white">
          <span className="text-purple-400">📸</span> QR Scanner
        </h1>
        <p className="text-sm text-white/40 mt-1">Scan tickets at the venue entrance</p>
      </motion.div>

      <div className="max-w-sm mx-auto">
        {/* Pronite selector */}
        {assignedPronites.length > 1 && (
          <div className="mb-4">
            <p className="text-xs text-white/40 mb-2 text-center">Select tonight&apos;s pronite:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {assignedPronites.map((p) => (
                <button
                  key={p._id}
                  onClick={() => { setSelectedProniteId(p._id); stopCamera(); }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedProniteId === p._id
                      ? "bg-purple-500/30 border border-purple-500/50 text-purple-200"
                      : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {!selectedProniteId ? (
          <p className="text-center py-12 text-white/40 text-sm">Select a pronite above to start scanning.</p>
        ) : (
          <>
            {/* Active pronite badge */}
            <div className="text-center mb-3">
              <span className="px-3 py-1 rounded-full text-xs bg-purple-500/20 border border-purple-500/30 text-purple-300">
                {selectedPronite?.title} — {selectedPronite?.artist}
              </span>
            </div>

            {/* Camera idle */}
            {!cameraActive && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-4xl">📷</span>
                </div>
                <button
                  onClick={startCamera}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  START SCANNING
                </button>
              </motion.div>
            )}

            {/* Camera view */}
            {cameraActive && (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black" style={{ aspectRatio: "3/4" }}>
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />

                {/* Scan overlay (shown when actively scanning) */}
                {scanning && !result && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      className="w-52 h-52 border-2 border-purple-400/70 rounded-2xl"
                      animate={{ borderColor: ["rgba(167,139,250,0.7)", "rgba(167,139,250,0.2)", "rgba(167,139,250,0.7)"] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute w-48 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                      animate={{ y: [-90, 90] }}
                      transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />
                  </div>
                )}

                {/* Status dot */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                  <div className={`w-1.5 h-1.5 rounded-full ${scanning ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} />
                  <span className="text-white text-xs">{scanning ? "Ready" : "Processing…"}</span>
                </div>

                {/* Stop button */}
                <button
                  onClick={stopCamera}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 text-white/70 text-xs hover:bg-black/80"
                >
                  Stop
                </button>

                {/* Result overlay — shown on top of camera */}
                <AnimatePresence>
                  {result && resultCfg && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute inset-0 flex flex-col items-center justify-center p-5 ${colors.bg} backdrop-blur-sm`}
                    >
                      {/* Big icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className={`w-24 h-24 rounded-full flex items-center justify-center border-2 ${colors.border} mb-3`}
                        style={{ background: "rgba(0,0,0,0.4)" }}
                      >
                        <span className="text-5xl">{resultCfg.icon}</span>
                      </motion.div>

                      <h2 className={`text-2xl font-bold ${colors.title} mb-1`}>{resultCfg.title}</h2>
                      <p className="text-white/70 text-sm text-center mb-4">{result.message}</p>

                      {/* Attendee info on success */}
                      {result.success && result.data?.attendee && (
                        <div className="w-full rounded-xl bg-black/40 border border-white/10 p-3 mb-4 text-left space-y-1">
                          <p className="text-white font-semibold text-sm">{result.data.attendee.name}</p>
                          <p className="text-white/50 text-xs">{result.data.attendee.email}</p>
                          {result.data.attendee.college && (
                            <p className="text-white/40 text-xs">🎓 {result.data.attendee.college}</p>
                          )}
                        </div>
                      )}

                      {/* Already scanned — show who / when */}
                      {result.reason === "already_scanned" && result.data?.attendee && (
                        <div className="w-full rounded-xl bg-black/40 border border-yellow-500/20 p-3 mb-4 text-left space-y-1">
                          <p className="text-white/80 text-sm font-medium">{result.data.attendee.name}</p>
                          <p className="text-white/50 text-xs">{result.data.attendee.email}</p>
                          {result.data.scannedBy && (
                            <p className="text-yellow-300/60 text-xs mt-1">Scanned by {result.data.scannedBy}</p>
                          )}
                        </div>
                      )}

                      {/* Auto-resume countdown bar */}
                      <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${result.success ? "bg-green-400" : "bg-white/40"}`}
                          initial={{ width: "100%" }}
                          animate={{ width: "0%" }}
                          transition={{ duration: (resultCfg.autoResumeMs || 3000) / 1000, ease: "linear" }}
                        />
                      </div>
                      <p className="text-white/30 text-xs mt-1">Resuming automatically…</p>

                      <button
                        onClick={resumeScanning}
                        className="mt-3 px-6 py-2 rounded-xl bg-white/10 border border-white/20 text-white/70 text-sm hover:bg-white/20"
                      >
                        Scan Now
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
