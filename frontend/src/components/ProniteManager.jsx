import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const ProniteManager = () => {
  const { isAuthenticated, user } = useAuth();
  const [pronites, setPronites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    startTime: '',
    endTime: '',
    artist: '',
    genre: '',
    ticketPrice: '',
    maxCapacity: '',
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchPronites();
  }, []);

  const fetchPronites = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/pronites`);
      const data = await response.json();
      
      if (data.success) {
        setPronites(data.data);
      }
    } catch (err) {
      setError('Failed to fetch pronites');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `${API_URL}/api/pronites/${editingId}`
        : `${API_URL}/api/pronites`;
      
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
        fetchPronites();
        resetForm();
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      setError('Failed to save pronite');
      console.error(err);
    }
  };

  const handleEdit = (pronite) => {
    setFormData({
      title: pronite.title,
      description: pronite.description,
      venue: pronite.venue || '',
      date: pronite.date ? new Date(pronite.date).toISOString().split('T')[0] : '',
      startTime: pronite.startTime || '',
      endTime: pronite.endTime || '',
      artist: pronite.artist || '',
      genre: pronite.genre || '',
      ticketPrice: pronite.ticketPrice || '',
      maxCapacity: pronite.maxCapacity || '',
    });
    setEditingId(pronite._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pronite?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/pronites/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        fetchPronites();
      } else {
        setError(data.message || 'Delete failed');
      }
    } catch (err) {
      setError('Failed to delete pronite');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      venue: '',
      date: '',
      startTime: '',
      endTime: '',
      artist: '',
      genre: '',
      ticketPrice: '',
      maxCapacity: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handlePurchase = async (proniteId) => {
    if (!isAuthenticated) {
      setError('Please login to purchase tickets');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          itemType: 'Pronite',
          itemId: proniteId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchPronites();
      } else {
        setError(data.message || 'Purchase failed');
      }
    } catch (err) {
      setError('Failed to purchase ticket');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-pink-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-pink-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
            Pronites
          </h2>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold shadow-lg"
            >
              {showForm ? 'Cancel' : 'Create Pronite'}
            </motion.button>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200"
          >
            {error}
            <button onClick={() => setError(null)} className="ml-4 underline">Dismiss</button>
          </motion.div>
        )}

        {/* Form */}
        <AnimatePresence>
          {showForm && isAdmin && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
                <input
                  type="text"
                  placeholder="Venue"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
                <input
                  type="time"
                  placeholder="Start Time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
                <input
                  type="time"
                  placeholder="End Time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
                <input
                  type="text"
                  placeholder="Artist"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
                <input
                  type="text"
                  placeholder="Genre"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
                <input
                  type="number"
                  placeholder="Ticket Price"
                  value={formData.ticketPrice}
                  onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                  min="0"
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
                <input
                  type="number"
                  placeholder="Max Capacity"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                  min="1"
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
              </div>
              <textarea
                placeholder="Description *"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="4"
                className="mt-4 w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
              />
              <div className="mt-4 flex gap-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold"
                >
                  {editingId ? 'Update Pronite' : 'Create Pronite'}
                </motion.button>
                {editingId && (
                  <motion.button
                    type="button"
                    onClick={resetForm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold"
                  >
                    Cancel Edit
                  </motion.button>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Pronites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pronites.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No pronites found. {isAdmin && 'Create your first one!'}
            </div>
          ) : (
            pronites.map((pronite) => (
              <motion.div
                key={pronite._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl"
              >
                <h3 className="text-xl font-bold text-white mb-2">{pronite.title}</h3>
                <p className="text-gray-300 mb-4">{pronite.description}</p>
                <div className="space-y-1 text-sm text-gray-400">
                  {pronite.venue && (
                    <p><span className="text-pink-400">Venue:</span> {pronite.venue}</p>
                  )}
                  {pronite.artist && (
                    <p><span className="text-pink-400">Artist:</span> {pronite.artist}</p>
                  )}
                  {pronite.genre && (
                    <p><span className="text-pink-400">Genre:</span> {pronite.genre}</p>
                  )}
                  {pronite.date && (
                    <p><span className="text-pink-400">Date:</span> {new Date(pronite.date).toLocaleDateString()}</p>
                  )}
                  {pronite.startTime && (
                    <p><span className="text-pink-400">Time:</span> {pronite.startTime} - {pronite.endTime}</p>
                  )}
                  <p><span className="text-pink-400">Price:</span> ₹{pronite.ticketPrice || 0}</p>
                  <p><span className="text-pink-400">Available:</span> {pronite.availableTickets}/{pronite.maxCapacity}</p>
                </div>
                {isAdmin ? (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(pronite)}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(pronite._id)}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
                    >
                      Delete
                    </motion.button>
                  </div>
                ) : isAuthenticated && pronite.availableTickets > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePurchase(pronite._id)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-lg text-sm font-semibold"
                    >
                      Purchase Ticket
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProniteManager;
