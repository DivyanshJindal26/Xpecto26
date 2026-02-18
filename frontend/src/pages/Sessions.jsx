"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useState, useRef, useEffect } from "react";
import FlowingMenu from "../components/ui/FlowingMenu";
import FloatingElement from "../components/ui/FloatingElement";
import OptimizedImage from "../components/ui/OptimizedImage";

const SessionCard = ({ session, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // Format time if available, otherwise use a placeholder or computed duration
  const displayTime =
    session.time ||
    (session.startTime ? `${session.startTime} - ${session.endTime}` : "TBA");

  return (
    <motion.div
      ref={cardRef}
      className="flex-shrink-0 w-[340px] sm:w-[380px] h-[520px]"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        className="relative h-full rounded-3xl overflow-hidden backdrop-blur-md bg-black/50 border border-white/20 shadow-2xl cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{
            boxShadow: isHovered
              ? "0 0 40px rgba(255, 255, 255, 0.4), inset 0 0 40px rgba(255, 255, 255, 0.1)"
              : "0 0 0px rgba(255, 255, 255, 0)",
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Background image section */}
        <div className="relative h-[240px] overflow-hidden">
          <motion.img
            src={session.image}
            alt={session.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />

          {/* Floating time badge */}
          <motion.div
            className="absolute top-4 right-4 px-3 sm:px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            animate={{ y: isHovered ? -5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-['Michroma'] text-xs font-bold text-black tracking-wider">
              {displayTime}
            </span>
          </motion.div>

          {/* Category badge */}
          <div className="absolute bottom-4 left-4">
            <motion.div
              className="px-3 sm:px-4 py-1.5 rounded-full border border-white/30 bg-black/60 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <span className="font-['Michroma'] text-xs font-semibold text-white tracking-widest">
                {session.category}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Content section */}
        <div className="relative p-5 sm:p-6 space-y-4">
          <motion.div
            animate={{ y: isHovered ? -5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <h3 className="font-['Michroma'] text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
              {session.title}
            </h3>

            {/* Subtitle line */}
            <motion.div
              className="h-0.5 bg-gradient-to-r from-white via-gray-400 to-transparent mb-3"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />

            {/* Description */}
            <p className="font-['Michroma'] text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
              {session.description}
            </p>
          </motion.div>

          {/* Venue (replaces Speaker info if speaker not present) */}
          {(session.venue || session.speaker) && (
            <motion.div
              className="flex items-center gap-3 pt-2"
              animate={{ opacity: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center">
                <span className="font-['Michroma'] text-black font-bold text-sm">
                  {(session.speaker || session.venue || "X").charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-['Michroma'] text-white text-sm font-semibold">
                  {session.speaker || session.venue}
                </p>
                <p className="font-['Michroma'] text-gray-500 text-xs">
                  {session.role || "Venue"}
                </p>
              </div>
            </motion.div>
          )}

          {/* Learn more link */}
          <motion.div
            className="pt-3"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 text-white group-hover:text-gray-200 transition-colors">
              <span className="font-['Michroma'] text-xs sm:text-sm font-semibold tracking-wider">
                LEARN MORE
              </span>
              <motion.span
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-lg"
              >
                →
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Corner decorations */}
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-white/20 rounded-tr-3xl"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-white/20 rounded-bl-3xl"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default function Sessions() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const planetY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const planetRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const demoItems = [{ link: "#", text: "XPECTO", image: "" }];

  const [sessions, setSessions] = useState([]);
  const [groupedSessions, setGroupedSessions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpecto.org/api";

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/sessions`);
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const data = await response.json();

        if (data.success) {
          const defaultImages = [
            "./ai_session.png",
            "./blockchain_session.png",
            "./quantum_session.png",
            "./cyber_session.png",
            "./iot_session.png",
            "./sustainable_session.png",
          ];

          const transformedData = data.data.map((item) => {
            const randomImage =
              defaultImages[Math.floor(Math.random() * defaultImages.length)];
            return {
              ...item,
              image:
                item.image && item.image.length > 0
                  ? item.image[0]
                  : randomImage,
              category: item.club_name || item.company || "SESSION",
            };
          });
          setSessions(transformedData);

          // Group by Date
          const groups = {};
          // Sort by date first to ensure order is correct if backend didn't
          transformedData.sort((a, b) => new Date(a.date) - new Date(b.date));

          transformedData.forEach((session) => {
            const dateObj = new Date(session.date);
            if (isNaN(dateObj.getTime())) return;

            // Format: MARCH 14
            const dateKey = dateObj
              .toLocaleDateString("en-US", { month: "long", day: "numeric" })
              .toUpperCase();

            if (!groups[dateKey]) {
              groups[dateKey] = [];
            }
            groups[dateKey].push(session);
          });

          // If grouping failed (e.g. no valid dates), fallback
          if (Object.keys(groups).length === 0 && transformedData.length > 0) {
            groups["UPCOMING WORKSHOP"] = transformedData;
          }

          setGroupedSessions(groups);
        }
      } catch (err) {
        console.error("Error fetching workshops:", err);
        setError("Failed to load workshops. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen relative bg-black overflow-x-hidden"
    >
      {/* Fixed Background Section */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <div className="absolute inset-0">
          <OptimizedImage
            src="./bg3.png"
            alt="Background"
            className="w-full h-full object-cover"
            priority={false}
            skeleton={false}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Fixed Planet with Parallax */}
        <motion.div
          className="absolute top-1/2 right-[5%] sm:right-[10%] -translate-y-1/2 scale-75 sm:scale-90 lg:scale-100"
          style={{ y: planetY, rotate: planetRotate }}
        >
          <FloatingElement
            floatIntensity={50}
            duration={10}
            enableParallax={false}
          >
            <motion.img
              src="./blue_planet.png"
              alt="Planet"
              className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />
          </FloatingElement>
        </motion.div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="relative pt-24 sm:pt-32 lg:pt-40 pb-12 sm:pb-16 px-4 sm:px-6">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="inline-block mb-4 sm:mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="px-4 sm:px-6 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                <span className="font-['Michroma'] text-xs sm:text-sm text-white tracking-widest">
                  XPECTO'26 PRESENTS
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="font-['Michroma'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white mb-6 sm:mb-8 tracking-[0.15em] sm:tracking-[0.2em] leading-tight px-4 break-words"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              WORKSHOPS
            </motion.h1>

            <motion.div
              className="h-1 w-32 sm:w-48 mx-auto bg-gradient-to-r from-transparent via-white to-transparent mb-6 sm:mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            <motion.p
              className="font-['Michroma'] text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-300 tracking-wider max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Join industry experts and innovators in transformative discussions
            </motion.p>
          </motion.div>
        </div>

        {/* Scrollable Sessions Container */}
        <div className="relative px-4 sm:px-6 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-white text-lg sm:text-xl font-['Michroma'] animate-pulse">
                  Loading workshops...
                </div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-red-400 text-lg sm:text-xl font-['Michroma'] px-4 text-center">
                  {error}
                </div>
              </div>
            ) : Object.keys(groupedSessions).length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-400 text-lg sm:text-xl font-['Michroma']">
                  COMING SOON...
                </div>
              </div>
            ) : (
              Object.entries(groupedSessions).map(
                ([dateLabel, dateSessions], groupIndex) => (
                  <div className="mb-12 sm:mb-16" key={groupIndex}>
                    <motion.div
                      className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="px-4 sm:px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <span className="font-['Michroma'] text-xs sm:text-sm font-bold text-white tracking-widest">
                          {dateLabel}
                        </span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-white/50 to-transparent" />
                    </motion.div>

                    <div className="overflow-x-auto scrollbar-hide">
                      <div className="flex gap-4 sm:gap-6 pb-4 px-2">
                        {dateSessions.map((session, index) => (
                          <SessionCard
                            key={session._id || index}
                            session={session}
                            index={index}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              )
            )}
          </motion.div>
        </div>

        {/* Footer Section */}
        <motion.div
          className="relative py-16 sm:py-20 text-center border-t border-white/10 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-white" />
            <p className="font-['Michroma'] text-gray-400 text-xs sm:text-sm tracking-[0.3em]">
              XPECTO'26
            </p>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-white" />
          </motion.div>
          <p className="font-['Michroma'] text-gray-500 text-[10px] sm:text-xs tracking-widest">
            MARCH 14-16, 2026 • HIMALAYAS' BIGGEST TECHFEST
          </p>
        </motion.div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
