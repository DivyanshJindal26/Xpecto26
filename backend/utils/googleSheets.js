import { google } from "googleapis";

// Column order from the Google Form response sheet:
//   A (0): Timestamp
//   B (1): Email
//   C (2): Full Name
//   D (3): ProNite Date   ("14 March" / "15 March" / "16 March")
//   E (4): Phone
//   F (5): College
//   G (6): Payment Proof  (Google Drive file URL)
//   H (7): Transaction ID

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const TAB_NAME = process.env.GOOGLE_SHEETS_TAB_NAME || "Form Responses 1";

/**
 * Fetch rows from the sheet filtered by a ProNite Date label.
 * @param {string} dateLabel  e.g. "14 March"
 */
export async function fetchSheetRows(dateLabel) {
  if (!SPREADSHEET_ID) {
    throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not set");
  }
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL is not set");
  }
  if (!process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error("GOOGLE_PRIVATE_KEY is not set");
  }

  // The private key in .env is stored with literal \n — convert them to real newlines
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  // Explicitly obtain an access token before making the API call
  await auth.authorize();

  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${TAB_NAME}'!A2:H`,
  });

  const rows = response.data.values || [];
  return rows
    .map((row, index) => ({
      rowIndex: index + 2,
      timestamp: row[0] || "",
      email: (row[1] || "").trim().toLowerCase(),
      name: (row[2] || "").trim(),
      proniteDate: (row[3] || "").trim(),
      phone: (row[4] || "").trim(),
      college: (row[5] || "").trim(),
      paymentProofUrl: (row[6] || "").trim(),
      transactionId: (row[7] || "").trim(),
    }))
    .filter((r) => r.email && r.proniteDate === dateLabel);
}
