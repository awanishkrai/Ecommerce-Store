import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiService } from "../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Product form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
    price: 0,
    stock: 0,
  });

  const [editingProduct, setEditingProduct] = useState(null);

  // Redirect non-admin users to admin login
  useEffect(() => {
    if (!admin) navigate("/admin/login");
  }, [admin, navigate]);

  // Fetch admin data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const usersRes = await apiService.getUsers();
      const productsRes = await apiService.getProducts();
      const ordersRes = await apiService.getAllOrders();

      setUsers(usersRes.data || []);
      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Create new product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const { name, description, category, image, price, stock } = formData;

    if (!name || !description || !category || !image) {
      return alert("Please fill in all required fields");
    }

    try {
      const res = await apiService.createProduct({
        name,
        description,
        category,
        image,
        price: Number(price),
        stock: Number(stock),
      });
      setProducts([...products, res.data]);
      setShowForm(false);
      setFormData({ name: "", description: "", category: "", image: "", price: 0, stock: 0 });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create product");
    }
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      image: product.image,
      price: product.price,
      stock: product.stock,
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await apiService.updateProduct(editingProduct, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });
      setProducts(products.map((p) => (p._id === editingProduct ? res.data : p)));
      setEditingProduct(null);
      setFormData({ name: "", description: "", category: "", image: "", price: 0, stock: 0 });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update product");
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", category: "", image: "", price: 0, stock: 0 });
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiService.deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await apiService.updateOrderStatus(id, status);
      setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  // Check if image is a URL or emoji
  const isValidImageUrl = (img) => {
    if (!img) return false;
    return img.startsWith("http") || img.startsWith("/") || img.startsWith("data:");
  };

  // Render product image
  const renderProductImage = (image, name, size = 50) => {
    if (isValidImageUrl(image)) {
      return <img src={image} alt={name} width={size} style={{ borderRadius: "4px" }} />;
    }
    return (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size > 50 ? "2rem" : "1.5rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "4px",
        }}
      >
        {image || "📦"}
      </div>
    );
  };

  const handleLogout = () => {
    logout(true);
    navigate("/admin/login");
  };

  if (!admin) {
    return <div className="admin-dashboard"><p>Redirecting to login...</p></div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Welcome, {admin?.name || "Admin"}</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Products Section */}
      <section className="admin-section">
        <h2>Products ({products.length})</h2>
        {!showForm && !editingProduct && (
          <button onClick={() => setShowForm(true)} className="add-btn">
            + Add New Product
          </button>
        )}

        {(showForm || editingProduct) && (
          <form
            onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
            className="product-form"
          >
            <div className="form-row">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
              />
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                required
              />
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
            <div className="form-row">
              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Image URL or Emoji (e.g. 🎧)"
                required
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                min="0"
                step="0.01"
              />
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
                min="0"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingProduct ? "Update Product" : "Create Product"}
              </button>
              <button
                type="button"
                onClick={editingProduct ? handleCancelEdit : () => setShowForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-message">No products found</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    <td>{renderProductImage(p.image, p.name)}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td className={p.stock <= 5 ? "low-stock" : ""}>{p.stock}</td>
                    <td className="action-buttons">
                      <button onClick={() => handleEditProduct(p)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(p._id)} className="delete-btn">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Users Section */}
      <section className="admin-section">
        <h2>Users ({users.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-message">No users found</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role || "customer"}`}>
                        {u.role || "customer"}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Orders Section */}
      <section className="admin-section">
        <h2>Orders ({orders.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Shipping</th>
                <th>Products</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-message">No orders found</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id}>
                    <td className="order-id">{o._id.slice(-8)}</td>
                    <td>{o.user?.name || "Guest"}</td>
                    <td className="shipping-info">
                      {o.shippingAddress ? (
                        <>
                          <div>{o.shippingAddress.addressLine}</div>
                          <div>
                            {o.shippingAddress.city}, {o.shippingAddress.pinCode}
                          </div>
                          <div>{o.shippingAddress.country}</div>
                        </>
                      ) : (
                        <span className="text-muted">No address</span>
                      )}
                    </td>
                    <td>
                      {o.orderItems?.map((item) => (
                        <div key={item._id} className="order-item">
                          <span className="item-name">{item.name}</span>
                          <span className="item-qty">x{item.quantity}</span>
                        </div>
                      ))}
                    </td>
                    <td className="order-total">${Number(o.totalPrice).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${o.status}`}>{o.status}</span>
                    </td>
                    <td className="action-buttons">
                      {o.status !== "delivered" && (
                        <>
                          {o.status === "pending" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o._id, "processing")}
                              className="status-btn processing"
                            >
                              Process
                            </button>
                          )}
                          {o.status === "processing" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o._id, "shipped")}
                              className="status-btn shipped"
                            >
                              Ship
                            </button>
                          )}
                          {o.status === "shipped" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o._id, "delivered")}
                              className="status-btn delivered"
                            >
                              Deliver
                            </button>
                          )}
                        </>
                      )}
                      {o.status === "delivered" && (
                        <span className="completed-text">✓ Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
