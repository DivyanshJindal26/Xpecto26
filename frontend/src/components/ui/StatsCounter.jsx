import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "../../libs/utils";

export default function StatsCounter({
    endValue,
    label,
    duration = 2,
    suffix = "",
    className
}) {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (!hasStarted) return;

        const startTime = Date.now();
        const startValue = 0;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / (duration * 1000), 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, [endValue, duration, hasStarted]);

    return (
        <motion.div
            className={cn("text-center", className)}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{
                opacity: 1,
                scale: 1,
            }}
            viewport={{ once: true, amount: 0.8 }}
            onViewportEnter={() => setHasStarted(true)}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="font-['Michroma'] text-5xl md:text-6xl font-bold text-white mb-2"
                animate={hasStarted ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
            >
                {count}{suffix}
            </motion.div>
            <div className="font-['Roboto'] text-sm md:text-base font-medium text-white/70 uppercase tracking-wider">
                {label}
            </div>
        </motion.div>
    );
}
