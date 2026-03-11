import express from "express";
import {
  createPronite,
  getAllPronites,
  getProniteById,
  updatePronite,
  deletePronite,
  getSheetRegistrations,
  generateQrForRegistrant,
  manualQrGenerate,
  reactivateQrCodes,
  scanQrCode,
  checkVerifierAccess,
  checkScannerAccess,
} from "../controllers/proniteController.js";
import authMiddleware, { adminMiddleware } from "../middleware/authMiddleware.js";
import Pronite from "../models/Pronite.js";

const router = express.Router();

// ── Verifier middleware: user must be in verifierEmails for the target pronite ──
const verifierMiddleware = async (req, res, next) => {
  try {
    const proniteId = req.params.id;
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

// ── Scanner middleware: user must be in scannerEmails for the SPECIFIC pronite in the QR ──
const scannerMiddleware = async (req, res, next) => {
  try {
    const userEmail = req.user.email.toLowerCase();
    const isAdmin = req.user.role === "admin";
    if (isAdmin) return next();

    const { proniteId } = req.body;
    if (!proniteId) {
      return res.status(400).json({
        success: false,
        message: "proniteId is required in the QR payload",
      });
    }

    const pronite = await Pronite.findOne({
      _id: proniteId,
      scannerEmails: { $in: [userEmail] },
    });

    if (!pronite) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not a scanner for this pronite.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// ── Access-check routes (public to authenticated users) ──
router.get("/check-verifier", authMiddleware, checkVerifierAccess);
router.get("/check-scanner", authMiddleware, checkScannerAccess);

// ── Admin read-all ──
router.get("/", authMiddleware, adminMiddleware, getAllPronites);
router.get("/:id", authMiddleware, adminMiddleware, getProniteById);

// ── Verifier routes ──
router.get("/:id/sheet-registrations", authMiddleware, verifierMiddleware, getSheetRegistrations);
router.post("/:id/generate-qr", authMiddleware, verifierMiddleware, generateQrForRegistrant);

// ── Scanner route ──
router.post("/scan", authMiddleware, scannerMiddleware, scanQrCode);

// ── Admin-only CRUD ──
router.post("/", authMiddleware, adminMiddleware, createPronite);
router.put("/:id", authMiddleware, adminMiddleware, updatePronite);
router.delete("/:id", authMiddleware, adminMiddleware, deletePronite);

// ── Admin-only: reactivate QR codes for the next night ──
router.post("/:id/reactivate", authMiddleware, adminMiddleware, reactivateQrCodes);

// ── Organizer: manually generate and send a QR ──
router.post("/:id/manual-qr", authMiddleware, manualQrGenerate);

export default router;
