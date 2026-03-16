import { google } from "googleapis";

// Column order from the Google Form response sheet:
//   A (0): Timestamp
//   B (1): Email (pre-filled from Google account)
//   C (2): Full Name
//   D (3): Phone
//   E (4): College
//   F (5): No of Tickets
//   G (6): Amount
//   H (7): Upload Proof Image (Google Drive file URL)
//   I (8): UTR / Transaction Number

/**
 * Fetch all rows from a specific sheet.
 * @param {string} spreadsheetId  The Google Sheets document ID
 * @param {string} tabName        The tab name (defaults to "Form Responses 1")
 */
export async function fetchSheetRows(spreadsheetId, tabName = "Form Responses 1", sheetIndex = 0) {
  if (!spreadsheetId) {
    throw new Error("spreadsheetId is not configured for this pronite");
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
    spreadsheetId,
    range: `'${tabName}'!A2:I`,
  });

  const rows = response.data.values || [];
  return rows
    .map((row, index) => ({
      rowIndex: index + 2,
      timestamp: row[0] || "",
      email: (row[1] || "").trim().toLowerCase(),
      name: (row[2] || "").trim(),
      phone: (row[3] || "").trim(),
      college: (row[4] || "").trim(),
      noOfTickets: parseInt(row[5], 10) || null,
      amount: (row[6] || "").trim(),
      paymentProofUrl: (row[7] || "").trim(),
      transactionId: (row[8] || "").trim(),
    }))
    .filter((r) => r.email);
}
