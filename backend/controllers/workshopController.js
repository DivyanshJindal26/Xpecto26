import Workshop from '../models/Workshop.js';

// @desc    Create a new workshop
// @route   POST /api/workshops
// @access  Admin only
export const createWorkshop = async (req, res, next) => {
  try {
    const workshopData = {
      ...req.body,
      availableTickets: req.body.maxCapacity || 100,
    };
    const workshop = await Workshop.create(workshopData);
    
    res.status(201).json({
      success: true,
      data: workshop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all workshops
// @route   GET /api/workshops
// @access  Public
export const getAllWorkshops = async (req, res, next) => {
  try {
    const workshops = await Workshop.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: workshops.length,
      data: workshops,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workshop by ID
// @route   GET /api/workshops/:id
// @access  Public
export const getWorkshopById = async (req, res, next) => {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found',
      });
    }

    res.status(200).json({
      success: true,
      data: workshop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update workshop
// @route   PUT /api/workshops/:id
// @access  Admin only
export const updateWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found',
      });
    }

    res.status(200).json({
      success: true,
      data: workshop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete workshop
// @route   DELETE /api/workshops/:id
// @access  Admin only
export const deleteWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Workshop deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
