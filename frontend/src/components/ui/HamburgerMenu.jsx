import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IconLogout,
  IconUserPlus,
  IconLoader2,
  IconUser,
  IconHome,
  IconCalendarEvent,
  IconUsers,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import "./HamburgerMenu.css";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loading, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { label: "Home", href: "/", icon: <IconHome className="h-5 w-5" /> },
    {
      label: "Events",
      href: "/events",
      icon: <IconCalendarEvent className="h-5 w-5" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <IconUser className="h-5 w-5" />,
    },
    {
      label: "Workshops",
      href: "/workshops",
      icon: <IconUsers className="h-5 w-5" />,
    },
    {
      label: "About",
      href: "/about",
      icon: <IconInfoCircle className="h-5 w-5" />,
    },
  ];

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
              {links.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} onClick={closeMenu}>
                    <span className="hamburger-link-icon">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
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
