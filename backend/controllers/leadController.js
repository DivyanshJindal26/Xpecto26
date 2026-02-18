import Lead from "../models/Lead.js";
import PaymentProof from "../models/PaymentProof.js";
import { uploadToGridFS, downloadFromGridFS, deleteFromGridFS } from "../utils/gridfs.js";

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req, res, next) => {
  try {
    const { passType } = req.body;
    
    // Determine the amount based on pass type and date
    const now = new Date();
    const earlyBirdDeadline = new Date("2026-02-15T23:59:59");
    
    let amount;
    let actualPassType;
    
    if (now <= earlyBirdDeadline) {
      amount = 2299;
      actualPassType = "early_bird";
    } else {
      amount = 2499;
      actualPassType = "regular";
    }

    // Check if user already has a pending or completed lead
    const existingLead = await Lead.findOne({
      user: req.user._id,
      paymentStatus: { $in: ["pending", "completed"] },
    });

    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending or completed registration",
        lead: existingLead,
      });
    }

    const lead = await Lead.create({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.contactNumber || "",
      collegeName: req.user.collegeName || "",
      passType: actualPassType,
      amount,
    });

    res.status(201).json({
      success: true,
      message: "Registration initiated successfully",
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's lead
// @route   GET /api/leads/my-lead
// @access  Private
export const getMyLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("selectedEvents", "title");

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads (Admin only)
// @route   GET /api/leads
// @access  Private/Admin
export const getAllLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find()
      .populate("user", "name email avatar")
      .populate("selectedEvents", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead payment status (Admin only)
// @route   PUT /api/leads/:id
// @access  Private/Admin
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { paymentStatus, paymentVerified, transactionId, notes, paymentProofData, campusAmbassadorCode, selectedEvents, numberOfParticipants } = req.body;

    const updateData = {
      paymentStatus,
      paymentVerified,
      transactionId,
      notes,
    };

    // Optional new fields
    if (campusAmbassadorCode !== undefined) updateData.campusAmbassadorCode = campusAmbassadorCode;
    if (selectedEvents !== undefined) updateData.selectedEvents = selectedEvents;
    if (numberOfParticipants !== undefined) updateData.numberOfParticipants = numberOfParticipants;

    // Handle payment proof upload if provided
    if (paymentProofData) {
      try {
        // Extract base64 data
        const matches = paymentProofData.match(/^data:(.+);base64,(.+)$/);
        if (!matches) {
          return res.status(400).json({
            success: false,
            message: "Invalid payment proof format",
          });
        }

        const contentType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");

        // Upload to GridFS
        const filename = `payment-proof-${req.params.id}-${Date.now()}.${contentType.split("/")[1]}`;
        const gridFsId = await uploadToGridFS(buffer, filename, contentType);

        // Create PaymentProof document
        const paymentProof = await PaymentProof.create({
          filename,
          contentType,
          size: buffer.length,
          gridFsId,
          uploadedBy: req.user._id,
        });

        // Delete old payment proof if exists
        const lead = await Lead.findById(req.params.id);
        if (lead?.paymentProof) {
          try {
            const oldProof = await PaymentProof.findById(lead.paymentProof);
            if (oldProof) {
              await deleteFromGridFS(oldProof.gridFsId);
              await PaymentProof.findByIdAndDelete(lead.paymentProof);
            }
          } catch (err) {
            console.error("Error deleting old payment proof:", err);
          }
        }

        updateData.paymentProof = paymentProof._id;
      } catch (error) {
        console.error("Error uploading payment proof:", error);
        return res.status(400).json({
          success: false,
          message: "Failed to upload payment proof",
        });
      }
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("paymentProof").populate("selectedEvents", "title");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit payment details (User submits their own payment info)
// @route   PUT /api/leads/submit-payment
// @access  Private
export const submitPaymentDetails = async (req, res, next) => {
  try {
    const {
      transactionId,
      paymentProofData,
      campusAmbassadorCode,
      selectedEvents,
      numberOfParticipants,
    } = req.body;

    // Validate mandatory fields
    if (!transactionId || !transactionId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required",
      });
    }

    if (!paymentProofData) {
      return res.status(400).json({
        success: false,
        message: "Payment proof screenshot is required",
      });
    }

    // Find the user's lead
    const lead = await Lead.findOne({
      user: req.user._id,
      paymentStatus: { $in: ["pending", "completed"] },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "No registration found. Please register first.",
      });
    }

    // Don't allow re-submission if already completed
    if (lead.paymentStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: "Payment is already verified and completed.",
      });
    }

    const updateData = {
      transactionId: transactionId.trim(),
      paymentStatus: "pending",
    };

    // Optional fields
    if (campusAmbassadorCode) {
      updateData.campusAmbassadorCode = campusAmbassadorCode.trim();
    }
    if (selectedEvents && Array.isArray(selectedEvents)) {
      updateData.selectedEvents = selectedEvents;
    }
    if (numberOfParticipants && numberOfParticipants >= 1) {
      updateData.numberOfParticipants = numberOfParticipants;
    }

    // Handle payment proof upload
    try {
      const matches = paymentProofData.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment proof format",
        });
      }

      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      const filename = `payment-proof-${lead._id}-${Date.now()}.${contentType.split("/")[1]}`;
      const gridFsId = await uploadToGridFS(buffer, filename, contentType);

      const paymentProof = await PaymentProof.create({
        filename,
        contentType,
        size: buffer.length,
        gridFsId,
        uploadedBy: req.user._id,
      });

      // Delete old payment proof if exists
      if (lead.paymentProof) {
        try {
          const oldProof = await PaymentProof.findById(lead.paymentProof);
          if (oldProof) {
            await deleteFromGridFS(oldProof.gridFsId);
            await PaymentProof.findByIdAndDelete(lead.paymentProof);
          }
        } catch (err) {
          console.error("Error deleting old payment proof:", err);
        }
      }

      updateData.paymentProof = paymentProof._id;
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      return res.status(400).json({
        success: false,
        message: "Failed to upload payment proof",
      });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      lead._id,
      updateData,
      { new: true, runValidators: true }
    ).populate("paymentProof").populate("selectedEvents", "title");

    res.status(200).json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead stats (Admin only)
// @route   GET /api/leads/stats
// @access  Private/Admin
export const getLeadStats = async (req, res, next) => {
  try {
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalLeads = await Lead.countDocuments();
    const verifiedLeads = await Lead.countDocuments({ paymentVerified: true });

    res.status(200).json({
      success: true,
      totalLeads,
      verifiedLeads,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment proof image
// @route   GET /api/leads/payment-proof/:id
// @access  Private
export const getPaymentProof = async (req, res, next) => {
  try {
    const paymentProof = await PaymentProof.findById(req.params.id);
    
    if (!paymentProof) {
      return res.status(404).json({
        success: false,
        message: "Payment proof not found",
      });
    }

    // Check if user is authorized (owner or admin)
    const lead = await Lead.findOne({ paymentProof: paymentProof._id });
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (lead.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this payment proof",
      });
    }

    const fileBuffer = await downloadFromGridFS(paymentProof.gridFsId);
    
    res.set("Content-Type", paymentProof.contentType);
    res.set("Content-Disposition", `inline; filename="${paymentProof.filename}"`);
    res.send(fileBuffer);
  } catch (error) {
    next(error);
  }
};
