import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';
import UserProfile from './UserProfile';
import ExhibitionManager from './ExhibitionManager';
import SessionManager from './SessionManager';
import EventManager from './EventManager';
import WorkshopManager from './WorkshopManager';
import ProniteManager from './ProniteManager';
import MyTickets from './MyTickets';

export default function XpectoHome() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('exhibitions');

  return (
    <div className="relative min-h-screen overflow-hidden text-white font-sans bg-black">
      {/* background nebula gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 10% 15%, rgba(88, 28, 135, 0.55), transparent 10%), radial-gradient(ellipse at 90% 85%, rgba(16, 185, 129, 0.20), transparent 12%), linear-gradient(180deg, rgba(6,6,23,0.96), rgba(2,6,23,0.9))',
          mixBlendMode: 'screen',
        }}
      />

      {/* Header with Auth */}
      <header className="relative z-10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          >
            XPECTO
          </motion.h1>
          
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="animate-pulse bg-gray-700 h-10 w-32 rounded-lg"></div>
            ) : isAuthenticated ? (
              <UserProfile />
            ) : (
              <GoogleLoginButton />
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 mt-8">
        <div className="flex gap-4 border-b border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('exhibitions')}
            className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'exhibitions'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Exhibitions
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'sessions'
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Sessions
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'events'
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('workshops')}
            className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'workshops'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Workshops
          </button>
          <button
            onClick={() => setActiveTab('pronites')}
            className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
              activeTab === 'pronites'
                ? 'text-rose-400 border-b-2 border-rose-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Pronites
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('mytickets')}
              className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'mytickets'
                  ? 'text-pink-400 border-b-2 border-pink-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              My Tickets
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 py-8">
        {activeTab === 'exhibitions' ? (
          <ExhibitionManager />
        ) : activeTab === 'sessions' ? (
          <SessionManager />
        ) : activeTab === 'events' ? (
          <EventManager />
        ) : activeTab === 'workshops' ? (
          <WorkshopManager />
        ) : activeTab === 'pronites' ? (
          <ProniteManager />
        ) : activeTab === 'mytickets' ? (
          <MyTickets />
        ) : (
          <ExhibitionManager />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-gray-500 text-sm">
        <p>&copy; 2025 Xpecto. All rights reserved.</p>
      </footer>
    </div>
  );
}
