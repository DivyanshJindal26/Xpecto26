import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const SessionManager = () => {
  const { isAuthenticated, user } = useAuth();
  const [sessions, setSessions] = useState([]);
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
    startTime: '',
    endTime: '',
    duration: '',
    registrationLimit: '',
    company: '',
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/sessions`);
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.data);
      }
    } catch (err) {
      setError('Failed to fetch sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `${API_URL}/api/sessions/${editingId}`
        : `${API_URL}/api/sessions`;
      
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
        fetchSessions();
        resetForm();
        setShowForm(false);
      } else {
        setError(data.message || 'Failed to save session');
      }
    } catch (err) {
      setError('Failed to save session');
      console.error(err);
    }
  };

  const handleEdit = (session) => {
    setFormData({
      title: session.title,
      description: session.description,
      venue: session.venue,
      club_name: session.club_name,
      date: new Date(session.date).toISOString().split('T')[0],
      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.duration,
      registrationLimit: session.registrationLimit || '',
      company: session.company || '',
    });
    setEditingId(session._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/sessions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        fetchSessions();
      } else {
        setError(data.message || 'Failed to delete session');
      }
    } catch (err) {
      setError('Failed to delete session');
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
      startTime: '',
      endTime: '',
      duration: '',
      registrationLimit: '',
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Sessions
        </h2>
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all"
          >
            {showForm ? 'Cancel' : '+ Add Session'}
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
            <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
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
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
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
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
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
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time *</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Time *</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 2 hours"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Registration Limit</label>
                  <input
                    type="number"
                    name="registrationLimit"
                    value={formData.registrationLimit}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
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
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all"
                >
                  {editingId ? 'Update' : 'Create'} Session
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

      {/* Session Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            No sessions found. {isAdmin && 'Create your first one!'}
          </div>
        ) : (
          sessions.map((session) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 hover:border-green-500/60 transition-all"
            >
              <h3 className="text-xl font-bold mb-2 text-green-300">{session.title}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{session.description}</p>
              <div className="space-y-2 text-sm text-gray-400">
                <p><span className="text-green-400">Club:</span> {session.club_name}</p>
                <p><span className="text-green-400">Venue:</span> {session.venue}</p>
                <p><span className="text-green-400">Date:</span> {new Date(session.date).toLocaleDateString()}</p>
                <p><span className="text-green-400">Time:</span> {session.startTime} - {session.endTime}</p>
                <p><span className="text-green-400">Duration:</span> {session.duration}</p>
                {session.registrationLimit && (
                  <p><span className="text-green-400">Limit:</span> {session.registrationLimit} people</p>
                )}
                {session.company && (
                  <p><span className="text-green-400">Company:</span> {session.company}</p>
                )}
              </div>
              {isAdmin && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleEdit(session)}
                    className="flex-1 px-4 py-2 bg-blue-600/80 rounded hover:bg-blue-600 transition-all text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(session._id)}
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

export default SessionManager;
