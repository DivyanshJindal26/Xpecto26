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
    // Google Sheet config for this specific pronite's form responses
    spreadsheetId: { type: String, trim: true },
    sheetTabName: { type: String, trim: true, default: "Form Responses 1" },
  },
  { timestamps: true }
);

const Pronite = mongoose.model("Pronite", proniteSchema);
export default Pronite;
