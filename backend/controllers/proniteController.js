import Pronite from "../models/Pronite.js";
import ProniteRegistration from "../models/ProniteRegistration.js";
import { uploadToGridFS, downloadFromGridFS } from "../utils/gridfs.js";
import { sendDenialEmail, sendApprovalEmail } from "../utils/email.js";
import { generateQrCode } from "../utils/qrcode.js";

// ============================================================
// PRONITE CRUD (Admin)
// ============================================================

// @desc    Create a new pronite
// @route   POST /api/pronites
// @access  Admin only
export const createPronite = async (req, res, next) => {
  try {
    const proniteData = {
      ...req.body,
      availableTickets: req.body.maxCapacity || 500,
    };
    const pronite = await Pronite.create(proniteData);

    res.status(201).json({
      success: true,
      data: pronite,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pronites
// @route   GET /api/pronites
// @access  Public
export const getAllPronites = async (req, res, next) => {
  try {
    const pronites = await Pronite.find().sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: pronites.length,
      data: pronites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pronite by ID
// @route   GET /api/pronites/:id
// @access  Public
export const getProniteById = async (req, res, next) => {
  try {
    const pronite = await Pronite.findById(req.params.id);

    if (!pronite) {
      return res.status(404).json({
        success: false,
        message: "Pronite not found",
      });
    }

    res.status(200).json({
      success: true,
      data: pronite,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pronite
// @route   PUT /api/pronites/:id
// @access  Admin only
export const updatePronite = async (req, res, next) => {
  try {
    const pronite = await Pronite.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pronite) {
      return res.status(404).json({
        success: false,
        message: "Pronite not found",
      });
    }

    res.status(200).json({
      success: true,
      data: pronite,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pronite
// @route   DELETE /api/pronites/:id
// @access  Admin only
export const deletePronite = async (req, res, next) => {
  try {
    const pronite = await Pronite.findByIdAndDelete(req.params.id);

    if (!pronite) {
      return res.status(404).json({
        success: false,
        message: "Pronite not found",
      });
    }

    // Also clean up registrations
    await ProniteRegistration.deleteMany({ pronite: req.params.id });

    res.status(200).json({
      success: true,
      data: {},
      message: "Pronite deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// REGISTRATION (User)
// ============================================================

// @desc    Register for a pronite (submit payment proof)
// @route   POST /api/pronites/:id/register
// @access  Authenticated users
export const registerForPronite = async (req, res, next) => {
  try {
    const pronite = await Pronite.findById(req.params.id);
    if (!pronite) {
      return res
        .status(404)
        .json({ success: false, message: "Pronite not found" });
    }

    if (pronite.availableTickets <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "No tickets available" });
    }

    // Check for existing registration
    const existing = await ProniteRegistration.findOne({
      user: req.user._id,
      pronite: req.params.id,
    });

    if (existing && existing.status !== "denied") {
      return res.status(400).json({
        success: false,
        message: "You have already registered for this pronite",
      });
    }

    // If previously denied, allow re-registration by updating same doc
    const { paymentProofImage, transactionId } = req.body;
    if (!paymentProofImage) {
      return res
        .status(400)
        .json({ success: false, message: "Payment proof is required" });
    }

    // Save payment proof to GridFS
    let gridFsId = null;
    if (paymentProofImage.startsWith("data:")) {
      const matches = paymentProofImage.match(
        /^data:(.+);base64,(.+)$/
      );
      if (matches) {
        const contentType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        const filename = `pronite_payment_${req.user._id}_${Date.now()}`;
        gridFsId = await uploadToGridFS(buffer, filename, contentType);
      }
    }

    if (existing && existing.status === "denied") {
      // Update the denied registration
      existing.paymentProofImage = paymentProofImage;
      existing.paymentProofGridFsId = gridFsId;
      existing.transactionId = transactionId || "";
      existing.status = "pending";
      existing.denialReason = undefined;
      existing.qrToken = undefined;
      existing.scanned = false;
      existing.scannedAt = undefined;
      existing.scannedBy = undefined;
      await existing.save();

      return res.status(200).json({
        success: true,
        data: existing,
        message: "Re-registered successfully",
      });
    }

    const registration = await ProniteRegistration.create({
      user: req.user._id,
      pronite: req.params.id,
      paymentProofImage,
      paymentProofGridFsId: gridFsId,
      transactionId: transactionId || "",
    });

    res.status(201).json({
      success: true,
      data: registration,
      message: "Registration submitted. Awaiting approval.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my registration status for a pronite
// @route   GET /api/pronites/:id/my-registration
// @access  Authenticated users
export const getMyRegistration = async (req, res, next) => {
  try {
    const registration = await ProniteRegistration.findOne({
      user: req.user._id,
      pronite: req.params.id,
    }).populate("pronite", "title artist");

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my QR code for an approved registration
// @route   GET /api/pronites/:id/my-qr
// @access  Authenticated users
export const getMyQrCode = async (req, res, next) => {
  try {
    const registration = await ProniteRegistration.findOne({
      user: req.user._id,
      pronite: req.params.id,
      status: "approved",
    }).populate("pronite", "title artist date venue");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "No approved registration found",
      });
    }

    const qrData = {
      token: registration.qrToken,
      registrationId: registration._id,
      proniteId: registration.pronite._id,
      userId: req.user._id,
    };

    const qrDataUrl = await generateQrCode(qrData);

    res.status(200).json({
      success: true,
      data: {
        qrCode: qrDataUrl,
        registration,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// VERIFICATION (Verifier emails)
// ============================================================

// @desc    Get all registrations for a pronite (verifiers)
// @route   GET /api/pronites/:id/registrations
// @access  Verifier emails only
export const getRegistrations = async (req, res, next) => {
  try {
    const registrations = await ProniteRegistration.find({
      pronite: req.params.id,
    })
      .populate("user", "name email avatar collegeName contactNumber collegeEmail")
      .populate("pronite", "title artist ticketPrice")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a registration
// @route   PUT /api/pronites/registrations/:regId/approve
// @access  Verifier emails only
export const approveRegistration = async (req, res, next) => {
  try {
    const registration = await ProniteRegistration.findById(req.params.regId)
      .populate("user", "name email")
      .populate("pronite", "title artist availableTickets");

    if (!registration) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });
    }

    if (registration.status === "approved") {
      return res
        .status(400)
        .json({ success: false, message: "Already approved" });
    }

    // Decrement available tickets
    const pronite = await Pronite.findById(registration.pronite._id);
    if (pronite.availableTickets <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "No tickets available" });
    }

    pronite.availableTickets -= 1;
    await pronite.save();

    // Generate QR token
    registration.status = "approved";
    registration.denialReason = undefined;
    registration.generateQrToken();
    await registration.save();

    // Generate QR code image
    const qrData = {
      token: registration.qrToken,
      registrationId: registration._id,
      proniteId: registration.pronite._id,
      userId: registration.user._id,
    };
    const qrDataUrl = await generateQrCode(qrData);

    // Send approval email with QR
    await sendApprovalEmail(
      registration.user.email,
      registration.user.name,
      registration.pronite.title,
      qrDataUrl
    );

    res.status(200).json({
      success: true,
      data: registration,
      message: "Registration approved and QR code sent",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deny a registration
// @route   PUT /api/pronites/registrations/:regId/deny
// @access  Verifier emails only
export const denyRegistration = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res
        .status(400)
        .json({ success: false, message: "Denial reason is required" });
    }

    const registration = await ProniteRegistration.findById(req.params.regId)
      .populate("user", "name email")
      .populate("pronite", "title");

    if (!registration) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });
    }

    if (registration.status === "denied") {
      return res
        .status(400)
        .json({ success: false, message: "Already denied" });
    }

    // If it was previously approved, refund the ticket
    if (registration.status === "approved") {
      await Pronite.findByIdAndUpdate(registration.pronite._id, {
        $inc: { availableTickets: 1 },
      });
    }

    registration.status = "denied";
    registration.denialReason = reason;
    registration.qrToken = undefined;
    await registration.save();

    // Send denial email
    await sendDenialEmail(
      registration.user.email,
      registration.user.name,
      registration.pronite.title,
      reason
    );

    res.status(200).json({
      success: true,
      data: registration,
      message: "Registration denied and email sent",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment proof image
// @route   GET /api/pronites/registrations/:regId/payment-proof
// @access  Verifier emails or Admin
export const getPaymentProof = async (req, res, next) => {
  try {
    const registration = await ProniteRegistration.findById(req.params.regId);

    if (!registration) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });
    }

    // Return base64 directly if available
    if (registration.paymentProofImage) {
      return res.status(200).json({
        success: true,
        data: { image: registration.paymentProofImage },
      });
    }

    // Fallback to GridFS
    if (registration.paymentProofGridFsId) {
      const buffer = await downloadFromGridFS(
        registration.paymentProofGridFsId
      );
      const base64 =
        "data:image/png;base64," + buffer.toString("base64");
      return res.status(200).json({
        success: true,
        data: { image: base64 },
      });
    }

    return res.status(404).json({
      success: false,
      message: "No payment proof found",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// SCANNER (Scanner emails)
// ============================================================

// @desc    Verify/scan a QR code at entry
// @route   POST /api/pronites/scan
// @access  Scanner emails only
export const scanQrCode = async (req, res, next) => {
  try {
    const { token, registrationId, proniteId } = req.body;

    if (!token || !registrationId) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR code data",
      });
    }

    const registration = await ProniteRegistration.findOne({
      _id: registrationId,
      qrToken: token,
      status: "approved",
    })
      .populate("user", "name email avatar collegeName contactNumber collegeEmail")
      .populate("pronite", "title artist date venue");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Invalid or unapproved ticket",
      });
    }

    if (registration.scanned) {
      return res.status(400).json({
        success: false,
        message: "Ticket already scanned",
        data: {
          scannedAt: registration.scannedAt,
          scannedBy: registration.scannedBy,
          user: registration.user,
          pronite: registration.pronite,
        },
      });
    }

    // Mark as scanned
    registration.scanned = true;
    registration.scannedAt = new Date();
    registration.scannedBy = req.user.email;
    await registration.save();

    return res.status(200).json({
      success: true,
      message: "Ticket verified successfully",
      data: {
        user: registration.user,
        pronite: registration.pronite,
        scannedAt: registration.scannedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ACCESS CHECK for verifiers/scanners
// ============================================================

// @desc    Check if current user is a verifier for any pronite
// @route   GET /api/pronites/check-verifier
// @access  Authenticated
export const checkVerifierAccess = async (req, res, next) => {
  try {
    const pronites = await Pronite.find({
      verifierEmails: { $in: [req.user.email.toLowerCase()] },
    }).select("_id title artist");

    res.status(200).json({
      success: true,
      isVerifier: pronites.length > 0,
      pronites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if current user is a scanner for any pronite
// @route   GET /api/pronites/check-scanner
// @access  Authenticated
export const checkScannerAccess = async (req, res, next) => {
  try {
    const pronites = await Pronite.find({
      scannerEmails: { $in: [req.user.email.toLowerCase()] },
    }).select("_id title artist");

    res.status(200).json({
      success: true,
      isScanner: pronites.length > 0,
      pronites,
    });
  } catch (error) {
    next(error);
  }
};
