// --- REALISTIC "IRIS" BLACK HOLE COMPONENT ---
const CinematicEventHorizon = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
      
      {/* 1. BACKGROUND NOISE (Film Grain) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0 mix-blend-overlay">
        <svg className="w-full h-full">
            <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* 2. THE ACCRETION DISK (The "Hair" Texture) */}
      {/* We layer multiple spinning rings with conic gradients to create the fibrous look */}
      
      {/* Outer Faint Wisps */}
      <div className="absolute w-[180vw] h-[180vw] md:w-[1200px] md:h-[1200px] rounded-full animate-spin-very-slow opacity-20 z-10">
         <div className="w-full h-full rounded-full bg-[repeating-conic-gradient(transparent_0deg,transparent_2deg,white_2.1deg,transparent_2.2deg)] mask-radial-fade"></div>
      </div>

      {/* Mid Layer - The Main Swirl */}
      <div className="absolute w-[120vw] h-[120vw] md:w-[800px] md:h-[800px] rounded-full animate-spin-slow opacity-40 z-10 mix-blend-screen">
         <div className="w-full h-full rounded-full bg-[repeating-conic-gradient(#000_0deg,#000_4deg,#444_4.1deg,#fff_4.2deg,#000_4.5deg)] blur-[1px] mask-radial-fade"></div>
      </div>

      {/* Inner Fast Layer - Sharp details */}
      <div className="absolute w-[90vw] h-[90vw] md:w-[600px] md:h-[600px] rounded-full animate-spin-medium opacity-60 z-10">
         <div className="w-full h-full rounded-full bg-[repeating-conic-gradient(transparent_0deg,transparent_1deg,white_1.1deg,transparent_1.3deg)] mask-radial-fade"></div>
      </div>

      {/* 3. THE EVENT HORIZON (The Absolute Void) */}
      <div className="absolute z-20 flex items-center justify-center">
         {/* The Photon Ring (Glowing Edge) */}
         <div className="w-[42vw] h-[42vw] md:w-[320px] md:h-[320px] rounded-full bg-white blur-[20px] opacity-30 animate-pulse-fast"></div>
         
         {/* The Black Hole Itself */}
         <div className="absolute w-[40vw] h-[40vw] md:w-[300px] md:h-[300px] bg-black rounded-full shadow-[0_0_100px_rgba(0,0,0,1)] scale-100 ring-1 ring-white/10 z-20"></div>
      </div>

      {/* 4. THE TEXT (Floating in the Void) */}
      <div className="absolute z-30 flex items-center justify-center">
        <h1 className="xpecto-text text-[12vw] md:text-[140px] font-black font-['Orbitron'] tracking-tighter text-white/90 mix-blend-exclusion">
          XPECTO
        </h1>
      </div>

      {/* 5. GRAVITATIONAL DISTORTION OVERLAY */}
      {/* This creates the subtle "sucking" warp over the text without moving the DOM element */}
      <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="w-[45vw] h-[45vw] md:w-[350px] md:h-[350px] rounded-full backdrop-blur-[2px] backdrop-brightness-125 mix-blend-overlay opacity-50 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]"></div>
      </div>

      <style jsx>{`
        /* Custom Mask to fade edges of the swirls */
        .mask-radial-fade {
            mask-image: radial-gradient(circle, transparent 25%, black 40%, black 60%, transparent 80%);
            -webkit-mask-image: radial-gradient(circle, transparent 25%, black 40%, black 60%, transparent 80%);
        }

        /* The Text Animation: "Breathing" under gravity */
        .xpecto-text {
            animation: gravity-squeeze 8s ease-in-out infinite;
            text-shadow: 0 0 30px rgba(255,255,255,0.2);
        }

        @keyframes gravity-squeeze {
            0%, 100% { 
                transform: scale(1); 
                letter-spacing: -0.05em;
                opacity: 0.9;
            }
            50% { 
                transform: scale(0.92); 
                letter-spacing: -0.08em; /* Compressing text */
                opacity: 0.6; /* Slight dimming as if light is trapped */
                filter: blur(1px);
            }
        }

        /* Rotation Animations */
        .animate-spin-very-slow { animation: spin 60s linear infinite; }
        .animate-spin-slow { animation: spin 30s linear infinite; }
        .animate-spin-medium { animation: spin 10s linear infinite; }
        
        .animate-pulse-fast { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};