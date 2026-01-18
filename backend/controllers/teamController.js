import Team from "../models/Team.js";

// @desc    Create a new team member
// @route   POST /api/team
// @access  Admin only
export const createTeamMember = async (req, res, next) => {
  try {
    const { name, team, image, order } = req.body;

    // Validation
    if (!name || !team || !image) {
      return res.status(400).json({
        success: false,
        message: "Name, team, and image are required",
      });
    }

    const teamMember = await Team.create({
      name,
      team,
      image,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      data: teamMember,
      message: "Team member created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getAllTeamMembers = async (req, res, next) => {
  try {
    const teamMembers = await Team.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team members by team/role
// @route   GET /api/team/by-team/:team
// @access  Public
export const getTeamMembersByTeam = async (req, res, next) => {
  try {
    const teamMembers = await Team.find({ team: req.params.team }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team member by ID
// @route   GET /api/team/:id
// @access  Public
export const getTeamMemberById = async (req, res, next) => {
  try {
    const teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Admin only
export const updateTeamMember = async (req, res, next) => {
  try {
    const { name, team, image, order } = req.body;

    const teamMember = await Team.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    // Update fields if provided
    if (name !== undefined) teamMember.name = name;
    if (team !== undefined) teamMember.team = team;
    if (image !== undefined) teamMember.image = image;
    if (order !== undefined) teamMember.order = order;

    await teamMember.save();

    res.status(200).json({
      success: true,
      data: teamMember,
      message: "Team member updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Admin only
export const deleteTeamMember = async (req, res, next) => {
  try {
    const teamMember = await Team.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: "Team member deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique teams/roles
// @route   GET /api/team/teams/list
// @access  Public
export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.distinct("team");

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};
