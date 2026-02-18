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

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", image: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/sponsors`, { credentials: "include" });
      const json = await res.json();
      if (json.success) setSponsors(json.data);
    } catch (err) {
      console.error("Failed to fetch sponsors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode("create");
    setFormData({ title: "", description: "", image: [] });
    setSelectedSponsor(null);
    setShowModal(true);
  };

  const handleEdit = (s) => {
    setModalMode("edit");
    setSelectedSponsor(s);
    setFormData({ title: s.title || "", description: s.description || "", image: s.image || [] });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this sponsor?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/sponsors/${id}`, { method: "DELETE", credentials: "include" });
      const json = await res.json();
      if (json.success) {
        fetchSponsors();
        alert("Sponsor deleted");
      } else alert(json.message || "Failed to delete sponsor");
    } catch (err) {
      console.error(err);
      alert("Failed to delete sponsor");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = modalMode === "create" ? `${API_BASE_URL}/sponsors` : `${API_BASE_URL}/sponsors/${selectedSponsor._id}`;
      const method = modalMode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        fetchSponsors();
        setShowModal(false);
        alert(modalMode === "create" ? "Sponsor created" : "Sponsor updated");
      } else alert(json.message || "Operation failed");
    } catch (err) {
      console.error("Failed to save sponsor:", err);
      alert("Failed to save sponsor");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const handleImageAdd = () => {
    const url = prompt("Enter image URL:");
    if (url) setFormData((p) => ({ ...p, image: [...(p.image || []), url] }));
  };

  const handleImageRemove = (idx) => setFormData((p) => ({ ...p, image: p.image.filter((_, i) => i !== idx) }));

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <IconLoader2 className="w-8 h-8 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Sponsors ({sponsors.length})</h2>
        <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/10 border border-orange-500/30 rounded-xl text-orange-300">
          <IconPlus className="w-5 h-5" />
          Add Sponsor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sponsors.map((s) => (
          <motion.div key={s._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-b from-[#12121a] to-[#0a0a0f] rounded-xl border border-white/10 p-4">
            {s.image?.[0] && <img src={s.image[0]} alt={s.title} className="w-full h-36 object-contain rounded-lg mb-3" />}
            <h3 className="text-lg font-semibold text-white mb-2 truncate">{s.title}</h3>
            <p className="text-white/60 text-sm mb-3 line-clamp-3">{s.description}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(s)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-white/80 text-sm">
                <IconEdit className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => handleDelete(s._id)} className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                <IconTrash className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#12121a] to-[#0a0a0f] rounded-2xl border border-white/10">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08]">
                <IconX className="w-5 h-5 text-white/50" />
              </button>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">{modalMode === "create" ? "Add Sponsor" : "Edit Sponsor"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Title *</label>
                    <input required type="text" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                    <textarea rows={4} value={formData.description} onChange={(e) => handleChange("description", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Images</label>
                    <div className="space-y-2">
                      {(formData.image || []).map((img, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-white/[0.02] rounded-lg">
                          <img src={img} alt="" className="w-16 h-16 object-cover rounded" />
                          <span className="flex-1 text-white/60 text-sm truncate">{img}</span>
                          <button type="button" onClick={() => handleImageRemove(idx)} className="p-1 text-red-400"><IconX className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={handleImageAdd} className="w-full px-4 py-2 border border-dashed border-white/20 rounded-lg text-white/60">+ Add Image URL</button>
                    </div>
                  </div>
                  <button type="submit" disabled={saving} className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl flex items-center justify-center gap-2">
                    {saving ? (<><IconLoader2 className="w-5 h-5 animate-spin" /> Saving...</>) : (<><IconCheck className="w-5 h-5" /> {modalMode === "create" ? "Create Sponsor" : "Update Sponsor"}</>)}
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
