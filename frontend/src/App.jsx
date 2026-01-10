import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; 
import Navbar from './components/Navbar';
import StarBackground from './components/StarBackground'; 
import Footer from './components/Footer'; 
import PageTransition from './components/PageTransition'; 

import Home from './pages/Home';
import Exhibition from './pages/Exhibition'; 
import Events from './pages/Events';        
import Sessions from './pages/Sessions';   
import Payments from './pages/Payment';
import Team from './pages/Team';
import Sponsors from './pages/Sponsors';
import About from './pages/About';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    // Reset scroll inside the transition container, not the window
    const scrollContainer = document.querySelector('.page-content');
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, [pathname]);
  return null;
};

// Wrapper for Page + Footer
const PageWithFooter = ({ children }) => (
  <PageTransition>
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  </PageTransition>
);

const ContentArea = ({ isMenuOpen }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      {!isMenuOpen && (
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWithFooter><Home /></PageWithFooter>} />
          <Route path="/exhibition" element={<PageWithFooter><Exhibition /></PageWithFooter>} />
          <Route path="/events" element={<PageWithFooter><Events /></PageWithFooter>} />
          <Route path="/sessions" element={<PageWithFooter><Sessions /></PageWithFooter>} />
          <Route path="/payments" element={<PageWithFooter><Payments /></PageWithFooter>} />
          <Route path="/Team" element={<PageWithFooter><Team /></PageWithFooter>} />
          <Route path="/Sponsors" element={<PageWithFooter><Sponsors /></PageWithFooter>} />
          <Route path="/about" element={<PageWithFooter><About /></PageWithFooter>} />
        </Routes>
      )}
    </AnimatePresence>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      {/* FIXED CONTAINER: Keeps everything locked to the screen */}
      <div className="fixed inset-0 w-full h-full bg-black text-white selection:bg-cyan-500/30 overflow-hidden">
        
        <StarBackground />

        {/* Content Area */}
        <div className="absolute inset-0 z-10">
           <ContentArea isMenuOpen={isMenuOpen} />
        </div>

        {/* Navbar on Top */}
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      </div>
      
      {/* Global Scrollbar Style */}
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      `}</style>
    </Router>
  );
}

export default App;