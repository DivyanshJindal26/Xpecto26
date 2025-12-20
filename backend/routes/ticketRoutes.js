import express from 'express';
import {
  purchaseTicket,
  getMyTickets,
  getAllTickets,
  cancelTicket,
  getTicketStats,
} from '../controllers/ticketController.js';
import authMiddleware, { adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Private routes (authenticated users)
router.post('/', authMiddleware, purchaseTicket);
router.get('/my-tickets', authMiddleware, getMyTickets);
router.delete('/:id', authMiddleware, cancelTicket);

// Admin only routes
router.get('/', authMiddleware, adminMiddleware, getAllTickets);
router.get('/stats/:itemType/:itemId', authMiddleware, adminMiddleware, getTicketStats);

export default router;
