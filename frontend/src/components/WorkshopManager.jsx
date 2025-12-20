import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const WorkshopManager = () => {
  const { isAuthenticated, user } = useAuth();
  const [workshops, setWorkshops] = useState([]);
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
    duration: '',
    instructor: '',
    company: '',
    ticketPrice: '',
    maxCapacity: '',
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/workshops`);
      const data = await response.json();
      
      if (data.success) {
        setWorkshops(data.data);
      }
    } catch (err) {
      setError('Failed to fetch workshops');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `${API_URL}/api/workshops/${editingId}`
        : `${API_URL}/api/workshops`;
      
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
        fetchWorkshops();
        resetForm();
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      setError('Failed to save workshop');
      console.error(err);
    }
  };

  const handleEdit = (workshop) => {
    setFormData({
      title: workshop.title,
      description: workshop.description,
      venue: workshop.venue || '',
      date: workshop.date ? new Date(workshop.date).toISOString().split('T')[0] : '',
      startTime: workshop.startTime || '',
      endTime: workshop.endTime || '',
      duration: workshop.duration || '',
      instructor: workshop.instructor || '',
      company: workshop.company || '',
      ticketPrice: workshop.ticketPrice || '',
      maxCapacity: workshop.maxCapacity || '',
    });
    setEditingId(workshop._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/workshops/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        fetchWorkshops();
      } else {
        setError(data.message || 'Delete failed');
      }
    } catch (err) {
      setError('Failed to delete workshop');
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
      duration: '',
      instructor: '',
      company: '',
      ticketPrice: '',
      maxCapacity: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handlePurchase = async (workshopId) => {
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
          itemType: 'Workshop',
          itemId: workshopId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchWorkshops();
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Workshops
          </h2>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg font-semibold shadow-lg"
            >
              {showForm ? 'Cancel' : 'Create Workshop'}
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
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Venue"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="time"
                  placeholder="Start Time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="time"
                  placeholder="End Time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 2 hours)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Ticket Price"
                  value={formData.ticketPrice}
                  onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                  min="0"
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Max Capacity"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                  min="1"
                  className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <textarea
                placeholder="Description *"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="4"
                className="mt-4 w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
              <div className="mt-4 flex gap-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg font-semibold"
                >
                  {editingId ? 'Update Workshop' : 'Create Workshop'}
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

        {/* Workshops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No workshops found. {isAdmin && 'Create your first one!'}
            </div>
          ) : (
            workshops.map((workshop) => (
              <motion.div
                key={workshop._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl"
              >
                <h3 className="text-xl font-bold text-white mb-2">{workshop.title}</h3>
                <p className="text-gray-300 mb-4">{workshop.description}</p>
                <div className="space-y-1 text-sm text-gray-400">
                  {workshop.venue && (
                    <p><span className="text-indigo-400">Venue:</span> {workshop.venue}</p>
                  )}
                  {workshop.instructor && (
                    <p><span className="text-indigo-400">Instructor:</span> {workshop.instructor}</p>
                  )}
                  {workshop.date && (
                    <p><span className="text-indigo-400">Date:</span> {new Date(workshop.date).toLocaleDateString()}</p>
                  )}
                  {workshop.startTime && (
                    <p><span className="text-indigo-400">Time:</span> {workshop.startTime} - {workshop.endTime}</p>
                  )}
                  {workshop.duration && (
                    <p><span className="text-indigo-400">Duration:</span> {workshop.duration}</p>
                  )}
                  <p><span className="text-indigo-400">Price:</span> ₹{workshop.ticketPrice || 0}</p>
                  <p><span className="text-indigo-400">Available:</span> {workshop.availableTickets}/{workshop.maxCapacity}</p>
                </div>
                {isAdmin ? (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(workshop)}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(workshop._id)}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
                    >
                      Delete
                    </motion.button>
                  </div>
                ) : isAuthenticated && workshop.availableTickets > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePurchase(workshop._id)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-lg text-sm font-semibold"
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

export default WorkshopManager;
