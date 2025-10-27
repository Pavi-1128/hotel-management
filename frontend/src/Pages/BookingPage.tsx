import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DetailedBookingForm from "../components/DetailedBookingForm";
import apiService from "../services/api";
import type { Room } from "../types/api";

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<{ [key: string]: string }>({});
  const [savedRoomIds, setSavedRoomIds] = useState<string[]>([]);
  const role = (location.state?.role || localStorage.getItem("role") || "client").trim().toLowerCase();
  
  // Handle offer information from Photos modal
  const offerInfo = location.state?.fromOffer ? {
    title: location.state.offerTitle,
    price: location.state.offerPrice,
    description: location.state.offerDescription
  } : null;
  
  // Debug: Log the role to console
  console.log("BookingPage - Role detected:", role, "Type:", typeof role);
  console.log("BookingPage - Offer info:", offerInfo);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newName, setNewName] = useState("");
  const [newCapacity, setNewCapacity] = useState(2);
  const [newSize, setNewSize] = useState("320 sq. ft.");
  const [newOriginalPrice, setNewOriginalPrice] = useState<number | "">("");
  const [newCurrentPrice, setNewCurrentPrice] = useState<number | "">("");
  const [newTaxes, setNewTaxes] = useState<number | "">("");
  const [newTotal, setNewTotal] = useState<number | "">("");
  const [newAvailability, setNewAvailability] = useState("Available");
  const [newDescription, setNewDescription] = useState("");
  const [newAmenities, setNewAmenities] = useState("");
  const [newImageDataUrl, setNewImageDataUrl] = useState<string>("");

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDetailedBookingOpen, setIsDetailedBookingOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");


  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRooms();
      setRooms(response.data || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load rooms";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isManagerRoom = (id: string) => rooms.some((r) => r._id === id);

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setNewImageDataUrl("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setNewImageDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const addRoomCard = async () => {
    if (!newRoomNumber || !newName || !newCurrentPrice || !newOriginalPrice || !newTaxes || !newTotal) return;

    try {
      const roomData = {
        roomNumber: newRoomNumber,
        name: newName,
        image: newImageDataUrl || "",
        capacity: newCapacity,
        size: newSize,
        originalPrice: Number(newOriginalPrice),
        currentPrice: Number(newCurrentPrice),
        taxes: Number(newTaxes),
        total: Number(newTotal),
        description: newDescription || "",
        amenities: (newAmenities || "").split(/\n|,/).map((a) => a.trim()).filter(Boolean),
        availability: newAvailability as "Available" | "Limited" | "Unavailable",
      };

      await apiService.createRoom(roomData);
      await loadRooms(); // Reload rooms
      setIsAddOpen(false);
      resetForm();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create room";
      alert(errorMessage);
    }
  };

  const resetForm = () => {
    setNewRoomNumber("");
    setNewName("");
    setNewCapacity(2);
    setNewSize("320 sq. ft.");
    setNewOriginalPrice("");
    setNewCurrentPrice("");
    setNewTaxes("");
    setNewTotal("");
    setNewAvailability("Available");
    setNewDescription("");
    setNewAmenities("");
    setNewImageDataUrl("");
  };

  // Edit / Delete manager rooms
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openEdit = (room: Room) => {
    setEditingId(room._id);
    setNewRoomNumber(room.roomNumber || "");
    setNewName(room.name);
    setNewCapacity(room.capacity);
    setNewSize(room.size);
    setNewOriginalPrice(room.originalPrice);
    setNewCurrentPrice(room.currentPrice);
    setNewTaxes(room.taxes);
    setNewTotal(room.total);
    setNewAvailability(room.availability);
    setNewDescription(room.description);
    setNewAmenities(room.amenities.join(", "));
    setNewImageDataUrl(room.image);
    setIsEditOpen(true);
  };

  const saveEdit = async () => {
    if (editingId == null) return;
    
    try {
      const roomData = {
        roomNumber: newRoomNumber,
        name: newName,
        capacity: newCapacity,
        size: newSize,
        originalPrice: Number(newOriginalPrice || 0),
        currentPrice: Number(newCurrentPrice || 0),
        taxes: Number(newTaxes || 0),
        total: Number(newTotal || 0),
        availability: newAvailability as "Available" | "Limited" | "Unavailable",
        description: newDescription,
        amenities: (newAmenities || "").split(/\n|,/).map((a) => a.trim()).filter(Boolean),
        image: newImageDataUrl,
      };

      await apiService.updateRoom(editingId, roomData);
      await loadRooms(); // Reload rooms
      setIsEditOpen(false);
      setEditingId(null);
      resetForm();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update room";
      alert(errorMessage);
    }
  };

  const deleteRoom = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    
    try {
      await apiService.deleteRoom(id);
      await loadRooms(); // Reload rooms
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete room";
      alert(errorMessage);
    }
  };

  const handleTabChange = (roomId: string, tab: string) => {
    setActiveTab(prev => ({ ...prev, [roomId]: tab }));
  };

  const toggleSaveRoom = (roomId: string) => {
    setSavedRoomIds((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  const savedRooms = rooms.filter((r) => savedRoomIds.includes(r._id));



  return (
    <div className="min-h-screen bg-gray-50">
      <Header role={role} />

      {/* Offer Information Banner - Show when coming from Photos modal */}
      {offerInfo && (
        <div className="bg-gradient-to-r from-[#C1A16B] to-[#9C7B45] text-white py-6 mt-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{offerInfo.title}</h2>
                <p className="text-lg opacity-90 mb-2">{offerInfo.description}</p>
                <p className="text-sm opacity-75">Special Offer - Book your room now!</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{offerInfo.price}</div>
                <div className="text-sm opacity-75">Limited Time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center py-8">
            <div className="text-lg">Loading rooms...</div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <div className="text-red-600">{error}</div>
            <button onClick={loadRooms} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
              Retry
            </button>
          </div>
        )}
        
        <div className="space-y-6">
          {role === 'manager' && (
            <div className="mb-4">
              <button onClick={() => setIsAddOpen(true)} className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-neutral-800">Add Room Card</button>
            </div>
          )}
          {!loading && !error && rooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Rooms Available</h3>
            <p className="text-gray-500 mb-6">
              {role === 'manager' 
                ? "You haven't created any rooms yet. Click 'Add Room Card' to get started!"
                : "No rooms have been added by the hotel manager yet. Please check back later."
              }
            </p>
            {role === 'manager' && (
              <button 
                onClick={() => setIsAddOpen(true)} 
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Your First Room
              </button>
            )}
          </div>
        )}
        
        {!loading && !error && rooms.length > 0 && rooms.map((room) => (
            <div key={room._id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: room.capacity }).map((_, i) => (
                            <span key={i} className="text-gray-500">👤</span>
                          ))}
                        </div>
                        <span>Room Size: {room.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                    {room.availability !== "Available" && (
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        {room.availability}
                      </div>
                    )}
                    {role === 'manager' && isManagerRoom(room._id) && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(room)} className="text-sm text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => deleteRoom(room._id)} className="text-sm text-red-600 hover:underline">Delete</button>
                      </div>
                    )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-lg text-gray-500 line-through">₹{room.originalPrice.toLocaleString()}</span>
                      <span className="text-2xl font-bold text-gray-900">₹{room.currentPrice.toLocaleString()} INR / Night</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      Plus ₹{room.taxes.toLocaleString()} In Taxes and Fees/Night
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      Total ₹{room.total.toLocaleString()} for 1 Night Includes Taxes and Fees
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="mb-4">
                    <div className="flex border-b border-gray-200">
                      {["rates", "amenities", "photos"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => handleTabChange(room._id, tab)}
                          className={`px-4 py-2 text-sm font-medium capitalize ${
                            activeTab[room._id] === tab
                              ? "text-[#C1A16B] border-b-2 border-[#C1A16B]"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="mb-6">
                    {activeTab[room._id] === "rates" && (
                      <div>
                        <p className="text-gray-700 mb-4">{room.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Included Amenities:</h4>
                            <ul className="space-y-1">
                              {room.amenities.slice(0, 6).map((amenity: string, index: number) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="text-green-500">✓</span>
                                  {amenity}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Additional Features:</h4>
                            <ul className="space-y-1">
                              {room.amenities.slice(6).map((amenity: string, index: number) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="text-green-500">✓</span>
                                  {amenity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab[room._id] === "amenities" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {room.amenities.map((amenity: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-green-500">✓</span>
                            {amenity}
                          </div>
                        ))}
                      </div>
                    )}
                    {activeTab[room._id] === "photos" && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <img src={room.image} alt="Room view 1" className="w-full h-32 object-cover rounded" />
                        <img src={room.image} alt="Room view 2" className="w-full h-32 object-cover rounded" />
                        <img src={room.image} alt="Room view 3" className="w-full h-32 object-cover rounded" />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button 
                      onClick={() => toggleSaveRoom(room._id)}
                      className={`px-6 py-2 rounded-md font-medium transition-colors ${
                        savedRoomIds.includes(room._id)
                          ? "bg-emerald-600 text-white"
                          : "bg-[#C1A16B] hover:bg-[#9C7B45] text-white"
                      }`}
                    >
                      {savedRoomIds.includes(room._id) ? "Saved" : "Save"}
                    </button>
                     {role === 'client' && (
                       <button
                         onClick={() => {
                           setSelectedRoomForBooking(room);
                           setIsDetailedBookingOpen(true);
                         }}
                         className="px-6 py-2 rounded-md font-medium bg-black text-white hover:bg-neutral-800"
                       >
                         Lets Go
                       </button>
                     )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        {savedRooms.length > 0 && (
          <div className="mt-8 text-center">
            <button className="bg-[#C1A16B] hover:bg-[#9C7B45] text-white px-8 py-3 rounded-md font-semibold text-lg">
              Continue to Guest Details →
            </button>
          </div>
        )}

        {/* Saved Rooms Floating Button */}
        <button
          onClick={() => navigate("/booking/saved", { state: { savedIds: savedRoomIds } })}
          className="fixed right-6 bottom-6 z-40 bg-black text-white rounded-full px-5 py-3 shadow-lg hover:bg-neutral-800"
        >
          Saved Rooms
          {savedRoomIds.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center text-xs font-semibold bg-[#C1A16B] text-white rounded-full w-6 h-6">
              {savedRoomIds.length}
            </span>
          )}
        </button>
      </div>

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCalendarOpen(false)} />
          <div className="relative z-10 w-[90%] max-w-md rounded-md shadow-xl bg-white text-neutral-900">
            <div className="px-6 py-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select your dates</h3>
              <button onClick={() => setIsCalendarOpen(false)} className="text-2xl leading-none">×</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Check-In</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border rounded px-3 py-2"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Check-Out</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border rounded px-3 py-2"/>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setIsCalendarOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={() => {}} className="px-4 py-2 bg-[#C1A16B] text-white rounded">Book</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Room Modal */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} />
          <div className="relative z-10 w-[90%] max-w-lg rounded-md shadow-xl bg-white text-neutral-900">
            <div className="px-6 py-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{isAddOpen ? "Add Room" : "Edit Room"}</h3>
              <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="text-2xl leading-none">×</button>
            </div>
            <div className="px-6 py-5 space-y-3 max-h-[80vh] overflow-y-auto">
              <input type="text" placeholder="Room Number (e.g., 101, Deluxe A)" value={newRoomNumber} onChange={(e) => setNewRoomNumber(e.target.value)} className="w-full border rounded px-3 py-2"/>
              <input type="text" placeholder="Room Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full border rounded px-3 py-2"/>
              <input type="number" placeholder="Capacity" value={newCapacity} onChange={(e) => setNewCapacity(Number(e.target.value))} className="w-full border rounded px-3 py-2"/>
              <input type="text" placeholder="Size" value={newSize} onChange={(e) => setNewSize(e.target.value)} className="w-full border rounded px-3 py-2"/>
              <input type="number" placeholder="Original Price" value={newOriginalPrice} onChange={(e) => setNewOriginalPrice(Number(e.target.value))} className="w-full border rounded px-3 py-2"/>
              <input type="number" placeholder="Current Price" value={newCurrentPrice} onChange={(e) => setNewCurrentPrice(Number(e.target.value))} className="w-full border rounded px-3 py-2"/>
              <input type="number" placeholder="Taxes" value={newTaxes} onChange={(e) => setNewTaxes(Number(e.target.value))} className="w-full border rounded px-3 py-2"/>
              <input type="number" placeholder="Total" value={newTotal} onChange={(e) => setNewTotal(Number(e.target.value))} className="w-full border rounded px-3 py-2"/>
              <textarea placeholder="Description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full border rounded px-3 py-2"/>
              <textarea placeholder="Amenities (comma separated)" value={newAmenities} onChange={(e) => setNewAmenities(e.target.value)} className="w-full border rounded px-3 py-2"/>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files?.[0] || null)} className="w-full"/>
              <div className="flex justify-end mt-2">
                <button onClick={isAddOpen ? addRoomCard : saveEdit} className="px-4 py-2 bg-[#C1A16B] text-white rounded">{isAddOpen ? "Add" : "Save"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Booking Form */}
      {isDetailedBookingOpen && selectedRoomForBooking && (
        <DetailedBookingForm
          room={selectedRoomForBooking}
          onClose={() => {
            setIsDetailedBookingOpen(false);
            setSelectedRoomForBooking(null);
          }}
          onBookingSuccess={() => {
            // Refresh rooms or show success message
            loadRooms();
          }}
        />
      )}
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
