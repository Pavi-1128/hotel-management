const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Client only)
exports.createBooking = async (req, res) => {
  try {
    const { room, checkIn, checkOut, guests, specialRequests, guestDetails } = req.body;

    // Validate required fields
    if (!room || !checkIn || !checkOut || !guests || !guestDetails) {
      return res.status(400).json({
        success: false,
        message: 'Room, dates, guests, and guest details are required'
      });
    }

    // Check if room exists and is active
    const roomData = await Room.findById(room);
    if (!roomData || !roomData.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or not available'
      });
    }

    // Check if room is available for the selected dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      room: room,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available for the selected dates'
      });
    }

    // Calculate total amount
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalAmount = roomData.total * nights;

    // Create booking
    const bookingData = {
      room,
      user: req.user.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalAmount,
      specialRequests,
      guestDetails
    };

    const booking = await Booking.create(bookingData);

    // Populate room and user details
    await booking.populate('room', 'name currentPrice total');
    await booking.populate('user', 'email');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating booking'
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('room', 'name image currentPrice total')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching bookings'
    });
  }
};

// @desc    Get all bookings (Manager only)
// @route   GET /api/bookings
// @access  Private (Manager only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room', 'name image')
      .populate('user', 'email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching bookings'
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room', 'name image currentPrice total')
      .populate('user', 'email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is a manager
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching booking'
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Manager only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, confirmed, cancelled, or completed'
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating booking status'
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is a manager
    if (booking.user.toString() !== req.user.id && req.user.role !== 'manager') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error cancelling booking'
    });
  }
};

// @desc    Get booking statistics (Manager only)
// @route   GET /api/bookings/stats
// @access  Private (Manager only)
exports.getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Calculate total revenue
    const revenueResult = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching booking statistics'
    });
  }
};
