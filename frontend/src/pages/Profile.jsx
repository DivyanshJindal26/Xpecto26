"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconMail,
  IconSchool,
  IconUser,
  IconCamera,
  IconCheck,
  IconLoader2,
  IconShieldCheck,
  IconLogout,
  IconPhone,
  IconTicket,
  IconCreditCard,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    loading,
    updateProfile,
    logout,
    userHasWorkspaceEmail,
  } = useAuth();

  const [formData, setFormData] = useState({
    collegeName: "",
    collegeEmail: "",
    contactNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [leadInfo, setLeadInfo] = useState(null);
  const [loadingLead, setLoadingLead] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // Populate form with existing data
  useEffect(() => {
    if (user) {
      setFormData({
        collegeName: user.collegeName || "",
        collegeEmail: user.collegeEmail || user.email || "",
        contactNumber: user.contactNumber || "",
      });
    }
  }, [user]);

  // Fetch lead/pass information
  useEffect(() => {
    const fetchLeadInfo = async () => {
      if (!user) return;

      try {
        setLoadingLead(true);
        const API_BASE_URL =
          import.meta.env.VITE_API_URL || "https://xpecto.org/api";
        const response = await fetch(`${API_BASE_URL}/leads/my-lead`, {
          credentials: "include",
        });
        const result = await response.json();

        if (result.success && result.lead) {
          setLeadInfo(result.lead);
        }
      } catch (error) {
        console.error("Failed to fetch lead info:", error);
      } finally {
        setLoadingLead(false);
      }
    };

    fetchLeadInfo();
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = "College name is required";
    }

    if (!formData.collegeEmail.trim()) {
      newErrors.collegeEmail = "College email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.collegeEmail)) {
      newErrors.collegeEmail = "Please enter a valid email address";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (
      !/^[0-9]{10}$/.test(formData.contactNumber.replace(/[\s-]/g, ""))
    ) {
      newErrors.contactNumber = "Please enter a valid 10-digit contact number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    const result = await updateProfile({
      collegeName: formData.collegeName.trim(),
      collegeEmail: formData.collegeEmail.trim(),
      contactNumber: formData.contactNumber.trim(),
    });

    if (result.success) {
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } else {
      setSubmitError(result.error);
    }

    setIsSubmitting(false);
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    setSubmitSuccess(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050508] pt-14 md:pt-8 pb-8 px-4 md:px-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors"
        >
          <IconArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-white/60">Manage your account information</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-linear-to-b from-[#12121a] to-[#0a0a0f] rounded-2xl border border-white/10 overflow-hidden"
        >
          {/* Header gradient */}
          <div className="h-24 bg-linear-to-r from-purple-500/20 via-violet-500/15 to-purple-500/20" />

          {/* Avatar Section */}
          <div className="px-6 pb-6">
            <div className="relative -mt-12 mb-6">
              <div className="relative inline-block">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-[#0a0a0f] object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-[#0a0a0f] bg-gradient-to-br from-purple-500/20 to-violet-500/10 flex items-center justify-center">
                    <span className="text-3xl font-semibold text-purple-300">
                      {user.name?.charAt(0) || "?"}
                    </span>
                  </div>
                )}

                {/* Camera icon overlay */}
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors">
                  <IconCamera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-1">
                {user.name}
              </h2>
              <div className="flex items-center gap-2 text-white/60">
                <IconMail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
                {userHasWorkspaceEmail && (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* Role Badge */}
            {user.role && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/10 mb-6">
                <IconShieldCheck className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white/70 capitalize">
                  {user.role}
                </span>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-white/10 mb-6" />

            {/* Pass Details Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <IconTicket className="w-5 h-5 text-purple-400" />
                Pass Details
              </h3>

              {loadingLead ? (
                <div className="flex items-center justify-center py-8">
                  <IconLoader2 className="w-6 h-6 text-purple-400 animate-spin" />
                </div>
              ) : leadInfo ? (
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/5 border border-purple-500/30">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/40 mb-1">Pass Type</p>
                      <p className="text-sm text-white font-medium capitalize">
                        {leadInfo.passType === "early_bird"
                          ? "Early Bird"
                          : "Regular"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1">Amount</p>
                      <p className="text-sm text-white font-medium">
                        ₹{leadInfo.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1">
                        Payment Status
                      </p>
                      <div className="flex items-center gap-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                            leadInfo.paymentStatus === "completed"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : leadInfo.paymentStatus === "pending"
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {leadInfo.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1">Verified</p>
                      <p className="text-sm text-white font-medium">
                        {leadInfo.paymentVerified ? (
                          <span className="text-green-400 flex items-center gap-1">
                            <IconCheck className="w-4 h-4" /> Yes
                          </span>
                        ) : (
                          <span className="text-white/60">No</span>
                        )}
                      </p>
                    </div>
                    {leadInfo.transactionId && (
                      <div className="col-span-2">
                        <p className="text-xs text-white/40 mb-1">
                          Transaction ID
                        </p>
                        <p className="text-sm text-white/80 font-mono break-all">
                          {leadInfo.transactionId}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                  <IconAlertCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60 mb-4">
                    You haven't purchased a pass yet
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 text-white font-medium hover:from-purple-600 hover:to-violet-600 transition-all"
                  >
                    <IconCreditCard className="w-5 h-5" />
                    Register Now
                  </Link>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mb-6" />

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-lg font-medium text-white mb-4">
                Profile Information
              </h3>

              {/* Name (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="text"
                    value={user.name || ""}
                    disabled
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/2 border border-white/5 text-white/50 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-white/40">
                  Name is synced from your Google account
                </p>
              </div>

              {/* College Name */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  College / University Name
                </label>
                <div className="relative">
                  <IconSchool className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="text"
                    value={formData.collegeName}
                    onChange={handleChange("collegeName")}
                    placeholder="e.g., IIT Kharagpur"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border ${
                      errors.collegeName
                        ? "border-red-500/50"
                        : "border-white/10"
                    } text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors`}
                  />
                </div>
                {errors.collegeName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.collegeName}
                  </p>
                )}
              </div>

              {/* College Email */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  College Email Address
                </label>
                <div className="relative">
                  <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="email"
                    value={formData.collegeEmail}
                    onChange={handleChange("collegeEmail")}
                    placeholder="your.name@college.edu"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border ${
                      errors.collegeEmail
                        ? "border-red-500/50"
                        : "border-white/10"
                    } text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors`}
                  />
                </div>
                {errors.collegeEmail && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.collegeEmail}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Contact Number
                </label>
                <div className="relative">
                  <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={handleChange("contactNumber")}
                    placeholder="10-digit mobile number"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border ${
                      errors.contactNumber
                        ? "border-red-500/50"
                        : "border-white/10"
                    } text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors`}
                  />
                </div>
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.contactNumber}
                  </p>
                )}
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                  {submitError}
                </div>
              )}

              {/* Success Message */}
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm text-green-400 flex items-center gap-2"
                >
                  <IconCheck className="w-4 h-4" />
                  Profile updated successfully!
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-medium hover:from-purple-600 hover:to-violet-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <IconLoader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <IconCheck className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </form>

            {/* Logout Section */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <IconLogout className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center"
        >
          <p className="text-sm text-white/40">
            Signed in with Google • Account managed by Google
          </p>
        </motion.div>
      </div>
    </div>
  );
}
