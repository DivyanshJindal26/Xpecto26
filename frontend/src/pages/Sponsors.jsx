import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ExternalLink, Globe, ShieldCheck, Gem } from 'lucide-react';

// --- 1. DEFINE ICONS FIRST (Fixes ReferenceError) ---
const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const CpuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);

// --- 2. DEFINE DATA SECOND ---
const sponsorData = [
  {
    id: 1,
    name: "GOOGLE CLOUD",
    tier: "TITLE SPONSOR",
    desc: "Powering the future of cloud computing. Providing infrastructure for our hackathons and AI challenges.",
    link: "https://cloud.google.com",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069", 
    color: "#4285F4", // Google Blue
    accent: "rgba(66, 133, 244, 0.5)",
    icon: <Globe />
  },
  {
    id: 2,
    name: "RED BULL",
    tier: "ENERGY PARTNER",
    desc: "Giving wings to innovation. Fueling our participants through 24-hour coding marathons.",
    link: "https://www.redbull.com",
    image: "https://images.unsplash.com/photo-1620406739776-e9c402773229?q=80&w=1974",
    color: "#ef4444", // Red
    accent: "rgba(239, 68, 68, 0.5)",
    icon: <ZapIcon />
  },
  {
    id: 3,
    name: "NVIDIA",
    tier: "TECH PARTNER",
    desc: "The engine of AI. Supplying GPUs and hardware support for the Robotics and ML workshops.",
    link: "https://www.nvidia.com",
    image: "https://images.unsplash.com/photo-1624705051759-40eb340a6de4?q=80&w=2070",
    color: "#76b900", // Nvidia Green
    accent: "rgba(118, 185, 0, 0.5)",
    icon: <CpuIcon />
  }
];

// --- 3. COMPONENTS ---
const WarpStars = ({ isWarping, color }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
     <div className={`absolute inset-0 transition-opacity duration-300 ${isWarping ? 'opacity-0' : 'opacity-100'}`}>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
         {[...Array(30)].map((_, i) => (<div key={i} className="absolute bg-white rounded-full w-[2px] h-[2px]" style={{ top: Math.random()*100+'%', left: Math.random()*100+'%' }}></div>))}
     </div>
     <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-100 ${isWarping ? 'opacity-100' : 'opacity-0'}`}>
         {[...Array(20)].map((_, i) => (<div key={i} className="absolute h-[2px] w-[60vw] origin-center" style={{ backgroundColor: color, rotate: `${i * 18}deg`, transform: `translateX(${Math.random() * 50}px)`, boxShadow: `0 0 10px ${color}` }}></div>))}
     </div>
  </div>
);

const Sponsors = () => {
  const [index, setIndex] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const partner = sponsorData[index];

  const handleNav = (dir) => {
    if (isWarping) return;
    setIsWarping(true);
    setTimeout(() => {
        setIndex((prev) => (prev + dir + sponsorData.length) % sponsorData.length);
        setIsWarping(false);
    }, 800); 
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black text-white font-['Montserrat'] overflow-hidden">
      
      {/* 1. BACKGROUND */}
      <div className="absolute inset-0 bg-[#080808]">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000_100%)]"></div>
         {/* Metallic/Gold Glow */}
         <motion.div animate={{ backgroundColor: partner.color }} transition={{ duration: 1 }} className="absolute inset-0 opacity-10 blur-[150px] mix-blend-screen" />
      </div>
      <WarpStars isWarping={isWarping} color={partner.color} />

      {/* 2. THE HEXAGON PORTAL (The Vault) */}
      <div className={`absolute top-[40%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-1000 ${isWarping ? 'scale-[1.5] md:scale-[2] rotate-90 blur-sm' : 'scale-100 rotate-0 blur-0'}`}>
          
          {/* Hexagon Container */}
          <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[500px] md:h-[500px] relative flex items-center justify-center">
              
              {/* Spinning Hex Frame */}
              <div className="absolute inset-0 border-[2px] border-white/20" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute inset-[-15px] border border-dashed border-white/10 animate-spin-slow" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>

              {/* The Content Mask */}
              <div className="w-[90%] h-[90%] relative shadow-2xl group" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm border-white/20"></div>
                  
                  <AnimatePresence mode="wait">
                      {!isWarping && (
                          <motion.img 
                            key={partner.id} src={partner.image}
                            initial={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8 }}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                          />
                      )}
                  </AnimatePresence>
                  
                  {/* Hex Grid Overlay */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              </div>
          </div>
      </div>

      {/* 3. INFO HUD */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between py-24 md:py-0">
          <AnimatePresence mode="wait">
             {!isWarping && (
                 <>
                    {/* Top/Left: Identification */}
                    <motion.div 
                        key={`left-${partner.id}`}
                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                        className="w-full text-center px-6 md:absolute md:top-1/2 md:left-20 md:w-[400px] md:text-left md:-translate-y-1/2"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 md:mb-4 border border-white/10 bg-black/40 rounded-full backdrop-blur-md">
                            <Gem size={12} style={{ color: partner.color }} />
                            <span className="text-[10px] font-mono tracking-widest text-gray-300 uppercase">{partner.tier}</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-['Orbitron'] text-white mb-2 uppercase" style={{ textShadow: `0 0 30px ${partner.accent}` }}>
                           {partner.name}
                        </h1>
                        <p className="text-xs font-mono text-gray-400 tracking-widest flex items-center justify-center md:justify-start gap-2">
                           <ShieldCheck size={14} className="text-green-500" /> VERIFIED PARTNER
                        </p>
                    </motion.div>

                    {/* Bottom/Right: Details */}
                    <motion.div 
                        key={`right-${partner.id}`}
                        initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
                        className="w-full text-center px-6 md:absolute md:top-1/2 md:right-20 md:w-[350px] md:text-right md:-translate-y-1/2"
                    >
                        <p className="text-gray-300 font-light text-xs md:text-sm mb-4 md:mb-6 leading-relaxed border-t border-b border-white/10 py-4">
                            {partner.desc}
                        </p>
                        
                        <div className="flex justify-center md:justify-end gap-2 mb-6">
                            <div className="px-4 py-2 border border-white/10 rounded-lg bg-white/5">
                                <div className="text-[8px] text-gray-500 font-mono uppercase mb-1">ALLIANCE</div>
                                <div className="text-sm font-bold text-white flex items-center gap-2 justify-center md:justify-end">
                                    {partner.icon} Global
                                </div>
                            </div>
                        </div>

                        <a 
                            href={partner.link} target="_blank" rel="noreferrer"
                            className="pointer-events-auto inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-none skew-x-[-10deg] hover:skew-x-0 transition-all text-xs tracking-widest hover:bg-[color:var(--partner-color)] mx-auto md:ml-auto md:mr-0"
                            style={{ '--partner-color': partner.color }}
                        >
                            VISIT HQ <ExternalLink size={14} />
                        </a>
                    </motion.div>
                 </>
             )}
          </AnimatePresence>
      </div>

      {/* CONTROLS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-8 pointer-events-auto">
          <button onClick={() => handleNav(-1)} disabled={isWarping} className="p-3 border border-white/20 rounded-full hover:bg-white/10 bg-black/50"><ChevronLeft /></button>
          <button onClick={() => handleNav(1)} disabled={isWarping} className="p-3 border border-white/20 rounded-full hover:bg-white/10 bg-black/50"><ChevronRight /></button>
      </div>

      <style jsx>{` .animate-spin-slow { animation: spin 40s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } `}</style>
    </div>
  );
};

export default Sponsors;