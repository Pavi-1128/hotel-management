import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import HomePage from "./Pages/HomePage";
import ContactPage from "./Pages/ContactPage";
import BookingPage from "./Pages/BookingPage";
import SavedRoomsPage from "./Pages/SavedRoomsPage";
import BookingsPage from "./Pages/BookingsPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/contact" element={
          <ProtectedRoute>
            <ContactPage />
          </ProtectedRoute>
        } />
        <Route path="/booking" element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        } />
        <Route path="/booking/saved" element={
          <ProtectedRoute>
            <SavedRoomsPage />
          </ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute requiredRole="manager">
            <BookingsPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
