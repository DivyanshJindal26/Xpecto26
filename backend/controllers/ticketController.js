import Ticket from '../models/Ticket.js';
import Workshop from '../models/Workshop.js';
import Pronite from '../models/Pronite.js';
import Event from '../models/Event.js';

// Get model based on itemType
const getModel = (itemType) => {
  switch (itemType) {
    case 'Workshop':
      return Workshop;
    case 'Pronite':
      return Pronite;
    case 'Event':
      return Event;
    default:
      throw new Error('Invalid item type');
  }
};

// @desc    Purchase ticket(s)
// @route   POST /api/tickets
// @access  Private (authenticated users)
export const purchaseTicket = async (req, res, next) => {
  try {
    const { itemType, itemId, quantity = 1 } = req.body;
    const userId = req.user._id;

    // Validate item type
    if (!['Workshop', 'Pronite', 'Event'].includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item type. Must be Workshop, Pronite, or Event',
      });
    }

    // Get the item
    const Model = getModel(itemType);
    const item = await Model.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `${itemType} not found`,
      });
    }

    // Check if enough tickets available
    if (item.availableTickets < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${item.availableTickets} tickets available`,
      });
    }

    // Calculate total price
    const totalPrice = item.ticketPrice * quantity;

    // Create ticket
    const ticket = await Ticket.create({
      user: userId,
      itemType,
      itemId,
      quantity,
      totalPrice,
      status: 'confirmed',
      paymentStatus: totalPrice === 0 ? 'paid' : 'unpaid',
    });

    // Update available tickets
    item.availableTickets -= quantity;
    await item.save();

    // Populate ticket with item details
    await ticket.populate('itemId');
    await ticket.populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: ticket,
      message: `Successfully purchased ${quantity} ticket(s)`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's tickets
// @route   GET /api/tickets/my-tickets
// @access  Private
export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('itemId')
      .sort({ purchasedAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets (admin)
// @route   GET /api/tickets
// @access  Admin only
export const getAllTickets = async (req, res, next) => {
  try {
    const { itemType, itemId } = req.query;
    
    let query = {};
    if (itemType) query.itemType = itemType;
    if (itemId) query.itemId = itemId;

    const tickets = await Ticket.find(query)
      .populate('user', 'name email')
      .populate('itemId')
      .sort({ purchasedAt: -1 });

    // Calculate stats
    const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.totalPrice, 0);

    res.status(200).json({
      success: true,
      count: tickets.length,
      stats: {
        totalTickets,
        totalRevenue,
      },
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel ticket
// @route   DELETE /api/tickets/:id
// @access  Private (own tickets) or Admin
export const cancelTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Check if user owns the ticket or is admin
    if (ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this ticket',
      });
    }

    // Only allow cancellation if ticket is confirmed
    if (ticket.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Ticket already cancelled',
      });
    }

    // Update ticket status
    ticket.status = 'cancelled';
    ticket.paymentStatus = 'refunded';
    await ticket.save();

    // Return tickets to available pool
    const Model = getModel(ticket.itemType);
    const item = await Model.findById(ticket.itemId);
    if (item) {
      item.availableTickets += ticket.quantity;
      await item.save();
    }

    res.status(200).json({
      success: true,
      data: ticket,
      message: 'Ticket cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket statistics for an item
// @route   GET /api/tickets/stats/:itemType/:itemId
// @access  Admin only
export const getTicketStats = async (req, res, next) => {
  try {
    const { itemType, itemId } = req.params;

    const tickets = await Ticket.find({ 
      itemType, 
      itemId,
      status: { $ne: 'cancelled' }
    });

    const totalSold = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.totalPrice, 0);

    const Model = getModel(itemType);
    const item = await Model.findById(itemId);

    res.status(200).json({
      success: true,
      data: {
        totalSold,
        totalRevenue,
        availableTickets: item?.availableTickets || 0,
        maxCapacity: item?.maxCapacity || 0,
        occupancyRate: item ? ((totalSold / item.maxCapacity) * 100).toFixed(2) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
