import express from "express";
import {
  createLead,
  getMyLead,
  getAllLeads,
  updateLeadStatus,
  getLeadStats,
  getPaymentProof,
} from "../controllers/leadController.js";
import authMiddleware, { adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Private routes (authenticated users)
router.post("/", authMiddleware, createLead);
router.get("/my-lead", authMiddleware, getMyLead);
router.get("/payment-proof/:id", authMiddleware, getPaymentProof);

// Admin only routes
router.get("/", authMiddleware, adminMiddleware, getAllLeads);
router.get("/stats", authMiddleware, adminMiddleware, getLeadStats);
router.put("/:id", authMiddleware, adminMiddleware, updateLeadStatus);

export default router;
