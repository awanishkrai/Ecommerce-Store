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

  // Redirect non-admin users
  useEffect(() => {
    if (!admin) navigate("/login");
  }, [admin, navigate]);

  // Fetch admin data
  const fetchData = async () => {
    try {
      setLoading(true);
      const usersRes = await apiService.getUsers(true); // Admin token
      const productsRes = await apiService.getProducts();
      const ordersRes = await apiService.getAllOrders(true); // Admin token

      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) fetchData();
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
      const res = await apiService.createProduct(
        { name, description, category, image, price, stock },
        true
      );
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
      const res = await apiService.updateProduct(editingProduct, formData, true);
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
      await apiService.deleteProduct(id, true);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await apiService.updateOrderStatus(id, status, true);
      setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Welcome, {admin?.name}</h1>
        <button onClick={() => logout(true)}>Logout</button>
      </header>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Products Section */}
      <section>
        <h2>Products</h2>
        {!showForm && !editingProduct && (
          <button onClick={() => setShowForm(true)}>Add New Product</button>
        )}

        {(showForm || editingProduct) && (
          <form
            onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
            className="product-form"
          >
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              required
            />
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
              required
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              min="0"
            />
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock"
              min="0"
            />
            <button type="submit">{editingProduct ? "Update" : "Create"}</button>
            <button type="button" onClick={editingProduct ? handleCancelEdit : () => setShowForm(false)}>
              Cancel
            </button>
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>{p.category}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <img src={p.image} alt={p.name} width={50} />
                </td>
                <td>
                  <button onClick={() => handleEditProduct(p)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Users Section */}
      <section>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role || "user"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Orders Section */}
      {/* Orders Section */}
<section>
  <h2>Orders</h2>
  <table>
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Products</th>
        <th>Total</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((o) => (
        <tr key={o._id}>
          <td>{o._id}</td>
        
          <td>
            {o.orderItems.map((item) => (
              <div key={item._id} style={{ marginBottom: "5px" }}>
                <strong>{item.name}</strong> (${item.price}) x {item.quantity}
              </div>
            ))}
          </td>
          <td>${o.totalPrice}</td>
          <td>{o.status}</td>
          <td>
            {o.status !== "Delivered" && (
              <button onClick={() => handleUpdateOrderStatus(o._id, "Delivered")}>
                Mark Delivered
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</section>

    </div>
  );
};

export default AdminDashboard;
