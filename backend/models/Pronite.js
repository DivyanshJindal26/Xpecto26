import mongoose from "mongoose";

const proniteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    venue: { type: String, trim: true },
    date: { type: Date },
    // Emails allowed to verify registrations (view sheet + send QR)
    verifierEmails: [{ type: String, lowercase: true, trim: true }],
    // Emails allowed to scan QR codes at entry (pronite-specific)
    scannerEmails: [{ type: String, lowercase: true, trim: true }],
    // The value in the "ProNite Date" dropdown column of the Google Form
    // that identifies this pronite's registrations (e.g. "14 March")
    googleSheetDateLabel: { type: String, trim: true },
  },
  { timestamps: true }
);

const Pronite = mongoose.model("Pronite", proniteSchema);
export default Pronite;
