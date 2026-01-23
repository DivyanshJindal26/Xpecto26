import { useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'motion/react';

const getRotationTransition = (duration, from, loop = true) => ({
  from,
  to: from + 360,
  ease: 'linear',
  duration,
  type: 'tween',
  repeat: loop ? Infinity : 0
});

const getTransition = (duration, from) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: 'spring',
    damping: 20,
    stiffness: 300
  }
});

const CircularText = ({
  text,
  spinDuration = 20,
  onHover = 'speedUp',
  className = '',
  children,
  textOffset = 50, // Distance from the edge of children to place text
  fontSize = 'text-2xl' // Tailwind class for font size
}) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  }, [spinDuration, text, onHover, controls, rotation]);

  const handleHoverStart = () => {
    const start = rotation.get();
    if (!onHover) return;

    let transitionConfig;
    let scaleVal = 1;

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring', damping: 20, stiffness: 300 },
          scale: { type: 'spring', damping: 20, stiffness: 300 }
        };
        scaleVal = 1;
        break;
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig
    });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Children (e.g., image) in the center */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Circular text wrapper - positioned absolutely to overlay */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
        style={{ rotate: rotation }}
        initial={{ rotate: 0 }}
        animate={controls}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
      >
        <div className="relative w-full h-full">
          {letters.map((letter, i) => {
            const rotationDeg = (360 / letters.length) * i;
            // Calculate radius as 50% of container + textOffset
            const radius = `calc(50% + ${textOffset}px)`;
            const x = `calc(${Math.cos((rotationDeg - 90) * (Math.PI / 180)) * 100}%)`;
            const y = `calc(${Math.sin((rotationDeg - 90) * (Math.PI / 180)) * 100}%)`;

            return (
              <span
                key={i}
                className={`absolute inline-block ${fontSize} text-white font-black transition-all duration-500 ease-[cubic-bezier(0,0,0,1)] pointer-events-auto cursor-pointer`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${x}, ${y}) translate(${Math.cos((rotationDeg - 90) * (Math.PI / 180)) * textOffset}px, ${Math.sin((rotationDeg - 90) * (Math.PI / 180)) * textOffset}px) rotate(${rotationDeg}deg)`,
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default CircularText;
