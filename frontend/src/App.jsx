import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import StarBackground from './components/StarBackground'; 
import Footer from './components/Footer'; // Import Footer

import Home from './pages/Home';
import Exhibition from './pages/Exhibition'; 
import Events from './pages/Events';        
import Sessions from './pages/Sessions';   
import Payments from './pages/Payment';
import Team from './pages/Team';
import Sponsors from './pages/Sponsors';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="relative w-full min-h-screen bg-black text-white selection:bg-cyan-500/30 flex flex-col">
        
        <Navbar />
        <StarBackground />

        {/* Main Content (flex-grow pushes footer down if content is short) */}
        <div className="relative z-10 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exhibition" element={<Exhibition />} />
            <Route path="/events" element={<Events />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/Team" element={<Team />} />
            <Route path="/Sponsors" element={<Sponsors />} />
            
          </Routes>
        </div>

        {/* Footer sits at the bottom */}
        <div className="relative z-10">
          <Footer />
        </div>

      </div>
    </Router>
  );
}

export default App;