"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import OptimizedImage from "../components/ui/OptimizedImage";

// ─── Sponsor Data ─────────────────────────────────────────────────────────────
// NOTE: Update logo paths to match your actual file naming convention
const TIERS = [
  {
    key: "title",
    label: "Title Sponsor",
    accent: "#FFFFFF",
    cardBg: "rgba(255,255,255,0.05)",
    cardBgHover: "rgba(255,255,255,0.09)",
    borderColor: "rgba(255,255,255,0.16)",
    hoverBorder: "rgba(255,255,255,0.42)",
    // 1 col on mobile, 2 on sm — big cards
    gridCols: "grid-cols-1 sm:grid-cols-2",
    logoAspect: "aspect-[3/1.4]",
    sponsors: [
      { name: "Tiger Analytics", logo: "./logos/tiger-analytics.png" },
    ],
  },
  {
    key: "associate",
    label: "Associate Title Sponsor",
    accent: "#FFFFFF",
    cardBg: "rgba(255,255,255,0.04)",
    cardBgHover: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.14)",
    hoverBorder: "rgba(255,255,255,0.36)",
    gridCols: "grid-cols-2 sm:grid-cols-3",
    logoAspect: "aspect-[3/1.5]",
    sponsors: [
      { name: "Weilliptic", logo: "./logos/weilliptic.jpg" },
      { name: "Upstox", logo: "./logos/upstox.png" },
    ],
  },
  {
    key: "platinum",
    label: "Platinum Sponsor",
    accent: "#DCDCDC",
    cardBg: "rgba(220,220,220,0.04)",
    cardBgHover: "rgba(220,220,220,0.08)",
    borderColor: "rgba(220,220,220,0.13)",
    hoverBorder: "rgba(220,220,220,0.32)",
    gridCols: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
    logoAspect: "aspect-[3/1.6]",
    sponsors: [
      { name: "Inxiteout", logo: "./logos/inxiteout.jpg" },
      { name: "Road Safety", logo: "./logos/road-safety.png" },
    ],
  },
  {
    key: "gold",
    label: "Gold Sponsor",
    accent: "#C9A227",
    cardBg: "rgba(201,162,39,0.05)",
    cardBgHover: "rgba(201,162,39,0.10)",
    borderColor: "rgba(201,162,39,0.16)",
    hoverBorder: "rgba(201,162,39,0.42)",
    gridCols: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
    logoAspect: "aspect-[3/1.6]",
    sponsors: [
      { name: "ICICI", logo: "./logos/icici.png" },
      { name: "Siemens", logo: "./logos/siemens.png" },
      { name: "AbhiBus", logo: "./logos/abhibus.png" },
    ],
  },
  {
    key: "silver",
    label: "Silver Sponsor",
    accent: "#A8A9AD",
    cardBg: "rgba(168,169,173,0.04)",
    cardBgHover: "rgba(168,169,173,0.09)",
    borderColor: "rgba(168,169,173,0.14)",
    hoverBorder: "rgba(168,169,173,0.38)",
    gridCols: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    logoAspect: "aspect-[3/1.7]",
    sponsors: [
      { name: "SJVN", logo: "./logos/sjvn.png" },
      { name: "IT Bhawan Shimla", logo: "./logos/it-bhawan-shimla.png" },
      { name: "EaseMyTrip", logo: "./logos/easemytrip.jpg" },
      { name: "Krafton", logo: "./logos/krafton.png" },
      { name: "Chess.com", logo: "./logos/chess_com.png" },
      { name: "Goibibo", logo: "./logos/goibibo.png" },
    ],
  },
  {
    key: "bronze",
    label: "Bronze Sponsor",
    accent: "#CD7F32",
    cardBg: "rgba(205,127,50,0.04)",
    cardBgHover: "rgba(205,127,50,0.09)",
    borderColor: "rgba(205,127,50,0.14)",
    hoverBorder: "rgba(205,127,50,0.38)",
    gridCols: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    logoAspect: "aspect-[3/1.7]",
    sponsors: [
      { name: "BSE", logo: "./logos/bse.png" },
      { name: "Athea", logo: "./logos/athea.jpg" },
      { name: "Nodwin", logo: "./logos/nodwin.png" },
      { name: "Edufab", logo: "./logos/edufab.png" },
      { name: "Trip24x7", logo: "./logos/trip24x7.png" },
      { name: "Umeed", logo: "./logos/umeed.png" },
    ],
  },
  {
    key: "others",
    label: "Community Partners",
    accent: "rgba(255,255,255,0.45)",
    cardBg: "rgba(255,255,255,0.03)",
    cardBgHover: "rgba(255,255,255,0.07)",
    borderColor: "rgba(255,255,255,0.08)",
    hoverBorder: "rgba(255,255,255,0.22)",
    gridCols: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
    logoAspect: "aspect-[3/1.8]",
    sponsors: [
      { name: "Campa Sure", logo: "./logos/campa-sure.png" },
      { name: "Belgian Waffle", logo: "./logos/belgian-waffle.png" },
      { name: "IGDC", logo: "./logos/igdc.png" },
      { name: "Piyos", logo: "./logos/piyos.png" },
      { name: "StockEdge", logo: "./logos/stockedge.png" },
      { name: "MetaNova", logo: "./logos/metanova.jpg" },
      { name: "Jio Saavan", logo: "./logos/jio-saavan.png" },
      { name: "Gautam Builders", logo: "./logos/gautam-builders.png" },
      { name: "AVP Web Solutions", logo: "./logos/avp-web-solutions.jpg" },
      { name: "Enerzal", logo: "./logos/enerzal.png" },
      { name: "Flixbus", logo: "./logos/flixbus.png" },
      { name: "Quantinsti", logo: "./logos/quantinsti.jpg" },
      { name: "Unstop", logo: "./logos/unstop.png" },
    ],
  },
];

// ─── Sponsor Card ─────────────────────────────────────────────────────────────
const SponsorCard = ({ sponsor, tier, index }) => {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="flex flex-col rounded-xl overflow-hidden cursor-default"
      style={{
        background: hovered ? tier.cardBgHover : tier.cardBg,
        border: `1px solid ${hovered ? tier.hoverBorder : tier.borderColor}`,
        backdropFilter: "blur(10px)",
        transition: "background 0.2s ease, border-color 0.2s ease",
      }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.36, delay: Math.min(index * 0.045, 0.35) }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
    >
      {/* Logo area */}
      <div
        className={`w-full ${tier.logoAspect} flex items-center justify-center p-5`}
        style={{
          borderBottom: `1px solid ${hovered ? tier.hoverBorder : tier.borderColor}`,
          transition: "border-color 0.2s ease",
        }}
      >
        {!imgError ? (
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="w-full h-full object-contain"
            style={{
              filter: hovered
                ? "brightness(1.08) saturate(1.05)"
                : "brightness(0.82) saturate(0.85)",
              transition: "filter 0.2s ease",
            }}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          // Fallback when image not found
          <span
            className="font-['Michroma'] text-sm font-semibold tracking-wider text-center leading-snug px-2"
            style={{ color: tier.accent }}
          >
            {sponsor.name}
          </span>
        )}
      </div>

      {/* Name label */}
      <div className="px-4 py-3">
        <p
          className="font-['Michroma'] text-[10px] tracking-[0.2em] leading-tight"
          style={{ color: tier.accent, opacity: hovered ? 0.75 : 0.45 }}
        >
          {sponsor.name.toUpperCase()}
        </p>
      </div>
    </motion.div>
  );
};

// ─── Tier Section ─────────────────────────────────────────────────────────────
const TierRow = ({ tier, sectionIndex }) => {
  if (!tier.sponsors || tier.sponsors.length === 0) return null;

  return (
    <motion.div
      className="mb-14"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: sectionIndex * 0.04 }}
    >
      {/* Header */}
      <div className="flex items-center gap-5 mb-6">
        <div className="shrink-0">
          <span
            className="font-['Michroma'] text-[9px] tracking-[0.38em] block mb-0.5"
            style={{ color: tier.accent, opacity: 0.40 }}
          >
            {tier.key === "others" ? "PARTNER" : tier.key.toUpperCase()}
          </span>
          <h3
            className="font-['Michroma'] text-lg md:text-xl font-light tracking-wide whitespace-nowrap"
            style={{ color: tier.accent }}
          >
            {tier.label}
          </h3>
        </div>

        <div
          className="flex-1 h-px mt-4"
          style={{ background: tier.borderColor }}
        />

        <span
          className="font-['Michroma'] text-xs mt-4 tabular-nums shrink-0"
          style={{ color: tier.accent, opacity: 0.28 }}
        >
          {tier.sponsors.length.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Grid */}
      <div className={`grid ${tier.gridCols} gap-3 md:gap-4`}>
        {tier.sponsors.map((sponsor, i) => (
          <SponsorCard
            key={sponsor.name}
            sponsor={sponsor}
            tier={tier}
            index={i}
          />
        ))}
      </div>
    </motion.div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Sponsors() {
  return (
    <div className="w-full min-h-screen relative bg-[#050508]">

      {/* ── Fixed Background ── */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src="./bg2.png"
            alt="Background"
            className="w-full h-full object-cover"
            priority={false}
            skeleton={false}
          />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.80)" }}
          />
        </div>

        {/* Planet — bottom-right, fully contained */}
        <motion.div
          className="absolute"
          style={{
            bottom: "-8%",
            right: "-5%",
            width: "min(36vw, 480px)",
            height: "min(36vw, 480px)",
            pointerEvents: "none",
          }}
          animate={{ y: [0, -14, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src="./red_planet.png"
            alt=""
            className="w-full h-full object-contain"
            style={{ opacity: 0.38 }}
          />
        </motion.div>

        {/* Planet — top-left, faint accent */}
        <motion.div
          className="absolute"
          style={{
            top: "-10%",
            left: "-7%",
            width: "min(22vw, 300px)",
            height: "min(22vw, 300px)",
            pointerEvents: "none",
          }}
          animate={{ y: [0, 10, 0], rotate: [0, 7, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src="./red_planet.png"
            alt=""
            className="w-full h-full object-contain"
            style={{ opacity: 0.11 }}
          />
        </motion.div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="relative z-10">

        {/* ── Header ── */}
        <div className="max-w-6xl mx-auto px-6 md:px-10 pt-36 pb-14">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            {/* Eyebrow pill */}
            <motion.div
              className="inline-flex items-center mb-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div
                className="px-5 py-1.5 rounded-full"
                style={{
                  border: "1px solid rgba(255,255,255,0.20)",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="font-['Michroma'] text-xs text-white/55 tracking-[0.3em]">
                  XPECTO'26
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="font-['Michroma'] font-light text-white tracking-[0.12em] leading-none mb-5"
              style={{ fontSize: "clamp(2.6rem, 6.5vw, 5.2rem)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.85 }}
            >
              OUR SPONSORS
            </motion.h1>

            {/* Divider */}
            <motion.div
              className="h-px w-full mb-7"
              style={{ background: "rgba(255,255,255,0.11)", originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.44, duration: 0.9 }}
            />

            {/* Sub-copy + stats */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <p
                className="font-['Michroma'] text-sm leading-relaxed max-w-sm"
                style={{ color: "rgba(255,255,255,0.36)" }}
              >
                The companies and organisations powering<br />
                India's biggest Himalayan Tech Fest.
              </p>
              <div className="flex items-center gap-8 shrink-0">
                {[
                  { v: "30+", l: "Sponsors" },
                  { v: "7", l: "Tiers" },
                  { v: "3", l: "Days" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="font-['Michroma'] text-2xl font-light text-white">
                      {s.v}
                    </p>
                    <p
                      className="font-['Michroma'] text-[9px] tracking-[0.3em] mt-0.5"
                      style={{ color: "rgba(255,255,255,0.26)" }}
                    >
                      {s.l.toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Sponsor Tiers ── */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 pb-10">
          <div
            className="w-full h-px mb-14"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
          {TIERS.map((tier, i) => (
            <TierRow key={tier.key} tier={tier} sectionIndex={i} />
          ))}
        </section>

        {/* ── Become a Sponsor CTA ── */}
        <motion.section
          className="max-w-6xl mx-auto px-6 md:px-10 pb-24"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="rounded-2xl px-8 md:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div>
              <p
                className="font-['Michroma'] text-[9px] tracking-[0.38em] mb-2"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                PARTNERSHIP OPPORTUNITIES
              </p>
              <h3 className="font-['Michroma'] text-xl font-light text-white tracking-wide mb-2">
                Become a Sponsor
              </h3>
              <p
                className="font-['Michroma'] text-sm leading-relaxed max-w-md"
                style={{ color: "rgba(255,255,255,0.34)" }}
              >
                Partner with IIT Mandi's premier tech festival and reach
                10,000+ students, innovators, and industry leaders.
              </p>
            </div>
            <a href="mailto:publicity@xpecto.org" className="shrink-0">
              <motion.div
                className="inline-flex items-center gap-3 px-7 py-3 rounded-xl font-['Michroma'] text-xs font-bold tracking-[0.2em] text-white"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.16)",
                }}
                whileHover={{ background: "rgba(255,255,255,0.11)", scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18 }}
              >
                GET IN TOUCH
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.div>
            </a>
          </div>
        </motion.section>

        {/* ── Footer ── */}
        <motion.div
          className="relative py-16 text-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-px w-12" style={{ background: "rgba(255,255,255,0.16)" }} />
            <p
              className="font-['Michroma'] text-sm tracking-[0.3em]"
              style={{ color: "rgba(255,255,255,0.30)" }}
            >
              XPECTO'26
            </p>
            <div className="h-px w-12" style={{ background: "rgba(255,255,255,0.16)" }} />
          </div>
          <p
            className="font-['Michroma'] text-xs tracking-widest mb-8"
            style={{ color: "rgba(255,255,255,0.17)" }}
          >
            MARCH 14-16, 2026 • HIMALAYAS' BIGGEST TECHFEST
          </p>

          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <p
                className="font-['Michroma'] text-sm"
                style={{ color: "rgba(255,255,255,0.17)" }}
              >
                © 2026 Xpecto, IIT Mandi
              </p>
              <div className="flex items-center gap-6">
                {[
                  { label: "Tech Support", href: "mailto:tech@xpecto.org" },
                  {
                    label: "Instagram",
                    href: "https://instagram.com/xpecto_iitmandi",
                    external: true,
                  },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="font-['Michroma'] text-sm"
                    style={{ color: "rgba(255,255,255,0.17)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.50)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.17)")
                    }
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div
              className="flex items-center justify-center gap-6 pt-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              {[
                { label: "Terms of Service", href: "/terms-of-service" },
                { label: "Privacy Policy", href: "/privacy-policy" },
              ].map((l, i, arr) => (
                <span key={l.label} className="flex items-center gap-6">
                  <a
                    href={l.href}
                    className="font-['Michroma'] text-xs"
                    style={{ color: "rgba(255,255,255,0.17)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.45)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.17)")
                    }
                  >
                    {l.label}
                  </a>
                  {i < arr.length - 1 && (
                    <span style={{ color: "rgba(255,255,255,0.11)" }}>•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}