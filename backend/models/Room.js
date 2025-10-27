const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Room image is required']
  },
  capacity: {
    type: Number,
    required: [true, 'Room capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  size: {
    type: String,
    required: [true, 'Room size is required'],
    trim: true
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Price cannot be negative']
  },
  currentPrice: {
    type: Number,
    required: [true, 'Current price is required'],
    min: [0, 'Price cannot be negative']
  },
  taxes: {
    type: Number,
    required: [true, 'Taxes are required'],
    min: [0, 'Taxes cannot be negative']
  },
  total: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Room description is required'],
    trim: true
  },
  amenities: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    enum: ['Available', 'Limited', 'Unavailable'],
    default: 'Available'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
roomSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Room', roomSchema);
