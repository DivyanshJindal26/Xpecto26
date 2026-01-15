import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ExternalLink, Zap, Hexagon, Star, Rocket, Trophy } from 'lucide-react';

// --- 1. MOCK DATA (Hierarchy) ---
const sponsors = {
  title: {
    name: "GOOGLE CLOUD",
    tier: "TITLE SPONSOR",
    desc: "Powering the XPECTO infrastructure.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/2560px-Google_Cloud_logo.svg.png",
    color: "#4285F4",
    link: "https://cloud.google.com"
  },
  platinum: [
    { name: "NVIDIA", image: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg", color: "#76B900" },
    { name: "RED BULL", image: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/RedBullEnergyDrink.svg/1200px-RedBullEnergyDrink.svg.png", color: "#FFCC00" },
  ],
  gold: [
    { name: "GITHUB", image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg", color: "#ffffff" },
    { name: "DEV.TO", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Dev_logo.png/1600px-Dev_logo.png", color: "#000000" },
    { name: "POLYGON", image: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Polygon_Blockchain_Matic_Logo.svg", color: "#8247E5" },
  ],
  silver: [
    { name: "DigitalOcean" }, { name: "Auth0" }, { name: "Twilio" }, { name: "Postman" }
  ],
  bronze: [
    { name: "Taskade" }, { name: "Echo3D" }, { name: "XYZ Domains" }, { name: "Wolfram" }, { name: "Axure" }
  ]
};

// --- 2. SUB-COMPONENTS ---

// A. Background Starfield
const SpaceBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-[#050505]">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#000000] to-[#000000]"></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
    {/* Twinkling Stars */}
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white rounded-full"
        initial={{ opacity: 0.1, scale: 0.5 }}
        animate={{ opacity: [0.1, 1, 0.1], scale: [0.5, 1.5, 0.5] }}
        transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: Math.random() * 2 + 1 + 'px',
          height: Math.random() * 2 + 1 + 'px',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
        }}
      />
    ))}
  </div>
);

// B. Section Title
const TierHeader = ({ title, icon: Icon, color = "text-white" }) => (
  <div className="flex items-center gap-4 justify-center mb-12 mt-20">
    <div className="h-[1px] w-12 md:w-32 bg-gradient-to-r from-transparent to-white/30"></div>
    <div className={`flex items-center gap-2 border border-white/10 bg-white/5 px-6 py-2 rounded-full backdrop-blur-md ${color}`}>
      <Icon size={18} />
      <span className="font-['Orbitron'] tracking-[0.2em] text-lg font-bold uppercase">{title}</span>
    </div>
    <div className="h-[1px] w-12 md:w-32 bg-gradient-to-l from-transparent to-white/30"></div>
  </div>
);

// --- 3. MAIN COMPONENT ---
const SponsorsPage = () => {
  return (
    <div className="relative min-h-screen text-white font-['Montserrat'] overflow-x-hidden selection:bg-blue-500/30">
      <SpaceBackground />
      
      {/* SCROLLABLE CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 flex flex-col items-center">
        
        {/* --- HEADER IDENTITY --- */}
        <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1 }}
            className="text-center mb-16"
        >
            <h1 className="text-6xl md:text-8xl font-black font-['Orbitron'] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                XPECTO
            </h1>
            <p className="text-blue-400 font-mono tracking-[0.3em] text-sm md:text-base mt-4 uppercase animate-pulse">
                Initiating Sponsorship Protocols...
            </p>
        </motion.div>

        {/* --- TITLE SPONSOR (The Core) --- */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl relative group"
        >
          {/* Glowing Backlight */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-1000 animate-tilt"></div>
          
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-16 flex flex-col items-center text-center overflow-hidden">
             {/* Tech Grid Background */}
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
             
             <div className="inline-flex items-center gap-2 mb-6 text-cyan-400 border border-cyan-500/30 bg-cyan-900/10 px-4 py-1 rounded-full text-xs font-mono tracking-widest">
                <Zap size={12} fill="currentColor" /> POWERED BY
             </div>

             <img src={sponsors.title.image} alt={sponsors.title.name} className="h-24 md:h-32 object-contain mb-8 z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
             
             <h2 className="text-3xl md:text-5xl font-bold font-['Orbitron'] mb-4 z-10">{sponsors.title.name}</h2>
             <p className="text-gray-400 max-w-lg mx-auto mb-8 z-10">{sponsors.title.desc}</p>
             
             <a href={sponsors.title.link} target="_blank" rel="noreferrer" className="z-10 px-8 py-3 bg-white text-black font-bold rounded hover:bg-cyan-50 transition flex items-center gap-2">
                VISIT SITE <ExternalLink size={16} />
             </a>
          </div>
        </motion.div>

        {/* --- PLATINUM TIER --- */}
        <TierHeader title="Platinum Partners" icon={Trophy} color="text-yellow-100" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
            {sponsors.platinum.map((sponsor, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="relative group h-48 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center overflow-hidden hover:bg-white/10 transition-all duration-300"
                >
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                        <Star size={16} className="text-yellow-400" fill="currentColor"/>
                    </div>
                    {/* Placeholder Logic for Image vs Text */}
                    {sponsor.image ? (
                        <img src={sponsor.image} alt={sponsor.name} className="h-16 md:h-20 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                    ) : (
                        <h3 className="text-2xl font-bold font-['Orbitron']">{sponsor.name}</h3>
                    )}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-xl transition-colors"></div>
                </motion.div>
            ))}
        </div>

        {/* --- GOLD TIER --- */}
        <TierHeader title="Gold Sponsors" icon={Hexagon} color="text-yellow-500" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {sponsors.gold.map((sponsor, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="group h-40 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-lg flex items-center justify-center relative hover:-translate-y-1 transition-transform"
                >
                     {/* Corner Accents */}
                     <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-yellow-500/50"></div>
                     <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-yellow-500/50"></div>

                    {sponsor.image ? (
                        <img src={sponsor.image} alt={sponsor.name} className="h-12 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                    ) : (
                        <span className="font-bold">{sponsor.name}</span>
                    )}
                </motion.div>
            ))}
        </div>

        {/* --- SILVER & BRONZE (Grid Clusters) --- */}
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 mt-12">
            
            {/* SILVER */}
            <div>
                <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
                    <ShieldCheck className="text-gray-400" />
                    <h3 className="font-['Orbitron'] text-xl text-gray-300 tracking-widest">SILVER</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {sponsors.silver.map((s, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.05 }} className="h-20 bg-white/5 border border-white/5 rounded flex items-center justify-center hover:bg-white/10 hover:border-gray-400/30 transition-colors">
                            <span className="font-mono text-sm text-gray-400 font-bold">{s.name}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* BRONZE */}
            <div>
                 <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
                    <Rocket className="text-orange-700" />
                    <h3 className="font-['Orbitron'] text-xl text-orange-700/80 tracking-widest">BRONZE</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {sponsors.bronze.map((s, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.05 }} className="h-20 bg-black/40 border border-white/5 rounded flex items-center justify-center hover:border-orange-900/50 transition-colors">
                            <span className="font-mono text-xs text-gray-500">{s.name}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>

        {/* FOOTER CALL TO ACTION */}
        <div className="mt-32 mb-12 text-center">
            <p className="text-gray-500 text-sm font-mono mb-4">WANT TO JOIN THE MISSION?</p>
            <button className="px-8 py-4 border border-white/20 rounded-none bg-transparent hover:bg-white hover:text-black transition-all duration-300 tracking-[0.2em] font-bold text-xs uppercase">
                Become a Sponsor
            </button>
        </div>

      </div>
    </div>
  );
};

export default SponsorsPage;