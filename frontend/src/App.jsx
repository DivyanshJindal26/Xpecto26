import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
// import Exhibition from "./pages/Exhibition";
import Events from "./pages/Events";
import About from "./pages/About";
// import Sessions from "./pages/Sessions";
import Profile from "./pages/Profile";
import AuthSuccess from "./pages/AuthSuccess";
import AuthError from "./pages/AuthError";
import AdminPanel from "./pages/AdminPanel";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import XpectoSideBar from "./components/XpectoSideBar";
import SmoothCursor from "./components/ui/SmoothCursor";
import LoadingScreen from "./components/ui/LoadingScreen";
import ProfileCompletionModal from "./components/ProfileCompletionModal";
import GoogleOneTap from "./components/GoogleOneTap";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Sessions from "./pages/Sessions";
import HamburgerMenu from "./components/ui/HamburgerMenu";
import useImagePreloader from "./hooks/useImagePreloader";

export default function App() {
  const [showLoading, setShowLoading] = useState(() => {
    try {
      return !localStorage.getItem("xpecto_first_visit");
    } catch (e) {
      return true;
    }
  });
  const location = useLocation();

  // Critical images to preload for smooth experience
  const criticalImages = [
    "./bg.png", // Home background
    "./home_planet.png", // Home planet
    "./logo.png", // Logo
  ];

  // Preload critical images
  const { isLoading: imagesLoading, progress } = useImagePreloader(
    criticalImages,
    showLoading,
  );

  useEffect(() => {
    try {
      const visited = localStorage.getItem("xpecto_first_visit");
      if (!visited) {
        setShowLoading(true);
      }
    } catch (e) {}
  }, []);

  // Hide loading screen when images are loaded
  useEffect(() => {
    if (!imagesLoading && showLoading) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem("xpecto_first_visit", "1");
        } catch (e) {}
        setShowLoading(false);
      }, 500); // Small delay for smooth transition
      return () => clearTimeout(timer);
    }
  }, [imagesLoading, showLoading]);

  useEffect(() => {
    if (localStorage.getItem("xpecto_first_visit")) {
      setShowLoading(false);
    }
  }, [location]);
  return (
    <AuthProvider>
      <div className="overflow-x-hidden">
        <HamburgerMenu />
        <XpectoSideBar>
          <GoogleOneTap />
          <SmoothCursor />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/workshops" element={<Sessions />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/auth/error" element={<AuthError />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </XpectoSideBar>
        {/* Profile Completion Modal - shows after OAuth if profile is incomplete */}
        <ProfileCompletionModal />
        {showLoading && <LoadingScreen progress={progress} />}
      </div>
    </AuthProvider>
  );
}
