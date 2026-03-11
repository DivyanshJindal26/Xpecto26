"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

export default function ProniteVerification() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [accessData, setAccessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProniteId, setSelectedProniteId] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sendingQr, setSendingQr] = useState(null); // email being processed
  const [sendingAll, setSendingAll] = useState(false);
  const [error, setError] = useState(null);

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
      } catch {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch sheet registrations for the selected pronite
  const fetchRegistrations = useCallback(async () => {
    if (!selectedProniteId) return;
    setLoadingRegs(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/pronites/${selectedProniteId}/sheet-registrations`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data);
      } else {
        setError(data.message || "Failed to load registrations");
      }
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoadingRegs(false);
    }
  }, [selectedProniteId]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Send QR to a single registrant
  const handleSendQr = async (email) => {
    setSendingQr(email);
    try {
      const res = await fetch(
        `${API_BASE_URL}/pronites/${selectedProniteId}/generate-qr`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (data.success) {
        await fetchRegistrations();
      } else {
        alert(data.message || "Failed to send QR");
      }
    } catch {
      alert("Failed to send QR code");
    } finally {
      setSendingQr(null);
    }
  };

  // Send QR to all who haven't received one yet
  const handleSendAll = async () => {
    if (!confirm("Send QR codes to all registrants who haven't received one yet?")) return;
    setSendingAll(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/pronites/${selectedProniteId}/generate-qr`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ all: true }),
        }
      );
      const data = await res.json();
      if (data.success) {
        await fetchRegistrations();
        alert(`Done. ${data.results?.length || 0} QR codes sent.`);
      } else {
        alert(data.message || "Failed to send QR codes");
      }
    } catch {
      alert("Failed to send QR codes");
    } finally {
      setSendingAll(false);
    }
  };

  // Derived display lists
  const filtered = registrations.filter((r) => {
    const matchSearch =
      !search ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.college?.toLowerCase().includes(search.toLowerCase()) ||
      r.transactionId?.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;
    if (filter === "qr_sent") return r.qrEmailSent;
    if (filter === "qr_pending") return !r.qrEmailSent;
    if (filter === "scanned") return r.scanned;
    return true;
  });

  const counts = {
    all: registrations.length,
    qr_sent: registrations.filter((r) => r.qrEmailSent).length,
    qr_pending: registrations.filter((r) => !r.qrEmailSent).length,
    scanned: registrations.filter((r) => r.scanned).length,
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors mb-4"
        >
          ← Back to Home
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center gap-3">
              <span className="text-purple-400">🎫</span> Pronite Registrations
            </h1>
            <p className="text-sm text-white/50">Live data from Google Sheet · {counts.all} registrants</p>
          </div>
          <button
            onClick={handleSendAll}
            disabled={sendingAll || counts.qr_pending === 0}
            className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-500/30 disabled:opacity-40 transition-colors"
          >
            {sendingAll ? "Sending..." : `Send QR to all pending (${counts.qr_pending})`}
          </button>
        </div>
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

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, college, txn ID…"
          className="flex-1 min-w-48 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50"
        />
        {[
          { key: "all", label: "All" },
          { key: "qr_pending", label: "QR Pending" },
          { key: "qr_sent", label: "QR Sent" },
          { key: "scanned", label: "Scanned In" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.key
                ? "bg-white/20 border border-white/30 text-white"
                : "bg-white/3 border border-white/10 text-white/50 hover:bg-white/5"
            }`}
          >
            {f.label} ({counts[f.key]})
          </button>
        ))}
        <button
          onClick={fetchRegistrations}
          className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 ml-auto"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      {loadingRegs ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-lg">No registrants found</p>
          {!error && <p className="text-sm mt-1">Check that the Spreadsheet ID is set in Admin → Pronites</p>}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((reg, i) => (
            <motion.div
              key={`${reg.email}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`rounded-xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
                reg.scanned
                  ? "bg-green-500/5 border-green-500/20"
                  : reg.qrEmailSent
                  ? "bg-blue-500/5 border-blue-500/20"
                  : "bg-white/3 border-white/10"
              }`}
            >
              {/* Info */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-white font-semibold text-sm truncate">{reg.name || "—"}</p>
                <p className="text-white/40 text-xs truncate">{reg.email}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-white/30 mt-1">
                  {reg.college && <span>🎓 {reg.college}</span>}
                  {reg.phone && <span>📱 {reg.phone}</span>}
                  {reg.transactionId && <span>💳 {reg.transactionId}</span>}
                  {reg.noOfTickets && <span>🎟 {reg.noOfTickets} {reg.noOfTickets === 1 ? "pass" : "passes"}</span>}
                  {reg.amount && <span>₹ {reg.amount}</span>}
                  {reg.timestamp && <span>🕐 {reg.timestamp}</span>}
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 shrink-0">
                {reg.scanned ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                    ✓ SCANNED IN
                  </span>
                ) : reg.qrEmailSent ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                    QR SENT
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                    QR PENDING
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                {reg.paymentProofUrl && (
                  <a
                    href={reg.paymentProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 text-xs transition-colors text-center"
                  >
                    View Proof
                  </a>
                )}
                <button
                  onClick={() => handleSendQr(reg.email)}
                  disabled={sendingQr === reg.email}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 text-xs disabled:opacity-50 transition-colors"
                >
                  {sendingQr === reg.email
                    ? "Sending…"
                    : reg.qrEmailSent
                    ? "Resend QR"
                    : "Send QR"}
                </button>
              </div>

              {/* Scan details */}
              {reg.scanned && reg.scannedAt && (
                <p className="text-xs text-green-300/60 sm:hidden">
                  Scanned {new Date(reg.scannedAt).toLocaleString()}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
