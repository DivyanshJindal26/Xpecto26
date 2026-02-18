import Sponsor from '../models/Sponsor.js';

// @desc    Create a new sponsor
// @route   POST /api/sponsors
// @access  Admin
export const createSponsor = async (req, res, next) => {
  try {
    const sponsor = await Sponsor.create(req.body);
    res.status(201).json({ success: true, data: sponsor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sponsors
// @route   GET /api/sponsors
// @access  Public
export const getAllSponsors = async (req, res, next) => {
  try {
    const sponsors = await Sponsor.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: sponsors.length, data: sponsors });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single sponsor by ID
// @route   GET /api/sponsors/:id
// @access  Public
export const getSponsorById = async (req, res, next) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    res.status(200).json({ success: true, data: sponsor });
  } catch (error) {
    next(error);
  }
};

// @desc    Update sponsor
// @route   PUT /api/sponsors/:id
// @access  Admin
export const updateSponsor = async (req, res, next) => {
  try {
    const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    res.status(200).json({ success: true, data: sponsor });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete sponsor
// @route   DELETE /api/sponsors/:id
// @access  Admin
export const deleteSponsor = async (req, res, next) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    res.status(200).json({ success: true, message: 'Sponsor deleted successfully', data: {} });
  } catch (error) {
    next(error);
  }
};
