import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Monitor, Trophy, Rocket, Users, Gem, Info, ArrowRight, Zap,
  Cpu, Sparkles, ScanLine
} from 'lucide-react';

// --- 1. THE PHYSICS ENGINE (Canvas Black Hole) ---
const BlackHoleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Configuration
    const PARTICLE_COUNT = 4000; // High density for the "fibrous" look
    const CENTER_SAFE_ZONE = 100; // The Event Horizon radius

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        // Spawn particles in a ring far from center
        const angle = Math.random() * Math.PI * 2;
        // Distribute distance to create depth
        const distance = Math.random() * (window.innerWidth / 1.5) + CENTER_SAFE_ZONE + 100;
        
        this.x = Math.cos(angle) * distance;
        this.y = Math.sin(angle) * distance;
        this.z = Math.random(); // Z-index for brightness variation
        
        // Physics properties
        this.angle = angle;
        this.distance = distance;
        this.speed = 0.5 + Math.random() * 0.5;
        this.opacity = 0;
      }

      update() {
        // 1. Move Closer (Gravity)
        this.distance -= this.speed * 2;
        
        // 2. Spin Faster as you get closer (Conservation of Angular Momentum)
        // Closer = Faster spin
        const angularSpeed = (500 / (this.distance + 50)) * 0.02;
        this.angle += angularSpeed;

        // 3. Update coordinates relative to center
        this.x = Math.cos(this.angle) * this.distance;
        this.y = Math.sin(this.angle) * this.distance;

        // 4. Calculate Opacity
        // Fade in when spawning, Fade out sharply at event horizon
        if (this.distance < CENTER_SAFE_ZONE + 20) {
            this.opacity *= 0.85; // Die fast at the hole
        } else if (this.opacity < 1) {
            this.opacity += 0.05; // Fade in
        }

        // 5. Reset if sucked in
        if (this.distance < CENTER_SAFE_ZONE || this.opacity < 0.01) {
           this.reset();
        }
      }

      draw(ctx, centerX, centerY) {
        // Visuals: Simulate Motion Blur / Light Streaks
        // The "hair" look comes from drawing lines, not dots
        
        const tailLength = Math.max(2, (1000 / (this.distance + 1)) * 3); // Longer streaks near center
        const trailX = Math.cos(this.angle - 0.05) * (this.distance + tailLength);
        const trailY = Math.sin(this.angle - 0.05) * (this.distance + tailLength);

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * (0.3 + this.z * 0.5)})`;
        ctx.lineWidth = 0.5 + (1 - this.z) * 1.5; // Varying thickness
        
        // Draw the streak
        ctx.moveTo(centerX + this.x, centerY + this.y);
        ctx.lineTo(centerX + trailX, centerY + trailY);
        ctx.stroke();
      }
    }

    // Initialize Particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    // Animation Loop
    const animate = () => {
      // Create trails by not clearing completely (Echo effect)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particles.forEach(p => {
        p.update();
        p.draw(ctx, centerX, centerY);
      });

      // Draw the pure black event horizon in the middle covering the particle deaths
      ctx.beginPath();
      ctx.arc(centerX, centerY, CENTER_SAFE_ZONE, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();
      
      // Draw the glowing photon ring edge
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-80" />;
};

// --- 2. THE TEXT COMPONENT (Overlay) ---
const CinematicText = () => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
       {/* Glass Distortion Field */}
       <div className="absolute w-[300px] h-[300px] rounded-full backdrop-blur-[2px] opacity-20"></div>
       
       <h1 className="text-[12vw] md:text-[140px] font-black font-['Orbitron'] text-white tracking-tighter mix-blend-difference z-20 select-none opacity-90">
         XPECTO
       </h1>
    </div>
  );
};

// --- 3. HELPER COMPONENTS ---

const PrismScroller = () => {
  return (
    <div className="flex-1 overflow-hidden relative flex items-center h-full">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#020205] to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#020205] to-transparent z-10"></div>
      <motion.div 
        className="flex whitespace-nowrap gap-16 pl-8"
        animate={{ x: "-50%" }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
             <div className="flex items-center gap-3">
                 <div className="relative">
                    <div className="absolute inset-0 bg-cyan-400 blur-[8px] opacity-60 animate-pulse"></div>
                    <div className="w-2 h-2 bg-cyan-300 rounded-full relative z-10"></div>
                 </div>
                 <span className="text-sm md:text-base font-black font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-400 to-cyan-200 tracking-widest">
                    LOGIN TO ACCESS ARCHIVES
                 </span>
             </div>
             <div className="flex items-center gap-2 opacity-50">
                 <ScanLine size={14} className="text-purple-500" />
                 <span className="text-[10px] font-mono tracking-[0.3em] text-purple-300">SYSTEM.SECURE</span>
             </div>
             <div className="flex items-center gap-3">
                 <Sparkles size={16} className="text-yellow-400 animate-spin-slow" />
                 <span className="text-sm md:text-base font-black font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-400 to-yellow-200 tracking-widest">
                    XPECTO '26 IS LIVE
                 </span>
             </div>
             <div className="flex items-center gap-2 opacity-50">
                 <Cpu size={14} className="text-emerald-500" />
                 <span className="text-[10px] font-mono tracking-[0.3em] text-emerald-300">EST. CONNECTION</span>
             </div>
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

const StarBackground = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none">
      <div className="absolute inset-0 bg-[#020205]"></div>
      {[...Array(60)].map((_, i) => (
        <div key={i} className="absolute bg-white rounded-full opacity-0 animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
            width: `${Math.random() * 1.5}px`, height: `${Math.random() * 1.5}px`,
            animationDelay: `${Math.random() * 5}s`, animationDuration: `${Math.random() * 3 + 2}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes twinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.5; } }
        .animate-twinkle { animation: twinkle linear infinite; }
      `}</style>
  </div>
);


// --- 4. MAIN PAGE LAYOUT ---
const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  const bhScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const bhOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen w-full text-white overflow-hidden bg-[#020205]">
      
      {/* TOP NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-[100] h-16 bg-[#020205]/90 backdrop-blur-xl border-b border-white/5 flex items-center shadow-2xl">
        <div className="h-full px-6 md:px-8 flex flex-col justify-center border-r border-white/5 bg-black/40 relative overflow-hidden">
             <div className="absolute top-0 -inset-full w-1/2 h-full block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 animate-shine" />
             <h1 className="font-['Orbitron'] font-black text-xl md:text-2xl text-white tracking-tighter leading-none">XPECTO</h1>
             <div className="flex items-center gap-2 mt-1">
                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] md:text-[10px] text-gray-500 font-mono tracking-widest">IIT MANDI</span>
             </div>
        </div>
        <PrismScroller />
        <div className="h-full border-l border-white/5 relative">
            <button className="h-full px-8 md:px-10 bg-gradient-to-b from-[#111] to-black group relative">
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 animate-gradient-x"></div>
                <div className="flex flex-col items-end justify-center h-full relative z-10">
                    <span className="text-xs md:text-sm font-bold font-['Orbitron'] text-white tracking-widest group-hover:text-cyan-400 transition-colors">LOGIN</span>
                    <span className="text-[8px] font-mono text-gray-500 tracking-[0.2em]">/ SIGNUP</span>
                </div>
            </button>
        </div>
      </div>

      <StarBackground />

      {/* 🕳 BLACK HOLE LAYER (CANVAS) */}
      <div className="fixed inset-0 z-[0] flex items-center justify-center">
        <motion.div className="w-full h-full" style={{ scale: bhScale, opacity: bhOpacity }}>
          <BlackHoleCanvas />
          <CinematicText />
        </motion.div>
      </div>

      {/* VIGNETTE */}
      <div className="fixed inset-0 z-[5] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,#020205_90%)]" />

      {/* CENTRAL LINE */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent z-[15] md:-translate-x-1/2" />

      {/* CONTENT LAYER */}
      <div className="relative z-[20] flex flex-col items-center">
        
        {/* HERO SPACER */}
        <section className="min-h-screen flex flex-col items-center justify-end pb-24 text-center px-4 w-full">
             <div className="relative z-10 flex flex-col items-center gap-6">
                 <div className="inline-block border border-white/10 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full">
                    <span className="text-xs md:text-sm font-mono text-cyan-300 tracking-[0.4em] uppercase">The Future is Now</span>
                 </div>
                 <div className="flex flex-col items-center gap-2 mt-4">
                    <div className="w-[1px] h-24 bg-gradient-to-b from-cyan-500 to-transparent animate-pulse" />
                    <p className="text-[10px] text-cyan-500/50 font-mono tracking-widest uppercase">Descend</p>
                 </div>
             </div>
        </section>

        {/* SECTIONS LIST */}
        <div className="w-full bg-gradient-to-b from-transparent via-[#020205] to-[#020205]">
            <Section align="left" title="EXHIBITION" subtitle="INNOVATE" desc="Witness the future. Prototypes, models, and machinery from the brightest minds." path="/exhibition" color="#f97316" icon={<Monitor size={32} />} img="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070" />
            <Section align="right" title="COMPETITIONS" subtitle="DOMINATE" desc="Robowars, Hackathons, and Esports. Prove your skills in the arena." path="/events" color="#06b6d4" icon={<Trophy size={32} />} img="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071" />
            <Section align="left" title="SESSIONS" subtitle="LEARN" desc="Tech talks from industry leaders. Gain knowledge from the masters." path="/sessions" color="#8b5cf6" icon={<Rocket size={32} />} img="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070" />
            <Section align="right" title="THE CREW" subtitle="OPERATORS" desc="Meet the minds behind the machine." path="/team" color="#eab308" icon={<Users size={32} />} img="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070" />
            <Section align="left" title="ALLIANCE" subtitle="PARTNERS" desc="Our strategic partners powering the event." path="/sponsors" color="#10b981" icon={<Gem size={32} />} img="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070" />

            {/* ARCHIVES */}
            <section className="min-h-[60vh] flex items-center justify-center px-4 relative py-20">
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="bg-[#0b0b0b] border border-white/10 p-12 rounded-[40px] max-w-2xl text-center shadow-[0_0_50px_rgba(255,0,0,0.1)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/50 relative z-10"><Info size={32} className="text-red-500" /></div>
                    <h2 className="text-4xl md:text-6xl font-black font-['Orbitron'] mb-4 text-white relative z-10">ARCHIVES</h2>
                    <p className="text-gray-400 mb-8 relative z-10">Dive into the history of Xpecto. Access the mission logs and previous records.</p>
                    <Link to="/about" className="relative z-10 inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-none skew-x-[-10deg] font-bold tracking-widest hover:bg-red-500 hover:text-white transition-all">ACCESS DATA <ArrowRight size={16} /></Link>
                </motion.div>
            </section>

            {/* FOOTER */}
            <div className="h-[20vh] flex items-end justify-center pb-10 bg-[#020205]">
                <div className="flex items-center gap-2 text-[10px] font-mono text-white/30"><Zap size={12} /> END OF LINE</div>
            </div>
        </div>
      </div>
      
      {/* GLOBAL STYLES */}
      <style jsx>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-shine { animation: shine 2s infinite; }
        @keyframes shine { 100% { left: 125%; } }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
    </div>
  );
};

const Section = ({ align, title, subtitle, desc, path, color, icon, img }) => {
  const isLeft = align === 'left';
  return (
    <section className="min-h-[80vh] w-full flex items-center justify-center py-20 relative">
      <div className={`max-w-6xl w-full px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 ${!isLeft && 'md:flex-row-reverse'}`}>
        <motion.div initial={{ opacity: 0, x: isLeft ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className={`flex-1 ${!isLeft ? 'md:text-right' : ''}`}>
          <div className={`flex items-center gap-4 mb-4 ${!isLeft ? 'md:justify-end' : ''}`}>
            <span className="text-xs font-mono px-3 py-1 border rounded tracking-widest bg-black" style={{ color, borderColor: color }}>{subtitle}</span>
            <div style={{ color }}>{icon}</div>
          </div>
          <h2 className="text-5xl md:text-8xl font-black font-['Orbitron'] mb-6 leading-[0.9] text-white">{title}</h2>
          <p className="text-gray-400 max-w-md mb-8 leading-relaxed font-light ml-0 md:ml-auto mr-auto md:mr-0">{desc}</p>
          <Link to={path} className={`inline-flex items-center gap-3 text-sm tracking-widest group ${!isLeft ? 'flex-row-reverse' : ''}`}>
            <span style={{ color }}>EXPLORE</span>
            <div className="w-12 h-[1px] group-hover:w-20 transition-all duration-300" style={{ backgroundColor: color }} />
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="flex-1 w-full">
          <div className="aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 bg-[#050505] shadow-2xl relative group">
            <img src={img} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;