import React, { useEffect, useState } from "react";
import { apiService } from "../services/api";
import "./userDashboard.css";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    addressLine: "",
    city: "",
    pinCode: "",
    country: "",
    type: "shipping",
  });

  // Fetch user, orders, addresses
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = await apiService.getProfile();
      setUser(userData.data);

      const ordersData = await apiService.getMyOrders();
      setOrders(ordersData.data);

      if (userData.data?._id) {
        const addressesData = await apiService.getUserAddresses(userData.data._id);
        setAddresses(addressesData.data);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async () => {
    try {
      await apiService.addAddress({ ...addressForm, userId: user._id });
      setAddressForm({ addressLine: "", city: "", pinCode: "", country: "", type: "shipping" });
      fetchUserData();
    } catch (err) {
      console.error("Failed to add address:", err);
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      addressLine: addr.addressLine,
      city: addr.city,
      pinCode: addr.pinCode,
      country: addr.country,
      type: addr.type || "shipping",
    });
  };

  const handleUpdateAddress = async () => {
    try {
      await apiService.updateAddress(editingAddressId, addressForm);
      setEditingAddressId(null);
      setAddressForm({ addressLine: "", city: "", pinCode: "", country: "", type: "shipping" });
      fetchUserData();
    } catch (err) {
      console.error("Failed to update address:", err);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await apiService.deleteAddress(id);
      fetchUserData();
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div className="user-dashboard">
      <h1>User Profile</h1>

      {/* User Info */}
      <h2>User Info</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {/* Addresses */}
      <h2>Addresses</h2>
      {Array.isArray(addresses) && addresses.length === 0 && <p>No addresses saved.</p>}
      <ul className="address-list">
        {Array.isArray(addresses) &&
          addresses.map((addr) => (
            <li key={addr._id}>
              <span>{addr.addressLine}, {addr.city}, {addr.pinCode}, {addr.country} ({addr.type})</span>
              <div>
                <button onClick={() => handleEditAddress(addr)}>Edit</button>
                <button onClick={() => handleDeleteAddress(addr._id)}>Delete</button>
              </div>
            </li>
          ))}
      </ul>

      {/* Address Form */}
      <div className="address-form">
        <h3>{editingAddressId ? "Edit Address" : "Add New Address"}</h3>
        <input
          type="text"
          name="addressLine"
          value={addressForm.addressLine}
          onChange={handleChange}
          placeholder="Address Line"
        />
        <input
          type="text"
          name="city"
          value={addressForm.city}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          type="text"
          name="pinCode"
          value={addressForm.pinCode}
          onChange={handleChange}
          placeholder="Pin Code"
        />
        <input
          type="text"
          name="country"
          value={addressForm.country}
          onChange={handleChange}
          placeholder="Country"
        />
        <select name="type" value={addressForm.type} onChange={handleChange}>
          <option value="shipping">Shipping</option>
          <option value="billing">Billing</option>
        </select>
        {editingAddressId ? (
          <button onClick={handleUpdateAddress}>Update Address</button>
        ) : (
          <button onClick={handleAddAddress}>Add Address</button>
        )}
      </div>

      {/* Orders */}
      <h2>Orders</h2>
      {Array.isArray(orders) && orders.length === 0 && <p>You have no orders.</p>}
      {Array.isArray(orders) &&
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h3>Order ID: {order._id}</h3>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ${order.totalPrice}</p>
            <h4>Shipping Address:</h4>
            <p>
              {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}, {order.shippingAddress?.pinCode}, {order.shippingAddress?.country}
            </p>
            <h4>Products:</h4>
            <ul>
              {order.orderItems.map((item) => (
                <li key={item._id}>
                  {item.name} - ${item.price} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
};

export default UserDashboard;
