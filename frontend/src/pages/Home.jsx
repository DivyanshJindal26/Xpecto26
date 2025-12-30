import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Animation for the Banners (Slide Up + Fade In)
const bannerVariant = {
  hidden: { opacity: 0, y: 100, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-[#02020A] flex flex-col">
      
      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle_at_center,_#4a148c_0%,_#311b92_30%,_#000000_70%)] opacity-80 pointer-events-none" />
        
        {/* X-AXIS ROTATING PLANET */}
        <div className="relative w-[280px] h-[280px] md:w-[500px] md:h-[500px] mb-8">
            <div className="absolute inset-0 bg-purple-600/30 blur-[80px] rounded-full animate-pulse" />
            <img 
                src="home.png" 
                alt="Home Planet" 
                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(100,100,255,0.5)] animate-planet-x"
            />
            {/* Overlay Text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] flex justify-between pointer-events-none z-10 font-michroma">
                <span className="text-5xl md:text-8xl tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">X P</span>
                <span className="text-5xl md:text-8xl tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">E C</span>
                <span className="text-5xl md:text-8xl tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">T O</span>
            </div>
        </div>

        <h1 className="text-xl md:text-3xl font-bold tracking-[0.2em] text-white mb-8 text-center uppercase relative z-10">
          Biggest Techfest of Himalayas
        </h1>

        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8 text-cyan-400 text-2xl relative z-10"
        >
           ↓
        </motion.div>
      </div>


      {/* ================= NAVIGATION BANNERS ================= */}
      {/* Added: gap, padding, and max-width for "Floating Card" look */}
      <div className="w-full flex flex-col gap-12 px-4 md:px-12 pb-20 max-w-[1400px] mx-auto z-10">


{/* 1. EXHIBITION BANNER */}
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={bannerVariant}
>
  <Link
    to="/exhibition"
    className="group relative block w-full
      h-[260px] md:h-[330px]
      rounded-[40px] overflow-hidden cursor-pointer
      border border-white/10

      shadow-[0_0_30px_rgba(255,159,28,0.1)]
      hover:shadow-[0_0_110px_rgba(255,200,80,0.6)]  // ⬅️ stronger glow
      transition-shadow duration-500

      before:absolute before:inset-[-45%]
      before:rounded-full
      before:opacity-0 group-hover:before:opacity-100
      before:transition-opacity before:duration-700
      before:bg-[radial-gradient(circle,
        rgba(255,230,120,0.65),
        rgba(255,195,60,0.45),
        rgba(255,165,0,0.25),
        transparent_72%)]  // ⬅️ brighter golden gradient
      before:z-0"
  >
    {/* Background Image */}
    <div className="absolute inset-0
      bg-[url('/public/nav1.jpg')]
      
      bg-cover bg-center
      transition-transform duration-700
      group-hover:scale-110
      filter brightness-[0.4] group-hover:brightness-[0.6]"
    ></div>

    {/* Content */}
    <div className="absolute inset-0 flex flex-col justify-center
      px-8 md:px-24 z-10"
    >
      <div className="flex items-center gap-2 mb-1
        translate-y-4 opacity-0
        group-hover:translate-y-0 group-hover:opacity-100
        transition-all duration-500 delay-100"
      >
        <span className="text-orange-500 text-lg">⊕</span>
        <span className="text-white/80 tracking-[0.18em] text-xs font-medium">
          INNOVATE - BUILD - LEARN
        </span>
      </div>

      <h2
        className="text-4xl md:text-6xl
        font-black text-white italic font-tech
        uppercase tracking-tight drop-shadow-lg"
      >
        EXHIBITION
      </h2>

      <div
        className="mt-4 w-10 h-1 bg-orange-500
        group-hover:w-36
        transition-all duration-500 ease-out"
      ></div>
    </div>
  </Link>
</motion.div>






{/* 2. EVENTS BANNER */}
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={bannerVariant}
>
  <Link
    to="/events"
    className="group relative block w-full
      h-[260px] md:h-[330px]
      rounded-[40px] overflow-hidden cursor-pointer
      border border-white/10

      shadow-[0_0_30px_rgba(67,97,238,0.1)]
      hover:shadow-[0_0_70px_rgba(90,120,255,0.45)]
      transition-shadow duration-500

      before:absolute before:inset-[-40%]
      before:opacity-0 group-hover:before:opacity-100
      before:transition-opacity before:duration-700
      before:rounded-full
      before:bg-[radial-gradient(circle,rgba(120,150,255,0.45),rgba(67,97,238,0.25),transparent_70%)]
      before:z-0"
  >
    {/* Background Image */}
    <div className="absolute inset-0
      bg-[url('/public/events1.jpg')]
      bg-cover bg-center
      transition-transform duration-700
      group-hover:scale-110
      filter brightness-[0.4] group-hover:brightness-[0.6]"
    ></div>

    {/* Content */}
    <div className="absolute inset-0 flex flex-col justify-center
      px-8 md:px-24 z-10 items-end text-right"
    >
      <div className="translate-y-4 opacity-0
        group-hover:translate-y-0 group-hover:opacity-100
        transition-all duration-500 delay-100
        mb-1"
      >
        <span className="text-white/80 tracking-[0.18em] text-xs font-medium">
          THRILLING
        </span>
      </div>

      <h2
        className="text-4xl md:text-6xl
        font-black text-white italic font-tech
        uppercase tracking-tight drop-shadow-lg"
      >
        EVENTS
      </h2>

      <div
        className="mt-4 w-10 h-1 bg-white
        group-hover:w-36
        transition-all duration-500 ease-out"
      ></div>
    </div>
  </Link>
</motion.div>




{/* 3. SESSIONS BANNER */}
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={bannerVariant}
>
  <Link
    to="/sessions"
    className="group relative block w-full
      h-[260px] md:h-[330px]
      rounded-[40px] overflow-hidden cursor-pointer
      border border-white/10

      shadow-[0_0_30px_rgba(46,196,182,0.1)]
      hover:shadow-[0_0_90px_rgba(46,220,200,0.5)]
      transition-shadow duration-500

      before:absolute before:inset-[-45%]
      before:rounded-full
      before:opacity-0 group-hover:before:opacity-100
      before:transition-opacity before:duration-700
      before:bg-[radial-gradient(circle,
        rgba(46,220,200,0.55),
        rgba(0,255,255,0.35),
        rgba(0,200,200,0.15),
        transparent_72%)]
      before:z-0"
  >
    {/* Background Image */}
    <div className="absolute inset-0
      bg-[url('/public/sessions2.jpg')]
      bg-cover bg-center
      transition-transform duration-700
      group-hover:scale-110
      filter brightness-[0.4] group-hover:brightness-[0.6]"
    ></div>

    {/* Content */}
    <div className="absolute inset-0 flex flex-col justify-center
      px-8 md:px-24 z-10"
    >
      <div className="flex items-center gap-2
        mb-1
        translate-y-4 opacity-0
        group-hover:translate-y-0 group-hover:opacity-100
        transition-all duration-500 delay-100"
      >
        <span className="text-white text-lg">⊕</span>
        <span className="text-white/80 tracking-[0.18em] text-xs font-medium">
          INSIGHTFUL
        </span>
      </div>

      <h2 className="text-4xl md:text-6xl
        font-black text-white italic font-tech
        uppercase tracking-tight drop-shadow-lg"
      >
        SESSIONS
      </h2>

      <div className="mt-4 w-10 h-1 bg-cyan-400
        group-hover:w-36
        transition-all duration-500 ease-out"
      ></div>
    </div>
  </Link>
</motion.div>



      </div>
    </div>
  );
};

export default Home;