import express from 'express';
import {
  createSponsor,
  getAllSponsors,
  getSponsorById,
  updateSponsor,
  deleteSponsor,
} from '../controllers/sponsorController.js';
import authMiddleware, { adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/sponsors
// @desc    Create a new sponsor
// @access  Admin only
router.post('/', authMiddleware, adminMiddleware, createSponsor);

// @route   GET /api/sponsors
// @desc    Get all sponsors
// @access  Public
router.get('/', getAllSponsors);

// @route   GET /api/sponsors/:id
// @desc    Get sponsor by ID
// @access  Public
router.get('/:id', getSponsorById);

// @route   PUT /api/sponsors/:id
// @desc    Update sponsor
// @access  Admin only
router.put('/:id', authMiddleware, adminMiddleware, updateSponsor);

// @route   DELETE /api/sponsors/:id
// @desc    Delete sponsor
// @access  Admin only
router.delete('/:id', authMiddleware, adminMiddleware, deleteSponsor);

export default router;
