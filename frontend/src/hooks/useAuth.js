import { useState } from "react";
import { useApp } from "../context/AppContext";
import { apiService } from "../services/api";
import { ACTIONS } from "../context/AppContext";

export const useAuth = () => {
  const { user, dispatch } = useApp();
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("admin");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Login function for User/Admin separately
  const login = async (credentials, isAdmin = false) => {
    try {
      setLoading(true);
      setError(null);

      // ⬅️ Choose correct API endpoint
      const response = isAdmin
        ? await apiService.adminLogin(credentials)
        : await apiService.login(credentials);

      const userData = response.data;

      // Admin role check
      if (isAdmin && userData.role !== "admin") {
        throw new Error("Not authorized as admin");
      }

      // Store in correct localStorage key
      if (isAdmin) {
        localStorage.setItem("admin", JSON.stringify(userData));
        setAdmin(userData);
      } else {
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch({ type: ACTIONS.SET_USER, payload: userData });
      }

      return userData;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Signup → only for normal users
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.signup(userData);
      const newUser = response.data;

      localStorage.setItem("user", JSON.stringify(newUser));
      dispatch({ type: ACTIONS.SET_USER, payload: newUser });

      return newUser;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Signup failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout clears correct storage
  const logout = (isAdmin = false) => {
    if (isAdmin) {
      localStorage.removeItem("admin");
      setAdmin(null);
    } else {
      localStorage.removeItem("user");
      dispatch({ type: ACTIONS.LOGOUT_USER });
    }
  };

  return {
    user,
    admin,
    login,
    signup,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
    isAdminAuthenticated: !!admin,
  };
};
