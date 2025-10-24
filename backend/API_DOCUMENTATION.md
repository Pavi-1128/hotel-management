# Hotel Booking API Documentation

## Overview
This is a comprehensive backend API for a hotel booking application built with Node.js, Express, and MongoDB. The API supports two user roles: **Hotel Manager** and **Client**.

## Base URL
```
http://localhost:5176/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles
- **Client**: Can view rooms, book rooms, view their bookings
- **Manager**: Can manage rooms, offers, and view all bookings

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "client" // or "manager"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "client"
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "client" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "client"
  }
}
```

### Get Current User
```http
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`

---

## Room Endpoints

### Get All Rooms (Public)
```http
GET /api/rooms
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "room_id",
      "name": "Deluxe Room",
      "image": "base64_image_or_url",
      "capacity": 2,
      "size": "320 sq. ft.",
      "originalPrice": 9500,
      "currentPrice": 7600,
      "taxes": 1739.36,
      "total": 9237.04,
      "description": "Room description...",
      "amenities": ["Wi-Fi", "Air-conditioning"],
      "availability": "Available",
      "createdBy": {
        "_id": "manager_id",
        "email": "manager@hotel.com",
        "role": "manager"
      }
    }
  ]
}
```

### Get Single Room (Public)
```http
GET /api/rooms/:id
```

### Check Room Availability (Public)
```http
POST /api/rooms/:id/availability
```

**Request Body:**
```json
{
  "checkIn": "2024-02-15",
  "checkOut": "2024-02-17"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isAvailable": true,
    "conflictingBookings": 0
  }
}
```

### Create Room (Manager Only)
```http
POST /api/rooms
```
**Headers:** `Authorization: Bearer <manager_token>`

**Request Body:**
```json
{
  "name": "Presidential Suite",
  "image": "base64_image_data",
  "capacity": 4,
  "size": "800 sq. ft.",
  "originalPrice": 18000,
  "currentPrice": 14400,
  "taxes": 3297.60,
  "total": 17697.60,
  "description": "Luxurious suite with premium amenities",
  "amenities": ["Jacuzzi", "Butler Service", "Private Balcony"],
  "availability": "Available"
}
```

### Update Room (Manager Only)
```http
PUT /api/rooms/:id
```
**Headers:** `Authorization: Bearer <manager_token>`

### Delete Room (Manager Only)
```http
DELETE /api/rooms/:id
```
**Headers:** `Authorization: Bearer <manager_token>`

---

## Booking Endpoints

### Create Booking (Client Only)
```http
POST /api/bookings
```
**Headers:** `Authorization: Bearer <client_token>`

**Request Body:**
```json
{
  "room": "room_id",
  "checkIn": "2024-02-15",
  "checkOut": "2024-02-17",
  "guests": 2,
  "specialRequests": "Late check-in requested",
  "guestDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "booking_id",
    "room": {
      "_id": "room_id",
      "name": "Deluxe Room",
      "currentPrice": 7600,
      "total": 9237.04
    },
    "user": {
      "_id": "user_id",
      "email": "client@example.com"
    },
    "checkIn": "2024-02-15T00:00:00.000Z",
    "checkOut": "2024-02-17T00:00:00.000Z",
    "guests": 2,
    "totalAmount": 18474.08,
    "status": "pending",
    "guestDetails": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    }
  }
}
```

### Get My Bookings (Client)
```http
GET /api/bookings/my-bookings
```
**Headers:** `Authorization: Bearer <client_token>`

### Get All Bookings (Manager Only)
```http
GET /api/bookings
```
**Headers:** `Authorization: Bearer <manager_token>`

### Get Single Booking
```http
GET /api/bookings/:id
```
**Headers:** `Authorization: Bearer <token>`

### Update Booking Status (Manager Only)
```http
PUT /api/bookings/:id/status
```
**Headers:** `Authorization: Bearer <manager_token>`

**Request Body:**
```json
{
  "status": "confirmed" // pending, confirmed, cancelled, completed
}
```

### Cancel Booking
```http
PUT /api/bookings/:id/cancel
```
**Headers:** `Authorization: Bearer <token>`

### Get Booking Statistics (Manager Only)
```http
GET /api/bookings/stats/overview
```
**Headers:** `Authorization: Bearer <manager_token>`

---

## Offer Endpoints

### Get All Offers (Public)
```http
GET /api/offers
```

### Get Active Offers (Public)
```http
GET /api/offers/active
```

### Get Single Offer (Public)
```http
GET /api/offers/:id
```

### Create Offer (Manager Only)
```http
POST /api/offers
```
**Headers:** `Authorization: Bearer <manager_token>`

**Request Body:**
```json
{
  "title": "Early Bird Special",
  "description": "Book early and save 20%",
  "image": "base64_image_data",
  "price": "From ₹6,000/Night",
  "discountPercentage": 20,
  "validFrom": "2024-01-01",
  "validUntil": "2024-12-31"
}
```

### Update Offer (Manager Only)
```http
PUT /api/offers/:id
```
**Headers:** `Authorization: Bearer <manager_token>`

### Delete Offer (Manager Only)
```http
DELETE /api/offers/:id
```
**Headers:** `Authorization: Bearer <manager_token>`

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'client' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error message"
}
```

---

## Key Features

### Room Booking Logic
- **Double Booking Prevention**: The API prevents multiple bookings for the same room on overlapping dates
- **Date Validation**: Ensures check-out date is after check-in date
- **Automatic Pricing**: Calculates total amount based on room price and number of nights
- **Status Management**: Tracks booking status (pending, confirmed, cancelled, completed)

### Role-Based Access Control
- **Client Role**: Can only view and book rooms, manage their own bookings
- **Manager Role**: Can create/edit/delete rooms and offers, view all bookings, manage booking statuses

### Data Validation
- **MongoDB Schema Validation**: All models have comprehensive validation rules
- **JWT Authentication**: Secure token-based authentication
- **Input Sanitization**: All inputs are validated and sanitized

### Database Design
- **MongoDB Collections**: Users, Rooms, Bookings, Offers
- **Relationships**: Proper references between collections
- **Indexing**: Optimized queries with database indexes
- **Soft Deletes**: Items are marked as inactive rather than deleted

---

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update MONGO_URI in .env file

4. **Start Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

5. **Test API**
   - Use Postman or similar tool to test endpoints
   - Start with registration/login endpoints
   - Create some rooms and offers as a manager
   - Book rooms as a client

---

## Frontend Integration

The frontend should replace localStorage usage with API calls:

1. **Authentication**: Store JWT token instead of role in localStorage
2. **Rooms**: Fetch from `/api/rooms` instead of localStorage
3. **Bookings**: Create via `/api/bookings` instead of localStorage
4. **Offers**: Fetch from `/api/offers` instead of localStorage

This backend provides a complete, production-ready API for your hotel booking application with proper security, validation, and role-based access control.
