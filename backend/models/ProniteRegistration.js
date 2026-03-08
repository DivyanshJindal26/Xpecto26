import mongoose from "mongoose";
import crypto from "crypto";

const proniteRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pronite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pronite",
      required: true,
    },
    // Payment proof as base64 image or GridFS reference
    paymentProofImage: {
      type: String,
    },
    paymentProofGridFsId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
    denialReason: {
      type: String,
    },
    // QR code token - unique per registration, generated on approval
    qrToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    // Whether the QR has been scanned at entry
    scanned: {
      type: Boolean,
      default: false,
    },
    scannedAt: {
      type: Date,
    },
    scannedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent duplicate registrations
proniteRegistrationSchema.index({ user: 1, pronite: 1 }, { unique: true });

// Generate a secure QR token
proniteRegistrationSchema.methods.generateQrToken = function () {
  this.qrToken = crypto.randomBytes(32).toString("hex");
  return this.qrToken;
};

const ProniteRegistration = mongoose.model(
  "ProniteRegistration",
  proniteRegistrationSchema
);
export default ProniteRegistration;
