import React from "react";
import { useNavigate } from "react-router-dom";
import type { Room, Booking } from "../types/api";

interface BookingConfirmationProps {
  booking: Booking;
  onClose: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, onClose }) => {
  const navigate = useNavigate();

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

  const calculateNights = () => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights;
  };

  const generateReservationId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const nights = calculateNights();
  const reservationId = generateReservationId();

  // Calculate pricing breakdown
  const roomPrice = booking.room.currentPrice || booking.room.total || 0;
  const subtotal = roomPrice * nights;
  const taxes = subtotal * 0.08; // 8% tax
  const total = subtotal + taxes;
  const paidAmount = 0; // Since it's "Pay Later"
  const balanceAmount = total;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex">
          {/* Left Column - Confirmation Details */}
          <div className="flex-1 p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Thank You For Your Reservation</h1>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-8">
              {/* Reservation For */}
              <div>
                <p className="text-gray-600 mb-2">Reservation Confirmation For</p>
                <h2 className="text-2xl font-bold text-gray-800">
                  {booking.guestDetails.firstName} {booking.guestDetails.lastName}
                </h2>
              </div>

              {/* Confirmation Message */}
              <div>
                <p className="text-lg text-gray-700 mb-2">
                  Your Reservation at <strong>The Residency</strong> is <strong>Confirmed.</strong>
                </p>
                <p className="text-gray-600">
                  We look forward to seeing you at our hotel soon.
                </p>
              </div>

              {/* Payment Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  You've paid INR {formatCurrency(paidAmount)} now. You may pay the additional remaining amount of {formatCurrency(balanceAmount)} later.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    onClose();
                    navigate("/booking");
                  }}
                  className="bg-[#C1A16B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#9C7B45] transition-colors"
                >
                  MAKE ANOTHER RESERVATION
                </button>
                <span className="text-gray-600">
                  Or <button onClick={() => navigate("/home")} className="font-bold text-gray-800 hover:underline">Go back to Website</button>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="w-96 bg-gray-50 p-8 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Booking Summary</h3>
            
            <div className="space-y-6">
              {/* Reservation ID */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Reservation Id</p>
                <p className="text-xl font-bold text-gray-800">{reservationId}</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Check In</p>
                  <p className="font-bold text-gray-800">{formatDate(booking.checkIn)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Check Out</p>
                  <p className="font-bold text-gray-800">{formatDate(booking.checkOut)}</p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">No of nights</span>
                  <span className="font-medium">{nights} Night{nights !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room</span>
                  <span className="font-medium">{booking.room.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{booking.guests} Guest{booking.guests !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Enhance Your Stay Section */}
              <div>
                <div className="bg-gray-600 text-white px-4 py-2 rounded-t-lg">
                  <h4 className="font-medium">Enhance Your Stay</h4>
                </div>
                <div className="bg-white border border-gray-200 border-t-0 rounded-b-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Room Service</span>
                    <span className="text-sm font-medium">1 unit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">WiFi Access</span>
                    <span className="text-sm font-medium">1 unit</span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room with Breakfast</span>
                  <span className="font-medium">{formatCurrency(roomPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Enhance Your Stay</span>
                  <span className="font-medium">{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sub Total</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes and Fees</span>
                  <span className="font-medium">{formatCurrency(taxes)}</span>
                </div>
                
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Grand Total</span>
                    <span className="text-xl font-bold text-gray-800">INR {formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">You've Paid</span>
                    <span className="text-green-600 font-medium">{formatCurrency(paidAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance (Pay Later)</span>
                    <span className="text-lg font-bold text-gray-800">INR {formatCurrency(balanceAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
