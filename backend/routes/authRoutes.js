const express = require('express');
const router = express.Router();
const passport = require('passport');
const { googleCallback, getCurrentUser, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: process.env.FRONTEND_URL + '/auth/error',
    session: false 
  }),
  googleCallback
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, getCurrentUser);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Public (but should have valid cookie)
router.post('/logout', logout);

module.exports = router;
