"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconX,
  IconLoader2,
  IconRefresh,
  IconMusic,
  IconMail,
  IconCamera,
  IconQrcode,
} from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";
const ORGANIZER_EMAIL = import.meta.env.VITE_ORGANIZER_EMAIL || "";

const EMPTY_FORM = {
  title: "",
  artist: "",
  date: "",
  venue: "",
  verifierEmails: "",
  scannerEmails: "",
  spreadsheetId: "",
  sheetTabName: "Form Responses 1",
  spreadsheetId2: "",
  sheetTabName2: "Form Responses 1",
};

const EMPTY_MANUAL = {
  email: "",
  name: "",
  phone: "",
  college: "",
  noOfTickets: "1",
  amount: "",
  transactionId: "",
};

export default function AdminPronites() {
  const { user } = useAuth();
  const isOrganizer = ORGANIZER_EMAIL && user?.email?.toLowerCase() === ORGANIZER_EMAIL.toLowerCase();

  const [pronites, setPronites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedPronite, setSelectedPronite] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [reactivating, setReactivating] = useState(null);

  // Manual QR state
  const [manualPronite, setManualPronite] = useState(null); // pronite being targeted
  const [manualData, setManualData] = useState(EMPTY_MANUAL);
  const [sendingManual, setSendingManual] = useState(false);

  useEffect(() => { fetchPronites(); }, []);

  const fetchPronites = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/pronites`, { credentials: "include" });
      const result = await res.json();
      if (result.success) setPronites(result.data);
    } catch (e) {
      console.error("Error fetching pronites:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode("create");
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const handleEdit = (pronite) => {
    setModalMode("edit");
    setSelectedPronite(pronite);
    setFormData({
      title: pronite.title || "",
      artist: pronite.artist || "",
      date: pronite.date ? new Date(pronite.date).toISOString().split("T")[0] : "",
      venue: pronite.venue || "",
      verifierEmails: (pronite.verifierEmails || []).join(", "),
      scannerEmails: (pronite.scannerEmails || []).join(", "),
      spreadsheetId: pronite.spreadsheetId || "",
      sheetTabName: pronite.sheetTabName || "Form Responses 1",
      spreadsheetId2: pronite.spreadsheetId2 || "",
      sheetTabName2: pronite.sheetTabName2 || "Form Responses 1",
    });
    setShowModal(true);
  };

  const handleManualQrOpen = (pronite) => {
    setManualPronite(pronite);
    setManualData(EMPTY_MANUAL);
  };

  const handleManualQrSubmit = async (e) => {
    e.preventDefault();
    setSendingManual(true);
    try {
      const res = await fetch(`${API_BASE_URL}/pronites/${manualPronite._id}/manual-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...manualData,
          noOfTickets: parseInt(manualData.noOfTickets, 10) || 1,
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        setManualPronite(null);
      } else {
        alert(result.message || "Failed to generate QR");
      }
    } catch {
      alert("Failed to generate QR");
    } finally {
      setSendingManual(false);
    }
  };

  const handleReactivate = async (pronite) => {
    if (!confirm(`Reactivate all QR codes for "${pronite.title}"?\n\nThis resets the scan status so the same QR codes can be used again on the next night.`)) return;
    setReactivating(pronite._id);
    try {
      const res = await fetch(`${API_BASE_URL}/pronites/${pronite._id}/reactivate`, {
        method: "POST",
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message || "Failed to reactivate QR codes");
      }
    } catch {
      alert("Failed to reactivate QR codes");
    } finally {
      setReactivating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this pronite? All sheet registrations for it will also be removed.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/pronites/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();
      if (result.success) { fetchPronites(); }
      else alert(result.message || "Failed to delete pronite");
    } catch {
      alert("Failed to delete pronite");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = modalMode === "create"
        ? `${API_BASE_URL}/pronites`
        : `${API_BASE_URL}/pronites/${selectedPronite._id}`;

      const payload = {
        title: formData.title,
        artist: formData.artist,
        venue: formData.venue,
        spreadsheetId: formData.spreadsheetId,
        sheetTabName: formData.sheetTabName || "Form Responses 1",
        spreadsheetId2: formData.spreadsheetId2 || undefined,
        sheetTabName2: formData.spreadsheetId2 ? (formData.sheetTabName2 || "Form Responses 1") : undefined,
        verifierEmails: formData.verifierEmails
          .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
        scannerEmails: formData.scannerEmails
          .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
      };
      if (formData.date) payload.date = formData.date;

      const res = await fetch(url, {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setShowModal(false);
        fetchPronites();
      } else {
        alert(result.message || "Failed to save pronite");
      }
    } catch {
      alert("Failed to save pronite");
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, props = {}) => (
    <div>
      <label className="block text-xs text-white/50 mb-1.5">{label}</label>
      <input
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
        {...props}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <IconLoader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <IconMusic className="w-6 h-6 text-purple-400" />
          Pronites ({pronites.length}/3)
        </h2>
        <div className="flex gap-2">
          <button
            onClick={fetchPronites}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-colors"
          >
            <IconRefresh className="w-5 h-5" />
          </button>
          {pronites.length < 3 && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-colors"
            >
              <IconPlus className="w-5 h-5" />
              Add Pronite
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      {pronites.length === 0 ? (
        <div className="text-center py-16 text-white/40">
          <IconMusic className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No pronites yet</p>
          <p className="text-sm mt-1">Click "Add Pronite" to create one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pronites.map((pronite) => (
            <motion.div
              key={pronite._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/3 border border-white/10 p-5 space-y-3"
            >
              <div>
                <h3 className="text-base font-bold text-white">{pronite.title}</h3>
                <p className="text-purple-300 text-sm flex items-center gap-1 mt-0.5">
                  <IconMusic className="w-3.5 h-3.5" />
                  {pronite.artist}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {pronite.date && (
                  <span className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/20">
                    {new Date(pronite.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                )}
                {pronite.venue && (
                  <span className="px-2 py-1 rounded-full bg-white/10 text-white/50 border border-white/10">
                    {pronite.venue}
                  </span>
                )}
                {pronite.spreadsheetId && (
                  <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/20">
                    Sheet linked
                  </span>
                )}
              </div>

              <div className="text-xs text-white/40 space-y-1">
                <p><IconMail className="w-3 h-3 inline mr-1" />Verifiers: {pronite.verifierEmails?.length || 0}</p>
                <p><IconCamera className="w-3 h-3 inline mr-1" />Scanners: {pronite.scannerEmails?.length || 0}</p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleEdit(pronite)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 text-sm transition-colors"
                >
                  <IconEdit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(pronite._id)}
                  className="flex items-center justify-center px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-sm transition-colors"
                >
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleReactivate(pronite)}
                disabled={reactivating === pronite._id}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 text-xs transition-colors disabled:opacity-50"
              >
                {reactivating === pronite._id ? (
                  <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "↺"
                )}
                Reactivate QR Codes
              </button>

              {isOrganizer && (
                <button
                  onClick={() => handleManualQrOpen(pronite)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs transition-colors"
                >
                  <IconQrcode className="w-3.5 h-3.5" />
                  Manual QR
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="relative w-full max-w-lg bg-[#0a0a12] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0a12]/95 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white">
                  {modalMode === "create" ? "Create Pronite" : "Edit Pronite"}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-white/60">
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Basic */}
                <div className="grid grid-cols-2 gap-4">
                  {field("Title *", "title", { required: true })}
                  {field("Artist *", "artist", { required: true })}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {field("Date", "date", { type: "date" })}
                  {field("Venue", "venue", { placeholder: "e.g. Main Stage" })}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-4">
                  <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Google Sheet 1</h4>
                  {field("Spreadsheet ID *", "spreadsheetId", {
                    placeholder: "e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
                    required: true,
                  })}
                  <p className="text-xs text-white/30 -mt-2">
                    The ID from the Google Sheet URL: /spreadsheets/d/<strong>ID</strong>/edit
                  </p>
                  {field("Sheet Tab Name", "sheetTabName", {
                    placeholder: "Form Responses 1",
                  })}
                  <p className="text-xs text-white/30 -mt-2">
                    The tab name inside the spreadsheet (default: Form Responses 1)
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-4">
                  <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Google Sheet 2 <span className="text-white/30 normal-case font-normal">(optional)</span></h4>
                  {field("Spreadsheet ID 2", "spreadsheetId2", {
                    placeholder: "Leave blank if not using a second sheet",
                  })}
                  <p className="text-xs text-white/30 -mt-2">
                    Optional second response sheet — rows are merged with Sheet 1 (duplicate emails are ignored)
                  </p>
                  {formData.spreadsheetId2 && field("Sheet Tab Name 2", "sheetTabName2", {
                    placeholder: "Form Responses 1",
                  })}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-4">
                  <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Access Control</h4>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Verifier Emails (comma-separated)</label>
                    <textarea
                      value={formData.verifierEmails}
                      onChange={(e) => setFormData({ ...formData, verifierEmails: e.target.value })}
                      rows={2}
                      placeholder="verifier@email.com, verifier2@email.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none"
                    />
                    <p className="text-xs text-white/30 mt-1">Can view sheet registrations and send QR codes</p>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Scanner Emails (comma-separated)</label>
                    <textarea
                      value={formData.scannerEmails}
                      onChange={(e) => setFormData({ ...formData, scannerEmails: e.target.value })}
                      rows={2}
                      placeholder="scanner@email.com, scanner2@email.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none"
                    />
                    <p className="text-xs text-white/30 mt-1">Can scan QR codes at the venue entrance</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 text-sm disabled:opacity-50"
                  >
                    {saving && <IconLoader2 className="w-4 h-4 animate-spin" />}
                    {modalMode === "create" ? "Create" : "Update"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual QR Modal */}
      <AnimatePresence>
        {manualPronite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setManualPronite(null)}
            />
            <motion.div
              className="relative w-full max-w-md bg-[#0a0a12] border border-blue-500/20 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0a12]/95 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <IconQrcode className="w-5 h-5 text-blue-400" />
                  Manual QR — {manualPronite.title}
                </h3>
                <button onClick={() => setManualPronite(null)} className="p-2 rounded-lg hover:bg-white/10 text-white/60">
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleManualQrSubmit} className="p-6 space-y-4">
                {[
                  { label: "Email *", key: "email", props: { type: "email", required: true, placeholder: "attendee@email.com" } },
                  { label: "Full Name", key: "name", props: { placeholder: "John Doe" } },
                  { label: "Phone", key: "phone", props: { placeholder: "9876543210" } },
                  { label: "College", key: "college", props: { placeholder: "IIT Mandi" } },
                  { label: "Transaction ID", key: "transactionId", props: { placeholder: "UTR123456" } },
                ].map(({ label, key, props }) => (
                  <div key={key}>
                    <label className="block text-xs text-white/50 mb-1.5">{label}</label>
                    <input
                      value={manualData[key]}
                      onChange={(e) => setManualData({ ...manualData, [key]: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                      {...props}
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">No of Tickets</label>
                    <input
                      type="number"
                      min="1"
                      value={manualData.noOfTickets}
                      onChange={(e) => setManualData({ ...manualData, noOfTickets: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Amount (₹)</label>
                    <input
                      value={manualData.amount}
                      onChange={(e) => setManualData({ ...manualData, amount: e.target.value })}
                      placeholder="500"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                <p className="text-xs text-blue-300/50 pt-1">
                  QR will be generated and emailed immediately. If this email already has a registration for this pronite, it will be updated and a new QR will be sent.
                </p>

                <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setManualPronite(null)}
                    className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingManual}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 text-sm disabled:opacity-50"
                  >
                    {sendingManual && <IconLoader2 className="w-4 h-4 animate-spin" />}
                    Generate & Send QR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
