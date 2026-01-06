import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarBackground from '../components/StarBackground';

// --- IMPORT YOUR EXISTING MANAGERS HERE ---
import EventManager from '../components/EventManager';
import ExhibitionManager from '../components/ExhibitionManager';
import SessionManager from '../components/SessionManager';
import WorkshopManager from '../components/WorkshopManager';
import ProniteManager from '../components/ProniteManager';
// If you have a UserManager, import it too, otherwise create one later.

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events'); // Default tab

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Define your sidebar items mapping to components
  const tabs = [
    { id: 'events', label: 'EVENTS', component: <EventManager /> },
    { id: 'exhibitions', label: 'EXHIBITIONS', component: <ExhibitionManager /> },
    { id: 'sessions', label: 'SESSIONS', component: <SessionManager /> },
    { id: 'workshops', label: 'WORKSHOPS', component: <WorkshopManager /> },
    { id: 'pronites', label: 'PRONITES', component: <ProniteManager /> },
  ];

  return (
    <div className="flex w-full min-h-screen bg-black text-white font-['Montserrat'] overflow-hidden">
      {/* Reusing your StarBackground for theme consistency */}
      <StarBackground />
      
      {/* --- SIDEBAR --- */}
      <div className="w-64 fixed h-full bg-[#0a0a0a]/90 backdrop-blur-xl border-r border-white/10 flex flex-col p-6 z-50">
        <h2 className="text-2xl font-['Orbitron'] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-10 tracking-widest text-center">
          ADMIN
        </h2>
        
        <div className="flex flex-col gap-4 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-3 rounded-xl transition-all font-bold text-xs tracking-widest ${
                activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button 
          onClick={handleLogout}
          className="mt-auto px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-xs font-bold tracking-widest"
        >
          LOGOUT
        </button>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="ml-64 flex-1 p-8 md:p-12 relative z-10 h-screen overflow-y-auto">
        <h1 className="text-3xl font-['Orbitron'] font-bold mb-8 text-white border-b border-white/10 pb-4">
          MANAGE {activeTab.toUpperCase()}
        </h1>
        
        {/* Render the selected manager component */}
        <div className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl min-h-[500px]">
          {tabs.find(t => t.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;