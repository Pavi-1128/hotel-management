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

/**
 * @swagger
 * /api/bookings/my-bookings:
 *   get:
 *     summary: Get current user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   room:
 *                     _id: "507f1f77bcf86cd799439012"
 *                     name: "Deluxe Suite"
 *                     image: "https://example.com/room.jpg"
 *                     currentPrice: 20000
 *                     total: 22000
 *                   checkIn: "2024-01-15T00:00:00.000Z"
 *                   checkOut: "2024-01-17T00:00:00.000Z"
 *                   guests: 2
 *                   totalAmount: 44000
 *                   status: "pending"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/my-bookings', getMyBookings);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings (Manager only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               count: 10
 *               data:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   room:
 *                     _id: "507f1f77bcf86cd799439012"
 *                     name: "Deluxe Suite"
 *                   user:
 *                     _id: "507f1f77bcf86cd799439013"
 *                     email: "user@example.com"
 *                   checkIn: "2024-01-15T00:00:00.000Z"
 *                   checkOut: "2024-01-17T00:00:00.000Z"
 *                   status: "confirmed"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Manager role required
 *       500:
 *         description: Server error
 */
router.get('/', authorize('manager'), getAllBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get a single booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 room:
 *                   _id: "507f1f77bcf86cd799439012"
 *                   name: "Deluxe Suite"
 *                   image: "https://example.com/room.jpg"
 *                   currentPrice: 20000
 *                   total: 22000
 *                 user:
 *                   _id: "507f1f77bcf86cd799439013"
 *                   email: "user@example.com"
 *                 checkIn: "2024-01-15T00:00:00.000Z"
 *                 checkOut: "2024-01-17T00:00:00.000Z"
 *                 guests: 2
 *                 totalAmount: 44000
 *                 status: "pending"
 *                 guestDetails:
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   email: "john@example.com"
 *                   phone: "9876543210"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to view this booking
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getBooking);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Update booking status (Manager only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 example: "confirmed"
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Booking status updated successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 status: "confirmed"
 *       400:
 *         description: Bad request - invalid status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid status. Must be pending, confirmed, cancelled, or completed"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Manager role required
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.put('/:id/status', authorize('manager'), updateBookingStatus);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Booking cancelled successfully"
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 status: "cancelled"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               already_cancelled:
 *                 summary: Booking already cancelled
 *                 value:
 *                   success: false
 *                   message: "Booking is already cancelled"
 *               completed_booking:
 *                 summary: Cannot cancel completed booking
 *                 value:
 *                   success: false
 *                   message: "Cannot cancel completed booking"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to cancel this booking
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.put('/:id/cancel', cancelBooking);

/**
 * @swagger
 * /api/bookings/stats/overview:
 *   get:
 *     summary: Get booking statistics overview (Manager only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 totalBookings: 50
 *                 confirmedBookings: 35
 *                 pendingBookings: 10
 *                 cancelledBookings: 5
 *                 totalRevenue: 1500000
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Manager role required
 *       500:
 *         description: Server error
 */
router.get('/stats/overview', authorize('manager'), getBookingStats);

// Client routes
router.post('/', authorize('client'), validateBooking, createBooking);

module.exports = router;
