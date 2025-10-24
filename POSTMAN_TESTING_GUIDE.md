# 🚀 Complete Postman Testing Guide for Hotel API

## 📋 **Step 1: Import API Specification**

### Option A: Import from URL
1. Open Postman
2. Click **"Import"** button
3. Select **"Link"** tab
4. Enter: `http://localhost:3001/api-docs/swagger.json`
5. Click **"Continue"** → **"Import"**

### Option B: Import from File
1. Open Postman
2. Click **"Import"** button
3. Select **"File"** tab
4. Choose `hotel-api-spec.json` file
5. Click **"Import"**

## 🔧 **Step 2: Set Up Environment**

### Create Environment
1. Click **"Environments"** in left sidebar
2. Click **"Create Environment"**
3. Name: `Hotel API - Local`
4. Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:3001` | `http://localhost:3001` |
| `auth_token` | (leave empty) | (leave empty) |
| `user_id` | (leave empty) | (leave empty) |

5. Click **"Save"**
6. Select the environment from dropdown (top right)

## 🔐 **Step 3: Authentication Setup**

### Test User Registration
1. Find **"Authentication"** folder
2. Select **"POST Register User"**
3. Click **"Send"** with this body:
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "password123",
  "role": "client"
}
```

### Test User Login
1. Select **"POST Login User"**
2. Click **"Send"** with this body:
```json
{
  "email": "test@example.com",
  "password": "password123",
  "role": "client"
}
```

### Save Authentication Token
1. After successful login, copy the `token` from response
2. Go to **"Environments"** → **"Hotel API - Local"**
3. Set `auth_token` variable to your token
4. Click **"Save"**

## 🏨 **Step 4: Test Room Endpoints**

### Get All Rooms
1. Select **"GET Get All Rooms"**
2. Click **"Send"**
3. Should return list of rooms

### Create Room (Manager Only)
1. First, register a manager account:
```json
{
  "firstName": "Manager",
  "lastName": "Test",
  "email": "manager@example.com",
  "password": "password123",
  "role": "manager"
}
```

2. Login with manager credentials
3. Update `auth_token` in environment
4. Select **"POST Create Room"**
5. Use this body:
```json
{
  "name": "Deluxe Suite",
  "image": "https://example.com/room.jpg",
  "capacity": 2,
  "size": "500 sq. ft.",
  "originalPrice": 20000,
  "currentPrice": 18000,
  "taxes": 2000,
  "total": 20000,
  "description": "Beautiful deluxe suite with ocean view",
  "amenities": ["WiFi", "TV", "Mini Bar", "Balcony"],
  "availability": "Available"
}
```

### Get Single Room
1. Select **"GET Get Room by ID"**
2. Replace `{id}` in URL with actual room ID from previous response
3. Click **"Send"**

### Update Room
1. Select **"PUT Update Room"**
2. Replace `{id}` in URL with room ID
3. Modify the request body as needed
4. Click **"Send"**

### Check Room Availability
1. Select **"POST Check Room Availability"**
2. Replace `{id}` in URL with room ID
3. Use this body:
```json
{
  "checkIn": "2024-12-01",
  "checkOut": "2024-12-03"
}
```

## 📅 **Step 5: Test Booking Endpoints**

### Create Booking
1. Select **"POST Create Booking"**
2. Use this body:
```json
{
  "room": "ROOM_ID_FROM_PREVIOUS_STEP",
  "checkIn": "2024-12-01",
  "checkOut": "2024-12-03",
  "guests": 2,
  "specialRequests": "Late checkout please",
  "guestDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

### Get All Bookings (Manager Only)
1. Login as manager
2. Update `auth_token`
3. Select **"GET Get All Bookings"**
4. Click **"Send"**

### Get Single Booking
1. Select **"GET Get Booking by ID"**
2. Replace `{id}` with booking ID
3. Click **"Send"**

### Update Booking Status
1. Select **"PUT Update Booking"**
2. Replace `{id}` with booking ID
3. Use this body:
```json
{
  "status": "confirmed"
}
```

## 🔧 **Step 6: Advanced Testing**

### Test Authentication Middleware
1. Try accessing protected endpoints without token
2. Should get 401 Unauthorized

### Test Role-Based Access
1. Try manager-only endpoints with client token
2. Should get 403 Forbidden

### Test Error Handling
1. Send invalid data to endpoints
2. Check error responses

## 📊 **Step 7: Collection Runner (Automated Testing)**

### Create Test Scripts
Add this to **"Tests"** tab in any request:

```javascript
// Test for successful response
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test for response structure
pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
});

// Save token automatically
if (pm.response.json().token) {
    pm.environment.set("auth_token", pm.response.json().token);
}
```

### Run Collection
1. Click **"Collection Runner"**
2. Select your collection
3. Choose environment
4. Click **"Start Test"**

## 🎯 **Step 8: Test Scenarios**

### Scenario 1: Complete Booking Flow
1. Register user → Login → Get rooms → Create booking → Check booking

### Scenario 2: Manager Workflow
1. Register manager → Login → Create room → View all bookings → Update booking

### Scenario 3: Error Testing
1. Invalid credentials → Missing fields → Unauthorized access

## 🔍 **Step 9: Monitoring & Debugging**

### Check Request/Response
1. Click **"Console"** tab in Postman
2. View detailed request/response logs
3. Debug any issues

### Environment Variables
- Use `{{base_url}}` in URLs
- Use `{{auth_token}}` in Authorization headers
- Use `{{user_id}}` for user-specific requests

## 📝 **Step 10: Export & Share**

### Export Collection
1. Right-click collection → **"Export"**
2. Choose **"Collection v2.1"**
3. Save and share with team

### Export Environment
1. Right-click environment → **"Export"**
2. Share environment variables

## 🚨 **Common Issues & Solutions**

### Issue: 401 Unauthorized
**Solution**: Check if token is set in environment and Authorization header

### Issue: 403 Forbidden
**Solution**: Ensure you're using manager account for manager-only endpoints

### Issue: 400 Bad Request
**Solution**: Check request body format and required fields

### Issue: 404 Not Found
**Solution**: Verify URL and resource ID

## 🎉 **You're Ready!**

Your API is now fully testable in Postman with:
- ✅ Complete endpoint coverage
- ✅ Authentication handling
- ✅ Environment variables
- ✅ Test scripts
- ✅ Error handling
- ✅ Automated testing

Happy Testing! 🚀
