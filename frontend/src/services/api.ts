// API Service Layer for Hotel Booking Application
import type {
  User,
  Room,
  Booking,
  ApiResponse,
  LoginCredentials,
  RegisterData,
  BookingData,
  RoomAvailabilityResponse
} from '../types/api';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;
  
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Helper method to handle API responses
  async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  }

  // Authentication APIs
  async register(userData: RegisterData): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(response);
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Room APIs
  async getRooms(): Promise<ApiResponse<Room[]>> {
    const response = await fetch(`${this.baseURL}/rooms`);
    return this.handleResponse(response);
  }

  async getRoom(id: string): Promise<ApiResponse<Room>> {
    const response = await fetch(`${this.baseURL}/rooms/${id}`);
    return this.handleResponse(response);
  }

  async createRoom(roomData: Partial<Room>): Promise<ApiResponse<Room>> {
    const response = await fetch(`${this.baseURL}/rooms`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(roomData),
    });
    return this.handleResponse(response);
  }

  async updateRoom(id: string, roomData: Partial<Room>): Promise<ApiResponse<Room>> {
    const response = await fetch(`${this.baseURL}/rooms/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(roomData),
    });
    return this.handleResponse(response);
  }

  async deleteRoom(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${this.baseURL}/rooms/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async checkRoomAvailability(roomId: string, checkIn: string, checkOut: string): Promise<ApiResponse<RoomAvailabilityResponse>> {
    const response = await fetch(`${this.baseURL}/rooms/${roomId}/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ checkIn, checkOut }),
    });
    return this.handleResponse(response);
  }

  // Booking APIs
  async createBooking(bookingData: BookingData): Promise<ApiResponse<Booking>> {
    const response = await fetch(`${this.baseURL}/bookings`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });
    return this.handleResponse(response);
  }

  async getMyBookings(): Promise<ApiResponse<Booking[]>> {
    const response = await fetch(`${this.baseURL}/bookings/my-bookings`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getAllBookings(): Promise<ApiResponse<Booking[]>> {
    const response = await fetch(`${this.baseURL}/bookings`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getBooking(id: string): Promise<ApiResponse<Booking>> {
    const response = await fetch(`${this.baseURL}/bookings/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    const response = await fetch(`${this.baseURL}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateBookingStatus(id: string, status: string): Promise<ApiResponse<Booking>> {
    const response = await fetch(`${this.baseURL}/bookings/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return this.handleResponse(response);
  }

  async getBookingStats(): Promise<ApiResponse<any>> {
    const response = await fetch(`${this.baseURL}/bookings/stats/overview`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }



  // Utility methods
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('savedRoomIds');
  }

  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      return !!(token && user);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  getCurrentUserFromStorage(): User | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user from storage:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
