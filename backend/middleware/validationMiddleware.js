// Validation middleware for request validation

const validatePhoneNumber = (phone) => {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length !== 10) {
    return { isValid: false, message: 'Phone number must be exactly 10 digits' };
  }
  
  // Check if it contains any letters
  if (/[a-zA-Z]/.test(phone)) {
    return { isValid: false, message: 'Phone number cannot contain letters' };
  }
  
  // Check for valid Indian mobile number patterns
  const validPatterns = /^[6-9]\d{9}$/;
  if (!validPatterns.test(cleanPhone)) {
    return { isValid: false, message: 'Please enter a valid Indian mobile number' };
  }
  
  return { isValid: true };
};

const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  if (email.length > 100) {
    return { isValid: false, message: 'Email cannot exceed 100 characters' };
  }
  
  return { isValid: true };
};

const validateName = (name, fieldName = 'Name') => {
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

const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password cannot exceed 128 characters' };
  }
  
  return { isValid: true };
};

const validatePincode = (pincode) => {
  if (!pincode) {
    return { isValid: false, message: 'Pincode is required' };
  }
  
  // Remove all non-digit characters
  const cleanPincode = pincode.replace(/\D/g, '');
  
  if (cleanPincode.length !== 6) {
    return { isValid: false, message: 'Pincode must be exactly 6 digits' };
  }
  
  // Check if it contains any letters
  if (/[a-zA-Z]/.test(pincode)) {
    return { isValid: false, message: 'Pincode cannot contain letters' };
  }
  
  return { isValid: true };
};

const validateAddress = (address) => {
  if (!address) {
    return { isValid: false, message: 'Address is required' };
  }
  
  if (address.length < 10) {
    return { isValid: false, message: 'Address must be at least 10 characters long' };
  }
  
  if (address.length > 200) {
    return { isValid: false, message: 'Address cannot exceed 200 characters' };
  }
  
  return { isValid: true };
};

const validateCity = (city) => {
  if (!city) {
    return { isValid: false, message: 'City is required' };
  }
  
  if (city.length < 2) {
    return { isValid: false, message: 'City must be at least 2 characters long' };
  }
  
  if (city.length > 50) {
    return { isValid: false, message: 'City cannot exceed 50 characters' };
  }
  
  // Allow letters, spaces, and common city name characters
  const cityRegex = /^[a-zA-Z\s\-']+$/;
  if (!cityRegex.test(city)) {
    return { isValid: false, message: 'City can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true };
};

const validateState = (state) => {
  if (!state) {
    return { isValid: false, message: 'State is required' };
  }
  
  if (state.length < 2) {
    return { isValid: false, message: 'State must be at least 2 characters long' };
  }
  
  if (state.length > 50) {
    return { isValid: false, message: 'State cannot exceed 50 characters' };
  }
  
  // Allow letters, spaces, and common state name characters
  const stateRegex = /^[a-zA-Z\s\-']+$/;
  if (!stateRegex.test(state)) {
    return { isValid: false, message: 'State can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true };
};

const validateDate = (date, fieldName = 'Date') => {
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

const validateCheckDates = (checkIn, checkOut) => {
  const checkInValidation = validateDate(checkIn, 'Check-in date');
  if (!checkInValidation.isValid) {
    return checkInValidation;
  }
  
  const checkOutValidation = validateDate(checkOut, 'Check-out date');
  if (!checkOutValidation.isValid) {
    return checkOutValidation;
  }
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  if (checkOutDate <= checkInDate) {
    return { isValid: false, message: 'Check-out date must be after check-in date' };
  }
  
  // Check if booking is more than 365 days in advance
  const maxAdvanceDate = new Date();
  maxAdvanceDate.setFullYear(maxAdvanceDate.getFullYear() + 1);
  
  if (checkInDate > maxAdvanceDate) {
    return { isValid: false, message: 'Booking cannot be more than 1 year in advance' };
  }
  
  return { isValid: true };
};

const validateGuestCount = (adults, children) => {
  if (!adults || adults < 1) {
    return { isValid: false, message: 'At least 1 adult is required' };
  }
  
  if (adults > 10) {
    return { isValid: false, message: 'Maximum 10 adults allowed per room' };
  }
  
  if (children < 0) {
    return { isValid: false, message: 'Children count cannot be negative' };
  }
  
  if (children > 10) {
    return { isValid: false, message: 'Maximum 10 children allowed per room' };
  }
  
  const totalGuests = adults + children;
  if (totalGuests > 15) {
    return { isValid: false, message: 'Maximum 15 total guests allowed per room' };
  }
  
  return { isValid: true };
};

const validateSpecialRequests = (requests) => {
  if (requests && requests.length > 500) {
    return { isValid: false, message: 'Special requests cannot exceed 500 characters' };
  }
  
  return { isValid: true };
};

// Middleware for user registration validation
const validateRegistration = (req, res, next) => {
  const { firstName, lastName, email, password, phone, role } = req.body;
  const errors = [];

  // Validate required fields
  if (!firstName) errors.push('First name is required');
  if (!lastName) errors.push('Last name is required');
  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  if (!phone) errors.push('Phone number is required');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', ')
    });
  }

  // Validate field formats
  const firstNameValidation = validateName(firstName, 'First name');
  if (!firstNameValidation.isValid) errors.push(firstNameValidation.message);

  const lastNameValidation = validateName(lastName, 'Last name');
  if (!lastNameValidation.isValid) errors.push(lastNameValidation.message);

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) errors.push(emailValidation.message);

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) errors.push(passwordValidation.message);

  const phoneValidation = validatePhoneNumber(phone);
  if (!phoneValidation.isValid) errors.push(phoneValidation.message);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', ')
    });
  }

  next();
};

// Middleware for booking validation
const validateBooking = (req, res, next) => {
  const { checkIn, checkOut, guests, guestDetails } = req.body;
  const errors = [];

  // Validate required fields
  if (!checkIn) errors.push('Check-in date is required');
  if (!checkOut) errors.push('Check-out date is required');
  if (!guests) errors.push('Number of guests is required');
  if (!guestDetails) errors.push('Guest details are required');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', ')
    });
  }

  // Validate dates
  const dateValidation = validateCheckDates(checkIn, checkOut);
  if (!dateValidation.isValid) errors.push(dateValidation.message);

  // Validate guest details
  if (guestDetails) {
    const { firstName, lastName, email, phone, address, city, state, pincode } = guestDetails;

    if (!firstName) errors.push('Guest first name is required');
    if (!lastName) errors.push('Guest last name is required');
    if (!email) errors.push('Guest email is required');
    if (!phone) errors.push('Guest phone number is required');
    if (!address) errors.push('Guest address is required');
    if (!city) errors.push('Guest city is required');
    if (!state) errors.push('Guest state is required');
    if (!pincode) errors.push('Guest pincode is required');

    if (firstName) {
      const firstNameValidation = validateName(firstName, 'Guest first name');
      if (!firstNameValidation.isValid) errors.push(firstNameValidation.message);
    }

    if (lastName) {
      const lastNameValidation = validateName(lastName, 'Guest last name');
      if (!lastNameValidation.isValid) errors.push(lastNameValidation.message);
    }

    if (email) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) errors.push(emailValidation.message);
    }

    if (phone) {
      const phoneValidation = validatePhoneNumber(phone);
      if (!phoneValidation.isValid) errors.push(phoneValidation.message);
    }

    if (address) {
      const addressValidation = validateAddress(address);
      if (!addressValidation.isValid) errors.push(addressValidation.message);
    }

    if (city) {
      const cityValidation = validateCity(city);
      if (!cityValidation.isValid) errors.push(cityValidation.message);
    }

    if (state) {
      const stateValidation = validateState(state);
      if (!stateValidation.isValid) errors.push(stateValidation.message);
    }

    if (pincode) {
      const pincodeValidation = validatePincode(pincode);
      if (!pincodeValidation.isValid) errors.push(pincodeValidation.message);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', ')
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateBooking,
  validatePhoneNumber,
  validateEmail,
  validateName,
  validatePassword,
  validatePincode,
  validateAddress,
  validateCity,
  validateState,
  validateDate,
  validateCheckDates,
  validateGuestCount,
  validateSpecialRequests
};
