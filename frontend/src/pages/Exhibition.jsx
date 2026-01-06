import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Wrench, Cpu, Shield, Code } from 'lucide-react';

const workshopData = [
  { id: 1, title: "AI & ML", subtitle: "NEURAL NETWORKS", desc: "Build your own Jarvis. Deep dive into computer vision.", mentor: "Dr. A. Stone", date: "MAR 14", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070", color: "#f97316", accent: "rgba(249, 115, 22, 0.5)" },
  { id: 2, title: "CYBER SEC", subtitle: "ETHICAL HACKING", desc: "Penetration testing bootcamp. Defend systems.", mentor: "Mr. R. Robot", date: "MAR 13", image: "https://images.unsplash.com/photo-1563206767-5b1d97289374?q=80&w=2071", color: "#10b981", accent: "rgba(16, 185, 129, 0.5)" },
  { id: 3, title: "WEB 3.0", subtitle: "BLOCKCHAIN DEV", desc: "Smart contracts and DApps. The future is decentralized.", mentor: "Satoshi N.", date: "MAR 15", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070", color: "#8b5cf6", accent: "rgba(139, 92, 246, 0.5)" }
];

const WarpStars = ({ isWarping, color }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
     <div className={`absolute inset-0 transition-opacity duration-300 ${isWarping ? 'opacity-0' : 'opacity-100'}`}>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
         {[...Array(30)].map((_, i) => (<div key={i} className="absolute bg-white rounded-full w-[2px] h-[2px]" style={{ top: Math.random()*100+'%', left: Math.random()*100+'%' }}></div>))}
     </div>
     <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-100 ${isWarping ? 'opacity-100' : 'opacity-0'}`}>
         {[...Array(15)].map((_, i) => (<div key={i} className="absolute h-[2px] w-[60vw] origin-center" style={{ backgroundColor: color, rotate: `${i * 18}deg`, transform: `translateX(${Math.random() * 50}px)`, boxShadow: `0 0 10px ${color}` }}></div>))}
     </div>
  </div>
);

const Exhibition = () => {
  const [index, setIndex] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const data = workshopData[index];

  const handleNav = (dir) => {
    if (isWarping) return;
    setIsWarping(true);
    setTimeout(() => {
        setIndex((prev) => (prev + dir + workshopData.length) % workshopData.length);
        setIsWarping(false);
    }, 800); 
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black text-white font-['Montserrat'] overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1005_0%,_#000_100%)]"></div>
         <motion.div animate={{ backgroundColor: data.color }} transition={{ duration: 1 }} className="absolute inset-0 opacity-10 blur-[150px] mix-blend-screen" />
      </div>
      <WarpStars isWarping={isWarping} color={data.color} />

      {/* SCHEMATIC PORTAL */}
      <div className={`absolute top-[42%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-1000 ${isWarping ? 'scale-[1.5] md:scale-[2] rotate-45 blur-sm' : 'scale-100 rotate-0 blur-0'}`}>
          <div className="w-[65vw] h-[65vw] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] border border-white/20 relative flex items-center justify-center bg-black/50 backdrop-blur-sm rotate-45 md:rotate-0 transition-all duration-700">
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: data.color }}></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: data.color }}></div>
              <div className="w-[90%] h-[90%] overflow-hidden relative shadow-2xl group border border-white/10">
                  <AnimatePresence mode="wait">
                      {!isWarping && (
                          <motion.img 
                            key={data.id} src={data.image}
                            initial={{ scale: 1.5, opacity: 0, filter: 'grayscale(100%)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'grayscale(0%)' }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                      )}
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
              </div>
          </div>
      </div>

      {/* INFO HUD */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between py-24 md:py-0">
          <AnimatePresence mode="wait">
             {!isWarping && (
                 <>
                    {/* Top Text */}
                    <motion.div 
                        key={`left-${data.id}`}
                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                        className="w-full text-center px-6 md:absolute md:top-1/2 md:left-20 md:w-[400px] md:text-left md:-translate-y-1/2"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 md:mb-4 border border-white/10 bg-black/40 rounded-full backdrop-blur-md">
                            <Wrench size={12} style={{ color: data.color }} />
                            <span className="text-[10px] font-mono tracking-widest text-gray-300">ID: 0{data.id}</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-['Orbitron'] text-white mb-2 uppercase" style={{ textShadow: `0 0 30px ${data.accent}` }}>
                           {data.title}
                        </h1>
                        <p className="text-xs font-mono text-gray-400 tracking-widest">// {data.subtitle}</p>
                    </motion.div>

                    {/* Bottom Details */}
                    <motion.div 
                        key={`right-${data.id}`}
                        initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
                        className="w-full text-center px-6 md:absolute md:top-1/2 md:right-20 md:w-[350px] md:text-right md:-translate-y-1/2"
                    >
                        <p className="text-gray-300 font-light text-xs md:text-sm mb-4 md:mb-6 leading-relaxed border-t border-b border-white/10 py-4">
                            {data.desc}
                        </p>
                        <div className="flex justify-center md:justify-end gap-6 mb-6 md:mb-8">
                             <div><div className="text-[10px] text-gray-500 font-mono uppercase">MENTOR</div><div className="text-sm md:text-lg font-bold text-white">{data.mentor}</div></div>
                             <div><div className="text-[10px] text-gray-500 font-mono uppercase">DATE</div><div className="text-sm md:text-lg font-bold text-white" style={{ color: data.color }}>{data.date}</div></div>
                        </div>
                        <button className="pointer-events-auto px-6 py-3 bg-white text-black font-bold rounded-none skew-x-[-10deg] hover:skew-x-0 transition-transform text-xs tracking-widest flex items-center gap-2 mx-auto md:ml-auto md:mr-0">
                            ENROLL <ChevronRight size={14} />
                        </button>
                    </motion.div>
                 </>
             )}
          </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-8 pointer-events-auto">
          <button onClick={() => handleNav(-1)} disabled={isWarping} className="p-3 border border-white/20 rounded-full hover:bg-white/10 bg-black/50"><ChevronLeft /></button>
          <button onClick={() => handleNav(1)} disabled={isWarping} className="p-3 border border-white/20 rounded-full hover:bg-white/10 bg-black/50"><ChevronRight /></button>
      </div>
    </div>
  );
};

export default Exhibition;