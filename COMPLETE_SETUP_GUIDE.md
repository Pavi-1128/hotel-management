# 🏨 Complete Hotel Booking Application Setup Guide

## 📋 Overview
This is a complete full-stack hotel booking application with:
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Features**: User authentication, room management, booking system, offers management
- **Roles**: Hotel Manager and Client

---

## 🚀 Quick Start (Complete Application)

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone and Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your MongoDB connection string
# For local MongoDB: mongodb://localhost:27017/hotel_booking_db
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/hotel_booking_db
```

**Edit `.env` file:**
```env
MONGO_URI=mongodb://localhost:27017/hotel_booking_db
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=30d
PORT=5176
NODE_ENV=development
```

### 2. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Server
# Download from: https://www.mongodb.com/try/download/community

# Start MongoDB service
# Windows: net start MongoDB
# macOS/Linux: sudo systemctl start mongod

# Verify installation
mongod --version
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create new cluster
4. Get connection string
5. Update MONGO_URI in .env file

### 3. Start Backend Server

```bash
# In backend directory
npm run dev
# Server will start on http://localhost:5176
```

### 4. Setup Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend will start on http://localhost:3000
```

---

## 🎯 Application Features

### 🔐 Authentication System
- **JWT-based authentication**
- **Role-based access control**
- **Secure password hashing**

### 👥 User Roles

#### Hotel Manager
- ✅ Add, edit, delete rooms
- ✅ Manage special offers
- ✅ View all bookings
- ✅ Update booking statuses
- ✅ View booking statistics

#### Client
- ✅ Browse available rooms
- ✅ Book rooms with date selection
- ✅ View their bookings
- ✅ Cancel bookings
- ✅ Save favorite rooms

### 🏨 Room Management
- **Complete room details** (pricing, amenities, images)
- **Real-time availability checking**
- **Prevents double booking**
- **Automatic price calculation**

### 📅 Booking System
- **Date validation** (check-out after check-in)
- **Availability checking** before booking
- **Guest details collection**
- **Booking status management**
- **Automatic total calculation**

---

## 🗄️ Database Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  role: String (client/manager),
  createdAt: Date
}
```

### Rooms Collection
```javascript
{
  _id: ObjectId,
  name: String,
  image: String,
  capacity: Number,
  size: String,
  originalPrice: Number,
  currentPrice: Number,
  taxes: Number,
  total: Number,
  description: String,
  amenities: [String],
  availability: String,
  isActive: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  room: ObjectId (ref: Room),
  user: ObjectId (ref: User),
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalAmount: Number,
  status: String (pending/confirmed/cancelled/completed),
  guestDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Offers Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  image: String,
  price: String,
  discountPercentage: Number,
  validFrom: Date,
  validUntil: Date,
  isActive: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Rooms
- `GET /api/rooms` - Get all rooms (public)
- `GET /api/rooms/:id` - Get single room (public)
- `POST /api/rooms` - Create room (manager only)
- `PUT /api/rooms/:id` - Update room (manager only)
- `DELETE /api/rooms/:id` - Delete room (manager only)
- `POST /api/rooms/:id/availability` - Check availability (public)

### Bookings
- `POST /api/bookings` - Create booking (client only)
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings` - Get all bookings (manager only)
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/status` - Update status (manager only)

### Offers
- `GET /api/offers` - Get all offers (public)
- `GET /api/offers/active` - Get active offers (public)
- `POST /api/offers` - Create offer (manager only)
- `PUT /api/offers/:id` - Update offer (manager only)
- `DELETE /api/offers/:id` - Delete offer (manager only)

---

## 🧪 Testing the Application

### 1. Test Backend API
```bash
# Test health endpoint
curl http://localhost:5176/

# Test rooms endpoint
curl http://localhost:5176/api/rooms
```

### 2. Test Frontend
1. Open http://localhost:3000
2. Use demo credentials:
   - **Manager**: manager@hotel.com / manager123
   - **Client**: client@hotel.com / client123

### 3. Test Complete Flow

#### As Manager:
1. Login with manager credentials
2. Add some rooms with details
3. Create special offers
4. View all bookings

#### As Client:
1. Login with client credentials
2. Browse available rooms
3. Book a room with dates
4. View your bookings

---

## 🐛 Troubleshooting

### Backend Issues
```bash
# Check if MongoDB is running
mongod --version

# Check if port 5176 is available
netstat -an | grep 5176

# Check backend logs
npm run dev
```

### Frontend Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if port 3000 is available
netstat -an | grep 3000
```

### Database Issues
```bash
# Connect to MongoDB
mongo
# or
mongosh

# Check databases
show dbs

# Check collections
use hotel_booking_db
show collections
```

---

## 📁 Project Structure

```
Hotel/
├── backend/
│   ├── controllers/     # API controllers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   └── .env            # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── Pages/       # Page components
│   │   ├── services/    # API service layer
│   │   └── assets/      # Images and assets
│   ├── package.json     # Frontend dependencies
│   └── vite.config.ts   # Vite configuration
└── COMPLETE_SETUP_GUIDE.md
```

---

## 🎉 You're All Set!

Your complete hotel booking application is now ready with:

✅ **Full-stack integration**  
✅ **Database setup**  
✅ **Authentication system**  
✅ **Role-based access**  
✅ **Room management**  
✅ **Booking system**  
✅ **Offer management**  
✅ **Real-time availability**  
✅ **Error handling**  
✅ **Responsive design**  

### Next Steps:
1. **Customize styling** - Modify Tailwind classes
2. **Add more features** - Payment integration, email notifications
3. **Deploy** - Use services like Vercel (frontend) and Railway/Heroku (backend)
4. **Add tests** - Unit and integration tests
5. **Add monitoring** - Error tracking and analytics

The application is production-ready and can handle real hotel bookings! 🏨✨
