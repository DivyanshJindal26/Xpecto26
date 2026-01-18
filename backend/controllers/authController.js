import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
export const googleCallback = (req, res) => {
  try {
    // Validate user object
    if (!req.user || !req.user._id) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: req.user._id.toString(),
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d", issuer: "xpecto-api" },
    );

    // Set token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : undefined,
    });

    // Redirect to frontend success page
    res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
};

// @desc    Google One Tap / ID token sign-in
// @route   POST /api/auth/google-onetap
// @access  Public
export const googleOneTap = async (req, res) => {
  try {
    const { id_token } = req.body;

    if (!id_token) {
      return res
        .status(400)
        .json({ success: false, message: "id_token is required" });
    }

    // Verify token using google-auth-library
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Google ID token" });
    }

    const payload = ticket.getPayload();

    // Basic checks
    const issuers = ["accounts.google.com", "https://accounts.google.com"];
    if (!payload || !issuers.includes(payload.iss) || !payload.email) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const name = payload.name || "";
    const picture = payload.picture || undefined;

    // Find or create user
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        googleId,
        name: name || email.split("@")[0],
        email,
        avatar: picture,
      });
    } else {
      // Update googleId or avatar if missing/changed
      let changed = false;
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        changed = true;
      }
      if (picture && user.avatar !== picture) {
        user.avatar = picture;
        changed = true;
      }
      if (changed) await user.save();
    }

    // Sign JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d", issuer: "xpecto-api" },
    );

    // Set token cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.COOKIE_DOMAIN
          : undefined,
    });

    // Return user info
    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("googleOneTap error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        role: req.user.role,
        collegeEmail: req.user.collegeEmail,
        collegeName: req.user.collegeName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Complete user profile
// @route   PUT /api/auth/complete-profile
// @access  Private
export const completeProfile = async (req, res) => {
  try {
    const { collegeEmail, collegeName } = req.body;

    // Validation
    if (!collegeEmail || !collegeName) {
      return res.status(400).json({
        success: false,
        message: "College email and college name are required",
      });
    }

    // Update user profile
    req.user.collegeEmail = collegeEmail;
    req.user.collegeName = collegeName;
    await req.user.save();

    res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        role: req.user.role,
        collegeEmail: req.user.collegeEmail,
        collegeName: req.user.collegeName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public (but should have valid cookie)
export const logout = (req, res) => {
  // Clear the cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
  });

  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error logging out",
      });
    }
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
};
