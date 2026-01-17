import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  deregisterFromEvent,
  getRegistrationStatus,
  getEventRegistrations,
} from "../controllers/eventController.js";
import authMiddleware, {
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// User registration routes (authenticated users)
router.post("/:id/register", authMiddleware, registerForEvent);
router.delete("/:id/register", authMiddleware, deregisterFromEvent);
router.get("/:id/register/status", authMiddleware, getRegistrationStatus);

// Admin only routes
router.post("/", authMiddleware, adminMiddleware, createEvent);
router.put("/:id", authMiddleware, adminMiddleware, updateEvent);
router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent);
router.get(
  "/:id/registrations",
  authMiddleware,
  adminMiddleware,
  getEventRegistrations,
);

export default router;
