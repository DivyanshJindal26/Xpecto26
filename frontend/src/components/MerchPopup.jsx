"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function MerchPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="merch-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            key="merch-card"
            initial={{ opacity: 0, scale: 0.88, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.45, type: "spring", stiffness: 120, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(139,92,246,0.25)]"
            style={{ background: "linear-gradient(145deg, #0d0015 0%, #0a0010 60%, #110020 100%)" }}
          >
            {/* Top glow bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

            {/* Corner accent sparks */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-purple-700/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-violet-800/15 blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-colors duration-200 cursor-pointer"
              aria-label="Close"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white/70"
              >
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="p-7 pt-8">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 bg-purple-600/25 border border-purple-500/40 text-purple-300 text-[10px] font-['Michroma'] tracking-widest px-3 py-1 rounded-full uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse inline-block" />
                  Limited Time
                </span>
              </div>

              {/* Title */}
              <h2 className="font-['Michroma'] text-white text-xl sm:text-2xl font-bold tracking-wide leading-tight mb-1">
                XPECTO 2026
              </h2>
              <h2 className="font-['Michroma'] text-transparent text-xl sm:text-2xl font-bold tracking-wide leading-tight mb-4"
                style={{ backgroundImage: "linear-gradient(90deg, #a855f7, #818cf8, #c084fc)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>
                OFFICIAL MERCH ⚡
              </h2>

              {/* Tagline */}
              <p className="text-white/70 text-sm leading-relaxed mb-5 font-light">
                Fest aa rahe ho… but swag bina? <span className="text-white font-medium">Not happening.</span><br />
                This year we're bringing premium, original, not-copied drip — made for the real Xpecto vibe.
              </p>

              {/* Merch list */}
              <div className="mb-5">
                <p className="font-['Michroma'] text-[10px] tracking-widest text-purple-400 uppercase mb-3">
                  Available Merch
                </p>
                <ul className="space-y-2">
                  {[
                    "Oversized Zipper Hoodie",
                    "Oversized Acid Wash Tee",
                    "Regular Zipper Jacket",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/85 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vibe line */}
              <p className="text-white/55 text-xs leading-relaxed mb-5 italic">
                Clean fits. Better fabric. Proper premium feel. Not cheap. Not basic.&nbsp;
                <span className="text-white/80 not-italic font-medium">Pure Xpecto energy. ⚡</span>
              </p>

              {/* Info strip */}
              <div className="rounded-xl bg-white/5 border border-white/8 px-4 py-3 mb-6 space-y-1.5">
                <p className="text-[11px] text-white/60">
                  <span className="text-purple-400 font-['Michroma'] tracking-wider text-[10px] uppercase mr-2">Delivery</span>
                  Collect at IIT Mandi during Xpecto 2026 (14–16 March 2026)
                </p>
                <p className="text-[11px] text-white/60">
                  <span className="text-purple-400 font-['Michroma'] tracking-wider text-[10px] uppercase mr-2">Deadline</span>
                  Fill the form before{" "}
                  <span className="text-white font-semibold">28 Feb</span>
                  {" "}— prices increase during fest dates, so lock early.
                </p>
              </div>

              {/* CTA */}
              <a
                href="http://forms.gle/FSdF9TVFnokBydJ47"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="block w-full text-center py-3.5 rounded-xl font-['Michroma'] text-sm tracking-widest text-white font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(90deg, #7c3aed, #6d28d9, #8b5cf6)",
                  boxShadow: "0 0 20px rgba(124,58,237,0.5)",
                }}
              >
                FILL THE FORM NOW
              </a>

              <p className="text-center text-white/30 text-[10px] mt-4 font-['Michroma'] tracking-widest">
                WEAR THE FEST. OWN THE VIBE.
              </p>
            </div>

            {/* Bottom glow bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-700/60 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
