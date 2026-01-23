import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HamburgerMenu.css";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="hamburger-menu-container">
      <button 
        className="hamburger-toggle" 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={`bar ${isOpen ? 'active' : ''}`}></span>
        <span className={`bar ${isOpen ? 'active' : ''}`}></span>
        <span className={`bar ${isOpen ? 'active' : ''}`}></span>
      </button>

      {isOpen && (
        <>
          <div className="hamburger-backdrop" onClick={closeMenu}></div>
          <nav className="hamburger-menu">
            <ul>
              <li><Link to="/" onClick={closeMenu}>Home</Link></li>
              <li><Link to="/events" onClick={closeMenu}>Events</Link></li>
              <li><Link to="/about" onClick={closeMenu}>About</Link></li>
              <li><Link to="/profile" onClick={closeMenu}>Profile</Link></li>
              <li><Link to="/exhibition" onClick={closeMenu}>Exhibitions</Link></li>
              <li><Link to="/sessions" onClick={closeMenu}>Sessions</Link></li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default HamburgerMenu;