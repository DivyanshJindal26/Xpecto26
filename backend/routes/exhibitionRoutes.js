import express from 'express';
import {
  createExhibition,
  getAllExhibitions,
  getExhibitionById,
  updateExhibition,
  deleteExhibition,
} from '../controllers/exhibitionController.js';
import authMiddleware, { adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/exhibitions
// @desc    Create a new exhibition
// @access  Admin only
router.post('/', authMiddleware, adminMiddleware, createExhibition);

// @route   GET /api/exhibitions
// @desc    Get all exhibitions
// @access  Public
router.get('/', getAllExhibitions);

// @route   GET /api/exhibitions/:id
// @desc    Get exhibition by ID
// @access  Public
router.get('/:id', getExhibitionById);

// @route   PUT /api/exhibitions/:id
// @desc    Update exhibition
// @access  Admin only
router.put('/:id', authMiddleware, adminMiddleware, updateExhibition);

// @route   DELETE /api/exhibitions/:id
// @desc    Delete exhibition
// @access  Admin only
router.delete('/:id', authMiddleware, adminMiddleware, deleteExhibition);

export default router;
