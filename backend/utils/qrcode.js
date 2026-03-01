import QRCode from "qrcode";

/**
 * Generate a QR code data URL containing registration details
 * @param {Object} data - The data to encode in the QR code
 * @returns {Promise<string>} QR code as data URL (base64 PNG)
 */
export const generateQrCode = async (data) => {
  try {
    const qrPayload = JSON.stringify(data);
    const dataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    return dataUrl;
  } catch (error) {
    console.error("QR code generation error:", error);
    throw new Error("Failed to generate QR code");
  }
};
