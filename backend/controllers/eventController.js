import Event from "../models/Event.js";

// @desc    Create a new event
// @route   POST /api/events
// @access  Admin only
export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Admin only
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Admin only
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is already registered
    if (event.registrations.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    // Add user to registrations
    event.registrations.push(userId);
    await event.save();

    res.status(200).json({
      success: true,
      message: "Successfully registered for the event",
      data: {
        eventId: event._id,
        eventTitle: event.title,
        registrationCount: event.registrations.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deregister from an event
// @route   DELETE /api/events/:id/register
// @access  Private
export const deregisterFromEvent = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is registered
    if (!event.registrations.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You are not registered for this event",
      });
    }
    // Remove user from registrations
    event.registrations = event.registrations.filter(
      (id) => id.toString() !== userId,
    );
    await event.save();

    res.status(200).json({
      success: true,
      message: "Successfully deregistered from the event",
      data: {
        eventId: event._id,
        eventTitle: event.title,
        registrationCount: event.registrations.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check registration status for an event
// @route   GET /api/events/:id/register/status
// @access  Private
export const getRegistrationStatus = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const isRegistered = event.registrations.includes(userId);

    res.status(200).json({
      success: true,
      data: {
        eventId: event._id,
        eventTitle: event.title,
        isRegistered,
        registrationCount: event.registrations.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations for an event
// @route   GET /api/events/:id/registrations
// @access  Admin only
export const getEventRegistrations = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "registrations",
      "name email collegeEmail collegeName",
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        eventId: event._id,
        eventTitle: event.title,
        registrationCount: event.registrations.length,
        registrations: event.registrations,
      },
    });
  } catch (error) {
    next(error);
  }
};
