import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Crosshair, Hexagon, Zap, Activity, Globe, Shield } from 'lucide-react';
import Blackhole3D from '../components/Blackhole3D';

// --- DATA CONFIGURATION ---
const navItems = [
  { 
    id: 'exhibition', 
    label: 'EXHIBITION', 
    path: '/exhibition',
    subtitle: 'Innovation Hub',
    desc: 'Explore cutting-edge tech prototypes and machinery.',
    color: '#f97316',
    stat: '98% SYNC'
  },
  { 
    id: 'events', 
    label: 'COMPETITIONS', 
    path: '/events',
    subtitle: 'Battle Grounds',
    desc: 'Robowars, Hackathons, and Esports tournaments.',
    color: '#06b6d4',
    stat: 'ACTIVE ZONES'
  },
  { 
    id: 'sessions', 
    label: 'SESSIONS', 
    path: '/sessions',
    subtitle: 'Knowledge Base',
    desc: 'Expert talks from industry leaders and scientists.',
    color: '#8b5cf6',
    stat: 'INCOMING SIGNAL'
  },
  { 
    id: 'team', 
    label: 'THE CREW', 
    path: '/Team',
    subtitle: 'Operatives',
    desc: 'Meet the team behind the Xpecto mission.',
    color: '#eab308',
    stat: 'PERSONNEL'
  },
  { 
    id: 'sponsors', 
    label: 'ALLIANCE', 
    path: '/Sponsors',
    subtitle: 'Partners',
    desc: 'Strategic support from global tech giants.',
    color: '#10b981',
    stat: 'SECURE'
  },
  { 
    id: 'about', 
    label: 'ARCHIVES', 
    path: '/About',
    subtitle: 'Mission Logs',
    desc: 'History and details of the Xpecto initiative.',
    color: '#ef4444',
    stat: 'READ ONLY'
  },
];

const Home = () => {
  const [activeItem, setActiveItem] = useState(navItems[0]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-['Montserrat'] selection:bg-cyan-500/30">
      
      {/* 1. THE VIEWPORT (Background Model) */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]"></div>
          {/* The Black Hole is pushed slightly right to balance the UI */}
          <div className="absolute top-0 right-[-10%] w-[100vw] h-[100vh] opacity-60 md:opacity-80 transition-all duration-700">
              <Blackhole3D />
          </div>
          {/* Overlay Grid */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0)_2px,transparent_2px)] bg-[length:40px_40px] opacity-10 pointer-events-none"></div>
      </div>

      {/* 2. THE UI LAYER */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row p-6 md:p-12 gap-8">
          
          {/* --- LEFT COLUMN: NAVIGATION LIST --- */}
          <div className="w-full md:w-1/3 flex flex-col justify-center h-full relative z-20">
              
              {/* Header */}
              <div className="mb-12">
                  <div className="flex items-center gap-2 text-cyan-500 text-xs font-mono tracking-widest mb-2">
                      <Activity size={14} className="animate-pulse" /> SYSTEM READY
                  </div>
                  <h1 className="text-6xl font-black font-['Orbitron'] text-white tracking-tighter leading-none">
                      XPECTO
                  </h1>
              </div>

              {/* The List */}
              <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                      <NavItem 
                        key={item.id} 
                        item={item} 
                        isActive={activeItem.id === item.id} 
                        onHover={() => setActiveItem(item)}
                      />
                  ))}
              </div>

              {/* Footer Status */}
              <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-gray-500">
                  <span>IIT MANDI // 2025</span>
                  <span>SEQ: 44.91.X</span>
              </div>
          </div>


          {/* --- RIGHT COLUMN: HOLOGRAPHIC PREVIEW --- */}
          <div className="w-full md:w-2/3 h-full flex items-center justify-center md:justify-end relative pointer-events-none md:pointer-events-auto">
              
              <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.id}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="w-full md:w-[500px] bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-[30px] p-8 md:p-12 relative overflow-hidden group shadow-2xl"
                  >
                      {/* Dynamic Accent Color Background */}
                      <div 
                        className="absolute top-0 right-0 w-[300px] h-[300px] blur-[120px] opacity-20 transition-colors duration-500"
                        style={{ backgroundColor: activeItem.color }}
                      ></div>

                      {/* Content */}
                      <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                          
                          {/* Top Specs */}
                          <div className="flex justify-between items-start">
                              <div className="flex flex-col">
                                  <span className="text-xs font-mono text-gray-400 tracking-widest mb-1">TARGET SECTOR</span>
                                  <h2 className="text-3xl md:text-5xl font-black font-['Orbitron'] text-white uppercase italic">
                                      {activeItem.label}
                                  </h2>
                              </div>
                              <Hexagon className="text-white/20 group-hover:text-white transition-colors animate-spin-slow" size={40} />
                          </div>

                          {/* Description */}
                          <div>
                              <div className="w-12 h-1 mb-4" style={{ backgroundColor: activeItem.color }}></div>
                              <h3 className="text-lg text-white font-bold mb-2 tracking-wide">
                                  {activeItem.subtitle}
                              </h3>
                              <p className="text-gray-400 font-light text-sm leading-relaxed">
                                  {activeItem.desc}
                              </p>
                          </div>

                          {/* Action Bar */}
                          <div className="flex items-center justify-between pt-8 border-t border-white/10">
                              <div className="flex items-center gap-2 text-xs font-mono" style={{ color: activeItem.color }}>
                                  <Crosshair size={14} /> {activeItem.stat}
                              </div>
                              
                              <Link to={activeItem.path} className="pointer-events-auto">
                                  <button className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-full font-bold text-xs tracking-widest flex items-center gap-2 transition-all group/btn">
                                      INITIALIZE <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                  </button>
                              </Link>
                          </div>
                      </div>

                      {/* Tech Decors */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-[8px] font-mono text-white/10">ID: {activeItem.id.toUpperCase()}</div>

                  </motion.div>
              </AnimatePresence>

          </div>

      </div>

      <style jsx>{`
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// --- COMPONENT: NAV ITEM (Left Side) ---
const NavItem = ({ item, isActive, onHover }) => {
  return (
    <div 
      onMouseEnter={onHover}
      className="group cursor-pointer relative pl-6 py-4 border-l-2 transition-all duration-300"
      style={{ borderColor: isActive ? item.color : 'rgba(255,255,255,0.1)' }}
    >
        {/* Active Glow behind text */}
        {isActive && (
            <motion.div 
                layoutId="active-glow"
                className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent -z-10"
                transition={{ duration: 0.3 }}
            />
        )}

        <div className="flex items-center justify-between pr-4">
            <span 
                className={`text-2xl md:text-3xl font-bold font-['Orbitron'] tracking-wide transition-all duration-300 ${isActive ? 'text-white translate-x-2' : 'text-gray-600 group-hover:text-gray-400'}`}
            >
                {item.label}
            </span>
            
            {/* Arrow appears on active */}
            <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                <ChevronRight size={20} style={{ color: item.color }} />
            </div>
        </div>
    </div>
  );
};

export default Home;