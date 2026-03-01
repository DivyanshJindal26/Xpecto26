"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

export default function ProniteVerification() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [accessData, setAccessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProniteId, setSelectedProniteId] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const [showDenyModal, setShowDenyModal] = useState(null);
  const [denyReason, setDenyReason] = useState("");
  const [showProofModal, setShowProofModal] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [proofLoading, setProofLoading] = useState(false);

  // Check verifier access
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }

    const checkAccess = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/pronites/check-verifier`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!data.success || !data.isVerifier) {
          navigate("/", { replace: true });
          return;
        }
        setAccessData(data);
        if (data.pronites.length > 0) {
          setSelectedProniteId(data.pronites[0]._id);
        }
      } catch (e) {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch registrations when pronite changes
  const fetchRegistrations = useCallback(async () => {
    if (!selectedProniteId) return;
    setLoadingRegs(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/pronites/${selectedProniteId}/registrations`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch registrations:", e);
    } finally {
      setLoadingRegs(false);
    }
  }, [selectedProniteId]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Approve
  const handleApprove = async (regId) => {
    setActionLoading(regId);
    try {
      const res = await fetch(
        `${API_BASE_URL}/pronites/registrations/${regId}/approve`,
        { method: "PUT", credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        fetchRegistrations();
      } else {
        alert(data.message || "Failed to approve");
      }
    } catch (e) {
      alert("Failed to approve registration");
    } finally {
      setActionLoading(null);
    }
  };

  // Deny
  const handleDeny = async () => {
    if (!denyReason.trim()) {
      alert("Please provide a reason for denial");
      return;
    }
    setActionLoading(showDenyModal);
    try {
      const res = await fetch(
        `${API_BASE_URL}/pronites/registrations/${showDenyModal}/deny`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reason: denyReason }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setShowDenyModal(null);
        setDenyReason("");
        fetchRegistrations();
      } else {
        alert(data.message || "Failed to deny");
      }
    } catch (e) {
      alert("Failed to deny registration");
    } finally {
      setActionLoading(null);
    }
  };

  // View payment proof
  const viewPaymentProof = async (regId) => {
    setProofLoading(true);
    setShowProofModal(regId);
    try {
      const res = await fetch(
        `${API_BASE_URL}/pronites/registrations/${regId}/payment-proof`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setProofImage(data.data.image);
      }
    } catch (e) {
      console.error("Failed to load proof:", e);
    } finally {
      setProofLoading(false);
    }
  };

  const filteredRegs = registrations.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const statusCounts = {
    all: registrations.length,
    pending: registrations.filter((r) => r.status === "pending").length,
    approved: registrations.filter((r) => r.status === "approved").length,
    denied: registrations.filter((r) => r.status === "denied").length,
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508]">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] pt-14 md:pt-8 pb-8 px-4 md:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors mb-4"
        >
          ← Back to Home
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <span className="text-purple-400">🎫</span>
          Pronite Verification
        </h1>
        <p className="text-sm text-white/50">
          Review and manage pronite registrations
        </p>
      </motion.div>

      {/* Pronite Selector */}
      {accessData?.pronites?.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {accessData.pronites.map((p) => (
            <button
              key={p._id}
              onClick={() => setSelectedProniteId(p._id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedProniteId === p._id
                  ? "bg-purple-500/20 border border-purple-500/30 text-purple-300"
                  : "bg-white/3 border border-white/10 text-white/60 hover:bg-white/5"
              }`}
            >
              {p.title} — {p.artist}
            </button>
          ))}
        </div>
      )}

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: "all", label: "All", active: "bg-white/20 border border-white/30 text-white" },
          { key: "pending", label: "Pending", active: "bg-yellow-500/20 border border-yellow-500/30 text-yellow-300" },
          { key: "approved", label: "Approved", active: "bg-green-500/20 border border-green-500/30 text-green-300" },
          { key: "denied", label: "Denied", active: "bg-red-500/20 border border-red-500/30 text-red-300" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.key
                ? f.active
                : "bg-white/3 border border-white/10 text-white/50 hover:bg-white/5"
            }`}
          >
            {f.label} ({statusCounts[f.key]})
          </button>
        ))}

        <button
          onClick={fetchRegistrations}
          className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 ml-auto"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Registrations Table */}
      {loadingRegs ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : filteredRegs.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-lg">No registrations found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRegs.map((reg) => (
            <motion.div
              key={reg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-4 sm:p-5 ${
                reg.status === "pending"
                  ? "bg-yellow-500/5 border-yellow-500/20"
                  : reg.status === "approved"
                  ? "bg-green-500/5 border-green-500/20"
                  : "bg-red-500/5 border-red-500/20"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* User Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {reg.user?.avatar ? (
                    <img
                      src={reg.user.avatar}
                      alt={reg.user.name}
                      className="w-10 h-10 rounded-full border border-white/10 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-white/50 text-sm font-bold">
                        {reg.user?.name?.charAt(0) || "?"}
                      </span>
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {reg.user?.name || "Unknown"}
                    </p>
                    <p className="text-white/40 text-xs truncate">
                      {reg.user?.email}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-white/30">
                      {reg.user?.collegeName && (
                        <span>🎓 {reg.user.collegeName}</span>
                      )}
                      {reg.user?.contactNumber && (
                        <span>📱 {reg.user.contactNumber}</span>
                      )}
                      {reg.transactionId && (
                        <span>💳 {reg.transactionId}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      reg.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : reg.status === "approved"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {reg.status.toUpperCase()}
                  </span>
                  {reg.scanned && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                      SCANNED
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => viewPaymentProof(reg._id)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 text-xs transition-colors"
                  >
                    View Proof
                  </button>

                  {reg.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(reg._id)}
                        disabled={actionLoading === reg._id}
                        className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 text-xs disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === reg._id ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => {
                          setShowDenyModal(reg._id);
                          setDenyReason("");
                        }}
                        disabled={actionLoading === reg._id}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 text-xs disabled:opacity-50 transition-colors"
                      >
                        Deny
                      </button>
                    </>
                  )}
                </div>
              </div>

              {reg.status === "denied" && reg.denialReason && (
                <p className="mt-2 text-xs text-red-300/70 bg-red-500/10 rounded-lg px-3 py-2">
                  Reason: {reg.denialReason}
                </p>
              )}

              <p className="mt-2 text-xs text-white/20">
                Registered: {new Date(reg.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Deny Modal */}
      <AnimatePresence>
        {showDenyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDenyModal(null)}
            />
            <motion.div
              className="relative w-full max-w-md bg-[#0a0a12] border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
            >
              <h3 className="text-lg font-bold text-white mb-4">
                Deny Registration
              </h3>
              <p className="text-white/50 text-sm mb-3">
                The user will receive an email with this reason.
              </p>
              <textarea
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                placeholder="Enter reason for denial..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/50 resize-none"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowDenyModal(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeny}
                  disabled={!denyReason.trim() || actionLoading}
                  className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm disabled:opacity-50"
                >
                  {actionLoading ? "Sending..." : "Deny & Send Email"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Proof Modal */}
      <AnimatePresence>
        {showProofModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowProofModal(null);
                setProofImage(null);
              }}
            />
            <motion.div
              className="relative w-full max-w-lg bg-[#0a0a12] border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Payment Proof</h3>
                <button
                  onClick={() => {
                    setShowProofModal(null);
                    setProofImage(null);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-sm"
                >
                  ✕
                </button>
              </div>
              {proofLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : proofImage ? (
                <img
                  src={proofImage}
                  alt="Payment Proof"
                  className="w-full max-h-[60vh] object-contain rounded-xl border border-white/10"
                />
              ) : (
                <p className="text-center py-12 text-white/40">
                  No payment proof available
                </p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
