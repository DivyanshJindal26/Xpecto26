import express from 'express';
import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
} from '../controllers/sessionController.js';
import authMiddleware, { adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/sessions
// @desc    Create a new session
// @access  Admin only
router.post('/', authMiddleware, adminMiddleware, createSession);

// @route   GET /api/sessions
// @desc    Get all sessions
// @access  Public
router.get('/', getAllSessions);

// @route   GET /api/sessions/:id
// @desc    Get session by ID
// @access  Public
router.get('/:id', getSessionById);

// @route   PUT /api/sessions/:id
// @desc    Update session
// @access  Admin only
router.put('/:id', authMiddleware, adminMiddleware, updateSession);

// @route   DELETE /api/sessions/:id
// @desc    Delete session
// @access  Admin only
router.delete('/:id', authMiddleware, adminMiddleware, deleteSession);

export default router;
