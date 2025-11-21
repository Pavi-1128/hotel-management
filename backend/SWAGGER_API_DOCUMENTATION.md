# 🏨 Hotel Booking API - Swagger Documentation

## 📍 Access Swagger Documentation

**Swagger UI (Interactive Documentation):**
```
http://localhost:3001/api-docs/
```

**Swagger JSON (Raw API Spec):**
```
http://localhost:3001/api-docs/swagger.json
```

## 📚 Complete API Endpoints

### 🔐 Authentication Endpoints
- `POST /api/auth/register` - Register a new user (Client or Manager)
- `POST /api/auth/login` - Login user and get JWT token
- `GET /api/auth/me` - Get current user profile (Protected)

### 🏠 Room Endpoints
- `GET /api/rooms` - Get all active rooms (Public)
- `GET /api/rooms/:id` - Get a single room by ID (Public)
- `POST /api/rooms/:id/availability` - Check room availability for dates (Public)
- `POST /api/rooms` - Create a new room (Manager only, Protected)
- `PUT /api/rooms/:id` - Update a room (Manager only, Protected)
- `DELETE /api/rooms/:id` - Delete a room (Manager only, Protected)
- `GET /api/rooms/manager/:managerId` - Get rooms by manager ID (Protected)

### 📅 Booking Endpoints
- `POST /api/bookings` - Create a new booking (Client only, Protected)
- `GET /api/bookings/my-bookings` - Get current user's bookings (Protected)
- `GET /api/bookings` - Get all bookings (Manager only, Protected)
- `GET /api/bookings/:id` - Get a single booking by ID (Protected)
- `PUT /api/bookings/:id/status` - Update booking status (Manager only, Protected)
- `PUT /api/bookings/:id/cancel` - Cancel a booking (Protected)
- `GET /api/bookings/stats/overview` - Get booking statistics (Manager only, Protected)

### ❤️ Health Check
- `GET /api/health` - Check API health status (Public)

## 🔑 Authentication

All protected endpoints require a JWT Bearer token. To authenticate:

1. Register or login using `/api/auth/register` or `/api/auth/login`
2. Copy the `token` from the response
3. Click the **"Authorize"** button in Swagger UI
4. Enter: `Bearer <your-token>` or just `<your-token>`
5. Click "Authorize" and "Close"

## 🎯 Quick Start

1. **Start the server:**
   ```bash
   cd backend
   npm start
   ```

2. **Open Swagger UI:**
   - Navigate to: `http://localhost:3001/api-docs/`

3. **Test the API:**
   - Use the "Try it out" button on any endpoint
   - Fill in the required parameters
   - Click "Execute" to see the response

## 📋 API Features

- ✅ Complete OpenAPI 3.0 specification
- ✅ Interactive API testing interface
- ✅ Request/Response examples
- ✅ Authentication support (JWT Bearer tokens)
- ✅ Error response documentation
- ✅ Role-based access control documentation
- ✅ Comprehensive schema definitions

## 🔒 Role-Based Access

- **Client**: Can create bookings, view own bookings, cancel own bookings
- **Manager**: Can manage rooms, view all bookings, update booking status, view statistics

## 📝 Notes

- All dates should be in ISO format: `YYYY-MM-DD`
- Phone numbers must be 10-digit Indian mobile numbers
- JWT tokens expire after 30 days (configurable)
- Room images can be provided as URLs or base64 strings

---

**Last Updated:** 2024
**API Version:** 2.0.0

