import express from 'express';
import {
  createPronite,
  getAllPronites,
  getProniteById,
  updatePronite,
  deletePronite,
} from '../controllers/proniteController.js';
import authMiddleware, { adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllPronites);
router.get('/:id', getProniteById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, createPronite);
router.put('/:id', authMiddleware, adminMiddleware, updatePronite);
router.delete('/:id', authMiddleware, adminMiddleware, deletePronite);

export default router;
