"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  IconLoader2,
  IconCheck,
  IconUpload,
  IconX,
  IconSparkles,
  IconShieldCheck,
} from "@tabler/icons-react";
import {
  Utensils,
  Home,
  Bed,
  Music,
  GraduationCap,
  Gift,
  Ticket,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import OptimizedImage from "../components/ui/OptimizedImage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

// CTA Button (Events-like style)
const CTAButton = ({ onClick, disabled, loading, isRegistered, children }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`group relative px-8 sm:px-10 py-3 sm:py-4 font-['Michroma'] font-bold text-white overflow-hidden rounded-xl shadow-lg w-full sm:w-auto ${isRegistered
        ? "bg-emerald-500"
        : "bg-linear-to-r from-white via-gray-100 to-white"
        }`}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className={
          isRegistered
            ? "absolute inset-0 bg-linear-to-r from-emerald-500 via-emerald-400 to-emerald-500 opacity-100"
            : "absolute inset-0 bg-linear-to-r from-white via-gray-100 to-white opacity-100"
        }
      />

      <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base tracking-wider text-black font-bold">
        {loading ? (
          <>
            <IconLoader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />{" "}
            PROCESSING...
          </>
        ) : isRegistered ? (
          <>
            <IconCheck className="w-4 h-4 sm:w-5 sm:h-5" /> REGISTERED
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
};

// Payment QR modal component (simplified to match Events UI)
const PaymentModal = ({
  isOpen,
  onClose,
  amount,
  onSubmit,
  submitting,
  existingLead,
}) => {
  const [transactionId, setTransactionId] = useState("");
  const [paymentProof, setPaymentProof] = useState("");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [campusAmbassadorCode, setCampusAmbassadorCode] = useState("");
  const [numberOfParticipants, setNumberOfParticipants] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Prefill when viewing existing lead
  useEffect(() => {
    if (!existingLead) return;
    if (existingLead.transactionId)
      setTransactionId(existingLead.transactionId);
    if (existingLead.paymentProof) {
      setPaymentProofUrl(
        `${API_BASE_URL}/leads/payment-proof/${existingLead.paymentProof}`,
      );
    }
    if (existingLead.campusAmbassadorCode)
      setCampusAmbassadorCode(existingLead.campusAmbassadorCode);
    if (existingLead.numberOfParticipants)
      setNumberOfParticipants(String(existingLead.numberOfParticipants));
    if (existingLead.selectedEvents?.length) {
      setSelectedEvents(
        existingLead.selectedEvents.map((e) =>
          typeof e === "string" ? e : e._id,
        ),
      );
    }
  }, [existingLead]);

  // Fetch events for selection
  useEffect(() => {
    if (!isOpen) return;
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const res = await fetch(`${API_BASE_URL}/events`);
        const data = await res.json();
        if (data.success) {
          setEvents(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, paymentProof: "File size must be less than 5MB" });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, paymentProof: "Only image files are allowed" });
      return;
    }

    setUploading(true);
    setErrors({ ...errors, paymentProof: null });

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result);
        setUploading(false);
      };
      reader.onerror = () => {
        setErrors({ ...errors, paymentProof: "Failed to read file" });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setErrors({ ...errors, paymentProof: "Failed to upload file" });
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!transactionId.trim()) {
      newErrors.transactionId = "Transaction ID is required";
    }

    if (!paymentProof && !paymentProofUrl) {
      newErrors.paymentProof = "Payment proof screenshot is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      transactionId,
      paymentProof,
      campusAmbassadorCode: campusAmbassadorCode.trim() || undefined,
      selectedEvents,
      numberOfParticipants: numberOfParticipants
        ? parseInt(numberOfParticipants)
        : undefined,
    });
  };

  const toggleEvent = (eventId) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId],
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full bg-[#0b0b0b] rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <IconX className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-bold text-white mb-2">Complete Payment</h3>
        <p className="text-cyan-400 mb-6 font-semibold">Amount: ₹{amount}</p>

        <div className="flex flex-col lg:flex-row items-start gap-6 mb-6">
          <div className="w-40 h-40 bg-white rounded-xl p-2 flex items-center justify-center shrink-0">
            <img src="/qr.png" alt="QR" />
          </div>

          <div className="flex-1 text-white space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Account Name</span>
              <span className="font-mono">Xpecto IIT Mandi</span>
            </div>
            <div className="flex justify-between text-sm text-gray-300">
              <span>Account No.</span>
              <span className="font-mono">7315000100034536</span>
            </div>
            <div className="flex justify-between text-sm text-gray-300">
              <span>IFSC</span>
              <span className="font-mono">PUNB0731500</span>
            </div>
            <div className="flex justify-between text-sm text-gray-300">
              <span>Branch</span>
              <span className="text-sm">IIT Kamand, Mandi HP</span>
            </div>
            <div className="flex justify-between text-sm text-gray-300">
              <span>UPI ID</span>
              <span className="font-mono text-cyan-400">8628963924m@pnb</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 space-y-4">
          <h4 className="text-white font-semibold mb-3">
            Payment Confirmation
          </h4>

          {/* Transaction ID */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Transaction ID / UPI Reference Number *
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => {
                setTransactionId(e.target.value);
                setErrors({ ...errors, transactionId: null });
              }}
              placeholder="Enter your transaction ID"
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.transactionId ? "border-red-500/50" : "border-white/10"
                } text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors`}
            />
            {errors.transactionId && (
              <p className="mt-1 text-sm text-red-400">
                {errors.transactionId}
              </p>
            )}
          </div>

          {/* Payment Proof Upload / View */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Payment Screenshot *
            </label>
            {!paymentProofUrl && (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="payment-proof"
                  disabled={uploading}
                />
                <label
                  htmlFor="payment-proof"
                  className={`flex flex-col items-center justify-center w-full px-4 py-8 rounded-xl border-2 border-dashed ${errors.paymentProof
                    ? "border-red-500/50 bg-red-500/5"
                    : paymentProof
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-white/20 bg-white/5"
                    } cursor-pointer hover:border-cyan-500/50 transition-colors`}
                >
                  {uploading ? (
                    <IconLoader2 className="w-8 h-8 text-white/60 animate-spin mb-2" />
                  ) : paymentProof ? (
                    <>
                      <IconCheck className="w-8 h-8 text-green-400 mb-2" />
                      <p className="text-sm text-green-400">
                        Screenshot uploaded
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        Click to change
                      </p>
                    </>
                  ) : (
                    <>
                      <IconUpload className="w-8 h-8 text-white/60 mb-2" />
                      <p className="text-sm text-white/60">
                        Click to upload screenshot
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            )}

            {/* Preview (from upload or existing) */}
            {(paymentProof || paymentProofUrl) && (
              <div className="mt-4">
                <p className="text-sm text-white/60 mb-2">Preview:</p>
                <img
                  src={paymentProof || paymentProofUrl}
                  alt="Payment proof"
                  crossOrigin="use-credentials"
                  className="max-w-full h-auto max-h-48 rounded-lg border border-white/10"
                />
              </div>
            )}
            {errors.paymentProof && (
              <p className="mt-1 text-sm text-red-400">{errors.paymentProof}</p>
            )}
          </div>

          {/* Campus Ambassador Code */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Campus Ambassador Code (Optional)
            </label>
            <input
              type="text"
              value={campusAmbassadorCode}
              onChange={(e) => setCampusAmbassadorCode(e.target.value)}
              placeholder="Enter ambassador code if you have one"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* Number of Participants */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Number of Participants (Optional)
            </label>
            <input
              type="number"
              min="1"
              value={numberOfParticipants}
              onChange={(e) => setNumberOfParticipants(e.target.value)}
              placeholder="e.g. 1"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* Event Selection */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Events you plan to participate in (Optional)
            </label>
            {loadingEvents ? (
              <div className="flex items-center gap-2 text-white/40 text-sm py-2">
                <IconLoader2 className="w-4 h-4 animate-spin" />
                Loading events...
              </div>
            ) : events.length === 0 ? (
              <p className="text-sm text-white/40">No events available yet.</p>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl bg-white/5 border border-white/10 p-3">
                {events.map((event) => (
                  <label
                    key={event._id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event._id)}
                      onChange={() => toggleEvent(event._id)}
                      className="w-4 h-4 rounded border-white/30 bg-white/10 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 accent-cyan-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {event.title}
                      </p>
                      {event.club_name && (
                        <p className="text-white/40 text-xs">
                          {event.club_name}
                        </p>
                      )}
                    </div>
                    {event.date && (
                      <span className="text-white/30 text-xs shrink-0">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-400">
            After submitting, your payment will be verified within 24-48 hours.
          </p>

          <button
            onClick={handleSubmit}
            disabled={submitting || uploading}
            className="w-full py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <IconLoader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <IconCheck className="w-5 h-5" />
                Submit Payment Details
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Register() {
  const { user, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingLead, setExistingLead] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const now = new Date();
  const earlyBirdDeadline = new Date("2026-02-15T23:59:59");
  const isEarlyBird = now <= earlyBirdDeadline;
  const price = isEarlyBird ? 2299 : 2499;

  const benefits = [
    { icon: Utensils, text: "Food & Refreshments" },
    { icon: Home, text: "Accommodation" },
    { icon: Bed, text: "Bedding" },
    { icon: Music, text: "Pronites Passes" },
    { icon: GraduationCap, text: "Free Workshops" },
    { icon: Gift, text: "Welcome Kit" },
    { icon: Ticket, text: "All Events Access" },
  ];

  useEffect(() => {
    const checkLead = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE_URL}/leads/my-lead`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.lead) setExistingLead(data.lead);
      } catch (e) {
        console.error(e);
      }
    };
    checkLead();
  }, [user]);

  const handleRegister = async () => {
    if (!user) return loginWithGoogle();

    setRegistering(true);

    try {
      const res = await fetch(`${API_BASE_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          passType: isEarlyBird ? "early_bird" : "regular",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExistingLead(data.lead);
        setShowPayment(true);
      } else if (data.lead) {
        setExistingLead(data.lead);
        setShowPayment(true);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRegistering(false);
    }
  };

  const handlePaymentSubmit = async ({
    transactionId,
    paymentProof,
    campusAmbassadorCode,
    selectedEvents,
    numberOfParticipants,
  }) => {
    if (!existingLead) return;

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/leads/submit-payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          transactionId,
          paymentProofData: paymentProof,
          campusAmbassadorCode,
          selectedEvents,
          numberOfParticipants,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExistingLead(data.lead);
        setShowPayment(false);
        alert(
          "Payment details submitted successfully! Your payment will be verified within 24-48 hours.",
        );
      } else {
        alert(data.message || "Failed to submit payment details");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit payment details");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-[#050508]">
      {/* Fixed Background */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <div className="absolute inset-0">
          <OptimizedImage
            src="./bg6.png"
            alt="Background"
            className="w-full h-full object-cover"
            priority={false}
            skeleton={false}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Fixed Planet - LEFT CENTER */}
        <div className="absolute top-1/2 left-[10%] -translate-y-1/2 scale-75 md:scale-90 lg:scale-100">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.img
              src="./emerald_planet.png"
              alt="Planet"
              className="w-87.5 h-87.5 lg:w-112.5 lg:h-112.5 object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="px-6 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
              <span className="font-['Michroma'] text-sm text-white tracking-widest">
                XPECTO'26
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="
    font-['Michroma']
    text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
    font-light text-white
    mb-4 sm:mb-5 md:mb-6
    tracking-widest sm:tracking-[0.12em] md:tracking-[0.15em]
  "
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            REGISTER
          </motion.h1>



          <motion.div
            className="h-1 w-48 mx-auto bg-white/20 mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <motion.p
            className="font-['Michroma'] text-lg md:text-xl text-white/60 tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Secure your spot at Himalayas' biggest techfest
          </motion.p>
        </motion.div>

        {/* Main Registration Card */}
        <motion.div
          className="max-w-4xl mx-auto backdrop-blur-md bg-black/60 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl hover:bg-black/70 hover:border-white/20 transition-all duration-500"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Pricing Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <IconSparkles className="w-6 h-6 text-white/40" />
              <h2 className="font-['Michroma'] text-2xl md:text-3xl font-light text-white">
                Pass Pricing
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <motion.div
                className={`p-6 rounded-2xl border ${isEarlyBird
                  ? "border-white bg-white/10"
                  : "border-white/10 bg-white/5"
                  }`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-['Michroma'] text-4xl font-light text-white">
                    ₹2299
                  </span>
                  {isEarlyBird && (
                    <span className="px-2 py-1 rounded-md bg-white/20 text-xs font-['Michroma'] text-white">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="font-['Michroma'] text-white/60 text-sm">
                  Early Bird
                </p>
                <p className="font-['Michroma'] text-white/40 text-xs mt-1">
                  Valid till 15 Feb 2026
                </p>
              </motion.div>

              <motion.div
                className={`p-6 rounded-2xl border ${!isEarlyBird
                  ? "border-white bg-white/10"
                  : "border-white/10 bg-white/5"
                  }`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-['Michroma'] text-4xl font-light text-white">
                    ₹2499
                  </span>
                  {!isEarlyBird && (
                    <span className="px-2 py-1 rounded-md bg-white/20 text-xs font-['Michroma'] text-white">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="font-['Michroma'] text-white/60 text-sm">
                  Regular
                </p>
                <p className="font-['Michroma'] text-white/40 text-xs mt-1">
                  From 16 Feb 2026
                </p>
              </motion.div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <IconShieldCheck className="w-6 h-6 text-white/40" />
              <h3 className="font-['Michroma'] text-xl font-light text-white">
                What's Included
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => {
                const IconComponent = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <IconComponent className="w-6 h-6 text-white/60" />
                    <span className="font-['Michroma'] text-sm text-white/80">
                      {benefit.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Registration Status */}
          {existingLead && (
            <motion.div
              className="mb-8 p-6 rounded-2xl border border-white/10 bg-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="font-['Michroma'] text-sm text-white/60 mb-4 uppercase tracking-wider">
                Registration Status
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-['Michroma'] text-white/80 text-sm">
                    Pass Type
                  </span>
                  <span className="font-['Michroma'] text-white text-sm capitalize">
                    {existingLead.passType?.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-['Michroma'] text-white/80 text-sm">
                    Payment Status
                  </span>
                  <span
                    className={`font-['Michroma'] text-sm px-3 py-1 rounded-full ${existingLead.paymentStatus === "completed"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : existingLead.paymentStatus === "pending"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                  >
                    {existingLead.paymentStatus}
                  </span>
                </div>
                {existingLead.paymentStatus === "pending" && (
                  <button
                    onClick={() => setShowPayment(true)}
                    className="font-['Michroma'] text-sm text-white/60 hover:text-white underline mt-2"
                  >
                    View payment details
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <CTAButton
              onClick={handleRegister}
              disabled={
                registering || existingLead?.paymentStatus === "completed"
              }
              loading={registering}
              isRegistered={existingLead?.paymentStatus === "completed"}
            >
              {existingLead?.paymentStatus === "completed"
                ? "✓ Registration Complete"
                : `Pay ₹${price} & Register`}
            </CTAButton>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="font-['Michroma'] text-sm text-white/40">
              For queries:{" "}
              <a
                href="mailto:publicity@xpecto.org"
                className="text-white/60 hover:text-white transition-colors"
              >
                publicity@xpecto.org
              </a>
            </p>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="max-w-4xl mx-auto mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="font-['Michroma'] text-xs text-white/30 tracking-widest">
            MARCH 14-16, 2026 • IIT MANDI
          </p>
        </motion.div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={existingLead?.amount || price}
        onSubmit={handlePaymentSubmit}
        submitting={submitting}
        existingLead={existingLead}
      />
    </div>
  );
}
