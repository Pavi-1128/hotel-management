const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🏨 Hotel Booking API',
      version: '2.0.0',
      description: `
        <div style="font-family: 'Inter', sans-serif; line-height: 1.6;">
          <h3 style="color: #2563eb; margin-bottom: 15px;">Welcome to Hotel Booking API! 🎉</h3>
          <p style="color: #64748b; margin-bottom: 15px;">
            A comprehensive REST API for hotel room booking and management system with 
            <strong>role-based authentication</strong>, <strong>real-time validation</strong>, and 
            <strong>secure payment processing</strong>.
          </p>
          <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 15px; margin: 15px 0;">
            <h4 style="color: #0c4a6e; margin: 0 0 10px 0;">🚀 Quick Start:</h4>
            <ol style="color: #0c4a6e; margin: 0; padding-left: 20px;">
              <li>Register a new user account (Client or Manager)</li>
              <li>Login to get your authentication token</li>
              <li>Browse available rooms or create rooms (Manager only)</li>
              <li>Create bookings with detailed guest information</li>
            </ol>
          </div>
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 15px 0;">
            <h4 style="color: #92400e; margin: 0 0 10px 0;">🔐 Authentication:</h4>
            <p style="color: #92400e; margin: 0;">
              Click the <strong>"Authorize"</strong> button above and enter your Bearer token to access protected endpoints.
            </p>
          </div>
          <div style="background: #f0fdf4; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin: 15px 0;">
            <h4 style="color: #065f46; margin: 0 0 10px 0;">📱 Features:</h4>
            <ul style="color: #065f46; margin: 0; padding-left: 20px;">
              <li>User registration & authentication with phone validation</li>
              <li>Room management & availability checking</li>
              <li>Booking creation with complete guest details</li>
              <li>Real-time form validation</li>
              <li>Role-based access control (Client/Manager)</li>
              <li>Comprehensive error handling</li>
            </ul>
          </div>
        </div>
      `,
      contact: {
        name: '🏨 Hotel API Support',
        email: 'support@hotel.com',
        url: 'https://hotel-api.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'phone', 'password'],
          properties: {
            id: { 
              type: 'string',
              description: 'Unique user identifier',
              example: '507f1f77bcf86cd799439011'
            },
            firstName: { 
              type: 'string',
              description: 'User first name',
              example: 'John'
            },
            lastName: { 
              type: 'string',
              description: 'User last name',
              example: 'Doe'
            },
            email: { 
              type: 'string', 
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            phone: {
              type: 'string',
              description: '10-digit Indian mobile number',
              example: '9876543210'
            },
            role: { 
              type: 'string', 
              enum: ['client', 'manager'],
              description: 'User role',
              example: 'client'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            }
          }
        },
        Room: {
          type: 'object',
          required: ['roomNumber', 'name', 'image', 'capacity', 'size', 'originalPrice', 'currentPrice', 'taxes', 'total', 'description'],
          properties: {
            _id: { 
              type: 'string',
              description: 'Unique room identifier',
              example: '507f1f77bcf86cd799439011'
            },
            roomNumber: {
              type: 'string',
              description: 'Room number (e.g., 101, Deluxe A)',
              example: '101'
            },
            name: { 
              type: 'string',
              description: 'Room name',
              example: 'Deluxe Suite'
            },
            image: { 
              type: 'string',
              description: 'Room image URL or base64',
              example: 'https://example.com/room-image.jpg'
            },
            capacity: { 
              type: 'number',
              description: 'Maximum number of guests',
              example: 2
            },
            size: { 
              type: 'string',
              description: 'Room size',
              example: '320 sq. ft.'
            },
            originalPrice: { 
              type: 'number',
              description: 'Original room price',
              example: 25000
            },
            currentPrice: { 
              type: 'number',
              description: 'Current room price',
              example: 20000
            },
            taxes: { 
              type: 'number',
              description: 'Tax amount',
              example: 2000
            },
            total: { 
              type: 'number',
              description: 'Total price including taxes',
              example: 22000
            },
            description: { 
              type: 'string',
              description: 'Room description',
              example: 'Luxurious suite with ocean view'
            },
            amenities: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Room amenities',
              example: ['WiFi', 'Air Conditioning', 'Mini Bar']
            },
            availability: { 
              type: 'string', 
              enum: ['Available', 'Limited', 'Unavailable'],
              description: 'Room availability status',
              example: 'Available'
            },
            isActive: { 
              type: 'boolean',
              description: 'Whether room is active',
              example: true
            },
            createdBy: { 
              type: 'string',
              description: 'ID of the manager who created the room',
              example: '507f1f77bcf86cd799439011'
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Room creation timestamp'
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Room last update timestamp'
            }
          }
        },
        Booking: {
          type: 'object',
          required: ['room', 'checkIn', 'checkOut', 'guests', 'guestDetails'],
          properties: {
            _id: { 
              type: 'string',
              description: 'Unique booking identifier',
              example: '507f1f77bcf86cd799439011'
            },
            room: { 
              type: 'string',
              description: 'Room ID',
              example: '507f1f77bcf86cd799439012'
            },
            user: { 
              type: 'string',
              description: 'User ID who made the booking',
              example: '507f1f77bcf86cd799439013'
            },
            checkIn: { 
              type: 'string', 
              format: 'date',
              description: 'Check-in date',
              example: '2024-01-15'
            },
            checkOut: { 
              type: 'string', 
              format: 'date',
              description: 'Check-out date',
              example: '2024-01-17'
            },
            guests: { 
              type: 'number',
              description: 'Number of guests',
              example: 2
            },
            totalAmount: { 
              type: 'number',
              description: 'Total booking amount',
              example: 30000
            },
            status: { 
              type: 'string', 
              enum: ['pending', 'confirmed', 'cancelled', 'completed'],
              description: 'Booking status',
              example: 'pending'
            },
            specialRequests: { 
              type: 'string',
              description: 'Special requests from guest',
              example: 'Late check-in requested'
            },
            guestDetails: {
              type: 'object',
              required: ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'],
              properties: {
                firstName: { 
                  type: 'string',
                  description: 'Guest first name',
                  example: 'John'
                },
                lastName: { 
                  type: 'string',
                  description: 'Guest last name',
                  example: 'Doe'
                },
                email: { 
                  type: 'string',
                  format: 'email',
                  description: 'Guest email address',
                  example: 'john.doe@example.com'
                },
                phone: { 
                  type: 'string',
                  description: 'Guest phone number',
                  example: '9876543210'
                },
                address: {
                  type: 'string',
                  description: 'Guest address',
                  example: '123 Main Street, Apartment 4B'
                },
                city: {
                  type: 'string',
                  description: 'Guest city',
                  example: 'Mumbai'
                },
                state: {
                  type: 'string',
                  description: 'Guest state',
                  example: 'Maharashtra'
                },
                pincode: {
                  type: 'string',
                  description: 'Guest pincode',
                  example: '400001'
                }
              }
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Booking creation timestamp'
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Booking last update timestamp'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { 
              type: 'boolean',
              description: 'Indicates if the request was successful',
              example: true
            },
            message: { 
              type: 'string',
              description: 'Response message',
              example: 'Operation completed successfully'
            },
            data: { 
              type: 'object',
              description: 'Response data'
            },
            count: { 
              type: 'number',
              description: 'Number of items returned (for list endpoints)',
              example: 10
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { 
              type: 'boolean',
              example: false
            },
            message: { 
              type: 'string',
              description: 'Error message',
              example: 'Validation failed'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              },
              description: 'Detailed validation errors'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(swaggerOptions);

// Swagger JSON endpoint
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Swagger UI with modern styling
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customSiteTitle: '🏨 Hotel Booking API Documentation',
  customCss: `
    /* Modern Swagger UI Styling */
    .swagger-ui .topbar { 
      display: none !important; 
    }
    
    /* Header styling */
    .swagger-ui .info {
      margin: 20px 0;
    }
    
    .swagger-ui .info .title {
      color: #2563eb !important;
      font-size: 2.5rem !important;
      font-weight: 700 !important;
      margin-bottom: 10px !important;
    }
    
    .swagger-ui .info .description {
      font-size: 1.1rem !important;
      color: #64748b !important;
      line-height: 1.6 !important;
    }
    
    /* Tag styling */
    .swagger-ui .opblock-tag {
      border: 2px solid #e2e8f0 !important;
      border-radius: 12px !important;
      margin: 20px 0 !important;
      padding: 15px !important;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
    }
    
    .swagger-ui .opblock-tag small {
      background: #2563eb !important;
      color: white !important;
      padding: 4px 12px !important;
      border-radius: 20px !important;
      font-weight: 600 !important;
    }
    
    /* Operation block styling */
    .swagger-ui .opblock {
      border-radius: 12px !important;
      margin: 15px 0 !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
      border: 1px solid #e2e8f0 !important;
    }
    
    .swagger-ui .opblock.opblock-post {
      border-left: 4px solid #10b981 !important;
    }
    
    .swagger-ui .opblock.opblock-get {
      border-left: 4px solid #3b82f6 !important;
    }
    
    .swagger-ui .opblock.opblock-put {
      border-left: 4px solid #f59e0b !important;
    }
    
    .swagger-ui .opblock.opblock-delete {
      border-left: 4px solid #ef4444 !important;
    }
    
    /* Method badges */
    .swagger-ui .opblock .opblock-summary-method {
      border-radius: 8px !important;
      font-weight: 700 !important;
      font-size: 12px !important;
      padding: 6px 12px !important;
    }
    
    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background: #10b981 !important;
    }
    
    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: #3b82f6 !important;
    }
    
    .swagger-ui .opblock.opblock-put .opblock-summary-method {
      background: #f59e0b !important;
    }
    
    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background: #ef4444 !important;
    }
    
    /* Response styling */
    .swagger-ui .responses-inner h4,
    .swagger-ui .responses-inner h5 {
      color: #1e293b !important;
      font-weight: 600 !important;
    }
    
    .swagger-ui .response-col_status {
      font-weight: 700 !important;
    }
    
    .swagger-ui .response-col_status-200 {
      color: #10b981 !important;
    }
    
    .swagger-ui .response-col_status-201 {
      color: #10b981 !important;
    }
    
    .swagger-ui .response-col_status-400 {
      color: #f59e0b !important;
    }
    
    .swagger-ui .response-col_status-401 {
      color: #ef4444 !important;
    }
    
    .swagger-ui .response-col_status-403 {
      color: #ef4444 !important;
    }
    
    .swagger-ui .response-col_status-404 {
      color: #ef4444 !important;
    }
    
    .swagger-ui .response-col_status-500 {
      color: #ef4444 !important;
    }
    
    /* Parameter styling */
    .swagger-ui .parameter__name {
      font-weight: 600 !important;
      color: #1e293b !important;
    }
    
    .swagger-ui .parameter__type {
      color: #64748b !important;
    }
    
    /* Schema styling */
    .swagger-ui .model-title {
      color: #2563eb !important;
      font-weight: 700 !important;
    }
    
    .swagger-ui .prop-name {
      color: #1e293b !important;
      font-weight: 600 !important;
    }
    
    .swagger-ui .prop-type {
      color: #64748b !important;
    }
    
    /* Button styling */
    .swagger-ui .btn {
      border-radius: 8px !important;
      font-weight: 600 !important;
    }
    
    .swagger-ui .btn.authorize {
      background: #2563eb !important;
      border-color: #2563eb !important;
    }
    
    .swagger-ui .btn.authorize:hover {
      background: #1d4ed8 !important;
    }
    
    .swagger-ui .btn.execute {
      background: #10b981 !important;
      border-color: #10b981 !important;
    }
    
    .swagger-ui .btn.execute:hover {
      background: #059669 !important;
    }
    
    /* Code blocks */
    .swagger-ui .highlight-code {
      background: #f8fafc !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 8px !important;
    }
    
    /* Security section */
    .swagger-ui .auth-wrapper {
      background: #f8fafc !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 8px !important;
      padding: 15px !important;
    }
  `
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hotel Booking API is running",
    timestamp: new Date().toISOString(),
    version: "2.0.0"
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    availableEndpoints: [
      "GET /api/health",
      "POST /api/auth/register",
      "POST /api/auth/login", 
      "GET /api/auth/me",
      "GET /api/rooms",
      "POST /api/rooms",
      "GET /api/rooms/:id",
      "PUT /api/rooms/:id",
      "DELETE /api/rooms/:id",
      "POST /api/rooms/:id/availability",
      "GET /api/rooms/manager/:managerId",
      "POST /api/bookings",
      "GET /api/bookings/my-bookings",
      "GET /api/bookings",
      "GET /api/bookings/:id",
      "PUT /api/bookings/:id/status",
      "PUT /api/bookings/:id/cancel",
      "GET /api/bookings/stats/overview"
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hotel-booking")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI available at: http://localhost:${PORT}/api-docs`);
  console.log(`API Health Check: http://localhost:${PORT}/api/health`);
  });

module.exports = app;