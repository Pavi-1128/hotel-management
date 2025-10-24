import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import apiService from "../services/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'manager' | 'client';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const user = apiService.getCurrentUserFromStorage();
        const role = localStorage.getItem('role');
        
        // Only consider authenticated if we have both token and user data
        const authenticated = !!(token && user);
        
        setIsAuthenticated(authenticated);
        setCurrentUser(user);
        setCurrentRole(role);
        setIsChecking(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setCurrentUser(null);
        setCurrentRole(null);
        setIsChecking(false);
      }
    };

    // Small delay to ensure localStorage is ready
    const timeoutId = setTimeout(checkAuth, 10);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  // If role is required and doesn't match, redirect to appropriate page
  if (requiredRole && currentRole !== requiredRole) {
    if (currentRole === 'manager') {
      return <Navigate to="/home" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
