import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Rocket, Calendar, Cpu, Radio, ShieldAlert, Star, ChevronDown, BookOpen, Fingerprint, Zap, Clock } from 'lucide-react';

const About = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#030303] text-white font-['Montserrat'] overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* 1. BACKGROUND: THE VOID */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#000000_100%)]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
          {/* Ambient Glows */}
          <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      {/* 2. HEADER: THE HOLOGRAPHIC MASTHEAD */}
      <div className="relative z-10 pt-32 pb-20 px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full mb-8"
          >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
              <span className="text-[10px] md:text-xs font-mono tracking-widest text-gray-300">ARCHIVE RECORD: #25</span>
          </motion.div>

          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-9xl font-black font-['Orbitron'] text-white tracking-tighter leading-none mb-6 drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
              XPECTO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">TIMES</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row justify-center items-center gap-4 text-xs font-mono text-gray-500 tracking-widest"
          >
              <span>ISSUE #25</span>
              <span className="hidden md:inline text-cyan-500">•</span>
              <span>29 - 31 MARCH 2025</span>
              <span className="hidden md:inline text-cyan-500">•</span>
              <span>TWENTY-SECOND REPRINT</span>
          </motion.div>
      </div>

      {/* 3. MAIN CONTENT: THE EDITORIAL FEED */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pb-32">
          
          {/* THE SPINE (Connecting Line) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent hidden md:block"></div>

          {/* STORY BLOCK 1: INTRODUCTION */}
          <StorySection 
             align="left"
             title="THE ANOMALY"
             icon={<Rocket />}
             image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072"
             text={
               <>
                 What began as an ordinary celebration of innovation became the most extraordinary event in history. 
                 <strong className="text-cyan-400"> Xpecto 2025</strong>, IIT Mandi's annual tech fest, promised to dazzle. 
                 But what unfolded over those fateful days transcended human comprehension.
               </>
             }
          />

          {/* STORY BLOCK 2: THE GLITCH */}
          <StorySection 
             align="right"
             title="TIME DISTORTION"
             icon={<Clock />}
             image="https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?q=80&w=2070"
             text={
               <>
                 It started during the keynote. A team unveiled a time-distortion simulation. 
                 The screen flickered, and a <strong className="text-red-400">blinding flash</strong> engulfed the hall. 
                 "We looked at our watches, and they were spinning backward," one attendee reported.
               </>
             }
          />

          {/* STORY BLOCK 3: CHAOS */}
          <StorySection 
             align="left"
             title="SYSTEM FAILURE"
             icon={<ShieldAlert />}
             image="https://images.unsplash.com/photo-1620406739776-e9c402773229?q=80&w=1974"
             text={
               <>
                 In <strong>Robowars</strong>, bots began moving autonomously, evolving strategies beyond design. 
                 In <strong>FrostHack</strong>, code seemed to rewrite itself. Even the food court wasn't spared; 
                 plates filled and emptied repeatedly in a loop.
               </>
             }
          />

          {/* FINAL BLOCK: THE ENIGMA */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mt-32 text-center"
          >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-6">
                  <Fingerprint size={32} className="text-white" />
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black font-['Orbitron'] text-white mb-6">THE ENIGMA REMAINS</h2>
              
              <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 font-light text-sm md:text-base">
                  Years later, Xpecto 2025 remains a cautionary tale. Was it an accident? Or a glimpse into what happens when humanity pushes the boundaries of innovation too far?
              </p>

              <div className="flex justify-center gap-4">
                  <button className="bg-white text-black px-8 py-3 rounded-none skew-x-[-10deg] font-bold text-xs hover:bg-cyan-400 transition-colors tracking-widest">
                      LOGIN TO ARCHIVE
                  </button>
              </div>
          </motion.div>

      </div>

      {/* FOOTER BAR */}
      <div className="fixed bottom-0 w-full bg-[#050505]/90 backdrop-blur-md border-t border-white/10 py-3 px-6 z-50 flex justify-between items-center text-[10px] font-mono text-gray-500">
          <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
              STATUS: SECURE
          </div>
          <div>IIT MANDI • HIMLAYAS</div>
      </div>

    </div>
  );
};

// --- REUSABLE COMPONENT: STORY SECTION ---
const StorySection = ({ align, title, icon, image, text }) => {
  const isLeft = align === 'left';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-24 relative ${isLeft ? '' : 'md:flex-row-reverse'}`}
    >
        
        {/* CENTER NODE (Desktop Only) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 bg-[#030303] border border-cyan-500/50 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            {React.cloneElement(icon, { size: 18, className: "text-cyan-400" })}
        </div>

        {/* IMAGE SIDE */}
        <div className="w-full md:w-1/2 relative group">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
                <img src={image} alt={title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                {/* Tech Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute bottom-4 left-4 text-[10px] font-mono text-cyan-500 bg-black/60 px-2 py-1 rounded">
                    IMG_SOURCE: DRONE_0{Math.floor(Math.random() * 9)}
                </div>
            </div>
            {/* Decoration */}
            <div className={`absolute -bottom-2 -right-2 w-20 h-20 border-b-2 border-r-2 border-cyan-500/30 rounded-br-2xl hidden md:block ${!isLeft ? 'left-auto right-auto -left-2 border-r-0 border-l-2 rounded-bl-2xl' : ''}`}></div>
        </div>

        {/* TEXT SIDE */}
        <div className={`w-full md:w-1/2 ${isLeft ? 'md:text-right' : 'md:text-left'} text-left`}>
            <div className={`flex items-center gap-3 mb-4 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                <div className="md:hidden text-cyan-400">{icon}</div>
                <h2 className="text-2xl md:text-4xl font-bold font-['Orbitron'] text-white uppercase">{title}</h2>
            </div>
            <div className="h-[1px] w-24 bg-gradient-to-r from-cyan-500 to-transparent mb-6 md:ml-auto md:mr-0 inline-block"></div>
            
            <p className="text-gray-300 leading-relaxed font-light text-sm md:text-base">
                {text}
            </p>
        </div>

    </motion.div>
  );
};

export default About;