import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconLogout, IconUserPlus, IconLoader2, IconUser } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import "./HamburgerMenu.css";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loading, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    closeMenu();
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
              <li><Link to="/profile" onClick={closeMenu}>Profile</Link></li> 
              <li><Link to="/workshops" onClick={closeMenu}>Workshops</Link></li>
              <li><Link to="/about" onClick={closeMenu}>About</Link></li>
            </ul>

            {/* Auth Section */}
            <div className="hamburger-auth-section">
              {loading ? (
                <div className="hamburger-auth-loading">
                  <IconLoader2 className="h-5 w-5 animate-spin text-white/40" />
                </div>
              ) : isAuthenticated && user ? (
        
                <div className="hamburger-user-section">
                  {/* User Profile Button */}
                  <button
                    onClick={handleProfileClick}
                    className="hamburger-profile-button"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="hamburger-avatar"
                      />
                    ) : (
                      <div className="hamburger-avatar-placeholder">
                        <span>{user.name?.charAt(0) || "?"}</span>
                      </div>
                    )}
                    <div className="hamburger-user-info">
                      <p className="hamburger-user-name">{user.name}</p>
                      <p className="hamburger-user-email">
                        {user.collegeName || user.email}
                      </p>
                    </div>
                    <IconUser className="h-5 w-5 text-white/30" />
                  </button>

                  {/* Sign Out Button */}
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="hamburger-signout-button"
                  >
                    <IconLogout className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
           
                <button
                  onClick={() => {
                    loginWithGoogle();
                    closeMenu();
                  }}
                  className="hamburger-signup-button"
                >
                  <IconUserPlus className="h-5 w-5" />
                  <span>Sign Up with Google</span>
                </button>
              )}
            </div>
          </nav>
        </>
      )}
    </div>
  );
};

export default HamburgerMenu;
