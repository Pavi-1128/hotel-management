const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API is running and get server information
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Hotel Booking API is running"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 *                 version:
 *                   type: string
 *                   example: "2.0.0"
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hotel Booking API is running",
    timestamp: new Date().toISOString(),
    version: "2.0.0"
  });
});

module.exports = router;

