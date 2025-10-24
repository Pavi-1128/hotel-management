const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateBooking } = require('../middleware/validationMiddleware');

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking (Client only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room
 *               - checkIn
 *               - checkOut
 *               - guests
 *               - guestDetails
 *             properties:
 *               room:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               checkIn:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               checkOut:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-17"
 *               guests:
 *                 type: number
 *                 example: 2
 *               specialRequests:
 *                 type: string
 *                 example: "Late check-in requested"
 *               guestDetails:
 *                 type: object
 *                 required:
 *                   - firstName
 *                   - lastName
 *                   - email
 *                   - phone
 *                   - address
 *                   - city
 *                   - state
 *                   - pincode
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "john.doe@example.com"
 *                   phone:
 *                     type: string
 *                     example: "9876543210"
 *                   address:
 *                     type: string
 *                     example: "123 Main Street"
 *                   city:
 *                     type: string
 *                     example: "Mumbai"
 *                   state:
 *                     type: string
 *                     example: "Maharashtra"
 *                   pincode:
 *                     type: string
 *                     example: "400001"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Booking created successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 room: "507f1f77bcf86cd799439012"
 *                 user: "507f1f77bcf86cd799439013"
 *                 checkIn: "2024-01-15T00:00:00.000Z"
 *                 checkOut: "2024-01-17T00:00:00.000Z"
 *                 guests: 2
 *                 totalAmount: 30000
 *                 status: "pending"
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               missing_fields:
 *                 summary: Missing required fields
 *                 value:
 *                   success: false
 *                   message: "Room, dates, guests, and guest details are required"
 *               invalid_dates:
 *                 summary: Invalid date format
 *                 value:
 *                   success: false
 *                   message: "Check-out date must be after check-in date"
 *               invalid_phone:
 *                 summary: Invalid phone number
 *                 value:
 *                   success: false
 *                   message: "Phone number must be exactly 10 digits and a valid Indian mobile number"
 *               room_unavailable:
 *                 summary: Room not available
 *                 value:
 *                   success: false
 *                   message: "Room is not available for the selected dates"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Access denied. No token provided."
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "User role 'manager' is not authorized to access this route"
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Room not found or not available"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Server error occurred while creating booking"
 */

// All booking routes require authentication
router.use(protect);

// Client routes
router.post('/', authorize('client'), validateBooking, createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

// Manager only routes
router.get('/', authorize('manager'), getAllBookings);
router.put('/:id/status', authorize('manager'), updateBookingStatus);
router.get('/stats/overview', authorize('manager'), getBookingStats);

module.exports = router;
