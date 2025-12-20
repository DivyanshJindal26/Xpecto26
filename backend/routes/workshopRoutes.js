import express from 'express';
import {
  createWorkshop,
  getAllWorkshops,
  getWorkshopById,
  updateWorkshop,
  deleteWorkshop,
} from '../controllers/workshopController.js';
import authMiddleware, { adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllWorkshops);
router.get('/:id', getWorkshopById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, createWorkshop);
router.put('/:id', authMiddleware, adminMiddleware, updateWorkshop);
router.delete('/:id', authMiddleware, adminMiddleware, deleteWorkshop);

export default router;
