import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD SAVED AUTHENTICATION
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);

        localStorage.removeItem("user");

        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user: loggedUser } = response.data;

    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify(loggedUser));

    setUser(loggedUser);

    return loggedUser;
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);

    const { token, user: registeredUser } = response.data;

    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify(registeredUser));

    setUser(registeredUser);

    return registeredUser;
  };

  // ==========================================
  // UPDATE USER
  // ==========================================

  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setUser(updatedUser);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);
  };

  // ==========================================
  // ROLE CHECK
  // ==========================================

  const isAdmin = user?.role === "admin";

  const isCustomer = user?.role === "customer";

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        login,
        register,
        updateUser,
        logout,

        isAdmin,
        isCustomer,

        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useAuth = () => useContext(AuthContext);
