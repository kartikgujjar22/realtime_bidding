import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Add a loading state to prevent flickering (optional but good)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for login on app start
    const token = Cookies.get("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Invalid user data");
        Cookies.remove("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // 1. Update React State (Instant UI update)
    setUser(userData);
    
    // 2. Update Browser Storage
    Cookies.set("token", token, { expires: 7, secure: true });
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context easily
export const useAuth = () => useContext(AuthContext);