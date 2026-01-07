import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Rocket, Trophy, Users, Monitor, Gem, Info, X as CloseIcon, Zap } from 'lucide-react';

const navLinks = [
  { name: 'HOME', path: '/', icon: <Home size={20} />, color: '#00f0ff' }, 
  { name: 'EXHIBITION', path: '/exhibition', icon: <Monitor size={20} />, color: '#ff0055' }, 
  { name: 'EVENTS', path: '/events', icon: <Trophy size={20} />, color: '#ffd700' }, 
  { name: 'SESSIONS', path: '/sessions', icon: <Rocket size={20} />, color: '#00ff99' }, 
  { name: 'TEAM', path: '/Team', icon: <Users size={20} />, color: '#bd00ff' }, 
  { name: 'SPONSORS', path: '/Sponsors', icon: <Gem size={20} />, color: '#ff8800' }, 
  { name: 'ABOUT', path: '/About', icon: <Info size={20} />, color: '#ffffff' }, 
];

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    if (location.pathname === path) {
        setIsMenuOpen(false);
        return;
    }
    // 1. Close Menu immediately
    setIsMenuOpen(false);
    // 2. Navigate (Triggers the Page Emerge Animation)
    navigate(path);
  };

  const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
  };

  // Animation Variants for the Menu Container
  const menuContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        // CRITICAL: Waits 0.8s (for page to suck in) before showing dots
        delayChildren: 0.8, 
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 } // Disappear fast when clicking a link
    }
  };

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 ,transition: { delay: 0.8 }} } exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90] pointer-events-auto"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center pointer-events-none">
          
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                variants={menuContainerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] pointer-events-auto"
              >
                 {navLinks.map((link, index) => {
                    const totalItems = navLinks.length;
                    const angle = 180 + (180 / (totalItems - 1)) * index;
                    const radian = (angle * Math.PI) / 180;
                    const radius = window.innerWidth < 768 ? 140 : 220; 
                    const x = Math.cos(radian) * radius;
                    const y = Math.sin(radian) * radius;

                    return (
                      <MenuItem 
                        key={link.name}
                        link={link}
                        x={x}
                        y={y}
                        onClick={() => handleNavClick(link.path)}
                      />
                    );
                 })}
                 
                 {/* Decorative Ring (Also delayed) */}
                 <motion.svg 
                    initial={{ opacity: 0 }} animate={{ opacity: 0.3, transition: { delay: 0.8 } }} exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                 >
                    <circle cx="50%" cy="50%" r={window.innerWidth < 768 ? "140" : "220"} fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="10 10" className="animate-spin-slow origin-center" />
                 </motion.svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TRIGGER BUTTON */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="relative w-24 h-24 rounded-full flex items-center justify-center bg-black border border-white/10 shadow-[0_0_50px_rgba(0,240,255,0.2)] group z-50 cursor-pointer outline-none pointer-events-auto"
          >
              <div className={`absolute inset-[-10px] rounded-full opacity-80 ${isMenuOpen ? 'animate-spin-fast bg-[conic-gradient(from_0deg,transparent_0deg,#ff0000_180deg,transparent_360deg)]' : 'animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,#00f0ff_180deg,transparent_360deg)]'}`}></div>
              
              <div className="absolute inset-1 bg-black rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,1)] flex items-center justify-center z-20">
                  <motion.div initial={false} animate={{ rotate: isMenuOpen ? 45 : 0 }}>
                      {isMenuOpen ? (
                          <CloseIcon size={32} className="text-red-500 drop-shadow-[0_0_10px_#ff0000]" />
                      ) : (
                          <Zap size={32} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                      )}
                  </motion.div>
              </div>
          </motion.button>

      </div>
      
      <style jsx>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        .animate-spin-fast { animation: spin 2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

const MenuItem = ({ link, x, y, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Item variants for stagger effect
  const itemVariants = {
    hidden: { x: 0, y: 0, opacity: 0, scale: 0 },
    show: { x: x, y: y, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 180, damping: 20 } },
    exit: { opacity: 0, scale: 0 }
  };

  return (
    <motion.div
      variants={itemVariants} // Use variants here
      className="absolute top-1/2 left-1/2 -ml-8 -mt-8 pointer-events-auto"
    >
        <button 
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative group block outline-none"
        >
            <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center transition-all duration-300 relative z-20 group-hover:scale-110 group-hover:border-white/50" style={{ boxShadow: isHovered ? `0 0 30px ${link.color}` : 'inset 0 0 20px rgba(255,255,255,0.05)' }}>
                <div style={{ color: isHovered ? 'white' : link.color }} className="transition-colors duration-300 drop-shadow-md">{link.icon}</div>
            </div>
            <AnimatePresence>
                {isHovered && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -5 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-center whitespace-nowrap z-30">
                        <div className="text-[10px] font-bold font-['Orbitron'] tracking-widest bg-black/90 px-3 py-1 rounded border border-white/20 text-white shadow-xl" style={{ borderBottom: `2px solid ${link.color}` }}>{link.name}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    </motion.div>
  );
};

export default Navbar;