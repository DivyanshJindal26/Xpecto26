import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Github, Linkedin, Twitter, Fingerprint } from 'lucide-react';

const teamData = [
  { id: 1, name: "ARYAN SINGH", role: "LEAD DEVELOPER", id_code: "DEV-001", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974", color: "#3b82f6" },
  { id: 2, name: "SARA KHAN", role: "UI/UX DESIGNER", id_code: "DSGN-042", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974", color: "#ec4899" },
  { id: 3, name: "ROHAN DAS", role: "EVENT MANAGER", id_code: "MNG-88", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974", color: "#eab308" }
];

const Team = () => {
  const [index, setIndex] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const member = teamData[index];

  const handleNav = (dir) => {
    if (isWarping) return;
    setIsWarping(true);
    setTimeout(() => {
        setIndex((prev) => (prev + dir + teamData.length) % teamData.length);
        setIsWarping(false);
    }, 600); 
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black text-white font-['Montserrat'] overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[#0a0a0a]">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#222_0%,_#000_100%)]"></div>
         <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* CRYO-POD (Responsive) */}
      <div className={`absolute top-[45%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-700 ${isWarping ? 'scale-[0.8] opacity-0 blur-md' : 'scale-100 opacity-100 blur-0'}`}>
          <div className="w-[80vw] h-[55dvh] sm:w-[350px] sm:h-[500px] border-2 border-white/20 rounded-[20px] relative flex items-center justify-center bg-black/30 backdrop-blur-md p-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/50 animate-scanline"></div>
              <div className="w-full h-full rounded-[16px] overflow-hidden relative shadow-[0_0_50px_rgba(255,255,255,0.1)] grayscale group-hover:grayscale-0 transition-all duration-500">
                  <AnimatePresence mode="wait">
                      {!isWarping && (
                          <motion.img 
                            key={member.id} src={member.image}
                            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full object-cover"
                          />
                      )}
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.05)_50%,_transparent_100%)] bg-[length:100%_4px]"></div>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded font-mono text-xs font-bold tracking-widest shadow-lg border border-white">
                  {member.id_code}
              </div>
          </div>
      </div>

      {/* INFO PANELS */}
      <div className="absolute inset-0 z-20 pointer-events-none">
          <AnimatePresence mode="wait">
             {!isWarping && (
                 <>
                    {/* Name */}
                    <motion.div 
                        key={`info-${member.id}`}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute top-[12%] w-full text-center px-4 md:top-1/2 md:left-20 md:w-auto md:text-left md:-translate-y-1/2 md:p-0"
                    >
                        <h2 className="text-4xl md:text-8xl font-black font-['Orbitron'] text-white opacity-20 absolute -top-12 left-1/2 -translate-x-1/2 md:-left-10 md:translate-x-0 md:-top-20 -z-10 select-none">
                            0{index + 1}
                        </h2>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black font-['Orbitron'] text-white mb-2">
                           {member.name.split(" ")[0]} <br className="hidden md:block" /> 
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 ml-2 md:ml-0">
                              {member.name.split(" ")[1]}
                           </span>
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-cyan-400 font-mono tracking-[0.2em] text-[10px] md:text-sm">
                            <Fingerprint size={16} /> {member.role}
                        </div>
                    </motion.div>

                    {/* Socials */}
                    <motion.div 
                        key={`socials-${member.id}`}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute bottom-[22%] w-full flex justify-center gap-6 md:top-1/2 md:right-20 md:w-auto md:flex-col md:bottom-auto md:-translate-y-1/2 pointer-events-auto"
                    >
                        <SocialIcon Icon={Github} />
                        <SocialIcon Icon={Linkedin} />
                        <SocialIcon Icon={Twitter} />
                    </motion.div>
                 </>
             )}
          </AnimatePresence>
      </div>

      {/* CONTROLS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-12 pointer-events-auto">
          <button onClick={() => handleNav(-1)} disabled={isWarping} className="p-3 bg-white/5 border border-white/20 rounded-full hover:bg-white/20"><ChevronLeft size={20} /></button>
          <button onClick={() => handleNav(1)} disabled={isWarping} className="p-3 bg-white/5 border border-white/20 rounded-full hover:bg-white/20"><ChevronRight size={20} /></button>
      </div>

      <style jsx>{` @keyframes scanline { 0% { top: 0% } 100% { top: 100% } } .animate-scanline { animation: scanline 2s linear infinite; } `}</style>
    </div>
  );
};

const SocialIcon = ({ Icon }) => (
    <a href="#" className="p-3 border border-white/10 rounded-xl hover:bg-white hover:text-black transition-all hover:scale-110"><Icon size={20} /></a>
);

export default Team;