import express from "express";
import {
  createPronite,
  getAllPronites,
  getProniteById,
  updatePronite,
  deletePronite,
  registerForPronite,
  getMyRegistration,
  getMyQrCode,
  getRegistrations,
  approveRegistration,
  denyRegistration,
  getPaymentProof,
  scanQrCode,
  checkVerifierAccess,
  checkScannerAccess,
} from "../controllers/proniteController.js";
import authMiddleware, { adminMiddleware } from "../middleware/authMiddleware.js";
import Pronite from "../models/Pronite.js";

const router = express.Router();

// ── Middleware: verify caller's email is in pronite.verifierEmails ──
const verifierMiddleware = async (req, res, next) => {
  try {
    // For routes with :id param, check that specific pronite
    let proniteId = req.params.id;

    // For routes like /registrations/:regId/approve we need to look up the registration
    if (!proniteId && req.params.regId) {
      const { default: ProniteRegistration } = await import(
        "../models/ProniteRegistration.js"
      );
      const reg = await ProniteRegistration.findById(req.params.regId);
      if (!reg) {
        return res.status(404).json({ success: false, message: "Registration not found" });
      }
      proniteId = reg.pronite;
    }

    if (!proniteId) {
      return res.status(400).json({ success: false, message: "Missing pronite context" });
    }

    const pronite = await Pronite.findById(proniteId);
    if (!pronite) {
      return res.status(404).json({ success: false, message: "Pronite not found" });
    }

    const userEmail = req.user.email.toLowerCase();
    const isAdmin = req.user.role === "admin";
    const isVerifier = pronite.verifierEmails.includes(userEmail);

    if (!isAdmin && !isVerifier) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not a verifier for this pronite.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// ── Middleware: verify caller's email is in pronite.scannerEmails ──
const scannerMiddleware = async (req, res, next) => {
  try {
    const { proniteId } = req.body;

    // Scanner can scan for any pronite they're assigned to
    // Check if user is scanner for ANY pronite or is admin
    const userEmail = req.user.email.toLowerCase();
    const isAdmin = req.user.role === "admin";

    if (isAdmin) return next();

    const assignedPronite = await Pronite.findOne({
      scannerEmails: { $in: [userEmail] },
    });

    if (!assignedPronite) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not a scanner.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// ── Public routes ──
router.get("/", getAllPronites);
router.get("/check-verifier", authMiddleware, checkVerifierAccess);
router.get("/check-scanner", authMiddleware, checkScannerAccess);
router.get("/:id", getProniteById);

// ── Authenticated user routes ──
router.post("/:id/register", authMiddleware, registerForPronite);
router.get("/:id/my-registration", authMiddleware, getMyRegistration);
router.get("/:id/my-qr", authMiddleware, getMyQrCode);

// ── Verifier routes ──
router.get("/:id/registrations", authMiddleware, verifierMiddleware, getRegistrations);
router.put("/registrations/:regId/approve", authMiddleware, verifierMiddleware, approveRegistration);
router.put("/registrations/:regId/deny", authMiddleware, verifierMiddleware, denyRegistration);
router.get("/registrations/:regId/payment-proof", authMiddleware, verifierMiddleware, getPaymentProof);

// ── Scanner routes ──
router.post("/scan", authMiddleware, scannerMiddleware, scanQrCode);

// ── Admin only routes ──
router.post("/", authMiddleware, adminMiddleware, createPronite);
router.put("/:id", authMiddleware, adminMiddleware, updatePronite);
router.delete("/:id", authMiddleware, adminMiddleware, deletePronite);

export default router;
