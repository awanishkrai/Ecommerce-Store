import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import "./Navigation.css";
import Logo from "../Assets/image-removebg-preview.png";
const Navigation = () => {
  const navigate = useNavigate();
  const { user, admin, logout } = useAuth();
  const { cart } = useCart();

  const handleUserLogout = () => {
    logout(false); // user logout
    navigate("/login");
  };

  const handleAdminLogout = () => {
    logout(true); // admin logout
    navigate("/admin/login");
  };

  return (
    <nav className="navigation bg-gray-800 text-white p-4 flex justify-between">
      <div className="nav-left">
        <Link to="/" className="nav-logo font-bold text-xl">
          <img src={Logo} alt="Logo" className="kk" />
        </Link>
      </div>

      <div className="nav-right flex items-center gap-4">
        {/* Cart only for normal users */}
        {user && (
          <Link to="/cart" className="nav-item">
            Cart ({cart.length})
          </Link>
        )}

        {/* Admin Links */}
        {admin && (
          <>
            <Link to="/admin/dashboard" className="nav-item">
              Admin Dashboard
            </Link>
            <button
              onClick={handleAdminLogout}
              className="nav-item btn-logout bg-red-600 px-3 py-1 rounded"
            >
              Admin Logout
            </button>
          </>
        )}

        {/* User Links */}
        {user && !admin && (
          <>
            <Link to="/user/dashboard" className="nav-item">
              User Dashboard
            </Link>
            <button
              onClick={handleUserLogout}
              className="nav-item btn-logout bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}

        {/* If nobody logged in, show both logins */}
        {!user && !admin && (
          <>
            <Link
              to="/login"
              className="nav-item bg-blue-600 px-3 py-1 rounded"
            >
              User Login
            </Link>
            <Link
              to="/admin/login"
              className="nav-item bg-green-600 px-3 py-1 rounded"
            >
              Admin Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
