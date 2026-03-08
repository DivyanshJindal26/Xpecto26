import Pronite from "../models/Pronite.js";
import SheetRegistration from "../models/SheetRegistration.js";
import { fetchSheetRows } from "../utils/googleSheets.js";
import { sendApprovalEmail } from "../utils/email.js";
import { generateQrCode } from "../utils/qrcode.js";

// ============================================================
// PRONITE CRUD (Admin)
// ============================================================

export const createPronite = async (req, res, next) => {
  try {
    const pronite = await Pronite.create(req.body);
    res.status(201).json({ success: true, data: pronite });
  } catch (error) {
    next(error);
  }
};

export const getAllPronites = async (req, res, next) => {
  try {
    const pronites = await Pronite.find().sort({ date: 1 });
    res.status(200).json({ success: true, count: pronites.length, data: pronites });
  } catch (error) {
    next(error);
  }
};

export const getProniteById = async (req, res, next) => {
  try {
    const pronite = await Pronite.findById(req.params.id);
    if (!pronite) {
      return res.status(404).json({ success: false, message: "Pronite not found" });
    }
    res.status(200).json({ success: true, data: pronite });
  } catch (error) {
    next(error);
  }
};

export const updatePronite = async (req, res, next) => {
  try {
    const pronite = await Pronite.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pronite) {
      return res.status(404).json({ success: false, message: "Pronite not found" });
    }
    res.status(200).json({ success: true, data: pronite });
  } catch (error) {
    next(error);
  }
};

export const deletePronite = async (req, res, next) => {
  try {
    const pronite = await Pronite.findByIdAndDelete(req.params.id);
    if (!pronite) {
      return res.status(404).json({ success: false, message: "Pronite not found" });
    }
    await SheetRegistration.deleteMany({ pronite: req.params.id });
    res.status(200).json({ success: true, data: {}, message: "Pronite deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// SHEET REGISTRATIONS (Verifier)
// ============================================================

// @desc    Get all registrations from Google Sheet for a pronite,
//          merged with QR/scan status from DB.
// @route   GET /api/pronites/:id/sheet-registrations
// @access  Verifier emails + Admin
export const getSheetRegistrations = async (req, res, next) => {
  try {
    const pronite = await Pronite.findById(req.params.id);
    if (!pronite) {
      return res.status(404).json({ success: false, message: "Pronite not found" });
    }

    if (!pronite.googleSheetDateLabel) {
      return res.status(400).json({
        success: false,
        message: "No ProNite Date label configured for this pronite. Set it in the admin panel (e.g. '14 March').",
      });
    }

    // Fetch live data from Google Sheet filtered by this pronite's date label
    const rows = await fetchSheetRows(pronite.googleSheetDateLabel);

    // Fetch all DB records for this pronite in one query
    const dbRecords = await SheetRegistration.find({ pronite: pronite._id }).lean();
    const dbMap = {};
    for (const rec of dbRecords) {
      dbMap[rec.email] = rec;
    }

    // Merge sheet rows with DB scan/QR status
    const merged = rows.map((row) => {
      const db = dbMap[row.email] || null;
      return {
        ...row,                                    // sheet data (includes paymentProofUrl)
        _id: db?._id || null,
        qrEmailSent: db?.qrEmailSent || false,
        scanned: db?.scanned || false,
        scannedAt: db?.scannedAt || null,
        scannedBy: db?.scannedBy || null,
      };
    });

    res.status(200).json({
      success: true,
      count: merged.length,
      data: merged,
    });
  } catch (error) {
    // Surface Google Sheets config / auth errors with a readable message
    const msg = error.message || "";
    if (
      msg.includes("not set") ||
      msg.includes("not configured") ||
      msg.includes("unregistered callers") ||
      msg.includes("invalid_grant") ||
      msg.includes("DECODER routines")
    ) {
      return res.status(503).json({
        success: false,
        message: `Google Sheets auth error: ${msg}. Check your GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and that the Sheets API is enabled on your Google Cloud project.`,
      });
    }
    next(error);
  }
};

// @desc    Generate a QR code for a sheet registrant and email it to them.
//          Upserts a SheetRegistration record by email + pronite.
// @route   POST /api/pronites/:id/generate-qr
// @body    { email } or { all: true } to send to all who haven't received one yet
// @access  Verifier emails + Admin
export const generateQrForRegistrant = async (req, res, next) => {
  try {
    const pronite = await Pronite.findById(req.params.id);
    if (!pronite) {
      return res.status(404).json({ success: false, message: "Pronite not found" });
    }

    if (!pronite.googleSheetDateLabel) {
      return res.status(400).json({
        success: false,
        message: "No ProNite Date label configured for this pronite.",
      });
    }

    const rows = await fetchSheetRows(pronite.googleSheetDateLabel);
    const { email, all } = req.body;

    const targets = all
      ? rows
      : rows.filter((r) => r.email === (email || "").trim().toLowerCase());

    if (targets.length === 0) {
      return res.status(404).json({ success: false, message: "No matching registrant found in sheet" });
    }

    const results = [];
    for (const row of targets) {
      // Upsert DB record
      let reg = await SheetRegistration.findOne({ email: row.email, pronite: pronite._id });
      if (!reg) {
        reg = new SheetRegistration({
          email: row.email,
          name: row.name,
          phone: row.phone,
          college: row.college,
          transactionId: row.transactionId,
          paymentProofUrl: row.paymentProofUrl,
          pronite: pronite._id,
          rowIndex: row.rowIndex,
        });
      } else {
        // Refresh sheet data
        reg.name = row.name;
        reg.phone = row.phone;
        reg.college = row.college;
        reg.transactionId = row.transactionId;
        reg.paymentProofUrl = row.paymentProofUrl;
        reg.rowIndex = row.rowIndex;
      }

      // Only generate a new QR if one hasn't been sent yet (or all=true forces resend)
      if (!reg.qrToken || all) {
        reg.generateQrToken();
      }

      await reg.save();

      // Build and email QR code
      const qrPayload = {
        token: reg.qrToken,
        sheetRegId: reg._id,
        proniteId: pronite._id,
      };
      const qrDataUrl = await generateQrCode(qrPayload);

      await sendApprovalEmail(
        reg.email,
        reg.name || reg.email,
        pronite.title,
        qrDataUrl
      );

      reg.qrEmailSent = true;
      await reg.save();

      results.push({ email: reg.email, success: true });
    }

    res.status(200).json({
      success: true,
      message: `QR code(s) generated and emailed`,
      results,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ACCESS CHECK for verifiers/scanners
// ============================================================

export const checkVerifierAccess = async (req, res, next) => {
  try {
    const pronites = await Pronite.find({
      verifierEmails: { $in: [req.user.email.toLowerCase()] },
    }).select("_id title artist googleSheetTabName");

    res.status(200).json({
      success: true,
      isVerifier: pronites.length > 0,
      pronites,
    });
  } catch (error) {
    next(error);
  }
};

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

// ============================================================
// SCANNER
// ============================================================

// @desc    Verify/scan a QR code at entry.
//          QR payload: { token, sheetRegId, proniteId }
// @route   POST /api/pronites/scan
// @access  Scanner emails for the specific pronite only
export const scanQrCode = async (req, res, next) => {
  try {
    const { token, sheetRegId, proniteId } = req.body;

    if (!token || !sheetRegId || !proniteId) {
      return res.status(400).json({
        success: false,
        reason: "invalid_qr",
        message: "Not a valid ticket QR code",
      });
    }

    const reg = await SheetRegistration.findOne({
      _id: sheetRegId,
      qrToken: token,
      pronite: proniteId,
    }).populate("pronite", "title artist date venue");

    if (!reg) {
      // Check if the token exists but belongs to a different pronite (wrong night scan)
      const wrongNight = await SheetRegistration.findOne({ _id: sheetRegId, qrToken: token })
        .populate("pronite", "title");
      if (wrongNight) {
        return res.status(403).json({
          success: false,
          reason: "wrong_pronite",
          message: `Wrong night — this ticket is for ${wrongNight.pronite?.title || "a different pronite"}`,
        });
      }
      return res.status(404).json({
        success: false,
        reason: "not_found",
        message: "Ticket not found — this QR was not issued by us",
      });
    }

    if (reg.scanned) {
      const scannedTime = reg.scannedAt
        ? new Date(reg.scannedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
        : "unknown time";
      return res.status(400).json({
        success: false,
        reason: "already_scanned",
        message: `Already checked in at ${scannedTime}`,
        data: {
          scannedAt: reg.scannedAt,
          scannedBy: reg.scannedBy,
          attendee: { name: reg.name, email: reg.email, college: reg.college, phone: reg.phone },
          pronite: reg.pronite,
        },
      });
    }

    reg.scanned = true;
    reg.scannedAt = new Date();
    reg.scannedBy = req.user.email;
    await reg.save();

    return res.status(200).json({
      success: true,
      message: "Ticket verified successfully",
      data: {
        attendee: { name: reg.name, email: reg.email, college: reg.college, phone: reg.phone },
        pronite: reg.pronite,
        scannedAt: reg.scannedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
