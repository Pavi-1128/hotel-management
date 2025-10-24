const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  checkAvailability,
  getRoomsByManager
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all active rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Rooms retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   name: "Deluxe Suite"
 *                   capacity: 2
 *                   currentPrice: 15000
 *                   availability: "Available"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Server error occurred while retrieving rooms"
 */
router.get('/', getRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get a single room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request - invalid room ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid room ID format"
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Room not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Server error occurred while retrieving room"
 */
router.get('/:id', getRoom);

/**
 * @swagger
 * /api/rooms/{id}/availability:
 *   post:
 *     summary: Check room availability for given dates
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - checkIn
 *               - checkOut
 *             properties:
 *               checkIn:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               checkOut:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-17"
 *     responses:
 *       200:
 *         description: Availability checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 isAvailable: true
 *                 conflictingBookings: 0
 *       400:
 *         description: Bad request - invalid dates
 *       500:
 *         description: Server error
 */
router.post('/:id/availability', checkAvailability);

// Protected routes
router.use(protect);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room (Manager only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Manager role required
 */
router.post('/', authorize('manager'), createRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update a room (Manager only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Manager role required
 *       404:
 *         description: Room not found
 */
router.put('/:id', authorize('manager'), updateRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete a room (Manager only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Manager role required
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authorize('manager'), deleteRoom);

/**
 * @swagger
 * /api/rooms/manager/{managerId}:
 *   get:
 *     summary: Get rooms by manager ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: managerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Manager ID
 *     responses:
 *       200:
 *         description: Manager rooms retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/manager/:managerId', getRoomsByManager);

module.exports = router;
