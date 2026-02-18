"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Loader2,
  Check,
  Calendar,
  MapPin,
  BookOpen,
  Sparkles,
  X,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import FloatingElement from "../components/ui/FloatingElement";
import OptimizedImage from "../components/ui/OptimizedImage";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://xpecto.org/api";

// Cache configuration
const CACHE_KEY = "xpecto_events_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Compact card for grid view
const EventGridCard = ({ event, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl backdrop-blur-md bg-black/60 border border-white/10 shadow-xl hover:bg-black/70 hover:border-white/30 hover:shadow-2xl transition-all duration-500 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-black/40">
        {event.image && event.image.length > 0 ? (
          <OptimizedImage
            src={event.image[0]}
            alt={event.title}
            className="w-full h-full object-cover transition-transform"
            skeleton={true}
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white/30" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-['Michroma'] text-lg md:text-xl font-light text-white mb-2 tracking-wide leading-tight line-clamp-2 min-h-14">
          {event.title}
        </h3>

        {/* Description */}
        <p className="font-['Michroma'] text-white/60 text-xs md:text-sm leading-relaxed line-clamp-2 mb-3">
          {event.description}
        </p>

        {/* Prize Pool */}
        {event.prizePool && (
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="font-['Michroma'] text-sm font-bold text-yellow-400">
              {event.prizePool}
            </span>
          </div>
        )}

        {/* More Details Button */
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="group/btn w-full px-4 py-2.5 font-['Michroma'] font-bold text-sm text-black bg-white rounded-lg overflow-hidden relative"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            MORE DETAILS
            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
          />
        </motion.button>
}
      </div>
    </motion.div>
  );
};

// Lazy loading wrapper with Intersection Observer
const LazyEventCard = ({ event, onClick, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "100px", // Load 100px before entering viewport
        threshold: 0.01,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div ref={cardRef}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.5 }}
        >
          <EventGridCard event={event} onClick={onClick} />
        </motion.div>
      ) : (
        <div className="w-full h-96 rounded-2xl bg-black/40 border border-white/10 animate-pulse" />
      )}
    </div>
  );
};

// Detailed modal card
const EventDetailModal = ({
  event,
  isOpen,
  onClose,
  onRegister,
  isRegistered,
  registering,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-5xl mx-auto my-6"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute -top-3 -right-3 z-10 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 hover:border-white/40 transition-all"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>

            {/* Event Card Content */}
            <div
              className="relative overflow-hidden rounded-3xl backdrop-blur-md bg-black/80 border border-white/20 shadow-2xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Content Container */}
              <div className="relative flex flex-col lg:flex-row items-stretch gap-0">
                {/* Left Side - Image Section */}
                <div className="relative lg:w-2/5 overflow-hidden bg-black/40">
                  <motion.div
                    className="relative h-full min-h-80 lg:min-h-100"
                    animate={{ scale: isHovered ? 1.02 : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Main Event Image */}
                    <div className="relative h-full flex items-center justify-center p-6">
                      <div className="relative w-full max-w-sm">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                          {event.image && event.image.length > 0 ? (
                            <OptimizedImage
                              src={event.image[0]}
                              alt={event.title}
                              className="w-full h-full object-cover"
                              skeleton={true}
                            />
                          ) : (
                            <div className="w-full h-64 bg-white/5 flex items-center justify-center">
                              <Sparkles className="w-12 h-12 text-white/30" />
                            </div>
                          )}
                        </div>

                        {/* Corner accents */}
                        <motion.div
                          className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg"
                          animate={{
                            opacity: isHovered ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                        <motion.div
                          className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-lg"
                          animate={{
                            opacity: isHovered ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Category badges overlay */}
                    {event.company && (
                      <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                        <motion.div
                          className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="font-['Michroma'] text-xs font-medium text-white tracking-wider">
                            {event.company}
                          </span>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Right Side - Content Section */}
                <div className="relative lg:w-3/5 p-6 lg:p-8 flex flex-col justify-center">
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="font-['Michroma'] text-2xl lg:text-3xl xl:text-4xl font-light text-white mb-2 tracking-wide leading-tight">
                        {event.title}
                      </h3>

                      {/* Underline accent */}
                      <motion.div
                        className="h-1 bg-white/20 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "60%" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>

                    {/* Description */}
                    <p className="font-['Michroma'] text-white/70 text-xs lg:text-sm leading-relaxed">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2.5 pt-3">
                      {/* Prize Pool */}
                      {event.prizePool && (
                        <motion.div
                          className="flex items-start gap-3 group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05, duration: 0.5 }}
                        >
                          <Trophy className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-['Michroma'] text-xs text-white/40 mb-0.5">
                              Prize Pool
                            </p>
                            <p className="font-['Michroma'] text-base font-bold text-yellow-400">
                              {event.prizePool}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {event.date && (
                        <motion.div
                          className="flex items-start gap-3 group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1, duration: 0.5 }}
                        >
                          <Calendar className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-['Michroma'] text-xs text-white/40 mb-0.5">
                              Date
                            </p>
                            <p className="font-['Michroma'] text-xs text-white/80">
                              {new Date(event.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {event.venue && (
                        <motion.div
                          className="flex items-start gap-3 group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          <MapPin className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-['Michroma'] text-xs text-white/40 mb-0.5">
                              Venue
                            </p>
                            <p className="font-['Michroma'] text-xs text-white/80">
                              {event.venue}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {event.rulebook && (
                        <motion.div
                          className="flex items-start gap-3 group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25, duration: 0.5 }}
                        >
                          <BookOpen className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-['Michroma'] text-xs text-white/40 mb-0.5">
                              Rulebook
                            </p>
                            <a
                              href={event.rulebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-['Michroma'] text-xs text-white/80 hover:text-white underline decoration-white/30 hover:decoration-white/60 transition-colors"
                            >
                              View Rulebook
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <motion.button
                        onClick={onRegister}
                        disabled={registering}
                        className={`group relative px-8 py-3 font-['Michroma'] font-bold text-white overflow-hidden rounded-xl shadow-lg w-full sm:w-auto ${
                          isRegistered
                            ? "bg-emerald-500"
                            : "bg-linear-to-r from-white via-gray-100 to-white"
                        }`}
                        whileHover={{
                          scale: registering ? 1 : 1.02,
                          y: registering ? 0 : -2,
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div
                          className={
                            isRegistered
                              ? "absolute inset-0 bg-linear-to-r from-emerald-500 via-emerald-400 to-emerald-500 opacity-100"
                              : "absolute inset-0 bg-linear-to-r from-white via-gray-100 to-white opacity-100"
                          }
                        />

                        <span className="relative z-10 flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wider text-black font-bold">
                          {registering ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              PROCESSING...
                            </>
                          ) : isRegistered ? (
                            <>
                              <Check className="w-4 h-4" />
                              REGISTERED
                            </>
                          ) : (
                            <>
                              REGISTER NOW
                              <motion.span
                                animate={{ x: isHovered ? 5 : 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                →
                              </motion.span>
                            </>
                          )}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function Events() {
  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Registration state
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Memoize filtered events to prevent unnecessary recalculations
  const filteredEvents = useMemo(() => {
    if (searchQuery.trim() === "") {
      return events;
    }
    return events.filter(
      (event) =>
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, events]);

  const checkAllRegistrations = useCallback(async (eventsData) => {
    const registered = new Set();
    
    // Use Promise.all for parallel requests instead of sequential
    const registrationChecks = eventsData.map(async (event) => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/events/${event._id}/register/status`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data.isRegistered) {
            return event._id;
          }
        }
      } catch (err) {
        console.error(`Failed to check registration for ${event._id}:`, err);
      }
      return null;
    });

    const results = await Promise.all(registrationChecks);
    results.forEach((id) => {
      if (id) registered.add(id);
    });

    setRegisteredEvents(registered);
  }, []);

  const fetchEvents = useCallback(async (skipCache = false) => {
    try {
      // Try to load from cache first
      if (!skipCache) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();
          
          // Use cached data if it's still fresh
          if (now - timestamp < CACHE_DURATION) {
            setEvents(data);
            setError(null);
            setLoading(false);
            
            // Check registration status for all events
            if (isAuthenticated) {
              checkAllRegistrations(data);
            }
            return;
          }
        }
      }

      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/events`);
      if (!response.ok) throw new Error("Failed to fetch events");
      const result = await response.json();
      const eventsData = result.data || [];
      
      // Cache the fetched data
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: eventsData,
        timestamp: Date.now()
      }));
      
      setEvents(eventsData);
      setError(null);

      // Check registration status for all events
      if (isAuthenticated) {
        checkAllRegistrations(eventsData);
      }
    } catch (err) {
      setError(err.message);
      // Try to use stale cache on error
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        setEvents(data);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, checkAllRegistrations]);

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  }, []);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      loginWithGoogle();
      return;
    }

    if (!selectedEvent?._id) return;

    const eventId = selectedEvent._id;
    const isCurrentlyRegistered = registeredEvents.has(eventId);

    try {
      setRegistering(true);

      const endpoint = `${BACKEND_URL}/events/${eventId}/register`;
      const method = isCurrentlyRegistered ? "DELETE" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const newRegistered = new Set(registeredEvents);
        if (isCurrentlyRegistered) {
          newRegistered.delete(eventId);
        } else {
          newRegistered.add(eventId);
        }
        setRegisteredEvents(newRegistered);
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

  return (
    <div className="w-full min-h-screen relative bg-[#050508]">
      {/* Fixed Background Section */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <div className="absolute inset-0">
          <OptimizedImage
            src="./bg5.png"
            alt="Background"
            className="w-full h-full object-cover"
            priority={false}
            skeleton={false}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Fixed Planet - CENTER */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-75 md:scale-90 lg:scale-100">
          <FloatingElement
            floatIntensity={50}
            duration={12}
            enableParallax={false}
          >
            <motion.img
              src="./void_planet.png"
              alt="Planet"
              className="w-75 h-75 sm:w-100 sm:h-100 lg:w-125 lg:h-125 object-contain"
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
              className="font-['Michroma'] text-5xl md:text-7xl font-light text-white mb-8 tracking-[0.15em] leading-tight"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              EVENTS
            </motion.h1>

            <motion.div
              className="h-1 w-48 mx-auto bg-white/20 mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            <motion.p
              className="font-['Michroma'] text-lg md:text-xl text-white/60 tracking-wider max-w-3xl mx-auto leading-relaxed mb-8"
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl px-12 py-4 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all duration-300 font-['Michroma']"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Events Content */}
        <div className="relative px-6 pb-24 min-h-150">
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
              <div className="backdrop-blur-md bg-red-900/40 border border-red-500/20 rounded-3xl px-8 py-6 max-w-md shadow-2xl">
                <p className="text-red-200 text-center mb-4 font-['Michroma']">
                  {error}
                </p>
                <button
                  onClick={fetchEvents}
                  className="w-full px-6 py-3 border border-red-400/40 rounded-xl text-red-300 hover:bg-red-400/10 transition font-['Michroma'] font-bold tracking-wider"
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
                className="text-center space-y-6 backdrop-blur-md bg-black/60 border border-white/10 rounded-3xl p-12 shadow-2xl"
              >
                <div className="relative w-32 h-32 mx-auto">
                  <div className="w-full h-full flex items-center justify-center">
                    <Search className="w-24 h-24 text-white/30" />
                  </div>
                </div>
                <div>
                  <h3 className="font-['Michroma'] text-2xl text-white tracking-wider mb-2">
                    NO EVENTS FOUND
                  </h3>
                  <p className="font-['Michroma'] text-white/40 text-sm">
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

          {/* Events Grid */}
          {!loading && !error && filteredEvents.length > 0 && (
            <motion.div
              className="max-w-7xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredEvents.map((event, index) => (
                  <LazyEventCard
                    key={event._id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
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
            <div className="h-px w-16 bg-linear-to-r from-transparent to-white" />
            <p className="font-['Michroma'] text-gray-400 text-sm tracking-[0.3em]">
              XPECTO'26
            </p>
            <div className="h-px w-16 bg-linear-to-l from-transparent to-white" />
          </motion.div>
          <p className="font-['Michroma'] text-gray-500 text-xs tracking-widest">
            MARCH 14-16, 2026 • HIMALAYAS' BIGGEST TECHFEST
          </p>
        </motion.div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRegister={handleRegister}
        isRegistered={selectedEvent ? registeredEvents.has(selectedEvent._id) : false}
        registering={registering}
      />
    </div>
  );
}
