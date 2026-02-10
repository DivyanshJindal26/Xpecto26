"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  Check,
  Calendar,
  MapPin,
  Building2,
  Users,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import FloatingElement from "../components/ui/FloatingElement";
import OptimizedImage from "../components/ui/OptimizedImage";

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
        className="relative overflow-hidden rounded-3xl backdrop-blur-md bg-black/60 border border-white/10 shadow-2xl hover:bg-black/70 hover:border-white/20 transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Content Container */}
        <div className="relative flex flex-col lg:flex-row items-stretch gap-0">
          {/* Left Side - Image Section */}
          <div className="relative lg:w-2/5 overflow-hidden bg-black/40">
            <motion.div
              className="relative h-full min-h-100 lg:min-h-125"
              animate={{ scale: isHovered ? 1.02 : 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Main Event Image */}
              <div className="relative h-full flex items-center justify-center p-8">
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
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                {event.club_name && (
                  <motion.div
                    className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-['Michroma'] text-xs font-medium text-white tracking-wider">
                      {event.club_name}
                    </span>
                  </motion.div>
                )}
                {event.company && (
                  <motion.div
                    className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-['Michroma'] text-xs font-medium text-white tracking-wider">
                      {event.company}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Content Section */}
          <div className="relative lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h3 className="font-['Michroma'] text-3xl lg:text-4xl xl:text-5xl font-light text-white mb-3 tracking-wide leading-tight">
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
              <p className="font-['Michroma'] text-white/70 text-sm lg:text-base leading-relaxed">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="space-y-3 pt-4">
                {event.date && (
                  <motion.div
                    className="flex items-start gap-3 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <Calendar className="w-5 h-5 text-white/40 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-['Michroma'] text-xs text-white/40 mb-1">
                        Date
                      </p>
                      <p className="font-['Michroma'] text-sm text-white/80">
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
                    <MapPin className="w-5 h-5 text-white/40 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-['Michroma'] text-xs text-white/40 mb-1">
                        Venue
                      </p>
                      <p className="font-['Michroma'] text-sm text-white/80">
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
                    <BookOpen className="w-5 h-5 text-white/40 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-['Michroma'] text-xs text-white/40 mb-1">
                        Rulebook
                      </p>
                      <a
                        href={event.rulebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-['Michroma'] text-sm text-white/80 hover:text-white underline decoration-white/30 hover:decoration-white/60 transition-colors"
                      >
                        View Rulebook
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* CTA Button */}
              <div className="pt-6">
                <motion.button
                  onClick={onRegister}
                  disabled={registering}
                  className={`group relative px-10 py-4 font-['Michroma'] font-bold text-white overflow-hidden rounded-xl shadow-lg w-full sm:w-auto ${
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

                  <span className="relative z-10 flex items-center justify-center gap-3 text-sm sm:text-base tracking-wider text-black font-bold">
                    {registering ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        PROCESSING...
                      </>
                    ) : isRegistered ? (
                      <>
                        <Check className="w-5 h-5" />
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
  const [isMobile, setIsMobile] = useState(false);

  // Registration state
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
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
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </motion.button>

                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full hover:border-white/40 hover:bg-black/80 transition-all duration-300 hidden lg:block"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
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
                  drag={isMobile ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(event, info) => {
                    if (!isMobile) return;

                    const swipeThreshold = 80;

                    if (info.offset.x < -swipeThreshold) {
                      handleNext();
                    } else if (info.offset.x > swipeThreshold) {
                      handlePrev();
                    }
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
                  <p className="font-['Michroma'] text-white/40 text-sm mb-4 tracking-wider">
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
                            ? "w-10 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
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
    </div>
  );
}
