import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';
import UserProfile from './UserProfile';

// Xpecto Space-Themed Homepage (single-file React component)
// Usage: Place this component in src/components/XpectoHome.jsx and import into App.js
// Make sure Tailwind CSS is configured and `src/index.css` is imported in your app.

export default function XpectoHome() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden text-white font-sans bg-black">
      {/* background nebula gradient + subtle noise */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 10% 15%, rgba(88, 28, 135, 0.55), transparent 10%), radial-gradient(ellipse at 90% 85%, rgba(16, 185, 129, 0.20), transparent 12%), linear-gradient(180deg, rgba(6,6,23,0.96), rgba(2,6,23,0.9))',
          mixBlendMode: 'screen',
        }}
      />

      {/* animated stars layer */}
      <div className="absolute inset-0 -z-5 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          {/* Many tiny stars (CSS animation will move the whole svg for parallax) */}
          {[...Array(60)].map((_, i) => {
            const cx = Math.random() * 100;
            const cy = Math.random() * 100;
            const r = Math.random() * 1.6 + 0.2;
            const opacity = Math.random() * 0.9 + 0.1;
            return <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r={r} fill={`rgba(255,255,255,${opacity})`} />;
          })}
        </svg>
      </div>

      {/* glowing rings / planets */}
      <div className="absolute -right-32 top-12 transform rotate-12 opacity-70">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-500/40 to-indigo-600/20 blur-3xl animate-blob" />
      </div>
      <div className="absolute left-8 bottom-6 opacity-75">
        <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-rose-400/30 to-yellow-400/10 blur-2xl animate-blob animation-delay-2000" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-400 to-cyan-400 shadow-2xl glass-blur">
            <span className="font-extrabold tracking-tight text-black">XP</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Xpecto</h1>
            <p className="text-xs text-slate-300">Expect the unexpected — Space Techfest</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <a className="hover:text-white transition">Home</a>
          <a className="hover:text-white transition">Events</a>
          <a className="hover:text-white transition">Workshops</a>
          <a className="hover:text-white transition">Sponsors</a>
          {!loading && (
            isAuthenticated ? (
              <UserProfile />
            ) : (
              <GoogleLoginButton className="ml-2" />
            )
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 px-8 md:px-20 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <section>
            <motion.h2
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-extrabold leading-tight"
            >
              Xpecto — <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-violet-400">A Voyage into Space</span>
            </motion.h2>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="mt-6 text-slate-300 max-w-xl"
            >
              Join IIT Mandi's flagship techfest where cosmic curiosity meets cutting-edge tech. Workshops, star-gazing, rocket demos, hackathons and more — crafted for the dreamers and builders.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.25 }}
              className="mt-8 flex gap-4"
            >
              <a className="inline-flex items-center gap-3 rounded-full px-5 py-3 bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-semibold shadow-xl hover:scale-105 transform transition">Explore Events</a>
              <a className="inline-flex items-center gap-3 rounded-full px-5 py-3 border border-slate-700 text-slate-200 hover:border-slate-500 transition">Volunteer</a>
            </motion.div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              <div className="p-4 bg-white/3 rounded-xl backdrop-blur-sm border border-white/10">
                <h3 className="text-2xl font-bold">120+</h3>
                <p className="text-xs text-slate-300">Events & Workshops</p>
              </div>
              <div className="p-4 bg-white/3 rounded-xl backdrop-blur-sm border border-white/10">
                <h3 className="text-2xl font-bold">30+</h3>
                <p className="text-xs text-slate-300">Teams from across India</p>
              </div>
              <div className="p-4 bg-white/3 rounded-xl backdrop-blur-sm border border-white/10">
                <h3 className="text-2xl font-bold">3</h3>
                <p className="text-xs text-slate-300">Days of cosmic madness</p>
              </div>
            </div>
          </section>

          <section className="relative flex items-center justify-center">
            {/* stylized rocket / planet card */}
            <div className="w-full max-w-md p-6 rounded-3xl glass border border-white/10 shadow-2xl">
              <div className="relative h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="lg" x1="0" x2="1">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>

                  {/* planet */}
                  <circle cx="60" cy="80" r="48" fill="url(#lg)" opacity="0.95" />

                  {/* ring */}
                  <ellipse cx="62" cy="100" rx="72" ry="18" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" transform="rotate(-18 62 100)" />

                  {/* rocket (simple) */}
                  <g transform="translate(120,60)">
                    <rect x="-12" y="-28" width="24" height="56" rx="6" fill="#fff" opacity="0.95" />
                    <polygon points="-12,-28 12,-28 0,-48" fill="#f97316" />
                    <circle cx="0" cy="0" r="8" fill="#111827" />
                  </g>
                </svg>

                {/* small badges */}
                <div className="absolute -left-6 -top-6 p-3 rounded-full bg-gradient-to-r from-yellow-400 to-rose-400 text-black font-bold shadow-md">Live</div>
                <div className="absolute -right-6 -bottom-6 p-3 rounded-full bg-white/8 text-white font-semibold">Nov 10 - 12</div>
              </div>

              <div className="mt-6">
                <h4 className="text-xl font-bold">Stargazers Hack</h4>
                <p className="text-sm text-slate-300 mt-2">Build satellite-sim apps, data-visualisation, and ML models inspired by space telescopes.</p>
                <div className="mt-4 flex items-center gap-3">
                  <button className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 font-semibold">Register Team</button>
                  <a className="text-sm text-slate-300">Learn more →</a>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* quick links / CTA bar */}
        <div className="mt-12 rounded-2xl bg-white/3 border border-white/10 p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <strong className="block">Early bird registration open</strong>
            <span className="text-sm text-slate-300">Get priority seats for workshops and free swag.</span>
          </div>
          <div className="flex gap-3">
            <button className="rounded-full px-4 py-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-semibold">Register Now</button>
            <button className="rounded-full px-4 py-2 border border-white/10 text-slate-200">Event Schedule</button>
          </div>
        </div>

        {/* Features / Sections */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Workshops', desc: 'Hands-on with rockets, drones, and satellite datasets.' },
            { title: 'Talks', desc: 'Research talks by industry and academia.' },
            { title: 'Exhibitions', desc: 'Robotics, AR/VR, and galactic art.' },
          ].map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/2 border border-white/6">
              <h5 className="text-xl font-bold">{f.title}</h5>
              <p className="mt-2 text-slate-300 text-sm">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Footer CTA */}
        <footer className="mt-20 mb-12">
          <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900/70 to-transparent border border-white/6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-2xl font-bold">Ready to launch?</h4>
              <p className="text-slate-300">Reserve your spot and be a part of Xpecto's cosmic story.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-black font-semibold">Register</button>
              <button className="px-5 py-3 rounded-full border border-white/10 text-slate-200">Contact</button>
            </div>
          </div>
        </footer>
      </main>

      {/* small corner credits */}
      <div className="absolute left-6 bottom-4 text-xs text-slate-400">Designed with ⭐ by Xpecto Web Team</div>

      {/* Inline styles for animations (Tailwind + small custom keyframes) */}
      <style>{`
        .animate-blob{animation: blob 8s infinite;}
        .animation-delay-2000{animation-delay:2s}
        @keyframes blob{
          0%{transform:scale(1) translateY(0)}
          33%{transform:scale(1.12) translateY(-8px)}
          66%{transform:scale(0.96) translateY(6px)}
          100%{transform:scale(1) translateY(0)}
        }

        .glass{background:linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); backdrop-filter: blur(6px);}

        /* subtle parallax star motion */
        @keyframes starTilt{
          from{transform:translateY(0)}
          to{transform:translateY(-8px)}
        }
        svg{animation:starTilt 12s linear infinite alternate}

        /* responsive clean-up */
        @media (max-width:640px){
          h2{font-size:2rem}
        }
      `}</style>
    </div>
  );
}
