"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconX,
  IconLoader2,
  IconCheck,
} from "@tabler/icons-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedSession, setSelectedSession] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: "",
    club_name: "",
    company: "",
    image: [],
    registrationLimit: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setSessions(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
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
      startTime: "",
      endTime: "",
      duration: "",
      club_name: "",
      company: "",
      image: [],
      registrationLimit: "",
    });
    setShowModal(true);
  };

  const handleEdit = (session) => {
    setModalMode("edit");
    setSelectedSession(session);
    setFormData({
      title: session.title || "",
      description: session.description || "",
      venue: session.venue || "",
      date: session.date
        ? new Date(session.date).toISOString().split("T")[0]
        : "",
      startTime: session.startTime || "",
      endTime: session.endTime || "",
      duration: session.duration || "",
      club_name: session.club_name || "",
      company: session.company || "",
      image: session.image || [],
      registrationLimit: session.registrationLimit || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (sessionId) => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        fetchSessions();
        alert("Session deleted successfully");
      } else {
        alert(result.message || "Failed to delete session");
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
      alert("Failed to delete session");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url =
        modalMode === "create"
          ? `${API_BASE_URL}/sessions`
          : `${API_BASE_URL}/sessions/${selectedSession._id}`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        fetchSessions();
        setShowModal(false);
        alert(
          `Session ${modalMode === "create" ? "created" : "updated"} successfully`,
        );
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Failed to save session:", error);
      alert("Failed to save session");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageAdd = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setFormData((prev) => ({ ...prev, image: [...prev.image, url] }));
    }
  };

  const handleImageRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          Sessions ({sessions.length})
        </h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-orange-500/20 to-red-500/10 border border-orange-500/30 rounded-xl text-orange-300 hover:bg-orange-500/30 transition-all"
        >
          <IconPlus className="w-5 h-5" />
          Create Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((session) => (
          <motion.div
            key={session._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-b from-[#12121a] to-[#0a0a0f] rounded-xl border border-white/10 p-4 hover:border-orange-500/30 transition-all"
          >
            {session.image?.[0] && (
              <img
                src={session.image[0]}
                alt={session.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="text-lg font-semibold text-white mb-2 truncate">
              {session.title}
            </h3>
            <p className="text-white/60 text-sm mb-3 line-clamp-2">
              {session.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {session.club_name && (
                <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                  {session.club_name}
                </span>
              )}
              {session.startTime && (
                <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-300">
                  {session.startTime}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(session)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/4 border border-white/10 rounded-lg text-white/80 hover:bg-white/8 text-sm transition-all"
              >
                <IconEdit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(session._id)}
                className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
              >
                <IconTrash className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-linear-to-b from-[#12121a] to-[#0a0a0f] rounded-2xl border border-white/10 shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/4 hover:bg-white/8 transition-colors z-10"
              >
                <IconX className="w-5 h-5 text-white/50" />
              </button>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {modalMode === "create" ? "Create Session" : "Edit Session"}
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
                      onChange={(e) => handleChange("title", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
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
                        handleChange("description", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Venue *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.venue}
                        onChange={(e) => handleChange("venue", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          handleChange("startTime", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) =>
                          handleChange("endTime", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 2 hours"
                        value={formData.duration}
                        onChange={(e) =>
                          handleChange("duration", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Club Name
                      </label>
                      <input
                        type="text"
                        value={formData.club_name}
                        onChange={(e) =>
                          handleChange("club_name", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          handleChange("company", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Registration Limit
                    </label>
                    <input
                      type="number"
                      value={formData.registrationLimit}
                      onChange={(e) =>
                        handleChange("registrationLimit", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Images
                    </label>
                    <div className="space-y-2">
                      {formData.image.map((img, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 bg-white/2 rounded-lg"
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-16 h-16 object-cover rounded"
                          />
                          <span className="flex-1 text-white/60 text-sm truncate">
                            {img}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleImageRemove(idx)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <IconX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleImageAdd}
                        className="w-full px-4 py-2 border border-dashed border-white/20 rounded-lg text-white/60 hover:text-white/80 hover:border-white/40 transition-all"
                      >
                        + Add Image URL
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 bg-linear-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <IconLoader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <IconCheck className="w-5 h-5" />
                        {modalMode === "create"
                          ? "Create Session"
                          : "Update Session"}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
