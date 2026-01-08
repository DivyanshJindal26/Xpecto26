import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  // Function to determine if a link is active
  const getButtonClass = (routePath) => {
    const isActive = path === routePath;
    
    // Default styling (inactive)
    let baseClass = "text-white/70 hover:text-white px-5 py-1.5 text-[10px] md:text-xs font-medium transition-all hover:bg-white/10 rounded-full cursor-pointer";

    // Active styling (Specific colors for specific pages)
    if (isActive) {
      if (routePath === '/exhibition') {
        return "bg-[#FF9F1C] text-black shadow-[0_0_15px_#FF9F1C] px-5 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all duration-300";
      }
      if (routePath === '/events') {
        return "bg-[#4361EE] text-white shadow-[0_0_15px_#4361EE] px-5 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all duration-300";
      }
      if (routePath === '/sessions') {
        return "bg-[#2EC4B6] text-black shadow-[0_0_15px_#2EC4B6] px-5 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all duration-300";
      }
      // Default Active (Home)
      return "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.6)] px-5 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all duration-300";
    }

    return baseClass;
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[900px]">
      <div className="bg-[#1e1e24]/80 backdrop-blur-xl border border-white/10 rounded-full pl-2 pr-3 py-2 flex items-center justify-between shadow-2xl">
        
        {/* Logo - Links to Home */}
        <Link to="/" className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)] shrink-0 transition-transform hover:scale-105">
             <div className="w-5 h-5 border-2 border-cyan-300 rounded-full flex items-center justify-center">
                <span className="text-[8px] font-bold text-cyan-200">X</span>
             </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className={getButtonClass('/')}>HOME</Link>
          <Link to="/exhibition" className={getButtonClass('/exhibition')}>EXHIBITION</Link>
          <Link to="/events" className={getButtonClass('/events')}>EVENTS</Link>
          <Link to="/sessions" className={getButtonClass('/sessions')}>SESSIONS</Link>
        </div>

        {/* Mobile Menu Text */}
        <div className="md:hidden text-xs font-bold text-white/50 tracking-widest absolute left-1/2 -translate-x-1/2">
            MENU
        </div>

        {/* Sign Up Button */}
        <Link
        to="/signup"
        className="bg-gradient-to-r from-[#A0C4FF] to-[#BDB2FF] hover:brightness-110 text-black text-[10px] md:text-xs font-extrabold px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(160,196,255,0.4)] transition-transform hover:scale-105 shrink-0"
      >
          SIGN UP
        </Link>

      </div>
    </div>
  );
};

export default Navbar;