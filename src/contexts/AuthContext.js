import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../utils/api'; // Import the login function from your API

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); // Try to get the token from localStorage
  const [isLoading, setIsLoading] = useState(true); // State to handle initial authentication loading

  useEffect(() => {
    // Here you can add logic to validate the token when the app loads
    // For now, we simply set isLoading to false after a small delay
    // In a real app, you would make a call to your backend to validate the token
    const checkAuthStatus = async () => {
      if (token) {
        // Here you could make an API call to verify if the token is valid
        // For example: const isValid = await api.validateToken(token);
        // If valid, you could get user data: const userData = await api.getUserProfile(token);
        // For now, we assume that if there is a token, the user is "logged in" (for the purpose of this example)
        try {
          // Simulate token decoding and user data retrieval
          // In a real application, this would be a call to your API /api/auth/me or similar
          const decodedUser = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload (basic, without signature verification)
          setUser({ id: decodedUser.id, email: decodedUser.email, rol: decodedUser.rol });
        } catch (error) {
          console.error("Error decoding token or invalid token:", error);
          localStorage.removeItem('token'); // Remove invalid token
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false); // Initial loading has finished
    };

    checkAuthStatus();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password); // Call your API function for login
      setToken(data.token);
      localStorage.setItem('token', data.token); // Save the token in localStorage
      setUser(data.user); // Assume the API returns user data
      return data; // Return data so the login component can handle it
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Propagate the error so the login component can handle it
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token'); // Remove the token from localStorage
  };

  // Helper function to check roles
  const hasRequiredRole = (requiredRoles) => {
    if (!user || !user.rol) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true; // If no roles are required, any authenticated user passes
    return requiredRoles.includes(user.rol);
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    hasRequiredRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
 