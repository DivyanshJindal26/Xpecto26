"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconX,
  IconLoader2,
  IconRefresh,
  IconMusic,
  IconUsers,
  IconCurrencyRupee,
  IconMail,
  IconQrcode,
  IconCamera,
} from "@tabler/icons-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

export default function AdminPronites() {
  const [pronites, setPronites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedPronite, setSelectedPronite] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    artist: "",
    genre: "",
    venue: "",
    date: "",
    startTime: "",
    endTime: "",
    ticketPrice: "",
    maxCapacity: "",
    image: "",
    upiId: "",
    paymentQrImage: "",
    verifierEmails: "",
    scannerEmails: "",
  });

  useEffect(() => {
    fetchPronites();
  }, []);

  const fetchPronites = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/pronites`, {
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setPronites(result.data);
      }
    } catch (error) {
      console.error("Error fetching pronites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      title: "",
      description: "",
      artist: "",
      genre: "",
      venue: "",
      date: "",
      startTime: "",
      endTime: "",
      ticketPrice: "",
      maxCapacity: "",
      image: "",
      upiId: "",
      paymentQrImage: "",
      verifierEmails: "",
      scannerEmails: "",
    });
    setShowModal(true);
  };

  const handleEdit = (pronite) => {
    setModalMode("edit");
    setSelectedPronite(pronite);
    setFormData({
      title: pronite.title || "",
      description: pronite.description || "",
      artist: pronite.artist || "",
      genre: pronite.genre || "",
      venue: pronite.venue || "",
      date: pronite.date
        ? new Date(pronite.date).toISOString().split("T")[0]
        : "",
      startTime: pronite.startTime || "",
      endTime: pronite.endTime || "",
      ticketPrice: pronite.ticketPrice ?? "",
      maxCapacity: pronite.maxCapacity ?? "",
      image: pronite.image || "",
      upiId: pronite.upiId || "",
      paymentQrImage: pronite.paymentQrImage || "",
      verifierEmails: (pronite.verifierEmails || []).join(", "),
      scannerEmails: (pronite.scannerEmails || []).join(", "),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this pronite? All registrations will also be deleted."))
      return;

    try {
      const response = await fetch(`${API_BASE_URL}/pronites/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        fetchPronites();
        alert("Pronite deleted successfully");
      } else {
        alert(result.message || "Failed to delete pronite");
      }
    } catch (error) {
      console.error("Failed to delete pronite:", error);
      alert("Failed to delete pronite");
    }
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url =
        modalMode === "create"
          ? `${API_BASE_URL}/pronites`
          : `${API_BASE_URL}/pronites/${selectedPronite._id}`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const payload = {
        ...formData,
        ticketPrice: formData.ticketPrice ? Number(formData.ticketPrice) : 0,
        maxCapacity: formData.maxCapacity ? Number(formData.maxCapacity) : 500,
        verifierEmails: formData.verifierEmails
          ? formData.verifierEmails
              .split(",")
              .map((e) => e.trim().toLowerCase())
              .filter(Boolean)
          : [],
        scannerEmails: formData.scannerEmails
          ? formData.scannerEmails
              .split(",")
              .map((e) => e.trim().toLowerCase())
              .filter(Boolean)
          : [],
      };

      // Remove empty date
      if (!payload.date) delete payload.date;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setShowModal(false);
        fetchPronites();
        alert(
          modalMode === "create"
            ? "Pronite created successfully!"
            : "Pronite updated successfully!"
        );
      } else {
        alert(result.message || "Failed to save pronite");
      }
    } catch (error) {
      console.error("Failed to save pronite:", error);
      alert("Failed to save pronite");
    } finally {
      setSaving(false);
    }
  };

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

      {/* Pronite Cards */}
      {pronites.length === 0 ? (
        <div className="text-center py-16 text-white/40">
          <IconMusic className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No pronites created yet</p>
          <p className="text-sm mt-1">Click "Add Pronite" to create your first pronite</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pronites.map((pronite) => (
            <motion.div
              key={pronite._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/30 to-black/60 border border-purple-500/20 backdrop-blur-md"
            >
              {/* Image */}
              {pronite.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={pronite.image}
                    alt={pronite.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                </div>
              )}

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{pronite.title}</h3>
                  <p className="text-purple-300 text-sm flex items-center gap-1">
                    <IconMusic className="w-4 h-4" />
                    {pronite.artist}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/20">
                    <IconCurrencyRupee className="w-3 h-3 inline" /> ₹{pronite.ticketPrice}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20">
                    <IconUsers className="w-3 h-3 inline" /> {pronite.availableTickets}/{pronite.maxCapacity}
                  </span>
                  {pronite.date && (
                    <span className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/20">
                      {new Date(pronite.date).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="text-xs text-white/40 space-y-1">
                  <p>
                    <IconMail className="w-3 h-3 inline mr-1" />
                    Verifiers: {pronite.verifierEmails?.length || 0}
                  </p>
                  <p>
                    <IconCamera className="w-3 h-3 inline mr-1" />
                    Scanners: {pronite.scannerEmails?.length || 0}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(pronite)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 text-sm transition-colors"
                  >
                    <IconEdit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pronite._id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-sm transition-colors"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />

            <motion.div
              className="relative w-full max-w-3xl bg-[#0a0a12] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0a12]/95 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white">
                  {modalMode === "create" ? "Create Pronite" : "Edit Pronite"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/60 transition-colors"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                    Basic Info
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">
                        Artist *
                      </label>
                      <input
                        type="text"
                        value={formData.artist}
                        onChange={(e) =>
                          setFormData({ ...formData, artist: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">
                        Genre
                      </label>
                      <input
                        type="text"
                        value={formData.genre}
                        onChange={(e) =>
                          setFormData({ ...formData, genre: e.target.value })
                        }
                        placeholder="e.g. EDM, Rock, Bollywood"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={formData.venue}
                        onChange={(e) =>
                          setFormData({ ...formData, venue: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                    Schedule
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({ ...formData, startTime: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing & Capacity */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                    Pricing & Capacity
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">
                        Ticket Price (₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.ticketPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ticketPrice: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">
                        Max Capacity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxCapacity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxCapacity: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                    Media
                  </h4>

                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">
                      Artist/Event Image
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "image")}
                        className="flex-1 text-sm text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-white/10 file:bg-white/5 file:text-white/70 file:text-sm hover:file:bg-white/10 file:cursor-pointer"
                      />
                      {formData.image && (
                        <img
                          src={formData.image}
                          className="w-12 h-12 rounded-lg object-cover border border-white/10"
                          alt="Preview"
                        />
                      )}
                    </div>
                    <p className="text-xs text-white/30 mt-1">Or paste an image URL:</p>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                      className="w-full mt-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">
                      UPI ID (for payment)
                    </label>
                    <input
                      type="text"
                      value={formData.upiId}
                      onChange={(e) =>
                        setFormData({ ...formData, upiId: e.target.value })
                      }
                      placeholder="example@upi"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">
                      Payment QR Image
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "paymentQrImage")}
                        className="flex-1 text-sm text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border file:border-white/10 file:bg-white/5 file:text-white/70 file:text-sm hover:file:bg-white/10 file:cursor-pointer"
                      />
                      {formData.paymentQrImage && (
                        <img
                          src={formData.paymentQrImage}
                          className="w-12 h-12 rounded-lg object-cover border border-white/10"
                          alt="QR Preview"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Access Control */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                    Access Control
                  </h4>

                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">
                      Verifier Emails (comma-separated)
                    </label>
                    <textarea
                      value={formData.verifierEmails}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          verifierEmails: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="verifier1@email.com, verifier2@email.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none"
                    />
                    <p className="text-xs text-white/30 mt-1">
                      These users can approve/deny registrations on the verification page
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">
                      Scanner Emails (comma-separated)
                    </label>
                    <textarea
                      value={formData.scannerEmails}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scannerEmails: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="scanner1@email.com, scanner2@email.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none"
                    />
                    <p className="text-xs text-white/30 mt-1">
                      These users can scan QR codes at the venue entrance
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-colors text-sm disabled:opacity-50"
                  >
                    {saving && (
                      <IconLoader2 className="w-4 h-4 animate-spin" />
                    )}
                    {modalMode === "create" ? "Create Pronite" : "Update Pronite"}
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
