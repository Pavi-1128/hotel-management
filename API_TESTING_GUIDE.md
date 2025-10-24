# 🧪 API Testing Guide for Hotel Booking System

## 🚀 Quick Start

### 1. Start the Server
```bash
cd backend
npm start
```
Server will run on: `http://localhost:3001`

### 2. Access Swagger Documentation
Open in browser: **http://localhost:3001/api-docs/**

## 📋 Available Endpoints

### 🔐 Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/me` - Get current user (requires token)

### 🏨 Room Management
- **GET** `/api/rooms` - Get all rooms
- **POST** `/api/rooms` - Create room (Manager only)
- **GET** `/api/rooms/{id}` - Get specific room
- **PUT** `/api/rooms/{id}` - Update room (Manager only)
- **DELETE** `/api/rooms/{id}` - Delete room (Manager only)
- **POST** `/api/rooms/{id}/availability` - Check room availability
- **GET** `/api/rooms/manager/{managerId}` - Get manager's rooms

### 📅 Booking Management
- **GET** `/api/bookings` - Get all bookings (Manager only)
- **POST** `/api/bookings` - Create new booking
- **GET** `/api/bookings/{id}` - Get specific booking
- **PUT** `/api/bookings/{id}` - Update booking
- **DELETE** `/api/bookings/{id}` - Cancel booking

## 🔑 Authentication

### Test Users
**Manager Account:**
- Email: `managertest@example.com`
- Password: `password123`
- Role: `manager`

**Client Account:**
- Email: `testuser@example.com`
- Password: `password123`
- Role: `client`

### Getting JWT Token
1. Use `/api/auth/login` endpoint
2. Copy the `token` from response
3. Use in Authorization header: `Bearer YOUR_TOKEN_HERE`

## 🧪 Testing Tips

### 1. Interactive Testing
- Use Swagger UI at `http://localhost:3001/api-docs/`
- Click "Try it out" on any endpoint
- Fill in required fields and test directly

### 2. Postman Collection
- Import the `swagger-documentation.json` file
- Set up environment variables for base URL
- Use the authentication token in headers

### 3. Test Scenarios

#### Scenario 1: Manager Workflow
1. Register/Login as manager
2. Create a room
3. View all bookings
4. Update booking status

#### Scenario 2: Client Workflow
1. Register/Login as client
2. View available rooms
3. Create a booking
4. Check booking status

## 📊 Expected Responses

### Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔒 Security Notes
- All protected routes require JWT token
- Manager routes are restricted to manager role
- Client routes are accessible to both roles
- Tokens expire after 30 days

## 🐛 Common Issues
- **401 Unauthorized**: Check if token is valid and included
- **403 Forbidden**: Check if user has correct role
- **400 Bad Request**: Check if all required fields are provided
- **404 Not Found**: Check if resource exists

## 📞 Support
If you encounter any issues, check:
1. Server is running on port 3001
2. MongoDB is connected
3. JWT token is valid and not expired
4. Required fields are provided in requests

Happy Testing! 🎉
