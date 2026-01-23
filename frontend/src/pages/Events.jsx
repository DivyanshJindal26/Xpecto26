"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconLoader2,
  IconCheck,
} from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import FloatingElement from "../components/ui/FloatingElement";

const BACKEND_URL = import.meta.env.BACKEND_URL || "https://xpecto.org/api";

const EventCard = ({
  event,
  isHovered,
  setIsHovered,
  onRegister,
  isRegistered,
  registering,
  registrationCount,
}) => {
  return (
    <motion.div
      className="relative w-full max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div
        className="relative overflow-hidden rounded-3xl backdrop-blur-sm bg-black/40 border border-white/10 shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated gradient border effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{
            background: isHovered
              ? "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.3) 100%)"
              : "transparent",
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Content Container */}
        <div className="relative flex flex-col lg:flex-row items-stretch gap-0 overflow-hidden">
          {/* Left Side - Image Section */}
          <div className="relative lg:w-2/5 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
            <motion.div
              className="relative h-full min-h-[400px] lg:min-h-[500px]"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                {event.image && event.image.length > 0 ? (
                  <>
                    <img
                      src={event.image[0]}
                      alt=""
                      className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </>
                ) : (
                  <>
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </>
                )}
              </div>

              {/* Main Event Image */}
              <div className="relative h-full flex items-center justify-center p-8">
                <motion.div
                  className="relative w-full max-w-sm"
                  animate={{ y: isHovered ? -8 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    {event.image && event.image.length > 0 ? (
                      <img
                        src={event.image[0]}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                        <span className="text-white/50 text-sm">No Image</span>
                      </div>
                    )}

                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"
                      animate={{ opacity: isHovered ? 0.6 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Corner accents */}
                  <motion.div
                    className="absolute -top-3 -left-3 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg"
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  <motion.div
                    className="absolute -bottom-3 -right-3 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg"
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              </div>

              {/* Category badges overlay */}
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                {event.club_name && (
                  <motion.div
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-white/90 to-gray-100/90 backdrop-blur-md border border-white/40"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-['Michroma'] text-xs font-bold text-black tracking-widest">
                      {event.club_name}
                    </span>
                  </motion.div>
                )}
                {event.company && (
                  <motion.div
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-100/90 to-blue-100/90 backdrop-blur-md border border-cyan-200/40"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-['Michroma'] text-xs font-bold text-black tracking-widest">
                      {event.company}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Content Section */}
          <div className="relative lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-slate-900/95 to-black/95">
            <motion.div
              animate={{ x: isHovered ? -5 : 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Title with gradient */}
              <div>
                <motion.h3
                  className="font-['Michroma'] text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-300 mb-3 tracking-wide leading-tight"
                  animate={{
                    backgroundPosition: isHovered ? "200% center" : "0% center",
                  }}
                  transition={{ duration: 2, ease: "linear" }}
                  style={{ backgroundSize: "200% auto" }}
                >
                  {event.title}
                </motion.h3>

                {/* Underline accent */}
                <motion.div
                  className="h-1 bg-gradient-to-r from-white via-gray-300 to-transparent rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>

              {/* Description */}
              <p className="font-['Michroma'] text-gray-300 text-base lg:text-lg leading-relaxed">
                {event.description}
              </p>

              {/* Event Details List */}
              <div className="space-y-3 pt-4">
                {event.date && (
                  <motion.div
                    className="flex items-start gap-4 group"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <div className="relative mt-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-white"
                        whileHover={{ scale: 1.5 }}
                      />
                      <motion.div
                        className="absolute inset-0 w-2 h-2 rounded-full bg-white"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                    <span className="font-['Michroma'] text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                      <span className="font-semibold text-white">Date:</span>{" "}
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </motion.div>
                )}

                {event.venue && (
                  <motion.div
                    className="flex items-start gap-4 group"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div className="relative mt-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-white"
                        whileHover={{ scale: 1.5 }}
                      />
                      <motion.div
                        className="absolute inset-0 w-2 h-2 rounded-full bg-white"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5,
                        }}
                      />
                    </div>
                    <span className="font-['Michroma'] text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                      <span className="font-semibold text-white">Venue:</span>{" "}
                      {event.venue}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* CTA Button with enhanced design */}
              <div className="pt-6">
                <motion.button
                  onClick={onRegister}
                  disabled={registering}
                  className="group relative px-10 py-4 font-['Michroma'] font-bold text-white overflow-hidden rounded-xl shadow-lg w-full sm:w-auto"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated gradient background */}
                  <div
                    className={`absolute inset-0 ${isRegistered ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" : "bg-gradient-to-r from-white via-gray-100 to-white"} opacity-100`}
                  />
                  <motion.div
                    className={`absolute inset-0 ${isRegistered ? "bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400" : "bg-gradient-to-r from-gray-200 via-white to-gray-200"}`}
                    initial={{ x: "100%" }}
                    whileHover={{ x: "-100%" }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  />

                  {/* Glow effect */}
                  <motion.div
                    className={`absolute inset-0 ${isRegistered ? "bg-emerald-400/40" : "bg-white/40"} blur-xl`}
                    animate={{ opacity: isHovered ? 0.5 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <span className="relative z-10 flex items-center justify-center gap-3 text-base tracking-wider text-black font-bold">
                    {registering ? (
                      <>
                        <IconLoader2 className="w-5 h-5 animate-spin" />
                        PROCESSING...
                      </>
                    ) : isRegistered ? (
                      <>
                        <IconCheck className="w-5 h-5" />
                        REGISTERED
                      </>
                    ) : (
                      <>
                        REGISTER NOW
                        <motion.span
                          animate={{ x: isHovered ? 5 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-xl"
                        >
                          →
                        </motion.span>
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Events() {
  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Registration state
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
      setCurrentIndex(0);
    } else {
      const filtered = events.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          event.club_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.company?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredEvents(filtered);
      setCurrentIndex(0);
    }
  }, [searchQuery, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/events`);
      if (!response.ok) throw new Error("Failed to fetch events");
      const result = await response.json();
      const eventsData = result.data || [];
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check registration status for current event
  useEffect(() => {
    const checkStatus = async () => {
      if (!isAuthenticated || !filteredEvents[currentIndex]?._id) {
        setIsRegistered(false);
        setRegistrationCount(
          filteredEvents[currentIndex]?.registrations?.length || 0,
        );
        return;
      }

      const eventId = filteredEvents[currentIndex]._id;

      try {
        const response = await fetch(
          `${BACKEND_URL}/events/${eventId}/register/status`,
          {
            credentials: "include",
          },
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setIsRegistered(result.data.isRegistered);
            setRegistrationCount(result.data.registrationCount);
          }
        }
      } catch (err) {
        console.error("Failed to check registration status:", err);
      }
    };

    checkStatus();
  }, [currentIndex, filteredEvents, isAuthenticated]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      loginWithGoogle();
      return;
    }

    const eventId = filteredEvents[currentIndex]?._id;
    if (!eventId) return;

    try {
      setRegistering(true);

      const endpoint = isRegistered
        ? `${BACKEND_URL}/events/${eventId}/register`
        : `${BACKEND_URL}/events/${eventId}/register`;

      const method = isRegistered ? "DELETE" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsRegistered(!isRegistered);
        setRegistrationCount(result.data.registrationCount);
      } else {
        console.error(result.message);
        alert(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Registration action failed:", err);
      alert("Failed to process request");
    } finally {
      setRegistering(false);
    }
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredEvents.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length,
    );
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full min-h-screen relative bg-black">
      {/* Fixed Background Section */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <div className="absolute inset-0">
          <img src="./bg5.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Fixed Planet - RIGHT CENTER */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-75 md:scale-90 lg:scale-100">
          <FloatingElement
            floatIntensity={50}
            duration={12}
            enableParallax={false}
          >
            <motion.img
              src="./void_planet.png"
              alt="Planet"
              className="w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />
          </FloatingElement>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="relative pt-32 pb-16 px-6">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="px-6 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                <span className="font-['Michroma'] text-sm text-white tracking-widest">
                  XPECTO'26 PRESENTS
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="font-['Michroma'] text-5xl md:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white mb-8 tracking-[0.2em] leading-tight"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              EVENTS
            </motion.h1>

            <motion.div
              className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-white to-transparent mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            <motion.p
              className="font-['Michroma'] text-xl md:text-2xl text-gray-300 tracking-wider max-w-3xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Join us for extraordinary experiences and groundbreaking
              competitions
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="max-w-xl mx-auto relative mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl px-12 py-4 text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-white/40 transition-all duration-300"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Events Content */}
        <div className="relative px-6 pb-24 min-h-[600px]">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-32">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
              />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center py-32">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-8 py-6 backdrop-blur-xl max-w-md">
                <p className="text-red-400 text-center mb-4">{error}</p>
                <button
                  onClick={fetchEvents}
                  className="w-full px-6 py-3 border border-red-400/40 rounded-lg text-red-300 hover:bg-red-400/10 transition font-['Michroma'] font-bold tracking-wider"
                >
                  RETRY
                </button>
              </div>
            </div>
          )}

          {/* No Events State */}
          {!loading && !error && filteredEvents.length === 0 && (
            <div className="flex items-center justify-center py-32">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6 max-w-md"
              >
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-gray-500/10 rounded-full blur-2xl" />
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg
                      className="w-24 h-24 text-white/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-['Michroma'] text-2xl text-white tracking-wider mb-2">
                    NO EVENTS FOUND
                  </h3>
                  <p className="font-['Michroma'] text-gray-400 text-sm">
                    {searchQuery
                      ? "Try adjusting your search query"
                      : "No events available at the moment"}
                  </p>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-6 py-3 border border-white/40 rounded-xl text-white font-['Michroma'] font-bold tracking-wider hover:border-white hover:bg-white/10 transition"
                  >
                    CLEAR SEARCH
                  </button>
                )}
              </motion.div>
            </div>
          )}

          {/* Events Carousel */}
          {!loading && !error && filteredEvents.length > 0 && (
            <div className="relative">
              {/* Navigation Buttons */}
              {filteredEvents.length > 1 && (
                <>
                  <motion.button
                    onClick={handlePrev}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full hover:border-white/40 hover:bg-black/80 transition-all duration-300 hidden lg:block"
                  >
                    <IconChevronLeft className="h-6 w-6 text-white" />
                  </motion.button>

                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full hover:border-white/40 hover:bg-black/80 transition-all duration-300 hidden lg:block"
                  >
                    <IconChevronRight className="h-6 w-6 text-white" />
                  </motion.button>
                </>
              )}

              {/* Event Card */}
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <EventCard
                    event={filteredEvents[currentIndex]}
                    isHovered={isHovered}
                    setIsHovered={setIsHovered}
                    onRegister={handleRegister}
                    isRegistered={isRegistered}
                    registering={registering}
                    registrationCount={registrationCount}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Pagination Dots */}
              {filteredEvents.length > 1 && (
                <div className="text-center mt-12">
                  <p className="font-['Michroma'] text-gray-400 text-sm mb-4 tracking-wider">
                    {currentIndex + 1} / {filteredEvents.length}
                  </p>
                  <div className="flex justify-center gap-2.5">
                    {filteredEvents.map((_, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => {
                          setDirection(idx > currentIndex ? 1 : -1);
                          setCurrentIndex(idx);
                        }}
                        animate={{
                          scale: idx === currentIndex ? 1.2 : 1,
                        }}
                        whileHover={{ scale: idx === currentIndex ? 1.3 : 1.1 }}
                        transition={{ duration: 0.3 }}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          idx === currentIndex
                            ? "w-10 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                            : "w-2 bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Section */}
        <motion.div
          className="relative py-20 text-center border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
            <p className="font-['Michroma'] text-gray-400 text-sm tracking-[0.3em]">
              XPECTO'26
            </p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
          </motion.div>
          <p className="font-['Michroma'] text-gray-500 text-xs tracking-widest">
            MARCH 14-16, 2026 • HIMALAYAS' BIGGEST TECHFEST
          </p>
        </motion.div>
      </div>
    </div>
  );
}
