import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Send a denial email to the user
 */
export const sendDenialEmail = async (toEmail, userName, proniteTitle, reason) => {
  const mailOptions = {
    from: `"XPECTO'26" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Registration Denied - ${proniteTitle} | XPECTO'26`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #1a1a2e;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 4px; color: #ffffff;">XPECTO'26</h1>
          <p style="margin: 8px 0 0; font-size: 12px; letter-spacing: 2px; color: #888;">HIMALAYAS' BIGGEST TECHFEST</p>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #ccc; margin-bottom: 8px;">Hi ${userName},</p>
          <p style="font-size: 14px; color: #aaa; line-height: 1.6;">
            We regret to inform you that your registration for <strong style="color: #ff6b6b;">${proniteTitle}</strong> has been denied.
          </p>
          <div style="background: #1a1a2e; border-left: 3px solid #ff6b6b; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 4px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Reason</p>
            <p style="margin: 0; font-size: 14px; color: #ff6b6b;">${reason}</p>
          </div>
          <p style="font-size: 14px; color: #aaa; line-height: 1.6;">
            You may re-register with a valid payment proof. If you believe this was an error, please contact us.
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #1a1a2e; text-align: center;">
            <p style="font-size: 12px; color: #555;">© 2026 XPECTO | IIT Mandi</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

/**
 * Send an approval email with QR code to the user
 */
export const sendApprovalEmail = async (toEmail, userName, proniteTitle, qrDataUrl) => {
  // Convert base64 data URL to buffer
  const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
  const qrBuffer = Buffer.from(base64Data, "base64");

  const mailOptions = {
    from: `"XPECTO'26" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Registration Approved - ${proniteTitle} | XPECTO'26`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #1a1a2e;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 4px; color: #ffffff;">XPECTO'26</h1>
          <p style="margin: 8px 0 0; font-size: 12px; letter-spacing: 2px; color: #888;">HIMALAYAS' BIGGEST TECHFEST</p>
        </div>
        <div style="padding: 30px; text-align: center;">
          <p style="font-size: 16px; color: #ccc; margin-bottom: 8px;">Hi ${userName},</p>
          <p style="font-size: 14px; color: #aaa; line-height: 1.6;">
            Your registration for <strong style="color: #4ade80;">${proniteTitle}</strong> has been <strong style="color: #4ade80;">approved!</strong>
          </p>
          <div style="background: #1a1a2e; padding: 24px; margin: 24px 0; border-radius: 12px;">
            <p style="margin: 0 0 12px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Your Entry QR Code</p>
            <img src="cid:qrcode" alt="QR Code" style="width: 200px; height: 200px; border-radius: 8px;" />
            <p style="margin: 12px 0 0; font-size: 11px; color: #666;">Show this QR at the venue entrance</p>
          </div>
          <p style="font-size: 13px; color: #888; line-height: 1.6;">
            Please save this QR code. You will need to present it at the event entrance for verification.
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #1a1a2e;">
            <p style="font-size: 12px; color: #555;">© 2026 XPECTO | IIT Mandi</p>
          </div>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: "qrcode.png",
        content: qrBuffer,
        cid: "qrcode",
        contentDisposition: "inline",
        contentType: "image/png",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};
