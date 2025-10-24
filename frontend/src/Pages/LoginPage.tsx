import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiService.login({ email, password, role });
      
      // Store token and user data
      localStorage.setItem("token", response.token || "");
      localStorage.setItem("user", JSON.stringify(response.user || {}));
      localStorage.setItem("role", response.user?.role || "client");
      
      // Debug: Log the stored role
      console.log("Login - Stored role:", response.user?.role, "Type:", typeof response.user?.role);
      
      navigate("/home", { state: { role: response.user?.role || "client" } });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Hotel Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
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
                </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="manager">Hotel Manager</option>
              <option value="client">Client</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">Don't have an account?</p>
          <button
            onClick={() => navigate("/signup")}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Create Account
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-600 mb-2">Or use demo credentials:</p>
          <button
            onClick={() => {
              // For demo purposes, we'll auto-register with default credentials
              const demoCredentials = {
                manager: { email: "manager@hotel.com", password: "manager123", role: "manager" },
                client: { email: "client@hotel.com", password: "client123", role: "client" }
              };

              const credentials = role === "manager" ? demoCredentials.manager : demoCredentials.client;
              setEmail(credentials.email);
              setPassword(credentials.password);
            }}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm"
          >
            Use Demo Credentials
          </button>
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-6">
          &copy; 2025 Hotel Residence
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
