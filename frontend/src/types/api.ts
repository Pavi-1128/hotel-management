// API Types for Hotel Booking Application

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'client' | 'manager';
}

export interface Room {
  _id: string;
  name: string;
  image: string;
  capacity: number;
  size: string;
  originalPrice: number;
  currentPrice: number;
  taxes: number;
  total: number;
  description: string;
  amenities: string[];
  availability: 'Available' | 'Limited' | 'Unavailable';
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  room: Room | string;
  user: User | string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}



export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export interface BookingData {
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface RoomAvailabilityRequest {
  checkIn: string;
  checkOut: string;
}

export interface RoomAvailabilityResponse {
  isAvailable: boolean;
  conflictingBookings: number;
}
