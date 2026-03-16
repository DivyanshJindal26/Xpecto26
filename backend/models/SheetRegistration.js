import mongoose from "mongoose";
import crypto from "crypto";

// Lightweight registration record synced from Google Sheet responses.
// One document per unique (email, pronite) pair.
const sheetRegistrationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    college: { type: String, trim: true },
    transactionId: { type: String, trim: true },
    paymentProofUrl: { type: String, trim: true },
    noOfTickets: { type: Number },
    amount: { type: String, trim: true },
    pronite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pronite",
      required: true,
    },
    // Row index in the sheet (1-based, excluding header) for reference
    rowIndex: { type: Number },
    // QR token generated on demand
    qrToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    qrEmailSent: { type: Boolean, default: false },
    // Entry scan tracking
    scanned: { type: Boolean, default: false },
    scannedAt: { type: Date },
    scannedBy: { type: String },
  },
  { timestamps: true }
);

// One record per person per pronite — 1 QR per email
sheetRegistrationSchema.index({ email: 1, pronite: 1 }, { unique: true });

sheetRegistrationSchema.methods.generateQrToken = function () {
  this.qrToken = crypto.randomBytes(32).toString("hex");
  return this.qrToken;
};

const SheetRegistration = mongoose.model(
  "SheetRegistration",
  sheetRegistrationSchema
);
export default SheetRegistration;
