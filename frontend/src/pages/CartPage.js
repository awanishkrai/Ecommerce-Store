import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { apiService } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import PaymentForm from "../components/PaymentForm";
import "./CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } =
    useCart();
  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data and addresses
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = await apiService.getProfile();

      if (userData.data?._id) {
        const addressesData = await apiService.getUserAddresses(
          userData.data._id
        );
        setAddresses(addressesData.data);

        // Set first address as default
        if (addressesData.data.length > 0) {
          setSelectedAddressId(addressesData.data[0]._id);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Checkout
  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to checkout");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    const selectedAddress = addresses.find(
      (addr) => addr._id === selectedAddressId
    );
    if (!selectedAddress) {
      toast.error("Please select a shipping address.");
      return;
    }

    try {
      setIsCheckingOut(true);

      const orderData = {
        orderItems: cart.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice: getCartTotal(),
        paymentMethod: "Cash on Delivery",
        shippingAddress: selectedAddress,
      };

      await apiService.createOrder(orderData);
      clearCart();
      setOrderSuccess(true);
      toast.success("Order placed successfully!");

      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error(error.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isCheckingOut) {
    return <LoadingSpinner message="Processing your order..." />;
  }

  if (loading) {
    return <LoadingSpinner message="Loading checkout details..." />;
  }

  if (orderSuccess) {
    return (
      <div className="success-page">
        <div className="success-content">
          <div className="success-icon"></div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your purchase. Your order is being processed.</p>
          <p>Redirecting you to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Continue Shopping
          </button>
          <h1>Your Cart ({cart.length} items)</h1>
        </div>

        {error && <div className="error-message" style={{ marginBottom: "1.5rem" }}>{error}</div>}

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon" style={{ fontSize: "4rem" }}>🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <button className="shop-now-btn" onClick={() => navigate("/")}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Shipping Address</h3>
                {addresses.length === 0 ? (
                  <p>Please add an address in your profile first.</p>
                ) : (
                  <select
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                  >
                    {addresses.map((addr) => (
                      <option key={addr._id} value={addr._id}>
                        {addr.addressLine}, {addr.city}, {addr.pinCode},{" "}
                        {addr.country}
                      </option>
                    ))}
                  </select>
                )}

                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>
                    Subtotal (
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} items):
                  </span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>

                <hr />

                <div className="payment-section">
                  <h3>Payment Method</h3>
                  <div className="payment-options">
                    <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Cash on Delivery</span>
                    </label>
                    <label className={`payment-option ${paymentMethod === 'Card' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="Card"
                        checked={paymentMethod === "Card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Pay with Card</span>
                    </label>
                  </div>
                </div>

                {paymentMethod === "Card" && user && addresses.length > 0 ? (
                  <div className="stripe-container">
                    {addresses.find(a => a._id === selectedAddressId) ? (
                      <PaymentForm
                        orderData={{
                          orderItems: cart, // Pass cart directly, logic handled in PaymentForm or backend
                          totalPrice: getCartTotal(),
                          shippingAddress: addresses.find(a => a._id === selectedAddressId),
                          user: user
                        }}
                        clearCart={clearCart}
                      />
                    ) : (
                      <p className="error-text">Please select an address first.</p>
                    )}
                  </div>
                ) : (
                  <button
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || addresses.length === 0}
                  >
                    {user ? "Place Order (COD)" : "Login to Checkout"}
                  </button>
                )}

                {!user && (
                  <p className="login-notice">
                    Please{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="link-btn"
                    >
                      login
                    </button>{" "}
                    to complete your order
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  // Check if image is a URL or an emoji/placeholder
  const isValidImageUrl = (img) => {
    if (!img) return false;
    return img.startsWith('http') || img.startsWith('/') || img.startsWith('data:');
  };

  return (
    <div className="cart-item">
      <div className="item-image">
        {isValidImageUrl(item.image) ? (
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ) : (
          <div
            style={{
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "8px",
            }}
          >
            {item.image || "📦"}
          </div>
        )}
      </div>

      <div className="item-details">
        <h4 className="item-name">{item.name}</h4>
        <p className="item-category">{item.category}</p>
        <p className="item-price">${item.price.toFixed(2)} each</p>
      </div>

      <div className="item-quantity">
        <div className="quantity-controls">
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="qty-btn"
          >
            -
          </button>
          <span className="quantity">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
            className="qty-btn"
          >
            +
          </button>
        </div>
      </div>

      <div className="item-total">
        <span className="total-price">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        <button onClick={() => onRemove(item._id)} className="remove-btn">
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartPage;
