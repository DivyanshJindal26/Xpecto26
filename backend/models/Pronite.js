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
    // Google Sheet config — supports up to 4 response sheets per pronite
    // Form 1: ₹199, Forms 2-4: ₹100 each. Eligible = total paid ≥ ₹199.
    spreadsheetId: { type: String, trim: true },
    sheetTabName: { type: String, trim: true, default: "Form Responses 1" },
    spreadsheetId2: { type: String, trim: true },
    sheetTabName2: { type: String, trim: true, default: "Form Responses 1" },
    spreadsheetId3: { type: String, trim: true },
    sheetTabName3: { type: String, trim: true, default: "Form Responses 1" },
    spreadsheetId4: { type: String, trim: true },
    sheetTabName4: { type: String, trim: true, default: "Form Responses 1" },
  },
  { timestamps: true }
);

const Pronite = mongoose.model("Pronite", proniteSchema);
export default Pronite;
