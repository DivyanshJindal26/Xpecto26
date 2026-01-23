"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconX,
  IconPlus,
  IconEdit,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";

export default function AdminTeam() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    team: "",
    image: "",
    order: 0,
  });

  const apiUrl = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/team`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch team members");

      const result = await response.json();
      if (result.success) {
        setTeamMembers(result.data);
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  // Open modal for creating new member
  const handleCreate = () => {
    setIsEditing(false);
    setCurrentMember(null);
    setFormData({
      name: "",
      team: "",
      image: "",
      order: 0,
    });
    setShowModal(true);
  };

  // Open modal for editing member
  const handleEdit = (member) => {
    setIsEditing(true);
    setCurrentMember(member);
    setFormData({
      name: member.name,
      team: member.team,
      image: member.image,
      order: member.order || 0,
    });
    setShowModal(true);
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isEditing
        ? `${apiUrl}/team/${currentMember._id}`
        : `${apiUrl}/team`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save team member");
      }

      // Refresh the list
      await fetchTeamMembers();
      setShowModal(false);
    } catch (err) {
      console.error("Error saving team member:", err);
      alert(err.message);
    }
  };

  // Delete member
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const response = await fetch(`${apiUrl}/team/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete team member");

      await fetchTeamMembers();
    } catch (err) {
      console.error("Error deleting team member:", err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <IconUsers className="w-6 h-6 text-orange-400" />
          <h2 className="text-2xl font-bold text-white">Team Members</h2>
          <span className="px-2.5 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs text-orange-300">
            {teamMembers.length}
          </span>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium transition-all duration-200"
        >
          <IconPlus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <motion.div
            key={member._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-white/[0.05] hover:border-orange-500/30 transition-all duration-200"
          >
            {/* Member Image */}
            <div className="relative mb-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/10">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-light text-white/20">
                    {member.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>
            </div>

            {/* Member Info */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-white/60 uppercase tracking-wide">
                {member.team}
              </p>
              {member.order !== undefined && (
                <p className="text-xs text-white/40 mt-1">
                  Order: {member.order}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(member)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors text-sm font-medium"
              >
                <IconEdit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(member._id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
              >
                <IconTrash className="w-4 h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {teamMembers.length === 0 && !loading && (
        <div className="text-center py-20 text-white/40">
          <IconUsers className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No team members yet</p>
          <p className="text-sm mt-2">Click "Add Member" to create one</p>
        </div>
      )}

      {/* Modal for Create/Edit */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {isEditing ? "Edit Team Member" : "Add Team Member"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/40 hover:text-white/60 transition-colors"
                >
                  <IconX className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all"
                    placeholder="Enter member name"
                  />
                </div>

                {/* Team/Role */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Team/Role *
                  </label>
                  <input
                    type="text"
                    name="team"
                    value={formData.team}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all"
                    placeholder="e.g., Technical Team, Web Dev, etc."
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all"
                    placeholder="0"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    Lower numbers appear first
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 bg-white/[0.05] border border-white/10 text-white/70 rounded-lg hover:bg-white/[0.08] transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all font-medium"
                  >
                    {isEditing ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
