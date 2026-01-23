"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconUsers,
  IconPresentation,
} from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import AdminEvents from "../components/admin/AdminEvents";
import AdminSessions from "../components/admin/AdminSessions";
import AdminExhibitions from "../components/admin/AdminExhibitions";
import AdminTeam from "../components/admin/AdminTeam";

export default function AdminPanel() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("events");

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/", { replace: true });
    }
  }, [loading, isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508]">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const tabs = [
    { id: "events", label: "Events", icon: IconCalendarEvent },
    { id: "sessions", label: "Sessions", icon: IconUsers },
    { id: "exhibitions", label: "Exhibitions", icon: IconPresentation },
    { id: "team", label: "Team", icon: IconUsers },
  ];

  return (
    <div className="min-h-screen bg-[#050508] pt-14 md:pt-8 pb-8 px-4 md:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors mb-4"
        >
          <IconArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-orange-400">⚡</span>
          Admin Panel
        </h1>
        <p className="text-sm sm:text-base text-white/60">Manage all content and registrations</p>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500/20 to-red-500/10 border border-orange-500/30 text-orange-300"
                  : "bg-white/[0.02] border border-white/10 text-white/60 hover:bg-white/[0.04] hover:text-white/80"
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">{tab.label}</span>
              <span className="xs:hidden">{tab.label.slice(0, 4)}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "events" && <AdminEvents />}
        {activeTab === "sessions" && <AdminSessions />}
        {activeTab === "exhibitions" && <AdminExhibitions />}
        {activeTab === "team" && <AdminTeam />}
      </div>
    </div>
  );
}
