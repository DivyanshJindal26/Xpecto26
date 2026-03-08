"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useAuth } from "../context/AuthContext";
import OptimizedImage from "../components/ui/OptimizedImage";
import FloatingElement from "../components/ui/FloatingElement";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

// ─── Registration Modal ─────────────────────────────────────
const RegisterModal = ({ pronite, isOpen, onClose }) => {
  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const [step, setStep] = useState("info"); // info | payment | uploading | done
  const [paymentProofImage, setPaymentProofImage] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && isAuthenticated && pronite) {
      checkExisting();
    }
    if (!isOpen) {
      setStep("info");
      setPaymentProofImage(null);
      setTransactionId("");
      setError(null);
    }
  }, [isOpen, pronite]);

  const checkExisting = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/pronites/${pronite._id}/my-registration`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success && data.data) {
        setRegistration(data.data);
        if (data.data.status === "approved") {
          fetchQr();
          setStep("done");
        } else if (data.data.status === "pending") {
          setStep("done");
        } else if (data.data.status === "denied") {
          setStep("info");
        }
      }
    } catch (e) {
      // No existing registration
    }
  };

  const fetchQr = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/pronites/${pronite._id}/my-qr`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setQrCode(data.data.qrCode);
      }
    } catch (e) {
      console.error("Failed to fetch QR:", e);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPaymentProofImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!paymentProofImage) {
      setError("Please upload payment proof");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/pronites/${pronite._id}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ paymentProofImage, transactionId }),
        }
      );
      const data = await res.json();

      if (data.success) {
        setRegistration(data.data);
        setStep("done");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!pronite) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-lg mx-auto"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-[#0a0a12] border border-white/10 shadow-2xl">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <span className="text-white text-sm">✕</span>
              </button>

              {/* Header */}
              <div className="p-6 pb-0">
                <h2 className="font-['Michroma'] text-xl text-white font-semibold">
                  {pronite.title}
                </h2>
                <p className="text-purple-300 text-sm mt-1">{pronite.artist}</p>
              </div>

              <div className="p-6">
                {!isAuthenticated ? (
                  <div className="text-center py-8">
                    <p className="text-white/60 mb-4">
                      Please sign in to register
                    </p>
                    <button
                      onClick={loginWithGoogle}
                      className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-colors cursor-pointer"
                    >
                      Sign in with Google
                    </button>
                  </div>
                ) : step === "done" ? (
                  <div className="text-center py-4">
                    {registration?.status === "pending" && (
                      <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <span className="text-3xl">⏳</span>
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">
                          Registration Pending
                        </h3>
                        <p className="text-white/50 text-sm">
                          Your payment proof is being reviewed. You&apos;ll
                          receive an email once approved.
                        </p>
                      </>
                    )}
                    {registration?.status === "approved" && (
                      <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                          <span className="text-3xl">✓</span>
                        </div>
                        <h3 className="text-green-300 text-lg font-semibold mb-2">
                          Approved!
                        </h3>
                        <p className="text-white/50 text-sm mb-4">
                          Show this QR code at the venue entrance
                        </p>
                        {qrCode && (
                          <img
                            src={qrCode}
                            alt="Entry QR Code"
                            className="w-48 h-48 mx-auto rounded-xl border border-white/10"
                          />
                        )}
                      </>
                    )}
                    {registration?.status === "denied" && (
                      <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                          <span className="text-3xl">✕</span>
                        </div>
                        <h3 className="text-red-300 text-lg font-semibold mb-2">
                          Registration Denied
                        </h3>
                        <p className="text-white/50 text-sm mb-2">
                          {registration.denialReason}
                        </p>
                        <button
                          onClick={() => {
                            setStep("info");
                            setPaymentProofImage(null);
                          }}
                          className="mt-4 px-5 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-500/30 transition-colors cursor-pointer"
                        >
                          Re-register
                        </button>
                      </>
                    )}
                  </div>
                ) : step === "info" ? (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/50 text-sm">Price</span>
                        <span className="text-white font-semibold">
                          ₹{pronite.ticketPrice}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50 text-sm">
                          Available
                        </span>
                        <span className="text-white">
                          {pronite.availableTickets}/{pronite.maxCapacity}
                        </span>
                      </div>
                      {pronite.date && (
                        <div className="flex justify-between">
                          <span className="text-white/50 text-sm">Date</span>
                          <span className="text-white">
                            {new Date(pronite.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                      {pronite.venue && (
                        <div className="flex justify-between">
                          <span className="text-white/50 text-sm">Venue</span>
                          <span className="text-white">{pronite.venue}</span>
                        </div>
                      )}
                    </div>

                    {pronite.availableTickets > 0 ? (
                      <button
                        onClick={() => setStep("payment")}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold tracking-wider hover:from-purple-500 hover:to-pink-500 transition-all cursor-pointer"
                      >
                        REGISTER NOW — ₹{pronite.ticketPrice}
                      </button>
                    ) : (
                      <div className="text-center py-4 text-red-300">
                        Sold Out!
                      </div>
                    )}
                  </div>
                ) : (
                  /* step === "payment" */
                  <div className="space-y-4">
                    {/* Payment QR */}
                    {pronite.paymentQrImage && (
                      <div className="text-center">
                        <p className="text-white/60 text-sm mb-3">
                          Scan to pay ₹{pronite.ticketPrice}
                        </p>
                        <img
                          src={pronite.paymentQrImage}
                          alt="Payment QR"
                          className="w-48 h-48 mx-auto rounded-xl border border-white/10"
                        />
                        {pronite.upiId && (
                          <p className="text-white/40 text-xs mt-2">
                            UPI: {pronite.upiId}
                          </p>
                        )}
                      </div>
                    )}

                    {!pronite.paymentQrImage && pronite.upiId && (
                      <div className="text-center rounded-xl bg-white/5 border border-white/10 p-4">
                        <p className="text-white/60 text-sm mb-2">
                          Pay ₹{pronite.ticketPrice} to:
                        </p>
                        <p className="text-white font-semibold text-lg">
                          {pronite.upiId}
                        </p>
                      </div>
                    )}

                    {/* Transaction ID */}
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">
                        Transaction ID (optional)
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter transaction/UTR number"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      />
                    </div>

                    {/* Upload Payment Proof */}
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">
                        Upload Payment Screenshot *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full text-sm text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-white/10 file:bg-white/5 file:text-white/70 file:text-sm hover:file:bg-white/10 file:cursor-pointer"
                      />
                      {paymentProofImage && (
                        <img
                          src={paymentProofImage}
                          alt="Proof preview"
                          className="mt-2 w-full max-h-48 object-contain rounded-lg border border-white/10"
                        />
                      )}
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm text-center">
                        {error}
                      </p>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep("info")}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 text-sm transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={submitting || !paymentProofImage}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 transition-all cursor-pointer"
                      >
                        {submitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── Pronite Card ────────────────────────────────────────────
const ProniteCard = ({ pronite, index, total, onRegister }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Different accent colors for each pronite
  const accents = [
    { gradient: "from-purple-600 via-violet-500 to-fuchsia-500", glow: "rgba(147, 51, 234, 0.4)", border: "border-purple-500/30" },
    { gradient: "from-cyan-500 via-blue-500 to-indigo-500", glow: "rgba(59, 130, 246, 0.4)", border: "border-blue-500/30" },
    { gradient: "from-rose-500 via-pink-500 to-orange-500", glow: "rgba(244, 63, 94, 0.4)", border: "border-rose-500/30" },
  ];
  const accent = accents[index % 3];

  return (
    <motion.div
      className={`relative w-full max-w-md mx-auto ${total === 1 ? 'lg:max-w-lg' : total === 2 ? 'lg:max-w-md' : ''}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <div
        className={`relative overflow-hidden rounded-3xl bg-black/60 backdrop-blur-xl border ${accent.border} cursor-pointer group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: `0 0 80px ${accent.glow}, inset 0 0 60px ${accent.glow}`,
          }}
        />

        {/* Artist Image */}
        <div className="relative h-72 sm:h-80 overflow-hidden">
          {pronite.image ? (
            <img
              src={pronite.image}
              alt={pronite.artist}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${accent.gradient} opacity-20 flex items-center justify-center`}>
              <span className="text-8xl opacity-30">♫</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Price Badge */}
          <div className="absolute top-5 right-5">
            <motion.div
              className={`px-4 py-2 rounded-full bg-gradient-to-r ${accent.gradient} shadow-lg`}
              animate={{ scale: isHovered ? 1.05 : 1 }}
            >
              <span className="font-['Michroma'] text-white text-sm font-bold">
                ₹{pronite.ticketPrice}
              </span>
            </motion.div>
          </div>

          {/* Genre Badge */}
          {pronite.genre && (
            <div className="absolute top-5 left-5">
              <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                <span className="font-['Michroma'] text-xs text-white/80 tracking-wider uppercase">
                  {pronite.genre}
                </span>
              </div>
            </div>
          )}

          {/* Night indicator */}
          <div className="absolute bottom-5 right-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="font-['Michroma'] text-xs text-white/70">
              NIGHT {index + 1}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-6 sm:p-8 space-y-4">
          {/* Artist Name - Large */}
          <div>
            <motion.h2
              className={`font-['Michroma'] text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${accent.gradient} leading-tight`}
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {pronite.artist}
            </motion.h2>
            <h3 className="font-['Michroma'] text-white/60 text-sm mt-1">
              {pronite.title}
            </h3>
          </div>

          {/* Divider */}
          <motion.div
            className={`h-0.5 bg-gradient-to-r ${accent.gradient} rounded-full`}
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Description */}
          <p className="font-['Michroma'] text-white/50 text-xs leading-relaxed line-clamp-3">
            {pronite.description}
          </p>

          {/* Details Row */}
          <div className="flex flex-wrap gap-3 text-xs">
            {pronite.date && (
              <div className="flex items-center gap-1.5 text-white/60">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5"/><path d="M16 2v4M8 2v4M3 10h18" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span className="font-['Michroma']">
                  {new Date(pronite.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            )}
            {pronite.startTime && (
              <div className="flex items-center gap-1.5 text-white/60">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="1.5"/><path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span className="font-['Michroma']">
                  {pronite.startTime}{pronite.endTime ? ` - ${pronite.endTime}` : ""}
                </span>
              </div>
            )}
            {pronite.venue && (
              <div className="flex items-center gap-1.5 text-white/60">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeWidth="1.5"/><circle cx="12" cy="9" r="2.5" strokeWidth="1.5"/></svg>
                <span className="font-['Michroma']">{pronite.venue}</span>
              </div>
            )}
          </div>

          {/* Capacity Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-['Michroma'] text-white/40">Tickets</span>
              <span className="font-['Michroma'] text-white/60">
                {pronite.availableTickets}/{pronite.maxCapacity}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${accent.gradient}`}
                initial={{ width: "0%" }}
                whileInView={{
                  width: `${((pronite.maxCapacity - pronite.availableTickets) / pronite.maxCapacity) * 100}%`,
                }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Register Button */}
          <motion.button
            onClick={() => onRegister(pronite)}
            className={`w-full py-3.5 rounded-2xl bg-gradient-to-r ${accent.gradient} text-white font-['Michroma'] text-sm tracking-widest font-semibold shadow-lg cursor-pointer`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {pronite.availableTickets > 0 ? "GET TICKET" : "SOLD OUT"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────
export default function Pronites() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const planetY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const planetRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  const [pronites, setPronites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPronite, setSelectedPronite] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const fetchPronites = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/pronites`);
        const data = await response.json();
        if (data.success) {
          setPronites(data.data);
        }
      } catch (error) {
        console.error("Error fetching pronites:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPronites();
  }, []);

  const handleRegister = (pronite) => {
    setSelectedPronite(pronite);
    setShowRegisterModal(true);
  };

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen relative bg-black overflow-x-hidden"
    >
      {/* Fixed Background */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <div className="absolute inset-0">
          <OptimizedImage
            src="./bg3.png"
            alt="Background"
            className="w-full h-full object-cover"
            priority={false}
            skeleton={false}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Floating decorative planet */}
        <motion.div
          className="absolute top-1/2 right-[5%] sm:right-[8%] -translate-y-1/2 scale-50 sm:scale-75 lg:scale-90 opacity-40"
          style={{ y: planetY, rotate: planetRotate }}
        >
          <FloatingElement floatIntensity={40} duration={12} enableParallax={false}>
            <motion.img
              src="./blue_planet.png"
              alt="Planet"
              className="w-[400px] h-[400px] object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />
          </FloatingElement>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero */}
        <div className="relative pt-24 sm:pt-32 lg:pt-40 pb-12 sm:pb-16 px-4 sm:px-6">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="inline-block mb-4 sm:mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="px-4 sm:px-6 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm">
                <span className="font-['Michroma'] text-xs sm:text-sm text-purple-200 tracking-widest">
                  XPECTO'26 PRESENTS
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="font-['Michroma'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-purple-300 mb-6 sm:mb-8 tracking-[0.15em] sm:tracking-[0.2em] leading-tight px-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              PRONITES
            </motion.h1>

            <motion.div
              className="h-1 w-32 sm:w-48 mx-auto bg-gradient-to-r from-transparent via-purple-400 to-transparent mb-6 sm:mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            <motion.p
              className="font-['Michroma'] text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-300 tracking-wider max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Three unforgettable nights of music, energy, and magic
            </motion.p>
          </motion.div>
        </div>

        {/* Pronite Cards */}
        <div className="relative px-4 sm:px-6 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-white text-lg sm:text-xl font-['Michroma'] animate-pulse">
                  Loading...
                </div>
              </div>
            ) : pronites.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-400 text-lg sm:text-xl font-['Michroma']">
                  COMING SOON...
                </div>
              </div>
            ) : (
              <div className={`grid gap-8 max-w-6xl mx-auto ${
                pronites.length === 1 
                  ? 'grid-cols-1 max-w-lg' 
                  : pronites.length === 2 
                    ? 'grid-cols-1 md:grid-cols-2' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {pronites.map((pronite, index) => (
                  <ProniteCard
                    key={pronite._id}
                    pronite={pronite}
                    index={index}
                    total={pronites.length}
                    onRegister={handleRegister}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="relative py-16 sm:py-20 text-center border-t border-white/10 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-purple-400" />
            <p className="font-['Michroma'] text-gray-400 text-xs sm:text-sm tracking-[0.3em]">
              XPECTO'26
            </p>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-purple-400" />
          </motion.div>
          <p className="font-['Michroma'] text-gray-500 text-[10px] sm:text-xs tracking-widest">
            MARCH 14-16, 2026 • HIMALAYAS' BIGGEST TECHFEST
          </p>
        </motion.div>
      </div>

      {/* Register Modal */}
      <RegisterModal
        pronite={selectedPronite}
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </div>
  );
}
