import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../libs/utils";

export default function AnimatedCounter({
    value,
    label,
    className
}) {
    const digits = String(value).padStart(2, '0').split('');

    return (
        <div className={cn("flex flex-col items-center", className)}>
            <motion.div
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-5 py-3 min-w-22.5 relative overflow-hidden"
                whileHover={{
                    scale: 1.05,
                    borderColor: "rgba(255, 255, 255, 0.4)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                {/* Pulsing background effect */}
                <motion.div
                    className="absolute inset-0 bg-white/5"
                    animate={{
                        opacity: [0, 0.3, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <div className="flex gap-0.5 relative z-10">
                    <AnimatePresence mode="popLayout">
                        {digits.map((digit, index) => (
                            <motion.span
                                key={`${digit}-${index}-${value}`}
                                className="font-['Michroma'] text-4xl font-bold text-white inline-block"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20
                                }}
                            >
                                {digit}
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>

            <motion.span
                className="font-['Roboto'] text-xs font-bold text-white/80 mt-2 tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {label}
            </motion.span>
        </div>
    );
}
