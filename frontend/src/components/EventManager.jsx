import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const EventManager = () => {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState([]);
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
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/events`);
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      }
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `${API_URL}/api/events/${editingId}`
        : `${API_URL}/api/events`;
      
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
        fetchEvents();
        resetForm();
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      setError('Failed to save event');
      console.error(err);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      venue: event.venue || '',
      club_name: event.club_name || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      company: event.company || '',
    });
    setEditingId(event._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        fetchEvents();
      } else {
        setError(data.message || 'Delete failed');
      }
    } catch (err) {
      setError('Failed to delete event');
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
    setShowForm(false);
  };

  const handlePurchase = async (eventId) => {
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
          itemType: 'Event',
          itemId: eventId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchEvents();
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Events
        </h2>
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold shadow-lg"
          >
            {showForm ? 'Cancel' : 'Create Event'}
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
                className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
              <input
                type="text"
                placeholder="Venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
              <input
                type="text"
                placeholder="Club Name"
                value={formData.club_name}
                onChange={(e) => setFormData({ ...formData, club_name: e.target.value })}
                className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <textarea
              placeholder="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="4"
              className="mt-4 w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
            <div className="mt-4 flex gap-4">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold"
              >
                {editingId ? 'Update Event' : 'Create Event'}
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            No events found. {isAdmin && 'Create your first one!'}
          </div>
        ) : (
          events.map((event) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl"
            >
              <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
              <p className="text-gray-300 mb-4">{event.description}</p>
              <div className="space-y-1 text-sm text-gray-400">
                {event.venue && (
                  <p><span className="text-yellow-400">Venue:</span> {event.venue}</p>
                )}
                {event.club_name && (
                  <p><span className="text-yellow-400">Club:</span> {event.club_name}</p>
                )}
                {event.date && (
                  <p><span className="text-yellow-400">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
                )}
                {event.company && (
                  <p><span className="text-yellow-400">Company:</span> {event.company}</p>
                )}
                <p><span className="text-yellow-400">Price:</span> ₹{event.ticketPrice || 0}</p>
                <p><span className="text-yellow-400">Available:</span> {event.availableTickets}/{event.maxCapacity}</p>
              </div>
              {isAdmin ? (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(event)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(event._id)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
                  >
                    Delete
                  </motion.button>
                </div>
              ) : isAuthenticated && event.availableTickets > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePurchase(event._id)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg text-sm font-semibold"
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

export default EventManager;
