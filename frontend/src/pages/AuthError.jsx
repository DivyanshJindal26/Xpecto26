"use client";
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { IconAlertTriangle, IconHome, IconRefresh } from "@tabler/icons-react";

export default function AuthError() {
  const handleRetry = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || "https://xpecto.org/api"}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 max-w-md"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-red-500/20 to-rose-500/10 border border-red-500/30 flex items-center justify-center"
        >
          <IconAlertTriangle className="w-10 h-10 text-red-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-white mb-2"
        >
          Authentication Failed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/60 mb-8"
        >
          Something went wrong during the login process. Please try again or
          contact support if the problem persists.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-500/20 to-violet-500/10 border border-purple-500/30 text-white hover:border-purple-400/50 transition-all duration-200"
          >
            <IconRefresh className="w-5 h-5" />
            Try Again
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/4 border border-white/10 text-white/80 hover:bg-white/8 hover:border-white/20 transition-all duration-200"
          >
            <IconHome className="w-5 h-5" />
            Go Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
