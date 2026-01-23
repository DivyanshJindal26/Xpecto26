import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "../../libs/utils";

export default function FloatingElement({
    children,
    className,
    floatIntensity = 20,
    duration = 6,
    enableParallax = true
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = enableParallax ? useTransform(scrollYProgress, [0, 1], [100, -100]) : 0;

    return (
        <motion.div
            ref={ref}
            className={cn("relative", className)}
            style={{ y }}
            animate={{
                y: enableParallax ? y : [0, -floatIntensity, 0],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            {children}
        </motion.div>
    );
}
