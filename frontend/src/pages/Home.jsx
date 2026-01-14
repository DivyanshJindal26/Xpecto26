import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Monitor,
  Trophy,
  Rocket,
  Users,
  Gem,
  Info,
  ArrowRight,
  Zap,
} from 'lucide-react';

import Blackhole3D from '../components/Blackhole3D';
import StarBackground from '../components/StarBackground';

const Home = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* ⭐ STAR PARALLAX */
  const starsY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);

  /* 🕳 BLACK HOLE GRAVITY EFFECT */
  const bhScale = useTransform(scrollYProgress, [0, 1], [1, 2.4]);
  const bhOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [0.6, 1, 0.15]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full text-white overflow-hidden"
    >
      {/* ⭐ STAR BACKGROUND — GLOBAL */}
      <StarBackground />

      {/* 🕳 BLACK HOLE (FIXED CENTER) */}
      <div className="fixed inset-0 z-[5] pointer-events-none flex items-center justify-center">
        <motion.div style={{ scale: bhScale, opacity: bhOpacity }}>
          <div className="w-[800px] h-[800px] md:w-[1200px] md:h-[1200px]">
            <Blackhole3D />
          </div>
        </motion.div>
      </div>

      {/* 🌌 SOFT SPACE VIGNETTE (DOES NOT KILL STARS) */}
      <div className="fixed inset-0 z-[8] pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.55)_100%)]" />

      {/* 🧲 CENTRAL TETHER */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent z-[15] md:-translate-x-1/2" />

      {/* 🧠 CONTENT */}
      <div className="relative z-[20] flex flex-col items-center">

        {/* ================= HERO ================= */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="text-[15vw] md:text-[12rem] font-black font-['Orbitron']
                       text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10"
          >
            XPECTO
          </motion.h1>

          <div className="text-cyan-400 tracking-[1em] mt-6 font-mono text-sm">
            2025
          </div>

          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-gray-400 text-xs font-mono tracking-widest border border-white/10 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md">
              SCROLL TO INITIATE DESCENT
            </p>
            <div className="w-[1px] h-24 bg-gradient-to-b from-cyan-500 to-transparent animate-pulse" />
          </div>
        </section>

        {/* ================= SECTIONS ================= */}
        <Section
          align="left"
          title="EXHIBITION"
          subtitle="INNOVATE"
          desc="Witness the future. Prototypes, models, and machinery from the brightest minds."
          path="/exhibition"
          color="#f97316"
          icon={<Monitor size={32} />}
          img="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070"
        />

        <Section
          align="right"
          title="COMPETITIONS"
          subtitle="DOMINATE"
          desc="Robowars, Hackathons, and Esports. Prove your skills in the arena."
          path="/events"
          color="#06b6d4"
          icon={<Trophy size={32} />}
          img="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071"
        />

        <Section
          align="left"
          title="SESSIONS"
          subtitle="LEARN"
          desc="Tech talks from industry leaders. Gain knowledge from the masters."
          path="/sessions"
          color="#8b5cf6"
          icon={<Rocket size={32} />}
          img="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070"
        />

        <Section
          align="right"
          title="THE CREW"
          subtitle="OPERATORS"
          desc="Meet the minds behind the machine."
          path="/team"
          color="#eab308"
          icon={<Users size={32} />}
          img="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
        />

        <Section
          align="left"
          title="ALLIANCE"
          subtitle="PARTNERS"
          desc="Our strategic partners powering the event."
          path="/sponsors"
          color="#10b981"
          icon={<Gem size={32} />}
          img="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070"
        />

        {/* ================= ARCHIVES ================= */}
        <section className="min-h-[80vh] flex items-center justify-center px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-black/50 backdrop-blur-xl border border-white/10 p-12 rounded-[40px] max-w-2xl text-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/50">
              <Info size={32} className="text-red-500" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black font-['Orbitron'] mb-4">
              ARCHIVES
            </h2>
            <p className="text-gray-400 mb-8">
              Dive into the history of Xpecto. Access the mission logs and previous records.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold tracking-widest hover:bg-red-500 hover:text-white transition"
            >
              ACCESS DATA <ArrowRight size={16} />
            </Link>
          </motion.div>
        </section>

        {/* ================= FOOTER ================= */}
        <div className="h-[20vh] flex items-end justify-center pb-10">
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/30">
            <Zap size={12} /> END OF LINE
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= SECTION COMPONENT ================= */

const Section = ({ align, title, subtitle, desc, path, color, icon, img }) => {
  const isLeft = align === 'left';

  return (
    <section className="min-h-[80vh] w-full flex items-center justify-center py-20 relative">
      <div
        className={`max-w-6xl w-full px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 ${
          !isLeft && 'md:flex-row-reverse'
        }`}
      >
        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <div className="flex items-center gap-4 mb-4">
            <span
              className="text-xs font-mono px-3 py-1 border rounded tracking-widest"
              style={{ color, borderColor: color }}
            >
              {subtitle}
            </span>
            <div style={{ color }}>{icon}</div>
          </div>

          <h2 className="text-5xl md:text-8xl font-black font-['Orbitron'] mb-6">
            {title}
          </h2>

          <p className="text-gray-400 max-w-md mb-8">{desc}</p>

          <Link to={path} className="inline-flex items-center gap-3 text-sm tracking-widest">
            <span style={{ color }}>EXPLORE</span>
            <div className="w-12 h-[1px]" style={{ backgroundColor: color }} />
          </Link>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
