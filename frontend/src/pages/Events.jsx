import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Trophy, Calendar, Rocket, Zap, Terminal, Crosshair, Hexagon } from 'lucide-react';

const eventsData = [
  {
    id: 1, title: "ROBO WARS", subtitle: "MECHANIZED COMBAT", category: "COMBAT SECTOR",
    desc: "The ultimate machine showdown. Two bots enter, one leaves debris.", prize: "₹50,000", date: "MAR 14",
    image: "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?q=80&w=2070",
    color: "#ff2a6d", accent: "rgba(255, 42, 109, 0.5)", icon: <Zap />
  },
  {
    id: 2, title: "CODE MYSTIQUE", subtitle: "ALGORITHM DECRYPTION", category: "CYBER SECTOR",
    desc: "Decrypt the matrix. Solve complex puzzles before the firewall closes.", prize: "₹30,000", date: "MAR 13",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
    color: "#05d9e8", accent: "rgba(5, 217, 232, 0.5)", icon: <Terminal />
  },
  {
    id: 3, title: "VALORANT", subtitle: "TACTICAL ASSAULT", category: "GAMING SECTOR",
    desc: "Precision gunplay. 5v5 warfare. Plant the spike or defuse the threat.", prize: "₹40,000", date: "MAR 15",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
    color: "#d1f7ff", accent: "rgba(209, 247, 255, 0.5)", icon: <Crosshair />
  },
  {
    id: 4, title: "ASTRO RACING", subtitle: "FPV DRONE LEAGUE", category: "AERO SECTOR",
    desc: "Mach-1 speeds through neon gates. Zero margin for error.", prize: "₹25,000", date: "MAR 15",
    image: "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=2070",
    color: "#ffe700", accent: "rgba(255, 231, 0, 0.5)", icon: <Hexagon />
  }
];

// Reusable Warp Star Component
const WarpStars = ({ isWarping }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className={`absolute inset-0 transition-opacity duration-300 ${isWarping ? 'opacity-0' : 'opacity-100'}`}>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
         {[...Array(30)].map((_, i) => (
             <div key={i} className="absolute bg-white rounded-full w-[2px] h-[2px]" style={{ top: Math.random()*100+'%', left: Math.random()*100+'%' }}></div>
         ))}
      </div>
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-100 ${isWarping ? 'opacity-100' : 'opacity-0'}`}>
         {[...Array(15)].map((_, i) => (
            <div key={i} className="absolute bg-white h-[2px] w-[60vw] origin-center" style={{ rotate: `${i * 24}deg`, transform: `translateX(${Math.random() * 50}px)`, boxShadow: '0 0 10px white' }}></div>
         ))}
      </div>
  </div>
);

const Events = () => {
  const [index, setIndex] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const event = eventsData[index];

  const handleNav = (dir) => {
    if (isWarping) return;
    setIsWarping(true);
    setTimeout(() => {
        setIndex((prev) => (prev + dir + eventsData.length) % eventsData.length);
        setIsWarping(false);
    }, 800);
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black text-white font-['Montserrat'] overflow-hidden selection:bg-cyan-500/30">
      
      {/* 1. BACKGROUND */}
      <div className="absolute inset-0 bg-black">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]"></div>
         <motion.div animate={{ backgroundColor: event.color }} transition={{ duration: 1 }} className="absolute inset-0 opacity-20 blur-[150px] mix-blend-screen" />
      </div>
      <WarpStars isWarping={isWarping} />

      {/* 2. STARGATE PORTAL (Responsive) */}
      <div className={`absolute top-[45%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-1000 ${isWarping ? 'scale-[1.2] md:scale-[2] rotate-180 blur-sm' : 'scale-100 rotate-0 blur-0'}`}>
          <div className="w-[70vw] h-[70vw] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] rounded-full border-[1px] border-white/10 relative flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="absolute inset-[-10px] md:inset-[-20px] rounded-full border border-dashed border-white/20 animate-spin-slow"></div>
              <div className="w-[90%] h-[90%] rounded-full overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,1)] border border-white/20 group">
                  <AnimatePresence mode="wait">
                      {!isWarping && (
                          <motion.img 
                            key={event.id} src={event.image}
                            initial={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ scale: 0, opacity: 0, filter: 'blur(20px)' }}
                            transition={{ duration: 0.8 }}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                      )}
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              </div>
          </div>
      </div>

      {/* 3. INFO HUD */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between py-24 md:py-0 md:justify-center">
          <AnimatePresence mode="wait">
             {!isWarping && (
                 <>
                    {/* Top/Left Title */}
                    <motion.div 
                        key={`title-${event.id}`}
                        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                        className="w-full text-center px-6 md:absolute md:top-1/2 md:left-20 md:w-[400px] md:text-left md:-translate-y-1/2 md:p-0"
                    >
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: event.color }}></span>
                            <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-gray-400">{event.category}</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-['Orbitron'] text-white leading-[0.9] mb-2 md:mb-4 drop-shadow-lg" style={{ textShadow: `0 0 30px ${event.accent}` }}>
                           {event.title}
                        </h1>
                        <p className="text-[10px] md:text-xs font-mono text-cyan-400 tracking-[0.2em]">// {event.subtitle}</p>
                    </motion.div>

                    {/* Bottom/Right Details */}
                    <motion.div 
                        key={`details-${event.id}`}
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                        className="w-full px-6 text-center md:absolute md:top-1/2 md:right-20 md:w-[350px] md:text-right md:-translate-y-1/2 md:p-0"
                    >
                        <div className="hidden md:block mb-6 border-r-2 pr-4 border-white/20">
                            <p className="text-gray-300 font-light text-sm leading-relaxed">{event.desc}</p>
                        </div>
                        <p className="md:hidden text-gray-300 font-light text-xs mb-4 px-4">{event.desc}</p>

                        <div className="flex flex-row justify-center md:flex-col gap-4 md:items-end">
                            <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg backdrop-blur-md">
                                <div className="text-[8px] md:text-[10px] text-gray-500 font-mono uppercase">Bounty</div>
                                <div className="text-sm md:text-xl font-bold text-white flex items-center gap-2">{event.prize} <Trophy size={14} className="text-yellow-400" /></div>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg backdrop-blur-md">
                                <div className="text-[8px] md:text-[10px] text-gray-500 font-mono uppercase">Date</div>
                                <div className="text-sm md:text-xl font-bold text-white flex items-center gap-2">{event.date} <Calendar size={14} className="text-cyan-400" /></div>
                            </div>
                        </div>

                        <button className="mt-6 md:mt-8 pointer-events-auto bg-white text-black font-bold py-3 px-8 rounded-full tracking-[0.2em] text-[10px] md:text-xs hover:scale-105 transition-transform inline-flex items-center gap-2 mx-auto md:ml-auto md:mr-0" style={{ boxShadow: `0 0 20px ${event.accent}` }}>
                            INITIATE <Rocket size={14} />
                        </button>
                    </motion.div>
                 </>
             )}
          </AnimatePresence>
      </div>

      {/* 4. CONTROLS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-8 md:gap-12 pointer-events-auto">
          <button onClick={() => handleNav(-1)} disabled={isWarping} className="p-3 md:p-4 rounded-full border border-white/10 bg-black/50 hover:bg-white/10"><ChevronLeft size={20} /></button>
          <div className="h-1 w-24 md:w-32 bg-white/10 rounded-full overflow-hidden self-center">
             <motion.div animate={{ width: `${((index + 1) / eventsData.length) * 100}%` }} className="h-full bg-cyan-500" />
          </div>
          <button onClick={() => handleNav(1)} disabled={isWarping} className="p-3 md:p-4 rounded-full border border-white/10 bg-black/50 hover:bg-white/10"><ChevronRight size={20} /></button>
      </div>

      <style jsx>{` .animate-spin-slow { animation: spin 30s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } } `}</style>
    </div>
  );
};

export default Events;