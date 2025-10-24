import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import apiService from "../services/api";
import type { Room } from "../types/api";

const SavedRoomsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (location.state?.role || localStorage.getItem("role") || "client").trim().toLowerCase();
  
  const [savedRooms, setSavedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSavedRooms();
  }, []);

  const loadSavedRooms = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRooms();
      const allRooms = response.data || [];
      
      // Get saved room IDs from localStorage
      const savedRoomIds = JSON.parse(localStorage.getItem("savedRoomIds") || "[]");
      const saved = allRooms.filter((room: Room) => savedRoomIds.includes(room._id));
      
      setSavedRooms(saved);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load saved rooms";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeFromSaved = (roomId: string) => {
    const savedRoomIds = JSON.parse(localStorage.getItem("savedRoomIds") || "[]");
    const updated = savedRoomIds.filter((id: string) => id !== roomId);
    localStorage.setItem("savedRoomIds", JSON.stringify(updated));
    setSavedRooms(prev => prev.filter(room => room._id !== roomId));
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
    <div className="min-h-screen bg-gray-50">
      <Header role={role} />

      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Saved Rooms</h1>
            <button 
              onClick={() => navigate("/booking")} 
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              ← Back to Booking
            </button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading saved rooms...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {!loading && !error && savedRooms.length === 0 && (
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Saved Rooms</h3>
              <p className="text-gray-500 mb-6">You haven't saved any rooms yet. Start exploring and save your favorites!</p>
              <button 
                onClick={() => navigate("/booking")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Rooms
              </button>
            </div>
          )}

          {!loading && !error && savedRooms.length > 0 && (
            <div className="space-y-6">
              {savedRooms.map((room) => (
                <div key={room._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <img 
                      src={room.image} 
                      alt={room.name} 
                      className="md:w-1/3 h-56 object-cover" 
                    />
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-gray-800">{room.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">Room Size: {room.size}</p>
                          <p className="text-sm text-gray-600">Capacity: {room.capacity} guests</p>
                          <p className="text-sm text-gray-600 mt-2">{room.description}</p>
                          
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-2">
                              {room.amenities.slice(0, 4).map((amenity: string, index: number) => (
                                <span 
                                  key={index} 
                                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {room.amenities.length > 4 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                  +{room.amenities.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="text-[#9C7B45] font-semibold text-lg">
                            {formatCurrency(room.currentPrice)} / Night
                          </div>
                          {room.originalPrice > room.currentPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              {formatCurrency(room.originalPrice)}
                            </div>
                          )}
                          <div className="text-sm text-gray-600 mt-1">
                            Status: <span className={`font-medium ${
                              room.availability === 'Available' ? 'text-green-600' : 
                              room.availability === 'Limited' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {room.availability}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-6">
                        <button 
                          onClick={() => {
                            navigate("/booking", { 
                              state: { 
                                role, 
                                selectedRoom: room._id 
                              } 
                            });
                          }}
                          className="bg-black text-white px-6 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors"
                        >
                          Book Now
                        </button>
                        <button 
                          onClick={() => removeFromSaved(room._id)}
                          className="bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SavedRoomsPage;