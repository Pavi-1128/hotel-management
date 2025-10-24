import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import apiService from "../services/api";
import type { Booking } from "../types/api";

const BookingsPage: React.FC = () => {
  const location = useLocation();
  const role = (location.state?.role || localStorage.getItem("role") || "client").trim().toLowerCase();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, confirmed, cancelled, completed
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, amount

  useEffect(() => {
    if (role === "manager") {
      loadBookings();
    }
  }, [role]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getAllBookings();
      console.log("Bookings response:", response);
      setBookings(response.data || []);
    } catch (error: unknown) {
      console.error("Error loading bookings:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load bookings";
      setError(errorMessage);
      setBookings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await apiService.updateBookingStatus(bookingId, newStatus);
      // Reload bookings to get updated data
      await loadBookings();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update booking status";
      setError(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = (bookings || []).filter(booking => {
    if (!booking) return false;
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'amount':
        return b.totalAmount - a.totalAmount;
      default:
        return 0;
    }
  });

  if (role !== "manager") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header role={role} />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
              <p className="text-gray-600">Only managers can access this page.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header role={role} />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Management</h1>
            <p className="text-gray-600">Manage all hotel bookings and reservations</p>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Filter by status:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">All Bookings</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount">Amount (High to Low)</option>
                </select>
              </div>

              <button
                onClick={loadBookings}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading bookings...</div>
            </div>
          )}

          {/* Bookings List */}
          {!loading && !error && (
            <div className="space-y-4">
              {sortedBookings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h3>
                  <p className="text-gray-500">
                    {filter === "all" 
                      ? "No bookings have been made yet." 
                      : `No ${filter} bookings found.`
                    }
                  </p>
                </div>
              ) : (
                sortedBookings.map((booking) => (
                  <div key={booking._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Booking #{booking._id.slice(-8).toUpperCase()}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Booked by: {booking.guestDetails.firstName} {booking.guestDetails.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Email: {booking.guestDetails.email} | Phone: {booking.guestDetails.phone}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-800">
                            {formatCurrency(booking.totalAmount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(booking.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Room</p>
                          <p className="font-medium">
                            {typeof booking.room === 'object' && booking.room?.name 
                              ? booking.room.name 
                              : 'Room not found'
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Check-in</p>
                          <p className="font-medium">{formatDate(booking.checkIn)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Check-out</p>
                          <p className="font-medium">{formatDate(booking.checkOut)}</p>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">Special Requests</p>
                          <p className="text-sm text-gray-800">{booking.specialRequests}</p>
                        </div>
                      )}

                      {/* Status Update Controls */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-700">Update Status:</span>
                        <div className="flex gap-2">
                          {booking.status !== 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"
                            >
                              Confirm
                            </button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'completed')}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Statistics */}
          {!loading && !error && (bookings || []).length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-gray-800">{(bookings || []).length}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-green-600">
                  {(bookings || []).filter(b => b && b.status === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {(bookings || []).filter(b => b && b.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-gray-800">
                  {formatCurrency((bookings || []).reduce((sum, b) => sum + (b?.totalAmount || 0), 0))}
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingsPage;
