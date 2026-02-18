"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { BackgroundRippleEffect } from "../components/ui/BackgroundRippleEffect";
import FlowingMenu from "../components/ui/FlowingMenu";
import ParticleBackground from "../components/ui/ParticleBackground";
import MagneticButton from "../components/ui/MagneticButton";
import FloatingElement from "../components/ui/FloatingElement";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import OptimizedImage from "../components/ui/OptimizedImage";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const eventDate = new Date(2026, 2, 14, 0, 0, 0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const demoItems = [
    {
      link: "#",
      text: isAuthenticated ? "XPECTO" : "LOGIN TO BE COOL",
      image: "./logo.png",
    },
  ];

  // Marquee text based on authentication status
  const marqueeText = isAuthenticated ? "XPECTO" : "LOGIN TO BE COOL";
  const marqueeItems = Array(20).fill(marqueeText);

  return (
    <div className="w-full min-h-screen relative">
      <div className="w-full h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src="./bg.png"
            alt="Background"
            className="w-full h-full object-cover"
            priority={true}
            skeleton={false}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative h-15 z-50">
          <FlowingMenu items={demoItems} />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] z-10 scale-[1.8] xs:scale-[1.1] sm:scale-100 md:scale-100 lg:scale-100">
          <FloatingElement
            floatIntensity={50}
            duration={8}
            enableParallax={false}
          >
            <motion.img
              src="./home_planet.png"
              alt="Planet"
              className="w-full h-full object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />
          </FloatingElement>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] flex flex-col items-center text-center z-20">
          <div
            className="flex w-280 h-63.75 justify-start items-center font-['Michroma'] mb-2 text-[84px] font-light leading-[119.438px] text-white tracking-[120px] text-left z-13 scale-[0.25] xs:scale-[0.35] sm:scale-50 md:scale-75 lg:scale-90 xl:scale-100"
            shimmerWidth="300px"
            shimmerColor="rgba(255, 255, 255, 0.9)"
            duration={4}
          >
            XPECTO
          </div>

          <motion.span
            className="flex w-232.5 h-8.5 justify-center items-center font-['Michroma'] text-[24px] font-bold leading-[32.813px] text-white mt-2 mb-10 text-center whitespace-nowrap z-11 scale-[0.4] xs:scale-[0.5] sm:scale-[0.65] md:scale-[0.8] lg:scale-90 xl:scale-100"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              type: "spring",
              stiffness: 100,
            }}
          >
            BIGGEST TECHFEST OF HIMALAYAS
          </motion.span>

          <motion.div
            className="mt-2 z-20 scale-[0.5] xs:scale-[0.6] sm:scale-[0.7] md:scale-[0.85] lg:scale-95 xl:scale-100"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="mt-2 flex gap-6 justify-center items-center mb-5">
              <AnimatedCounter value={timeLeft.days} label="DAYS" />
              <AnimatedCounter value={timeLeft.hours} label="HOURS" />
              <AnimatedCounter value={timeLeft.minutes} label="MINUTES" />
              <AnimatedCounter value={timeLeft.seconds} label="SECONDS" />
            </div>
            <motion.div
              className="text-center mb-5 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <p className="font-['Michroma'] text-lg font-bold text-white/90 tracking-widest">
                MARCH 14-16, 2026
              </p>
            </motion.div>

            <motion.div
              className="flex justify-center mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.7 }}
            >
              <MagneticButton magnetStrength={0.3}>
                <a href="/events">LEARN MORE</a>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
