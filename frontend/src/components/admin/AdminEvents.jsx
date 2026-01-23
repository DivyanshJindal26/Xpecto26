"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconX,
  IconLoader2,
  IconCheck,
  IconUsers,
} from "@tabler/icons-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit' | 'view-registrations'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    club_name: "",
    company: "",
    image: [],
    registrationLimit: "",
  });
  const [saving, setSaving] = useState(false);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/events`, {
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async (eventId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${eventId}/registrations`,
        {
          credentials: "include",
        },
      );
      const result = await response.json();
      if (result.success) {
        setRegistrations(result.data.registrations);
      }
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    }
  };

  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      title: "",
      description: "",
      venue: "",
      date: "",
      club_name: "",
      company: "",
      image: [],
      registrationLimit: "",
    });
    setShowModal(true);
  };

  const handleEdit = (event) => {
    setModalMode("edit");
    setSelectedEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      venue: event.venue || "",
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
      club_name: event.club_name || "",
      company: event.company || "",
      image: event.image || [],
      registrationLimit: event.registrationLimit || "",
    });
    setShowModal(true);
  };

  const handleViewRegistrations = async (event) => {
    setModalMode("view-registrations");
    setSelectedEvent(event);
    await fetchRegistrations(event._id);
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        fetchEvents();
        alert("Event deleted successfully");
      } else {
        alert(result.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url =
        modalMode === "create"
          ? `${API_BASE_URL}/events`
          : `${API_BASE_URL}/events/${selectedEvent._id}`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        fetchEvents();
        setShowModal(false);
        alert(
          `Event ${modalMode === "create" ? "created" : "updated"} successfully`,
        );
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Failed to save event:", error);
      alert("Failed to save event");
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          Events ({events.length})
        </h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/10 border border-orange-500/30 rounded-xl text-orange-300 hover:bg-orange-500/30 transition-all"
        >
          <IconPlus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-[#12121a] to-[#0a0a0f] rounded-xl border border-white/10 p-4 hover:border-orange-500/30 transition-all"
          >
            {event.image?.[0] && (
              <img
                src={event.image[0]}
                alt={event.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="text-lg font-semibold text-white mb-2 truncate">
              {event.title}
            </h3>
            <p className="text-white/60 text-sm mb-3 line-clamp-2">
              {event.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {event.club_name && (
                <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                  {event.club_name}
                </span>
              )}
              {event.venue && (
                <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-300">
                  {event.venue}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(event)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white/80 hover:bg-white/[0.08] text-sm transition-all"
              >
                <IconEdit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleViewRegistrations(event)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/20 text-sm transition-all"
              >
                <IconUsers className="w-4 h-4" />
                {event.registrations?.length || 0}
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
              >
                <IconTrash className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
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
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#12121a] to-[#0a0a0f] rounded-2xl border border-white/10 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors z-10"
              >
                <IconX className="w-5 h-5 text-white/50" />
              </button>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {modalMode === "create"
                    ? "Create Event"
                    : modalMode === "edit"
                      ? "Edit Event"
                      : "Registrations"}
                </h2>

                {modalMode === "view-registrations" ? (
                  <div>
                    <p className="text-white/60 mb-4">
                      Total Registrations: {registrations.length}
                    </p>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {registrations.map((reg, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white/2 border border-white/10 rounded-lg"
                        >
                          <p className="text-white font-medium">{reg.name}</p>
                          <p className="text-white/60 text-sm">{reg.email}</p>
                          {reg.collegeName && (
                            <p className="text-white/50 text-sm">
                              {reg.collegeName}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
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
                        className="w-full px-4 py-3 rounded-xl bg-white/4er border-white/10 text-white focus:outline-none focus:border-orange-500/50"
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
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
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
                          onChange={(e) =>
                            handleChange("venue", e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
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
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
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
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
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
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
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
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-orange-500/50"
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
                            className="flex items-center gap-2 p-2 bg-white/[0.02] rounded-lg"
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
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                            ? "Create Event"
                            : "Update Event"}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
