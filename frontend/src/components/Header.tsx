
import React from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

interface HeaderProps {
  role: string;
  onBookNowClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ role, onBookNowClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      // Use API service logout method
      apiService.logout();
      // Clear any additional local storage items
      localStorage.removeItem('savedRoomIds');
      // Navigate to login page
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-transparent z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C1A16B] text-white grid place-items-center font-bold transition-colors duration-300 hover:bg-[#9C7B45]">
            R
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">The Residency</span>
            {role && (
              <div className="text-xs text-gray-500">
                {role === 'manager' ? '🏨 Manager' : '👤 Guest'}
              </div>
            )}
          </div>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex gap-8 text-lg font-bold text-[#C1A16B] absolute left-1/2 -translate-x-1/2">
          <button
            onClick={() => navigate("/home", { state: { role } })}
            className="transition-colors duration-300 hover:text-[#9C7B45]"
          >
            {role === 'manager' ? 'Dashboard' : 'Our Hotels'}
          </button>
          {role === 'manager' && (
            <>
              <button onClick={() => navigate("/booking")} className="transition-colors duration-300 hover:text-[#9C7B45]">
                Manage Rooms
              </button>
              <button onClick={() => navigate("/bookings")} className="transition-colors duration-300 hover:text-[#9C7B45]">
                Bookings
              </button>
            </>
          )}
          <button onClick={() => navigate("/contact")} className="transition-colors duration-300 hover:text-[#9C7B45]">
            Contact Us
          </button>
        </nav>

        {/* Right Button */}
        <div className="flex items-center gap-3">
          {role === 'manager' ? (
            <>
              
              <button onClick={() => navigate("/bookings")} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors duration-300">
                Bookings
              </button>
              
            </>
          ) : (
            <button 
              onClick={onBookNowClick || (() => navigate("/booking"))} 
              className="bg-[#C1A16B] hover:bg-[#9C7B45] text-white rounded-md px-4 py-2 text-sm font-medium transition-colors duration-300"
            >
              Book Now
            </button>
          )}
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
