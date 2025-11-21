import React, { useState, useEffect } from "react";
import apiService from "../services/api";
import BookingConfirmation from "./BookingConfirmation";
import type { Booking } from "../types/api";
import { 
  validateName, 
  validateEmail, 
  validatePhoneNumber,
  validateAddress,
  validateCity,
  validateState,
  validatePincode,
  validateCheckDates,
  validateGuestCount,
  validateSpecialRequests,
  formatPhoneNumber,
  formatName,
  formatPincode,
  type ValidationResult 
} from "../utils/validation";

interface DetailedBookingFormProps {
  room: any;
  onClose: () => void;
  onBookingSuccess: () => void;
}

const DetailedBookingForm: React.FC<DetailedBookingFormProps> = ({ room, onClose, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    specialRequests: ""
  });

  const [rooms, setRooms] = useState([
    { adults: 1, children: 0 }
  ]);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [paymentOption, setPaymentOption] = useState("payLater");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  // Calculate pricing
  const calculatePricing = () => {
    if (!checkIn || !checkOut) return null;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const roomPrice = room.currentPrice || room.total || 0;
    const subtotal = roomPrice * nights;
    const taxes = subtotal * 0.08; // 8% tax
    const total = subtotal + taxes;
    
    return {
      nights,
      roomPrice,
      subtotal,
      taxes,
      total,
      originalPrice: room.originalPrice || roomPrice
    };
  };

  const pricing = calculatePricing();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Apply formatting based on field type
    if (name === 'phone') {
      processedValue = formatPhoneNumber(value);
    } else if (name === 'firstName' || name === 'lastName') {
      processedValue = formatName(value);
    } else if (name === 'pincode') {
      processedValue = formatPincode(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateField = (name: string, value: string): ValidationResult => {
    switch (name) {
      case 'firstName':
        return validateName(value, 'First name');
      case 'lastName':
        return validateName(value, 'Last name');
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhoneNumber(value);
      case 'address':
        return validateAddress(value);
      case 'city':
        return validateCity(value);
      case 'state':
        return validateState(value);
      case 'pincode':
        return validatePincode(value);
      case 'specialRequests':
        return validateSpecialRequests(value);
      default:
        return { isValid: true };
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const validation = validateField(name, value);
    
    if (!validation.isValid) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: validation.message || ''
      }));
    }
  };

  const updateRoomOccupancy = (roomIndex: number, field: 'adults' | 'children', value: number) => {
    const newRooms = [...rooms];
    newRooms[roomIndex] = {
      ...newRooms[roomIndex],
      [field]: Math.max(0, value)
    };
    setRooms(newRooms);
  };

  const addRoom = () => {
    setRooms([...rooms, { adults: 1, children: 0 }]);
  };

  const removeRoom = (index: number) => {
    if (rooms.length > 1) {
      const newRooms = rooms.filter((_, i) => i !== index);
      setRooms(newRooms);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError("");
    setFieldErrors({});

    // Validate dates
    const dateValidation = validateCheckDates(checkIn, checkOut);
    if (!dateValidation.isValid) {
      setError(dateValidation.message || "Invalid dates");
      setLoading(false);
      return;
    }

    // Validate all form fields
    const errors: {[key: string]: string} = {};
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    
    fieldsToValidate.forEach(field => {
      const validation = validateField(field, formData[field as keyof typeof formData]);
      if (!validation.isValid) {
        errors[field] = validation.message || '';
      }
    });

    // Validate special requests if provided
    if (formData.specialRequests) {
      const specialRequestsValidation = validateSpecialRequests(formData.specialRequests);
      if (!specialRequestsValidation.isValid) {
        errors.specialRequests = specialRequestsValidation.message || '';
      }
    }

    // Validate guest counts
    const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
    const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0);
    const guestValidation = validateGuestCount(totalAdults, totalChildren);
    if (!guestValidation.isValid) {
      setError(guestValidation.message || "Invalid guest count");
      setLoading(false);
      return;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const totalGuests = rooms.reduce((sum, room) => sum + room.adults + room.children, 0);
      
      const bookingData = {
        room: room._id,
        checkIn,
        checkOut,
        guests: totalGuests,
        specialRequests: formData.specialRequests,
        guestDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      };

      const response = await apiService.createBooking(bookingData);
      setCreatedBooking(response.data);
      setShowConfirmation(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create booking";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: '2-digit', 
      weekday: 'short' 
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex">
          {/* Left Column - Booking Form */}
          <div className="flex-1 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Complete Your Booking</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Select Dates</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-In Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-Out Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Guest Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {fieldErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {fieldErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <div className={`flex items-center border rounded-lg ${
                    fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}>
                  <div className="flex items-center px-3 py-3 border-r border-gray-300">
                    <span className="text-2xl mr-2">🇮🇳</span>
                    <span className="text-gray-600">+91</span>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                      placeholder="Enter 10-digit mobile number"
                    value={formData.phone}
                    onChange={handleInputChange}
                      onBlur={handleBlur}
                      maxLength={10}
                    className="flex-1 p-3 border-0 focus:outline-none focus:ring-0"
                    required
                  />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      fieldErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        fieldErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {fieldErrors.city && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        fieldErrors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {fieldErrors.state && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.state}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      maxLength={6}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        fieldErrors.pincode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {fieldErrors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.pincode}</p>
                    )}
                  </div>
                  <div>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    name="specialRequests"
                    placeholder="Special Requests (Optional)"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    rows={3}
                    maxLength={500}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      fieldErrors.specialRequests ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.specialRequests && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.specialRequests}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    {formData.specialRequests.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Room Occupancy Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Room Occupancy</h3>
                
                {rooms.map((room, index) => (
                  <div key={index} className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <span className="font-medium text-gray-700 text-lg">Room {index + 1}</span>
                    </div>
                    
                    <div className="flex-1 flex items-center gap-6">
                      {/* Adults Counter */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Adults</span>
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                          <button
                            onClick={() => updateRoomOccupancy(index, 'adults', room.adults - 1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={room.adults <= 1}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="px-4 py-2 min-w-[3rem] text-center font-medium">{room.adults}</span>
                          <button
                            onClick={() => updateRoomOccupancy(index, 'adults', room.adults + 1)}
                            className="p-2 hover:bg-gray-100 rounded-r-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Children Counter */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Children (0-10 years)</span>
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                          <button
                            onClick={() => updateRoomOccupancy(index, 'children', room.children - 1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={room.children <= 0}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="px-4 py-2 min-w-[3rem] text-center font-medium">{room.children}</span>
                          <button
                            onClick={() => updateRoomOccupancy(index, 'children', room.children + 1)}
                            className="p-2 hover:bg-gray-100 rounded-r-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Remove Room Button */}
                      {rooms.length > 1 && (
                        <button
                          onClick={() => removeRoom(index)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Another Room Button */}
                <button
                  onClick={addRoom}
                  className="flex items-center gap-2 px-4 py-2 border border-orange-300 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors bg-white"
                >
                  <span className="text-lg font-bold">+</span>
                  Add Another Room
                </button>
              </div>

              {/* Payment Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Payment Options</h3>
                
                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="payLater"
                      checked={paymentOption === "payLater"}
                      onChange={(e) => setPaymentOption(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium">I prefer to Pay Later</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <div>Pay Now: {pricing ? formatCurrency(0) : "₹0.00"}</div>
                        <div>Pay Later: {pricing ? formatCurrency(pricing.total) : "₹0.00"}</div>
                      </div>
                    </div>
                  </label>

                  <div className="border-t border-dashed border-gray-300"></div>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="payNow"
                      checked={paymentOption === "payNow"}
                      onChange={(e) => setPaymentOption(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium">I prefer to pay 100% now</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <div>Pay Now: {pricing ? formatCurrency(pricing.total) : "₹0.00"}</div>
                        <div>Pay Later: {pricing ? formatCurrency(0) : "₹0.00"}</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Booking Policy */}
              <div className="space-y-3">
                <div className="text-green-600 font-medium">Book your stay before the prices go up!</div>
                <div className="text-gray-600">Non-Refundable</div>
                <div className="text-sm text-gray-500">
                  By completing this reservation you are accepting our Terms & Conditions
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Book Now & Pay Later"}
              </button>
            </form>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="w-96 bg-gray-50 p-8 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Booking Summary</h3>
            
            {pricing && (
              <div className="space-y-4">
                {/* Dates */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check In</span>
                    <span className="font-medium">{formatDate(checkIn)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check Out</span>
                    <span className="font-medium">{formatDate(checkOut)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">No of nights</span>
                    <span className="font-medium">{pricing.nights} Night{pricing.nights !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Room</span>
                    <span className="font-medium">{room.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests</span>
                    <span className="font-medium">
                      {rooms.map((room, index) => (
                        <span key={index}>
                          Room {index + 1}: {room.adults} Adult{room.adults !== 1 ? 's' : ''}, {room.children} Child{room.children !== 1 ? 'ren' : ''}
                          {index < rooms.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room with Breakfast</span>
                      <span className="font-medium">{formatCurrency(pricing.roomPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sub Total</span>
                      <span className="font-medium">{formatCurrency(pricing.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes and Fees</span>
                      <span className="font-medium">{formatCurrency(pricing.taxes)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-500 line-through">{formatCurrency(pricing.originalPrice * pricing.nights)}</div>
                        <div className="text-lg font-bold">INR {formatCurrency(pricing.total)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Savings */}
                <div className="text-green-600 text-sm">
                  You are saving {formatCurrency((pricing.originalPrice * pricing.nights) - pricing.total)} on this deal!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showConfirmation && createdBooking && (
        <BookingConfirmation
          booking={createdBooking}
          onClose={() => {
            setShowConfirmation(false);
            onBookingSuccess();
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default DetailedBookingForm;
