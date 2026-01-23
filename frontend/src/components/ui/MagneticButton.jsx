import { useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../libs/utils";

export default function MagneticButton({
    children,
    className,
    onClick,
    magnetStrength = 0.4
}) {
    const buttonRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * magnetStrength;
        const deltaY = (e.clientY - centerY) * magnetStrength;

        setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            ref={buttonRef}
            className={cn(
                "group relative px-8 py-3 font-['Michroma'] text-sm font-bold text-white tracking-widest overflow-hidden border-2 border-white/30 rounded-lg transition-all duration-300",
                className
            )}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{
                x: position.x,
                y: position.y,
            }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1,
            }}
            whileHover={{
                scale: 1.05,
                borderColor: "rgba(255, 255, 255, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="relative z-10">{children}</span>

            {/* Animated background */}
            <motion.div
                className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/10"
            />

            {/* Shine effect */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                }}
                animate={{
                    x: ["-100%", "200%"],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                }}
            />
        </motion.button>
    );
}
