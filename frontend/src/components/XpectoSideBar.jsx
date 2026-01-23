"use client";
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/SideBar";
import {
  IconHome,
  IconPresentation,
  IconCalendarEvent,
  IconUsers,
  IconUserPlus,
  IconInfoCircle,
  IconLogout,
  IconUser,
  IconLoader2,
  IconShieldCheck,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "../libs/utils";
import { useAuth } from "../context/AuthContext";

export default function XpectoSideBar({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, loading, loginWithGoogle, logout } = useAuth();

  const links = [
    { label: "Home", href: "/", icon: <IconHome className="h-5 w-5" /> },
    {
      label: "Exhibition",
      href: "/exhibition",
      icon: <IconPresentation className="h-5 w-5" />,
    },
    {
      label: "Events",
      href: "/events",
      icon: <IconCalendarEvent className="h-5 w-5" />,
    },
    {
      label: "Sessions",
      href: "/sessions",
      icon: <IconUsers className="h-5 w-5" />,
    },
    {
      label: "About",
      href: "/about",
      icon: <IconInfoCircle className="h-5 w-5" />,
    },
  ];

  // Admin link - only visible to admins
  const adminLink = {
    label: "Admin Panel",
    href: "/admin",
    icon: <IconShieldCheck className="h-5 w-5" />,
  };

  const isAdmin = user?.role === "admin";

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <div
      className={cn("flex h-screen w-screen overflow-hidden", "bg-[#050508]")}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="bg-[#050508] z-50 border-r border-white/30">
          {/* Desktop Content */}
          <div className="hidden md:flex flex-1 flex-col overflow-hidden">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 px-3 py-2 mb-2">
              <motion.div
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <img
                  src="/logo.png"
                  alt="Xpecto"
                  className="h-10 w-10 object-contain"
                />
                {/* Subtle glow behind logo */}
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>

              <motion.span
                animate={{
                  opacity: open ? 1 : 0,
                  display: open ? "block" : "none",
                }}
                transition={{ duration: 0.15 }}
                className="font-['Michroma'] text-sm text-white/80 tracking-[0.2em]"
              >
                XPECTO
              </motion.span>
            </Link>

            {/* Divider */}
            <div className="mx-3 h-px bg-linear-to-r from-[#050508] via-white/6 to-[#050508] mb-4" />

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300">
              {links.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <SidebarLink link={link} isActive={isActive(link.href)} />
                </motion.div>
              ))}

              {/* Admin Link - Only for Admins */}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: links.length * 0.05 }}
                  className="mt-2 pt-2 border-t border-white/4"
                >
                  <SidebarLink
                    link={adminLink}
                    isActive={isActive(adminLink.href)}
                    className="bg-linear-to-r from-orange-500/10 to-red-500/5 border border-orange-500/20 hover:border-orange-400/30"
                  />
                </motion.div>
              )}
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto pt-4">
              <div className="mx-3 h-px bg-linear-to-r from-[#050508] via-white/6 to-[#050508] mb-4" />

              {loading ? (
                <div className="flex items-center justify-center py-3">
                  <IconLoader2 className="h-5 w-5 text-white/40 animate-spin" />
                </div>
              ) : isAuthenticated && user ? (
                // Logged in user section
                <div className="space-y-2">
                  {/* User Profile Link */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/4 transition-colors group"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full border border-purple-500/30 shrink-0"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-purple-300">
                          {user.name?.charAt(0) || "?"}
                        </span>
                      </div>
                    )}
                    <motion.div
                      animate={{
                        opacity: open ? 1 : 0,
                        display: open ? "block" : "none",
                      }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm font-medium text-white/80 truncate max-w-35">
                        {user.name}
                      </p>
                      <p className="text-xs text-white/40 truncate max-w-35">
                        {user.collegeName || user.email}
                      </p>
                    </motion.div>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors group"
                  >
                    <IconLogout className="h-5 w-5 shrink-0" />
                    <motion.span
                      animate={{
                        opacity: open ? 1 : 0,
                        display: open ? "block" : "none",
                      }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium"
                    >
                      Sign Out
                    </motion.span>
                  </button>
                </div>
              ) : (
                // Sign Up / Login Button
                <button
                  onClick={loginWithGoogle}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-linear-to-r from-purple-500/10 to-violet-500/5 border border-purple-500/20 hover:border-purple-400/30 transition-colors group"
                >
                  <IconUserPlus className="h-5 w-5 text-purple-400 shrink-0" />
                  <motion.span
                    animate={{
                      opacity: open ? 1 : 0,
                      display: open ? "block" : "none",
                    }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium text-white/80"
                  >
                    Sign Up with Google
                  </motion.span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Content */}
          <div className="flex md:hidden flex-col h-full">
            {/* Mobile Logo */}
            <Link to="/" className="flex items-center gap-3 mb-8">
              <img
                src="/logo.png"
                alt="Xpecto"
                className="h-11 w-11 object-contain"
              />
              <span className="font-['Michroma'] text-lg text-white/90 tracking-[0.15em]">
                XPECTO
              </span>
            </Link>

            {/* Mobile Links */}
            <nav className="flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden no-scrollbar">
              {links.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <SidebarLink
                    link={link}
                    isActive={isActive(link.href)}
                    className="py-3.5"
                  />
                </motion.div>
              ))}

              {/* Admin Link - Mobile */}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + links.length * 0.05 }}
                  className="mt-2 pt-2 border-t border-white/4"
                >
                  <SidebarLink
                    link={adminLink}
                    isActive={isActive(adminLink.href)}
                    className="py-3.5 bg-linear-to-r from-orange-500/10 to-red-500/5 border border-orange-500/20"
                  />
                </motion.div>
              )}
            </nav>

            {/* Mobile Sign Up / User Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4 mt-4 border-t border-white/4"
            >
              {loading ? (
                <div className="flex items-center justify-center py-3">
                  <IconLoader2 className="h-5 w-5 text-white/40 animate-spin" />
                </div>
              ) : isAuthenticated && user ? (
                // Mobile logged in user section
                <div className="space-y-3">
                  {/* User Info */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/2 border border-white/4"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full border border-purple-500/30"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/30 flex items-center justify-center">
                        <span className="text-lg font-medium text-purple-300">
                          {user.name?.charAt(0) || "?"}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-white/90 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-white/50 truncate">
                        {user.collegeName || user.email}
                      </p>
                    </div>
                    <IconUser className="h-5 w-5 text-white/30" />
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
                  >
                    <IconLogout className="h-5 w-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                // Mobile Sign Up Button
                <button
                  onClick={loginWithGoogle}
                  className="w-full flex items-center justify-center gap-2 px-3 py-3.5 rounded-xl bg-linear-to-r from-purple-500/10 to-violet-500/5 border border-purple-500/20"
                >
                  <IconUserPlus className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium text-white/80">
                    Sign Up with Google
                  </span>
                </button>
              )}
            </motion.div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <main className="relative flex flex-1 overflow-hidden bg-[#050508]">
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
