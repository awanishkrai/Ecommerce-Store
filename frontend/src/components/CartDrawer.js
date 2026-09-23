// CartDrawer.js — Allura slide-in bag drawer
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import "./CartDrawer.css";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const hasValidImage = (img) =>
    img && (img.startsWith("http") || img.startsWith("/") || img.startsWith("data:"));

  const handleCheckout = () => {
    onClose();
    navigate("/cart");
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isOpen ? "drawer-backdrop--visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`cart-drawer ${isOpen ? "cart-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
      >
        {/* Header */}
        <div className="drawer-header">
          <h2 className="drawer-title">
            Your bag
            {itemCount > 0 && (
              <span className="drawer-count">{itemCount}</span>
            )}
          </h2>
          <button className="drawer-close" onClick={onClose} aria-label="Close bag">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="drawer-empty">
              <p className="drawer-empty-text">Your bag is empty.</p>
              <button className="drawer-empty-cta" onClick={onClose}>
                Continue browsing
              </button>
            </div>
          ) : (
            <>
              {/* Line items */}
              <ul className="drawer-items" aria-label="Bag items">
                {cart.map((item) => (
                  <li key={item._id} className="drawer-item">
                    {/* Thumbnail */}
                    <div className="drawer-item-image">
                      {hasValidImage(item.image) ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="drawer-item-placeholder" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="drawer-item-info">
                      <span className="drawer-item-name">{item.name}</span>
                      <span className="drawer-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity stepper */}
                      <div className="drawer-qty">
                        <button
                          className="drawer-qty-btn"
                          onClick={() =>
                            item.quantity <= 1
                              ? removeFromCart(item._id)
                              : updateQuantity(item._id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="drawer-qty-value">{item.quantity}</span>
                        <button
                          className="drawer-qty-btn"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                        <button
                          className="drawer-remove"
                          onClick={() => removeFromCart(item._id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="drawer-footer">
                <div className="drawer-total-row">
                  <span className="drawer-total-label">Total</span>
                  <span className="drawer-total-amount">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
                <p className="drawer-shipping-note">
                  Shipping calculated at checkout
                </p>
                <button className="drawer-checkout-btn" onClick={handleCheckout}>
                  Proceed to checkout
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
