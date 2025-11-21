import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import { 
  validateName, 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword, 
  validatePhoneNumber,
  formatPhoneNumber,
  formatName,
  type ValidationResult 
} from "../utils/validation";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Apply formatting based on field type
    if (name === 'phone') {
      processedValue = formatPhoneNumber(value);
    } else if (name === 'firstName' || name === 'lastName') {
      processedValue = formatName(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
    
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
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return validateConfirmPassword(formData.password, value);
      default:
        return { isValid: true };
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const validation = validateField(name, value);
    
    if (!validation.isValid) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: validation.message || ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    // Validate all fields
    const errors: {[key: string]: string} = {};
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];
    
    fieldsToValidate.forEach(field => {
      const validation = validateField(field, formData[field as keyof typeof formData]);
      if (!validation.isValid) {
        errors[field] = validation.message || '';
    }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await apiService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      // Don't store token or auto-login - redirect to login page instead
      // Show success message on login page
      navigate("/login", { 
        state: { 
          message: "Account created successfully! Please login to continue.",
          email: formData.email 
        } 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed. Please try again.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  fieldErrors.firstName ? 'border-red-500' : ''
                }`}
                required
              />
              {fieldErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  fieldErrors.lastName ? 'border-red-500' : ''
                }`}
                required
              />
              {fieldErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.email ? 'border-red-500' : ''
              }`}
              required
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter 10-digit mobile number"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={10}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.phone ? 'border-red-500' : ''
              }`}
              required
            />
            {fieldErrors.phone && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  fieldErrors.password ? 'border-red-500' : ''
                }`}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  fieldErrors.confirmPassword ? 'border-red-500' : ''
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">Already have an account?</p>
          <button
            onClick={() => navigate("/")}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Sign In Instead
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          &copy; 2025 Hotel Residence
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
