import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// ================= BANNER ANIMATION =================
const bannerVariant = {
  hidden: { opacity: 0, y: 100, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

// ================= ASTEROID WORD =================
const word = "XPECTO26".split("");

const asteroidVariants = {
  hidden: {
    opacity: 0,
    scale: 0.2,
    x: () => Math.random() * 600 - 300,
    y: () => Math.random() * -400 ,
    rotate: () => Math.random() * 180
  },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      delay: i * 0.4,
      duration: 0.9,
      ease: "easeInOut"
    }
  })
};

const Home = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#02020A] flex flex-col overflow-hidden">

      {/* ================= SHOOTING STARS BACKGROUND ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="shooting-stars" />
      </div>

      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden z-10">

        {/* Cosmic Gradient */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle_at_center,_#4a148c_0%,_#1a1a40_30%,_#02020A_70%)] opacity-90 pointer-events-none" />

        {/* ================= ROTATING PLANET ================= */}
        <div className="relative w-[280px] h-[280px] md:w-[500px] md:h-[500px] mb-8">
          <div className="absolute inset-0 bg-cyan-500/20 blur-[90px] rounded-full animate-pulse" />

          <img
            src="home.png"
            alt="Home Planet"
            className="w-full h-full object-contain drop-shadow-[0_0_60px_rgba(0,255,255,0.6)] animate-planet-rotate"
          />

          {/* ================= ASTEROID TEXT FORMATION ================= */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 md:gap-4 z-10 pointer-events-none">
            {word.map((letter, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={asteroidVariants}
                className="w-15 h-15 md:w-30 md:h-30 rounded-full bg-gradient-to-br from-blue-1000 via-white-800 to-blue shadow-[0_0_25px_rgba(150,150,150,0.6)] flex items-center justify-center"
              >
                <span className="font-orbitron text-cyan-300 text-4xl md:text-7xl font-black tracking-[0.4em]
drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]
drop-shadow-[0_0_25px_rgba(0,255,255,1)]
drop-shadow-[0_0_45px_rgba(0,255,255,1)]">
  {letter}
</span>

              </motion.div>
            ))}
          </div>
        </div>

        {/* DOWN ARROW */}
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8 text-cyan-400 text-2xl relative z-10"
        >
          ↓
        </motion.div>
      </div>

      {/* ================= NAVIGATION BANNERS ================= */}
      <div className="w-full flex flex-col gap-12 px-4 md:px-12 pb-24 max-w-[1400px] mx-auto z-10">

        {/* EXHIBITION */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false }} variants={bannerVariant}>
          <Link to="/exhibition" className="group relative block w-full h-[350px] md:h-[450px] rounded-[40px] overflow-hidden cursor-pointer border border-white/10 shadow-[0_0_30px_rgba(255,159,28,0.15)] hover:shadow-[0_0_60px_rgba(255,159,28,0.4)] transition-all duration-500">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 brightness-[0.45]" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 z-10">
              <span className="text-blue-400 tracking-[0.3em] text-sm mb-2">INNOVATE · BUILD · LEARN</span>
              <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase">EXHIBITION</h2>
              <div className="mt-6 w-12 h-1 bg-orange-500 group-hover:w-48 transition-all duration-500" />
            </div>
          </Link>
        </motion.div>

        {/* EVENTS */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={bannerVariant}>
          <Link to="/events" className="group relative block w-full h-[350px] md:h-[450px] rounded-[40px] overflow-hidden cursor-pointer border border-white/10 shadow-[0_0_30px_rgba(67,97,238,0.15)] hover:shadow-[0_0_60px_rgba(67,97,238,0.4)] transition-all duration-500">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 brightness-[0.45]" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 z-10 items-end text-right">
              <span className="text-white/80 tracking-[0.3em] text-sm mb-2">THRILLING</span>
              <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase">EVENTS</h2>
              <div className="mt-6 w-12 h-1 bg-white group-hover:w-48 transition-all duration-500" />
            </div>
          </Link>
        </motion.div>

        {/* SESSIONS */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={bannerVariant}>
          <Link to="/sessions" className="group relative block w-full h-[350px] md:h-[450px] rounded-[40px] overflow-hidden cursor-pointer border border-white/10 shadow-[0_0_30px_rgba(46,196,182,0.15)] hover:shadow-[0_0_60px_rgba(46,196,182,0.4)] transition-all duration-500">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2074')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 brightness-[0.45]" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 z-10">
              <span className="text-cyan-300 tracking-[0.3em] text-sm mb-2">INSIGHTFUL</span>
              <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase">SESSIONS</h2>
              <div className="mt-6 w-12 h-1 bg-cyan-400 group-hover:w-48 transition-all duration-500" />
            </div>
          </Link>
        </motion.div>

      </div>

      {/* ================= BOTTOM NEWS TICKER ================= */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-t border-cyan-400/30 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee flex items-center py-3">
          <span className="mx-8 text-cyan-400 tracking-[0.35em] font-semibold uppercase">
            ★ Biggest Techfest of Himalayas ★
          </span>
          <span className="mx-8 text-white/80 tracking-[0.35em] uppercase">
            Sign in to experience XPECTO26
          </span>
          <span className="mx-8 text-cyan-300 tracking-[0.35em] uppercase">
            Sign in to register for events
          </span>
        </div>
      </div>

    </div>
  );
};

export default Home;


