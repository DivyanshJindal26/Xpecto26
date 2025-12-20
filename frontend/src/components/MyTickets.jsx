import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const MyTickets = () => {
  const { isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyTickets();
    }
  }, [isAuthenticated]);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/tickets/my-tickets`, {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setTickets(data.data);
      }
    } catch (err) {
      setError('Failed to fetch tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tickets/${ticketId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchMyTickets();
      } else {
        setError(data.message || 'Cancellation failed');
      }
    } catch (err) {
      setError('Failed to cancel ticket');
      console.error(err);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Workshop':
        return 'from-indigo-400 to-cyan-400';
      case 'Pronite':
        return 'from-pink-400 to-rose-400';
      case 'Event':
        return 'from-yellow-400 to-orange-400';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-500/20 text-green-300 border-green-500',
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
      cancelled: 'bg-red-500/20 text-red-300 border-red-500',
    };
    return styles[status] || styles.pending;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Please login to view your tickets</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your tickets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
          My Tickets
        </h2>

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

        {tickets.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-xl">You haven't purchased any tickets yet</p>
            <p className="mt-2">Browse workshops, pronites, and events to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getTypeColor(ticket.itemType)} bg-clip-text text-transparent border ${getTypeColor(ticket.itemType)} border-opacity-30`}>
                    {ticket.itemType}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(ticket.status)}`}>
                    {ticket.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {ticket.itemId?.title || 'Event Details Unavailable'}
                </h3>

                {ticket.itemId?.description && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {ticket.itemId.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <p><span className="text-purple-400">Quantity:</span> {ticket.quantity}</p>
                  <p><span className="text-purple-400">Total Price:</span> ₹{ticket.totalPrice}</p>
                  <p><span className="text-purple-400">Payment:</span> {ticket.paymentStatus.toUpperCase()}</p>
                  <p><span className="text-purple-400">Purchased:</span> {new Date(ticket.purchasedAt).toLocaleDateString()}</p>
                  
                  {ticket.itemId?.venue && (
                    <p><span className="text-purple-400">Venue:</span> {ticket.itemId.venue}</p>
                  )}
                  {ticket.itemId?.date && (
                    <p><span className="text-purple-400">Date:</span> {new Date(ticket.itemId.date).toLocaleDateString()}</p>
                  )}
                </div>

                {ticket.status === 'confirmed' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCancel(ticket._id)}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
                  >
                    Cancel Ticket
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
