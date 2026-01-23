"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconX,
  IconMail,
  IconSchool,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

export default function ProfileCompletionModal() {
  const {
    user,
    userHasWorkspaceEmail,
    completeProfile,
    showProfileCompletion,
    setShowProfileCompletion,
  } = useAuth();

  const [formData, setFormData] = useState({
    collegeName: "",
    collegeEmail: user?.email || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = "College name is required";
    }

    if (!userHasWorkspaceEmail) {
      if (!formData.collegeEmail.trim()) {
        newErrors.collegeEmail = "College email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.collegeEmail)) {
        newErrors.collegeEmail = "Please enter a valid email address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    const profileData = {
      collegeName: formData.collegeName.trim(),
      collegeEmail: userHasWorkspaceEmail
        ? user.email
        : formData.collegeEmail.trim(),
    };

    const result = await completeProfile(profileData);

    if (!result.success) {
      setSubmitError(result.error);
    }

    setIsSubmitting(false);
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  if (!showProfileCompletion) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#12121a] to-[#0a0a0f] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Header gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />

          {/* Close button (optional - can be removed if required) */}
          <button
            onClick={() => setShowProfileCompletion(false)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors z-10"
          >
            <IconX className="w-4 h-4 text-white/50" />
          </button>

          {/* Content */}
          <div className="relative p-6 pt-8">
            {/* Avatar & Welcome */}
            <div className="text-center mb-6">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-purple-500/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-violet-500/10 border-2 border-purple-500/30 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-purple-300">
                    {user?.name?.charAt(0) || "?"}
                  </span>
                </div>
              )}

              <h2 className="text-xl font-semibold text-white mb-1">
                Welcome, {user?.name?.split(" ")[0]}! 👋
              </h2>
              <p className="text-white/60 text-sm">
                {userHasWorkspaceEmail
                  ? "Just one more step - tell us about your college."
                  : "Please complete your profile to continue."}
              </p>
            </div>

            {/* Email badge */}
            <div className="flex items-center justify-center gap-2 mb-6 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <IconMail className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/70">{user?.email}</span>
              {userHasWorkspaceEmail && (
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                  College Email
                </span>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {/* College Email - Only for non-workspace emails */}
              {!userHasWorkspaceEmail && (
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
                  <p className="mt-1.5 text-xs text-white/40">
                    We'll use this for event communications and verification
                  </p>
                </div>
              )}

              {/* Submit Error */}
              {submitError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                  {submitError}
                </div>
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
                    Complete Profile
                  </>
                )}
              </button>
            </form>

            {/* Skip option */}
            <p className="mt-4 text-center text-sm text-white/40">
              You can update this later in your profile settings
            </p>

            {/* Legal Links */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-white/30">
              By completing your profile, you agree to our{" "}
              <a
                href="/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
