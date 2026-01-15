import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Monitor,
  Trophy,
  Users,
  Gem,
  Zap,
  X as CloseIcon,
} from 'lucide-react';

/* ---------------- NAV LINKS ---------------- */

const navLinks = [
  { name: 'HOME', path: '/', icon: <Home size={20} />, color: '#00f0ff' },
  { name: 'EVENTS', path: '/events', icon: <Trophy size={20} />, color: '#ffd700' },
  { name: 'TEAM', path: '/team', icon: <Users size={20} />, color: '#bd00ff' },
  { name: 'SPONSORS', path: '/sponsors', icon: <Gem size={20} />, color: '#ff8800' },
];

/* ---------------- NAVBAR ---------------- */

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    setIsMenuOpen(false);
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.6,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* BACKDROP */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[90]"
          />
        )}
      </AnimatePresence>

      {/* MENU */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuContainerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute bottom-4 left-1/2 -translate-x-1/2
                         w-[320px] h-[320px]
                         md:w-[500px] md:h-[500px]
                         pointer-events-auto"
            >
              {navLinks.map((link, index) => {
                const total = navLinks.length;
                const angle = 180 + (180 / (total - 1)) * index;
                const radian = (angle * Math.PI) / 180;
                const radius = window.innerWidth < 768 ? 120 : 220;

                return (
                  <MenuItem
                    key={link.name}
                    link={link}
                    x={Math.cos(radian) * radius}
                    y={Math.sin(radian) * radius}
                    onClick={() => handleNavClick(link.path)}
                  />
                );
              })}

              {/* ORBIT RING */}
              <motion.svg
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3, transition: { delay: 0.6 } }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <circle
                  cx="50%"
                  cy="50%"
                  r={window.innerWidth < 768 ? '120' : '220'}
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="1"
                  strokeDasharray="10 10"
                  className="animate-spin-slow origin-center"
                />
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOGGLE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
          className="relative w-24 h-24 rounded-full
                     flex items-center justify-center
                     bg-black border border-white/10
                     shadow-[0_0_50px_rgba(0,240,255,0.25)]
                     z-50 cursor-pointer pointer-events-auto"
        >
          <div
            className={`absolute inset-[-10px] rounded-full opacity-80
              ${
                isMenuOpen
                  ? 'animate-spin-fast bg-[conic-gradient(from_0deg,transparent,#ff0000,transparent)]'
                  : 'animate-spin-slow bg-[conic-gradient(from_0deg,transparent,#00f0ff,transparent)]'
              }`}
          />

          <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center z-20">
            <motion.div animate={{ rotate: isMenuOpen ? 45 : 0 }}>
              {isMenuOpen ? (
                <CloseIcon size={32} className="text-red-500 drop-shadow-[0_0_10px_#ff0000]" />
              ) : (
                <Zap size={32} className="text-cyan-400 drop-shadow-[0_0_12px_rgba(0,240,255,0.9)]" />
              )}
            </motion.div>
          </div>
        </motion.button>
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        .animate-spin-fast {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

/* ---------------- MENU ITEM ---------------- */

const MenuItem = ({ link, x, y, onClick }) => {
  const itemVariants = {
    hidden: { x: 0, y: 0, opacity: 0, scale: 0 },
    show: {
      x,
      y,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 180, damping: 20 },
    },
    exit: { opacity: 0, scale: 0 },
  };

  return (
    <motion.div
      variants={itemVariants}
      className="absolute top-1/2 left-1/2 -ml-8 -mt-8"
    >
      <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 outline-none"
      >
        {/* LABEL (ALWAYS VISIBLE) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-[10px] md:text-xs
                     font-bold font-['Orbitron']
                     tracking-widest
                     text-white
                     bg-black/80
                     px-3 py-1
                     rounded
                     border border-white/20
                     shadow-lg
                     whitespace-nowrap"
          style={{ borderBottom: `2px solid ${link.color}` }}
        >
          {link.name}
        </motion.div>

        {/* ICON */}
        <div
          className="w-14 h-14 md:w-16 md:h-16
                     rounded-full bg-black
                     border border-white/10
                     flex items-center justify-center
                     transition-transform duration-300
                     hover:scale-110"
          style={{
            boxShadow: `0 0 25px ${link.color}`,
            color: link.color,
          }}
        >
          {link.icon}
        </div>
      </button>
    </motion.div>
  );
};

export default Navbar;
