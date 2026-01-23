"use client";
import { cn } from "../../libs/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
    </>
  );
};

/* =========================
   DESKTOP SIDEBAR
========================= */
export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  const timeoutRef = React.useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  return (
    <motion.div
      className={cn(
        "relative h-screen px-4 py-6 hidden md:flex md:flex-col shrink-0",
        "bg-gradient-to-b from-[#0a0a0f] via-[#080810] to-[#050508]",
        "border-r border-white/[0.04]",
        className,
      )}
      animate={{
        width: animate ? (open ? "260px" : "80px") : "260px",
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Subtle edge highlight */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-linear-to-b from-[#050508] via-white/[0.06] to-[#050508]" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </motion.div>
  );
};

/* =========================
   MOBILE SIDEBAR
========================= */
export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();

  return (
    <>
      {/* Top bar */}
      <div
        className={cn(
          "h-14 px-4 flex md:hidden items-center justify-between w-full fixed top-0 left-0 z-50",
          "bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/[0.04]",
        )}
        {...props}
      >
        <a href="/" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Xpecto"
            className="h-9 w-9 object-contain"
          />
          <span className="font-['Michroma'] text-sm text-white/90 tracking-wider">
            XPECTO
          </span>
        </a>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
        >
          <IconMenu2 className="text-white/70 h-5 w-5" />
        </motion.button>

        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />

              {/* Sidebar Panel */}
              <motion.div
                initial={{ x: "-100%", opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  duration: 0.35,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className={cn(
                  "fixed inset-y-0 left-0 w-[280px] z-[100] p-5 flex flex-col",
                  "bg-[#0a0a0f]",
                  "border-r border-white/[0.04]",
                  className,
                )}
              >
                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-4 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <IconX className="h-4 w-4 text-white/50" />
                </motion.button>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full pt-12">
                  {children}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

/* =========================
   SIDEBAR LINK
========================= */
export const SidebarLink = ({ link, className, isActive, ...props }) => {
  const { open, animate } = useSidebar();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={link.href}
      className={cn(
        "group relative flex items-center gap-3 py-3 px-3 rounded-xl overflow-hidden",
        "text-white/60 font-['Inter',sans-serif] font-medium text-[13px]",
        "transition-colors duration-200",
        isActive && "text-white/90",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Hover background */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-white/[0.04]"
        initial={false}
        animate={{
          opacity: isHovered || isActive ? 1 : 0,
          scale: isHovered || isActive ? 1 : 0.95,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Active indicator bar */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-purple-400 to-violet-500"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {/* Icon */}
      <motion.div
        className={cn(
          "relative z-10 flex-shrink-0 transition-colors duration-200",
          isActive
            ? "text-purple-300"
            : "text-white/40 group-hover:text-white/70",
        )}
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        {link.icon}
      </motion.div>

      {/* Label */}
      <motion.span
        animate={{
          display: animate ? (open ? "block" : "none") : "block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.15 }}
        className={cn(
          "relative z-10 whitespace-nowrap tracking-wide",
          isActive
            ? "text-white/90"
            : "text-white/50 group-hover:text-white/80",
        )}
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
