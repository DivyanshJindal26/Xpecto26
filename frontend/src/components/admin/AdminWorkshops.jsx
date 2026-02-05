"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconX,
  IconLoader2,
  IconDownload,
  IconRefresh,
} from "@tabler/icons-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

export default function AdminWorkshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    instructor: "",
    maxCapacity: "",
    image: "",
    price: "",
  });

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/workshops`, {
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setWorkshops(result.data);
      }
    } catch (error) {
      console.error("Error fetching workshops:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      title: "",
      description: "",
      venue: "",
      date: "",
      time: "",
      instructor: "",
      maxCapacity: "",
      image: "",
      price: "",
    });
    setShowModal(true);
  };

  const handleEdit = (workshop) => {
    setModalMode("edit");
    setSelectedWorkshop(workshop);
    setFormData({
      title: workshop.title || "",
      description: workshop.description || "",
      venue: workshop.venue || "",
      date: workshop.date ? new Date(workshop.date).toISOString().split("T")[0] : "",
      time: workshop.time || "",
      instructor: workshop.instructor || "",
      maxCapacity: workshop.maxCapacity || "",
      image: workshop.image || "",
      price: workshop.price || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this workshop?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/workshops/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        fetchWorkshops();
        alert("Workshop deleted successfully");
      } else {
        alert(result.message || "Failed to delete workshop");
      }
    } catch (error) {
      console.error("Failed to delete workshop:", error);
      alert("Failed to delete workshop");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url =
        modalMode === "create"
          ? `${API_BASE_URL}/workshops`
          : `${API_BASE_URL}/workshops/${selectedWorkshop._id}`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        fetchWorkshops();
        setShowModal(false);
        alert(
          `Workshop ${modalMode === "create" ? "created" : "updated"} successfully`
        );
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Failed to save workshop:", error);
      alert("Failed to save workshop");
    } finally {
      setSaving(false);
    }
  };

  const escapeCSV = (value) => {
    if (value == null) return "";
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const exportToCSV = () => {
    const headers = [
      "Title",
      "Description",
      "Venue",
      "Date",
      "Time",
      "Instructor",
      "Max Capacity",
      "Available Tickets",
      "Price",
      "Image",
      "Created At",
    ];

    const rows = workshops.map((workshop) => [
      workshop.title,
      workshop.description,
      workshop.venue || "",
      workshop.date ? new Date(workshop.date).toLocaleDateString() : "",
      workshop.time || "",
      workshop.instructor || "",
      workshop.maxCapacity || "",
      workshop.availableTickets || "",
      workshop.price || "",
      workshop.image || "",
      new Date(workshop.createdAt).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workshops-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          Workshops ({workshops.length})
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl text-white transition-colors"
          >
            <IconDownload className="w-5 h-5" />
            Export
          </button>
          <button
            onClick={fetchWorkshops}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl text-white transition-colors"
          >
            <IconRefresh className="w-5 h-5" />
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/10 border border-orange-500/30 rounded-xl text-orange-300 hover:bg-orange-500/30 transition-all"
          >
            <IconPlus className="w-5 h-5" />
            Create Workshop
          </button>
        </div>
      </div>

      {/* Workshops List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workshops.length === 0 ? (
          <div className="col-span-full text-center py-12 text-white/60">
            No workshops found
          </div>
        ) : (
          workshops.map((workshop) => (
            <motion.div
              key={workshop._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-b from-[#12121a] to-[#0a0a0f] rounded-xl border border-white/10 p-4 hover:border-orange-500/30 transition-all"
            >
              {workshop.image && (
                <img
                  src={workshop.image}
                  alt={workshop.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="text-lg font-semibold text-white mb-2 truncate">
                {workshop.title}
              </h3>
              <p className="text-white/60 text-sm mb-3 line-clamp-2">
                {workshop.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {workshop.instructor && (
                  <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                    {workshop.instructor}
                  </span>
                )}
                {workshop.venue && (
                  <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-300">
                    {workshop.venue}
                  </span>
                )}
                {workshop.maxCapacity && (
                  <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300">
                    {workshop.availableTickets}/{workshop.maxCapacity} seats
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(workshop)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white/80 hover:bg-white/[0.08] text-sm transition-all"
                >
                  <IconEdit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(workshop._id)}
                  className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#12121a] to-[#0a0a0f] rounded-2xl border border-white/10 shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors z-10"
              >
                <IconX className="w-5 h-5 text-white/50" />
              </button>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {modalMode === "create" ? "Create Workshop" : "Edit Workshop"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={formData.venue}
                        onChange={(e) =>
                          setFormData({ ...formData, venue: e.target.value })
                        }
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Instructor
                      </label>
                      <input
                        type="text"
                        value={formData.instructor}
                        onChange={(e) =>
                          setFormData({ ...formData, instructor: e.target.value })
                        }
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Time
                      </label>
                      <input
                        type="text"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        placeholder="e.g., 10:00 AM"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Max Capacity
                      </label>
                      <input
                        type="number"
                        value={formData.maxCapacity}
                        onChange={(e) =>
                          setFormData({ ...formData, maxCapacity: e.target.value })
                        }
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Price
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <IconLoader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          {modalMode === "create" ? "Create Workshop" : "Update Workshop"}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-lg text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
