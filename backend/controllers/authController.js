import jwt from 'jsonwebtoken';

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
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d', issuer: 'xpecto-api' }
    );

    // Set token in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
    });

    // Redirect to frontend success page
    res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
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
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public (but should have valid cookie)
export const logout = (req, res) => {
  // Clear the cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
  });

  req.logout((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error logging out' 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  });
};
