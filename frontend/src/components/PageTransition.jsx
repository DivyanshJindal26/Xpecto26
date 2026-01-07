import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      className="page-content"
      
      initial={{ 
        y: "50vh", 
        scale: 0,
        opacity: 0,
        clipPath: "circle(0% at 50% 95%)" 
      }}

      animate={{ 
        y: 0, 
        scale: 1,
        opacity: 1,
        clipPath: "circle(150% at 50% 95%)", 
        transition: { 
          duration: 1.2, 
          ease: [0.22, 1, 0.36, 1],
          delay: 0.5 // DELAY ADDED: Wait for menu to close
        }
      }}

      exit={{ 
        y: "50vh", 
        scale: 0,
        opacity: 0,
        clipPath: "circle(0% at 50% 95%)", 
        transition: { 
          duration: 1.0, 
          ease: [0.68, -0.55, 0.27, 1.55]
        }
      }}

      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        overflowY: 'auto', 
        overflowX: 'hidden',
        zIndex: 10,
        willChange: "transform, clip-path, opacity" 
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;