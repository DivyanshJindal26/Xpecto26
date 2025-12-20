import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import authMiddleware, { adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, createEvent);
router.put('/:id', authMiddleware, adminMiddleware, updateEvent);
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent);

export default router;
