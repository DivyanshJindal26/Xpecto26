import express from "express";
import passport from "passport";
import {
  googleCallback,
  googleOneTap,
  getCurrentUser,
  completeProfile,
  logout,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL + "/auth/error",
    session: false,
  }),
  googleCallback,
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", authMiddleware, getCurrentUser);

// @route   POST /api/auth/google-onetap
// @desc    Google One Tap ID token exchange (One Tap)
// @access  Public
router.post("/google-onetap", googleOneTap);

// @route   PUT /api/auth/complete-profile
// @desc    Complete user profile
// @access  Private
router.put("/complete-profile", authMiddleware, completeProfile);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public (but should have valid cookie)
router.post("/logout", logout);

export default router;
