import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import "./Navigation.css";

const BagIcon = ({ count, onClick }) => (
  <button className="nav-bag" onClick={onClick} aria-label={`Open bag, ${count} items`}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
    {count > 0 && <span className="bag-count">{count}</span>}
  </button>
);

const Navigation = ({ onOpenCart }) => {
  const navigate = useNavigate();
  const { user, admin, logout } = useAuth();
  const { getCartItemsCount } = useCart();

  const handleUserLogout = () => {
    logout(false);
    navigate("/login");
  };

  const handleAdminLogout = () => {
    logout(true);
    navigate("/admin/login");
  };

  return (
    <nav className="allura-nav" role="navigation" aria-label="Main navigation">
      {/* Left — Wordmark */}
      <div className="nav-left">
        <Link to="/" className="nav-wordmark">Allura</Link>
      </div>

      {/* Centre — Primary links */}
      <div className="nav-centre">
        <Link to="/" className="nav-link">Shop</Link>
        <Link to="/" className="nav-link">Journal</Link>
      </div>

      {/* Right — Context-aware auth + bag */}
      <div className="nav-right">
        {/* Admin */}
        {admin && (
          <>
            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={handleAdminLogout} className="nav-link nav-link--action">
              Sign out
            </button>
          </>
        )}

        {/* Logged-in user */}
        {user && !admin && (
          <>
            <span className="nav-greeting">
              {user.name?.split(" ")[0] || "Account"}
            </span>
            <Link to="/user/dashboard" className="nav-link">Orders</Link>
            <button onClick={handleUserLogout} className="nav-link nav-link--action">
              Sign out
            </button>
          </>
        )}

        {/* Logged-out */}
        {!user && !admin && (
          <>
            <Link to="/login" className="nav-link">Sign in</Link>
            <Link to="/admin/login" className="nav-link nav-link--muted">Admin</Link>
          </>
        )}

        {/* Bag — only for users (not admins) */}
        {!admin && (
          <BagIcon count={getCartItemsCount()} onClick={onOpenCart} />
        )}
      </div>
    </nav>
  );
};

export default Navigation;

