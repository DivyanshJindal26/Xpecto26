import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Blackhole3D from '../components/Blackhole3D';

// Animation for the Banners
const bannerVariant = {
  hidden: { opacity: 0, y: 100, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-[#02020A] flex flex-col">
      
      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle_at_center,_#4a148c_0%,_#311b92_30%,_#000000_70%)] opacity-80 pointer-events-none" />
        
        {/* --- 3D MODEL CONTAINER --- */}
        {/* Use h-[80vh] to make it fill most of the screen vertically */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
            <div className="w-full h-[80vh] md:h-[90vh] max-w-[1200px]">
                <Blackhole3D />
            </div>
        </div>

        {/* --- OVERLAY TEXT --- */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center">
            
            {/* Massive XPECTO Text */}
            <div className="w-[90%] md:w-[70%] flex justify-between items-center font-michroma pointer-events-none mix-blend-screen opacity-90">
                <span className="text-6xl md:text-[10rem] tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] font-bold">X</span>
                <span className="text-6xl md:text-[10rem] tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] font-bold">P</span>
                <span className="text-6xl md:text-[10rem] tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] font-bold">E</span>
                <span className="text-6xl md:text-[10rem] tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] font-bold">C</span>
                <span className="text-6xl md:text-[10rem] tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] font-bold">T</span>
                <span className="text-6xl md:text-[10rem] tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] font-bold">O</span>
            </div>

            {/* Subtitle */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-lg md:text-2xl font-bold tracking-[0.5em] text-white/90 mt-[-20px] md:mt-[-40px] text-center uppercase drop-shadow-lg"
            >
              Biggest Techfest of Himalayas
            </motion.h1>

            {/* Scroll Indicator */}
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-10 text-cyan-400 text-3xl"
            >
               ↓
            </motion.div>
        </div>
      </div>


      {/* ================= NAVIGATION BANNERS ================= */}
      {/* Kept exactly as requested */}
      <div className="w-full flex flex-col gap-12 px-4 md:px-12 pb-20 max-w-[1400px] mx-auto z-10 pt-20">

        {/* 1. EXHIBITION */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={bannerVariant}>
          <Link to="/exhibition" className="group relative block w-full h-[260px] md:h-[330px] rounded-[40px] overflow-hidden cursor-pointer border border-white/10 shadow-[0_0_30px_rgba(255,159,28,0.1)] hover:shadow-[0_0_110px_rgba(255,200,80,0.6)] transition-shadow duration-500 before:absolute before:inset-[-45%] before:rounded-full before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700 before:bg-[radial-gradient(circle,rgba(255,230,120,0.65),rgba(255,195,60,0.45),rgba(255,165,0,0.25),transparent_72%)] before:z-0">
            <div className="absolute inset-0 bg-[url('/public/nav1.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 filter brightness-[0.4] group-hover:brightness-[0.6]"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white italic font-tech uppercase tracking-tight drop-shadow-lg">EXHIBITION</h2>
              <div className="mt-4 w-10 h-1 bg-orange-500 group-hover:w-36 transition-all duration-500 ease-out"></div>
            </div>
          </Link>
        </motion.div>

        {/* 2. EVENTS */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={bannerVariant}>
          <Link to="/events" className="group relative block w-full h-[260px] md:h-[330px] rounded-[40px] overflow-hidden cursor-pointer border border-white/10 shadow-[0_0_30px_rgba(67,97,238,0.1)] hover:shadow-[0_0_70px_rgba(90,120,255,0.45)] transition-shadow duration-500 before:absolute before:inset-[-40%] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700 before:rounded-full before:bg-[radial-gradient(circle,rgba(120,150,255,0.45),rgba(67,97,238,0.25),transparent_70%)] before:z-0">
            <div className="absolute inset-0 bg-[url('/public/events1.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 filter brightness-[0.4] group-hover:brightness-[0.6]"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 z-10 items-end text-right">
              <h2 className="text-4xl md:text-6xl font-black text-white italic font-tech uppercase tracking-tight drop-shadow-lg">EVENTS</h2>
              <div className="mt-4 w-10 h-1 bg-white group-hover:w-36 transition-all duration-500 ease-out"></div>
            </div>
          </Link>
        </motion.div>

        {/* 3. SESSIONS */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={bannerVariant}>
          <Link to="/sessions" className="group relative block w-full h-[260px] md:h-[330px] rounded-[40px] overflow-hidden cursor-pointer border border-white/10 shadow-[0_0_30px_rgba(46,196,182,0.1)] hover:shadow-[0_0_90px_rgba(46,220,200,0.5)] transition-shadow duration-500 before:absolute before:inset-[-45%] before:rounded-full before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700 before:bg-[radial-gradient(circle,rgba(46,220,200,0.55),rgba(0,255,255,0.35),rgba(0,200,200,0.15),transparent_72%)] before:z-0">
            <div className="absolute inset-0 bg-[url('/public/sessions2.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 filter brightness-[0.4] group-hover:brightness-[0.6]"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white italic font-tech uppercase tracking-tight drop-shadow-lg">SESSIONS</h2>
              <div className="mt-4 w-10 h-1 bg-cyan-400 group-hover:w-36 transition-all duration-500 ease-out"></div>
            </div>
          </Link>
        </motion.div>

        {/* 4. TEAM */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={bannerVariant}>
          <Link to="/Team" className="group relative block w-full h-[260px] md:h-[330px] rounded-[40px] overflow-hidden cursor-pointer border border-white/10 shadow-[0_0_30px_rgba(189,0,255,0.1)] hover:shadow-[0_0_90px_rgba(189,0,255,0.5)] transition-shadow duration-500 before:absolute before:inset-[-45%] before:rounded-full before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700 before:bg-[radial-gradient(circle,rgba(200,100,255,0.55),rgba(189,0,255,0.35),rgba(100,0,200,0.15),transparent_72%)] before:z-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 filter brightness-[0.4] group-hover:brightness-[0.6]"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 z-10 items-end text-right">
              <h2 className="text-4xl md:text-6xl font-black text-white italic font-tech uppercase tracking-tight drop-shadow-lg">TEAM</h2>
              <div className="mt-4 w-10 h-1 bg-purple-500 group-hover:w-36 transition-all duration-500 ease-out"></div>
            </div>
          </Link>
        </motion.div>

        {/* 5. SPONSORS */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={bannerVariant}>
          <Link to="/Sponsors" className="group relative block w-full h-[260px] md:h-[330px] rounded-[40px] overflow-hidden cursor-pointer border border-white/10 shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:shadow-[0_0_90px_rgba(16,185,129,0.5)] transition-shadow duration-500 before:absolute before:inset-[-45%] before:rounded-full before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700 before:bg-[radial-gradient(circle,rgba(52,211,153,0.55),rgba(16,185,129,0.35),rgba(6,95,70,0.15),transparent_72%)] before:z-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406140926-c627a92ad1ab?q=80&w=2070')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 filter brightness-[0.4] group-hover:brightness-[0.6]"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white italic font-tech uppercase tracking-tight drop-shadow-lg">SPONSORS</h2>
              <div className="mt-4 w-10 h-1 bg-emerald-500 group-hover:w-36 transition-all duration-500 ease-out"></div>
            </div>
          </Link>
        </motion.div>

        {/* 6. ABOUT */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={bannerVariant}>
          <Link to="/About" className="group relative block w-full h-[260px] md:h-[330px] rounded-[40px] overflow-hidden cursor-pointer border border-white/10 shadow-[0_0_30px_rgba(239,68,68,0.1)] hover:shadow-[0_0_90px_rgba(239,68,68,0.5)] transition-shadow duration-500 before:absolute before:inset-[-45%] before:rounded-full before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-700 before:bg-[radial-gradient(circle,rgba(248,113,113,0.55),rgba(239,68,68,0.35),rgba(153,27,27,0.15),transparent_72%)] before:z-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 filter brightness-[0.4] group-hover:brightness-[0.6]"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 z-10 items-end text-right">
              <h2 className="text-4xl md:text-6xl font-black text-white italic font-tech uppercase tracking-tight drop-shadow-lg">ABOUT US</h2>
              <div className="mt-4 w-10 h-1 bg-red-500 group-hover:w-36 transition-all duration-500 ease-out"></div>
            </div>
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default Home;