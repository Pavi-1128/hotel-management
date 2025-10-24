import React from "react";
import { useNavigate } from "react-router-dom";

interface AvailableRoomsProps {
  rooms: any[];
  checkIn: string;
  checkOut: string;
  onClose: () => void;
}

const AvailableRooms: React.FC<AvailableRoomsProps> = ({ rooms, checkIn, checkOut, onClose }) => {
  const navigate = useNavigate();

  const handleBookRoom = (roomId: string) => {
    // Navigate to booking page with room pre-selected
    navigate("/booking", { 
      state: { 
        selectedRoom: roomId,
        checkIn,
        checkOut
      } 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Available Rooms</h2>
            <p className="text-gray-600">
              {checkIn} to {checkOut} • {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Rooms Available</h3>
            <p className="text-gray-500 mb-6">
              Sorry, no rooms are available for the selected dates. Please try different dates.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Different Dates
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row">
                  {/* Room Image */}
                  <div className="lg:w-1/3">
                    <img 
                      src={room.image} 
                      alt={room.name}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  </div>

                  {/* Room Details */}
                  <div className="lg:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>
                        <p className="text-gray-600 mb-4">{room.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-indigo-600">
                          ₹{room.currentPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">per night</div>
                        {room.originalPrice > room.currentPrice && (
                          <div className="text-sm text-green-600 font-medium">
                            Save ₹{(room.originalPrice - room.currentPrice).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Room Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span className="font-medium">Size:</span>
                        <span className="ml-2">{room.size}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium">Capacity:</span>
                        <span className="ml-2">{room.capacity} guests</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities:</h4>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 6).map((amenity: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 6 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            +{room.amenities.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Book Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleBookRoom(room._id)}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Book This Room
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Close Button */}
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailableRooms;
