import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Monitor, Trophy, Rocket, Users, Gem, ChevronDown, LogIn } from 'lucide-react';
// Ensure this path is correct for your project
import PlanetImg from '../assets/home.png'; 

const Home = () => {
  const containerRef = useRef(null);
  
  // Parallax Hooks for the Hero Section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Hero Parallax Effects
  const textY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const planetScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const planetOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="relative w-full bg-[#02020A] overflow-x-hidden selection:bg-purple-500/30 text-white">
      
      {/* =========================================
          1. LOGIN BUTTON (Fixed Top Right)
         ========================================= */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed top-6 right-6 md:top-8 md:right-10 z-50"
      >
        <Link to="/login">
          <button className="group relative flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-cyan-400/50 rounded-full backdrop-blur-md transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <span className="text-sm font-bold tracking-widest text-white group-hover:text-cyan-300 transition-colors">LOGIN</span>
            <LogIn size={16} className="text-white/70 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-full ring-1 ring-white/10 group-hover:ring-cyan-400/30 transition-all"></div>
          </button>
        </Link>
      </motion.div>

      {/* =========================================
          2. FIXED VIBRANT BACKGROUND
         ========================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Radial Gradient */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[150vw] h-[120vh] bg-[radial-gradient(circle_at_center,_#4a148c_0%,_#311b92_30%,_#02020A_70%)] opacity-80" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[10%] left-[10%] w-64 h-64 md:w-96 md:h-96 bg-blue-600/20 blur-[100px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[20%] right-[10%] w-64 h-64 md:w-96 md:h-96 bg-purple-600/20 blur-[100px] rounded-full" 
        />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
      </div>

      {/* =========================================
          3. HERO SECTION
         ========================================= */}
      <div ref={containerRef} className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-4">
        
        <div className="w-full max-w-7xl flex flex-col items-center relative">
          
          {/* Planet & Text Wrapper */}
          <div className="relative w-full flex items-center justify-center py-10 md:py-0">
              
              {/* The Planet */}
              <motion.div 
                style={{ scale: planetScale, opacity: planetOpacity }}
                className="w-[260px] h-[260px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full relative z-0 transition-all"
              >
                  <div className="absolute inset-0 bg-purple-500/30 blur-[40px] md:blur-[60px] rounded-full" />
                  <img 
                      src={PlanetImg}
                      alt="Home Planet" 
                      className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(100,100,255,0.5)]"
                  />
              </motion.div>

              {/* The Text "XPECTO" */}
              <motion.div 
                style={{ y: textY }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90vw] md:max-w-6xl flex justify-between items-center px-2 md:px-10 pointer-events-none z-10"
              >
                  {['X','P','E','C','T','O'].map((char, i) => (
                     <span key={i} className="text-5xl sm:text-7xl md:text-9xl lg:text-[140px] font-thin text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] font-sans">
                       {char}
                     </span>
                  ))}
              </motion.div>
          </div>

          {/* Subtitle */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-2xl md:text-4xl font-bold tracking-[0.2em] md:tracking-widest text-white mt-8 md:-mt-10 text-center uppercase drop-shadow-2xl px-4"
          >
            Biggest Techfest of Himalayas
          </motion.h1>

          <Link to="/about">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(100,100,255,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="mt-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-3 px-10 md:py-4 md:px-16 rounded-full transition-all text-sm md:text-xl tracking-wider shadow-[0_0_20px_rgba(100,100,255,0.2)]"
            >
              LEARN MORE
            </motion.button>
          </Link>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1, y: [0, 10, 0] }} 
            transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
            className="absolute bottom-[-10vh] md:bottom-[-15vh] flex flex-col items-center gap-2"
          >
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-white/60">SCROLL</span>
            <ChevronDown className="text-white/60" />
          </motion.div>

        </div>
      </div>

      {/* =========================================
          4. SCROLLABLE CONTENT SECTIONS
         ========================================= */}
      <div className="relative z-10 w-full flex flex-col items-center pb-24 mt-20 md:mt-0">
         
         {/* Connector Line */}
         <div className="w-[1px] h-32 bg-gradient-to-b from-white/0 via-cyan-500/50 to-white/0 mb-10"></div>

         <div className="w-full max-w-7xl px-4 md:px-8 space-y-24 md:space-y-32">
            {/* <Section 
              align="left" 
              title="EXHIBITION" 
              subtitle="INNOVATE" 
              desc="Witness the future. Prototypes, models, and machinery from the brightest minds displayed against the cosmic backdrop." 
              path="/exhibition" 
              color="#f97316" 
              icon={<Monitor size={24} />} 
              img="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070" 
            /> */}
            
            <Section 
              align="right" 
              title="COMPETITIONS" 
              subtitle="DOMINATE" 
              desc="Robowars, Hackathons, and Esports. Prove your skills in the arena where legends are forged." 
              path="/events" 
              color="#06b6d4" 
              icon={<Trophy size={24} />} 
              img="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071" 
            />
            
            {/* <Section 
              align="left" 
              title="SESSIONS" 
              subtitle="LEARN" 
              desc="Tech talks from industry leaders. Gain knowledge from the masters of the universe." 
              path="/sessions" 
              color="#8b5cf6" 
              icon={<Rocket size={24} />} 
              img="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070" 
            /> */}
            
            <Section 
              align="right" 
              title="THE CREW" 
              subtitle="OPERATORS" 
              desc="Meet the minds behind the machine. The architects of Xpecto." 
              path="/team" 
              color="#eab308" 
              icon={<Users size={24} />} 
              img="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070" 
            />
            
            <Section 
              align="left" 
              title="ALLIANCE" 
              subtitle="PARTNERS" 
              desc="Our strategic partners powering the event across the galaxy." 
              path="/sponsors" 
              color="#10b981" 
              icon={<Gem size={24} />} 
              img="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070" 
            />
         </div>
         
         <div className="mt-32 w-full h-[1px] bg-white/10"></div>
         <div className="mt-10 text-white/40 text-xs md:text-sm tracking-widest text-center">
            IIT MANDI • XPECTO '25 <br />
            <span className="text-[10px] opacity-50">DESIGNED FOR THE FUTURE</span>
         </div>
      </div>

    </div>
  );
};

// --- REUSABLE ANIMATED SECTION COMPONENT ---
const Section = ({ align, title, subtitle, desc, path, color, icon, img }) => {
  const isLeft = align === 'left';
  
  // Animation Variants (Appear and Disappear logic)
  const textVariants = {
    hidden: { 
      opacity: 0, 
      x: isLeft ? -100 : 100,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      rotate: isLeft ? -5 : 5 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0, 
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } 
    }
  };
  
  return (
    <section className="w-full flex items-center justify-center overflow-hidden">
      <div className={`w-full flex flex-col md:flex-row items-center gap-10 md:gap-16 ${!isLeft && 'md:flex-row-reverse'}`}>
        
        {/* TEXT CONTENT */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          // "once: false" allows it to animate again when scrolling back up
          viewport={{ once: false, amount: 0.3, margin: "0px 0px -100px 0px" }}
          variants={textVariants}
          className={`flex-1 text-center ${!isLeft ? 'md:text-right' : 'md:text-left'}`}
        >
          <div className={`flex items-center gap-3 mb-4 justify-center ${!isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
            <span className="text-[10px] md:text-xs font-mono px-3 py-1 border rounded-full tracking-widest backdrop-blur-md bg-black/20" style={{ color, borderColor: color }}>
              {subtitle}
            </span>
            <div className="p-2 rounded-full bg-white/5 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]" style={{ color }}>{icon}</div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 md:mb-6 leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-lg">
            {title}
          </h2>
          
          <p className="text-blue-100/70 max-w-lg mb-8 leading-relaxed font-light text-sm md:text-lg mx-auto md:mx-0">
            {desc}
          </p>
          
          <Link to={path} className={`inline-flex items-center gap-3 group ${!isLeft ? 'md:flex-row-reverse' : ''}`}>
             <div className="relative px-8 py-3 overflow-hidden rounded-full group bg-white/5 border border-white/10 hover:border-white/40 transition-all">
                <div className="absolute inset-0 w-0 bg-white/10 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                <span className="relative text-sm font-bold tracking-widest" style={{ color }}>EXPLORE</span>
             </div>
          </Link>
        </motion.div>

        {/* IMAGE CARD */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          // "once: false" allows it to animate again when scrolling back up
          viewport={{ once: false, amount: 0.3, margin: "0px 0px -100px 0px" }}
          variants={imageVariants}
          className="flex-1 w-full max-w-xl"
        >
          <div className="aspect-[4/3] rounded-[20px] md:rounded-[40px] overflow-hidden border border-white/20 bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] relative group cursor-pointer">
            
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-10 mix-blend-color-dodge" style={{ backgroundColor: color }}></div>
            
            <img 
              src={img} 
              alt={title} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out" 
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#02020A] via-transparent to-transparent opacity-80"></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Home;