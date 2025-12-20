import Session from '../models/Session.js';

// @desc    Create a new session
// @route   POST /api/sessions
// @access  Public
export const createSession = async (req, res, next) => {
  try {
    const session = await Session.create(req.body);
    
    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Public
export const getAllSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find().sort({ date: 1 });
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single session by ID
// @route   GET /api/sessions/:id
// @access  Public
export const getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Public
export const updateSession = async (req, res, next) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Public
export const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
