// Comprehensive validation utilities for the Hotel Booking System

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface FieldValidation {
  [key: string]: ValidationResult;
}

// Phone number validation - exactly 10 digits, no letters
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, message: "Phone number is required" };
  }
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length !== 10) {
    return { isValid: false, message: "Phone number must be exactly 10 digits" };
  }
  
  // Check if it contains any letters (shouldn't happen after cleaning, but double-check)
  if (/[a-zA-Z]/.test(phone)) {
    return { isValid: false, message: "Phone number cannot contain letters" };
  }
  
  // Check for valid Indian mobile number patterns
  const validPatterns = /^[6-9]\d{9}$/;
  if (!validPatterns.test(cleanPhone)) {
    return { isValid: false, message: "Please enter a valid Indian mobile number" };
  }
  
  return { isValid: true };
};

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }
  
  if (email.length > 100) {
    return { isValid: false, message: "Email cannot exceed 100 characters" };
  }
  
  return { isValid: true };
};

// Name validation - only letters, spaces, and common name characters
export const validateName = (name: string, fieldName: string = "Name"): ValidationResult => {
  if (!name) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (name.length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters long` };
  }
  
  if (name.length > 50) {
    return { isValid: false, message: `${fieldName} cannot exceed 50 characters` };
  }
  
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: "Password cannot exceed 128 characters" };
  }
  
  return { isValid: true };
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: "Please confirm your password" };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match" };
  }
  
  return { isValid: true };
};

// Address validation
export const validateAddress = (address: string): ValidationResult => {
  if (!address) {
    return { isValid: false, message: "Address is required" };
  }
  
  if (address.length < 10) {
    return { isValid: false, message: "Address must be at least 10 characters long" };
  }
  
  if (address.length > 200) {
    return { isValid: false, message: "Address cannot exceed 200 characters" };
  }
  
  return { isValid: true };
};

// City validation
export const validateCity = (city: string): ValidationResult => {
  if (!city) {
    return { isValid: false, message: "City is required" };
  }
  
  if (city.length < 2) {
    return { isValid: false, message: "City must be at least 2 characters long" };
  }
  
  if (city.length > 50) {
    return { isValid: false, message: "City cannot exceed 50 characters" };
  }
  
  // Allow letters, spaces, and common city name characters
  const cityRegex = /^[a-zA-Z\s\-']+$/;
  if (!cityRegex.test(city)) {
    return { isValid: false, message: "City can only contain letters, spaces, hyphens, and apostrophes" };
  }
  
  return { isValid: true };
};

// State validation
export const validateState = (state: string): ValidationResult => {
  if (!state) {
    return { isValid: false, message: "State is required" };
  }
  
  if (state.length < 2) {
    return { isValid: false, message: "State must be at least 2 characters long" };
  }
  
  if (state.length > 50) {
    return { isValid: false, message: "State cannot exceed 50 characters" };
  }
  
  // Allow letters, spaces, and common state name characters
  const stateRegex = /^[a-zA-Z\s\-']+$/;
  if (!stateRegex.test(state)) {
    return { isValid: false, message: "State can only contain letters, spaces, hyphens, and apostrophes" };
  }
  
  return { isValid: true };
};

// Pincode validation - exactly 6 digits
export const validatePincode = (pincode: string): ValidationResult => {
  if (!pincode) {
    return { isValid: false, message: "Pincode is required" };
  }
  
  // Remove all non-digit characters
  const cleanPincode = pincode.replace(/\D/g, '');
  
  if (cleanPincode.length !== 6) {
    return { isValid: false, message: "Pincode must be exactly 6 digits" };
  }
  
  // Check if it contains any letters
  if (/[a-zA-Z]/.test(pincode)) {
    return { isValid: false, message: "Pincode cannot contain letters" };
  }
  
  return { isValid: true };
};

// Room capacity validation
export const validateRoomCapacity = (capacity: number): ValidationResult => {
  if (!capacity || capacity < 1) {
    return { isValid: false, message: "Room capacity must be at least 1" };
  }
  
  if (capacity > 20) {
    return { isValid: false, message: "Room capacity cannot exceed 20" };
  }
  
  if (!Number.isInteger(capacity)) {
    return { isValid: false, message: "Room capacity must be a whole number" };
  }
  
  return { isValid: true };
};

// Price validation
export const validatePrice = (price: number, fieldName: string = "Price"): ValidationResult => {
  if (!price && price !== 0) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (price < 0) {
    return { isValid: false, message: `${fieldName} cannot be negative` };
  }
  
  if (price > 1000000) {
    return { isValid: false, message: `${fieldName} cannot exceed ₹10,00,000` };
  }
  
  return { isValid: true };
};

// Date validation
export const validateDate = (date: string, fieldName: string = "Date"): ValidationResult => {
  if (!date) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(inputDate.getTime())) {
    return { isValid: false, message: `Please enter a valid ${fieldName.toLowerCase()}` };
  }
  
  if (inputDate < today) {
    return { isValid: false, message: `${fieldName} cannot be in the past` };
  }
  
  return { isValid: true };
};

// Check-in/Check-out validation
export const validateCheckDates = (checkIn: string, checkOut: string): ValidationResult => {
  const checkInValidation = validateDate(checkIn, "Check-in date");
  if (!checkInValidation.isValid) {
    return checkInValidation;
  }
  
  const checkOutValidation = validateDate(checkOut, "Check-out date");
  if (!checkOutValidation.isValid) {
    return checkOutValidation;
  }
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  if (checkOutDate <= checkInDate) {
    return { isValid: false, message: "Check-out date must be after check-in date" };
  }
  
  // Check if booking is more than 365 days in advance
  const maxAdvanceDate = new Date();
  maxAdvanceDate.setFullYear(maxAdvanceDate.getFullYear() + 1);
  
  if (checkInDate > maxAdvanceDate) {
    return { isValid: false, message: "Booking cannot be more than 1 year in advance" };
  }
  
  return { isValid: true };
};

// Guest count validation
export const validateGuestCount = (adults: number, children: number): ValidationResult => {
  if (!adults || adults < 1) {
    return { isValid: false, message: "At least 1 adult is required" };
  }
  
  if (adults > 10) {
    return { isValid: false, message: "Maximum 10 adults allowed per room" };
  }
  
  if (children < 0) {
    return { isValid: false, message: "Children count cannot be negative" };
  }
  
  if (children > 10) {
    return { isValid: false, message: "Maximum 10 children allowed per room" };
  }
  
  const totalGuests = adults + children;
  if (totalGuests > 15) {
    return { isValid: false, message: "Maximum 15 total guests allowed per room" };
  }
  
  return { isValid: true };
};

// Special requests validation
export const validateSpecialRequests = (requests: string): ValidationResult => {
  if (requests && requests.length > 500) {
    return { isValid: false, message: "Special requests cannot exceed 500 characters" };
  }
  
  return { isValid: true };
};

// Room description validation
export const validateDescription = (description: string): ValidationResult => {
  if (!description) {
    return { isValid: false, message: "Description is required" };
  }
  
  if (description.length < 10) {
    return { isValid: false, message: "Description must be at least 10 characters long" };
  }
  
  if (description.length > 1000) {
    return { isValid: false, message: "Description cannot exceed 1000 characters" };
  }
  
  return { isValid: true };
};

// Amenities validation
export const validateAmenities = (amenities: string): ValidationResult => {
  if (!amenities) {
    return { isValid: false, message: "Amenities are required" };
  }
  
  if (amenities.length < 5) {
    return { isValid: false, message: "Please provide at least one amenity" };
  }
  
  if (amenities.length > 500) {
    return { isValid: false, message: "Amenities list cannot exceed 500 characters" };
  }
  
  return { isValid: true };
};

// Real-time input formatting utilities
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Limit to 10 digits
  return digits.slice(0, 10);
};

export const formatPincode = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Limit to 6 digits
  return digits.slice(0, 6);
};

export const formatName = (value: string): string => {
  // Remove numbers and special characters except spaces, hyphens, and apostrophes
  return value.replace(/[^a-zA-Z\s\-']/g, '');
};

export const formatPrice = (value: string): string => {
  // Remove all non-digit characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleanValue.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  return cleanValue;
};

// Form validation helper
export const validateForm = (formData: any, validationRules: any): FieldValidation => {
  const errors: FieldValidation = {};
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field];
    const rule = rules as any;
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = { isValid: false, message: `${rule.label || field} is required` };
      continue;
    }
    
    if (value && rule.validator) {
      const result = rule.validator(value);
      if (!result.isValid) {
        errors[field] = result;
      }
    }
  }
  
  return errors;
};
