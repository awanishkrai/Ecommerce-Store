// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // or process.env.REACT_APP_API_URL
  headers: { "Content-Type": "application/json" },
});

// Helper to get token
const getToken = (isAdmin = false) => {
  const key = isAdmin ? "admin" : "user";
  const data = JSON.parse(localStorage.getItem(key) || "{}");
  return data.token || "";
};

// Helper to get headers with token
const getHeaders = (isAdmin = false) => {
  const token = getToken(isAdmin);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API Service
export const apiService = {
  // 🔹 Admin
  getUsers: () => api.get("/users", { headers: getHeaders(true) }),

  // 🔹 Products
  getProducts: () => api.get("/products"),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) =>
    api.post("/products", data, { headers: getHeaders(true) }),
  updateProduct: (id, data) =>
    api.put(`/products/${id}`, data, { headers: getHeaders(true) }),
  deleteProduct: (id) =>
    api.delete(`/products/${id}`, { headers: getHeaders(true) }),
  uploadProductImage: (formData) =>
    api.post("/products/upload", formData, {
      headers: { "Content-Type": "multipart/form-data", ...getHeaders(true) },
    }),

  // 🔹 Users
  signup: (data) => api.post("/users/signup", data),
  login: (data) => api.post("/users/login", data),
  adminLogin: (data) => api.post("/users/adminLogin", data),
  getProfile: () => api.get("/users/profile", { headers: getHeaders(false) }),
  updateProfile: (data) =>
    api.put("/users/profile", data, { headers: getHeaders(false) }),

  // 🔹 Orders
  createOrder: (data) =>
    api.post(`/orders`, data, { headers: getHeaders(false) }),
  getOrder: (id) => api.get(`/orders/${id}`, { headers: getHeaders(false) }),
  getMyOrders: () =>
    api.get(`/orders/myorders/list`, { headers: getHeaders(false) }),
  getAllOrders: () => api.get("/orders", { headers: getHeaders(true) }),
  updateOrderToPaid: (id) =>
    api.put(`/orders/${id}/pay`, {}, { headers: getHeaders(false) }),
  updateOrderStatus: (id, status) =>
    api.put(`/orders/${id}/status`, { status }, { headers: getHeaders(true) }),

  // Addresses
  getUserAddresses: (userId) =>
    api.get(`/addresses/user/${userId}`, { headers: getHeaders(false) }),

  getAddress: (id) =>
    api.get(`/addresses/${id}`, { headers: getHeaders(false) }),

  addAddress: (address) =>
    api.post(`/addresses`, address, { headers: getHeaders(false) }),

  updateAddress: (id, address) =>
    api.put(`/addresses/${id}`, address, { headers: getHeaders(false) }),

  deleteAddress: (id) =>
    api.delete(`/addresses/${id}`, { headers: getHeaders(false) }),
};

export default api;
