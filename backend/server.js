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
      version: '1.0.0',
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
              <li>Register a new user account</li>
              <li>Login to get your authentication token</li>
              <li>Browse available rooms</li>
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
              <li>User registration & authentication</li>
              <li>Room management & availability checking</li>
              <li>Booking creation with guest details</li>
              <li>Real-time form validation</li>
              <li>Role-based access control (Client/Manager)</li>
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
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['client', 'manager'] }
          }
        },
        Room: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            image: { type: 'string' },
            capacity: { type: 'number' },
            size: { type: 'string' },
            originalPrice: { type: 'number' },
            currentPrice: { type: 'number' },
            taxes: { type: 'number' },
            total: { type: 'number' },
            description: { type: 'string' },
            amenities: { type: 'array', items: { type: 'string' } },
            availability: { type: 'string', enum: ['Available', 'Limited', 'Unavailable'] },
            isActive: { type: 'boolean' },
            createdBy: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            room: { type: 'string' },
            user: { type: 'string' },
            checkIn: { type: 'string', format: 'date' },
            checkOut: { type: 'string', format: 'date' },
            guests: { type: 'number' },
            totalAmount: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'] },
            specialRequests: { type: 'string' },
            guestDetails: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            count: { type: 'number' }
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
  apis: ['./routes/*.js', './controllers/*.js']
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
    
    /* Button styling */
    .swagger-ui .btn {
      border-radius: 8px !important;
      font-weight: 600 !important;
      padding: 8px 16px !important;
    }
    
    .swagger-ui .btn.execute {
      background: #2563eb !important;
      border-color: #2563eb !important;
    }
    
    .swagger-ui .btn.execute:hover {
      background: #1d4ed8 !important;
      border-color: #1d4ed8 !important;
    }
    
    /* Input styling */
    .swagger-ui input[type="text"],
    .swagger-ui input[type="email"],
    .swagger-ui input[type="password"],
    .swagger-ui textarea {
      border: 2px solid #e2e8f0 !important;
      border-radius: 8px !important;
      padding: 10px 12px !important;
      font-size: 14px !important;
    }
    
    .swagger-ui input:focus,
    .swagger-ui textarea:focus {
      border-color: #2563eb !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
    }
    
    /* Code blocks */
    .swagger-ui .highlight-code {
      background: #f8fafc !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 8px !important;
    }
    
    /* Schema styling */
    .swagger-ui .model {
      background: #f8fafc !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 8px !important;
    }
    
    /* Security section */
    .swagger-ui .auth-wrapper {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%) !important;
      border: 1px solid #f59e0b !important;
      border-radius: 12px !important;
      padding: 20px !important;
      margin: 20px 0 !important;
    }
    
    /* Try it out section */
    .swagger-ui .opblock-section {
      background: #f8fafc !important;
      border-radius: 8px !important;
      margin: 10px 0 !important;
    }
    
    /* Error examples styling */
    .swagger-ui .examples {
      background: #fef2f2 !important;
      border: 1px solid #fecaca !important;
      border-radius: 8px !important;
      padding: 15px !important;
    }
    
    /* Success examples styling */
    .swagger-ui .examples .example {
      background: #f0fdf4 !important;
      border: 1px solid #bbf7d0 !important;
      border-radius: 8px !important;
      padding: 15px !important;
    }
    
    /* Overall container */
    .swagger-ui {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      max-width: 1200px !important;
      margin: 0 auto !important;
      padding: 20px !important;
    }
    
    /* Loading animation */
    .swagger-ui .loading-container {
      text-align: center !important;
      padding: 40px !important;
    }
    
    .swagger-ui .loading-container::after {
      content: "🏨 Loading Hotel API Documentation..." !important;
      font-size: 18px !important;
      color: #2563eb !important;
      font-weight: 600 !important;
    }
  `,
  customJs: `
    // Add modern interactions
    document.addEventListener('DOMContentLoaded', function() {
      // Add smooth scrolling
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
      
      // Add copy to clipboard functionality
      const copyButtons = document.querySelectorAll('.copy-to-clipboard');
      copyButtons.forEach(button => {
        button.addEventListener('click', function() {
          const text = this.getAttribute('data-copy');
          navigator.clipboard.writeText(text).then(() => {
            this.textContent = 'Copied!';
            setTimeout(() => {
              this.textContent = 'Copy';
            }, 2000);
          });
        });
      });
      
      // Add search functionality
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder = '🔍 Search endpoints...';
      searchInput.style.cssText = \`
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 16px;
        margin: 20px 0;
        background: white;
      \`;
      
      const mainContainer = document.querySelector('.swagger-ui');
      if (mainContainer) {
        mainContainer.insertBefore(searchInput, mainContainer.firstChild);
        
        searchInput.addEventListener('input', function() {
          const searchTerm = this.value.toLowerCase();
          const endpoints = document.querySelectorAll('.opblock');
          
          endpoints.forEach(endpoint => {
            const text = endpoint.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
              endpoint.style.display = 'block';
            } else {
              endpoint.style.display = 'none';
            }
          });
        });
      }
    });
  `
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

// Basic health route
app.get("/", (req, res) => res.send({ ok: true, message: "Hotel backend running" }));

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger UI available at: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = app;
