import { createContext, useContext, useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { isTokenExpired, setupTokenExpirationTimer } from "../utils/jwtUtils";
import { createAuthenticatedFetch } from "../utils/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Add a loading state to prevent flickering (optional but good)
  const [loading, setLoading] = useState(true);
  const expirationTimerRef = useRef(null); // Store timer ID for cleanup

  // Central logout function that clears everything
  const logout = () => {
    setUser(null);
    Cookies.remove("token");
    localStorage.removeItem("user");

    // Clear the expiration timer if it exists
    if (expirationTimerRef.current) {
      clearTimeout(expirationTimerRef.current);
      expirationTimerRef.current = null;
    }
  };

  // Setup token expiration monitoring
  const setupExpirationMonitoring = (token) => {
    // Clear any existing timer
    if (expirationTimerRef.current) {
      clearTimeout(expirationTimerRef.current);
      expirationTimerRef.current = null;
    }

    // Check if token is already expired
    if (isTokenExpired(token)) {
      console.log("Token is already expired, logging out...");
      logout();
      return;
    }

    // Setup timer to automatically logout when token expires
    expirationTimerRef.current = setupTokenExpirationTimer(token, () => {
      console.log("Token has expired, automatically logging out...");
      logout();
    });
  };

  // Create authenticated fetch function with automatic logout on 401
  const authFetch = createAuthenticatedFetch(logout);

  useEffect(() => {
    // Check for login on app start
    const token = Cookies.get("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        console.log("Token expired on app startup, clearing session...");
        Cookies.remove("token");
        localStorage.removeItem("user");
        setLoading(false);
        return;
      }

      try {
        setUser(JSON.parse(storedUser));
        // Setup expiration monitoring for existing token
        setupExpirationMonitoring(token);
      } catch (e) {
        console.error("Invalid user data");
        Cookies.remove("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);

    // Cleanup timer on unmount
    return () => {
      if (expirationTimerRef.current) {
        clearTimeout(expirationTimerRef.current);
      }
    };
  }, []);

  const login = (userData, token) => {
    // 1. Update React State (Instant UI update)
    setUser(userData);

    // 2. Update Browser Storage
    Cookies.set("token", token, { expires: 7, secure: true });
    localStorage.setItem("user", JSON.stringify(userData));

    // 3. Setup expiration monitoring for the new token
    setupExpirationMonitoring(token);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, authFetch }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context easily
export const useAuth = () => useContext(AuthContext);
