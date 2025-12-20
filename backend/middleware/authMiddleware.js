import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  // Get token from cookie
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied' 
    });
  }
  
  try {
    // Verify token with issuer validation
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'xpecto-api'
    });
    
    // Validate decoded payload
    if (!decoded.id || !decoded.email) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token payload' 
      });
    }
    
    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired, please login again' 
      });
    }
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};

// Admin middleware - use after authMiddleware
export const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

export default authMiddleware;
