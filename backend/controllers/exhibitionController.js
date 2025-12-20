import Exhibition from '../models/Exhibition.js';

// @desc    Create a new exhibition
// @route   POST /api/exhibitions
// @access  Public
export const createExhibition = async (req, res, next) => {
  try {
    const exhibition = await Exhibition.create(req.body);
    
    res.status(201).json({
      success: true,
      data: exhibition,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all exhibitions
// @route   GET /api/exhibitions
// @access  Public
export const getAllExhibitions = async (req, res, next) => {
  try {
    const exhibitions = await Exhibition.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: exhibitions.length,
      data: exhibitions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single exhibition by ID
// @route   GET /api/exhibitions/:id
// @access  Public
export const getExhibitionById = async (req, res, next) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);

    if (!exhibition) {
      return res.status(404).json({
        success: false,
        message: 'Exhibition not found',
      });
    }

    res.status(200).json({
      success: true,
      data: exhibition,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update exhibition
// @route   PUT /api/exhibitions/:id
// @access  Public
export const updateExhibition = async (req, res, next) => {
  try {
    const exhibition = await Exhibition.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!exhibition) {
      return res.status(404).json({
        success: false,
        message: 'Exhibition not found',
      });
    }

    res.status(200).json({
      success: true,
      data: exhibition,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete exhibition
// @route   DELETE /api/exhibitions/:id
// @access  Public
export const deleteExhibition = async (req, res, next) => {
  try {
    const exhibition = await Exhibition.findByIdAndDelete(req.params.id);

    if (!exhibition) {
      return res.status(404).json({
        success: false,
        message: 'Exhibition not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Exhibition deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
