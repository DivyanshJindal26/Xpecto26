import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const ExhibitionManager = () => {
  const { isAuthenticated, user } = useAuth();
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    club_name: '',
    date: '',
    company: '',
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/exhibitions`);
      const data = await response.json();
      
      if (data.success) {
        setExhibitions(data.data);
      }
    } catch (err) {
      setError('Failed to fetch exhibitions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `${API_URL}/api/exhibitions/${editingId}`
        : `${API_URL}/api/exhibitions`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        fetchExhibitions();
        resetForm();
        setShowForm(false);
      } else {
        setError(data.message || 'Failed to save exhibition');
      }
    } catch (err) {
      setError('Failed to save exhibition');
      console.error(err);
    }
  };

  const handleEdit = (exhibition) => {
    setFormData({
      title: exhibition.title,
      description: exhibition.description,
      venue: exhibition.venue,
      club_name: exhibition.club_name,
      date: new Date(exhibition.date).toISOString().split('T')[0],
      company: exhibition.company || '',
    });
    setEditingId(exhibition._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exhibition?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/exhibitions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        fetchExhibitions();
      } else {
        setError(data.message || 'Failed to delete exhibition');
      }
    } catch (err) {
      setError('Failed to delete exhibition');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      venue: '',
      club_name: '',
      date: '',
      company: '',
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Exhibitions
        </h2>
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            {showForm ? 'Cancel' : '+ Add Exhibition'}
          </motion.button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
          {error}
          <button onClick={() => setError(null)} className="float-right text-xl">&times;</button>
        </div>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Club Name *</label>
                  <input
                    type="text"
                    name="club_name"
                    value={formData.club_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Venue *</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  {editingId ? 'Update' : 'Create'} Exhibition
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                    className="px-6 py-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exhibition Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exhibitions.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            No exhibitions found. {isAdmin && 'Create your first one!'}
          </div>
        ) : (
          exhibitions.map((exhibition) => (
            <motion.div
              key={exhibition._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/60 transition-all"
            >
              <h3 className="text-xl font-bold mb-2 text-purple-300">{exhibition.title}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{exhibition.description}</p>
              <div className="space-y-2 text-sm text-gray-400">
                <p><span className="text-purple-400">Club:</span> {exhibition.club_name}</p>
                <p><span className="text-purple-400">Venue:</span> {exhibition.venue}</p>
                <p><span className="text-purple-400">Date:</span> {new Date(exhibition.date).toLocaleDateString()}</p>
                {exhibition.company && (
                  <p><span className="text-purple-400">Company:</span> {exhibition.company}</p>
                )}
              </div>
              {isAdmin && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleEdit(exhibition)}
                    className="flex-1 px-4 py-2 bg-blue-600/80 rounded hover:bg-blue-600 transition-all text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exhibition._id)}
                    className="flex-1 px-4 py-2 bg-red-600/80 rounded hover:bg-red-600 transition-all text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExhibitionManager;
