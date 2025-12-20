import Pronite from '../models/Pronite.js';

// @desc    Create a new pronite
// @route   POST /api/pronites
// @access  Admin only
export const createPronite = async (req, res, next) => {
  try {
    const proniteData = {
      ...req.body,
      availableTickets: req.body.maxCapacity || 500,
    };
    const pronite = await Pronite.create(proniteData);
    
    res.status(201).json({
      success: true,
      data: pronite,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pronites
// @route   GET /api/pronites
// @access  Public
export const getAllPronites = async (req, res, next) => {
  try {
    const pronites = await Pronite.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: pronites.length,
      data: pronites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pronite by ID
// @route   GET /api/pronites/:id
// @access  Public
export const getProniteById = async (req, res, next) => {
  try {
    const pronite = await Pronite.findById(req.params.id);

    if (!pronite) {
      return res.status(404).json({
        success: false,
        message: 'Pronite not found',
      });
    }

    res.status(200).json({
      success: true,
      data: pronite,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pronite
// @route   PUT /api/pronites/:id
// @access  Admin only
export const updatePronite = async (req, res, next) => {
  try {
    const pronite = await Pronite.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!pronite) {
      return res.status(404).json({
        success: false,
        message: 'Pronite not found',
      });
    }

    res.status(200).json({
      success: true,
      data: pronite,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pronite
// @route   DELETE /api/pronites/:id
// @access  Admin only
export const deletePronite = async (req, res, next) => {
  try {
    const pronite = await Pronite.findByIdAndDelete(req.params.id);

    if (!pronite) {
      return res.status(404).json({
        success: false,
        message: 'Pronite not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Pronite deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
