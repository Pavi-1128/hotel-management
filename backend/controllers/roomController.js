const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true })
      .populate('createdBy', 'email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching rooms'
    });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('createdBy', 'email role');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching room'
    });
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Manager only)
exports.createRoom = async (req, res) => {
  try {
    const roomData = {
      ...req.body,
      createdBy: req.user.id
    };

    const room = await Room.create(roomData);

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating room'
    });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Manager only)
exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user is the creator or admin
    if (room.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating room'
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Manager only)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if user is the creator or admin
    if (room.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this room'
      });
    }

    // Soft delete by setting isActive to false
    room.isActive = false;
    await room.save();

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting room'
    });
  }
};

// @desc    Check room availability
// @route   POST /api/rooms/:id/availability
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.body;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-in and check-out dates are required'
      });
    }

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
      room: req.params.id,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ]
    });

    const isAvailable = overlappingBookings.length === 0;

    res.status(200).json({
      success: true,
      data: {
        isAvailable,
        conflictingBookings: overlappingBookings.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking availability'
    });
  }
};

// @desc    Get rooms by manager
// @route   GET /api/rooms/manager/:managerId
// @access  Private
exports.getRoomsByManager = async (req, res) => {
  try {
    const rooms = await Room.find({ 
      createdBy: req.params.managerId,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching manager rooms'
    });
  }
};
