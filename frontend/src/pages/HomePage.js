//HomePage.js
import React, { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import ProductCard from "../components/ProductCard";
import SidebarFilter from "../components/SidebarFilter";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import "./HomePage.css";

const HomePage = () => {
  const { products, loading, error, fetchProducts, totalPages, currentPage } =
    useProducts();
  const { addToCart } = useCart();
  const [keyword, setKeyword] = useState("");

  const handleFilter = (filters) => {
    fetchProducts({ ...filters, keyword, pageNumber: 1 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts({ keyword, pageNumber: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchProducts({ pageNumber: newPage, keyword });
    }
  };

  if (loading) return <LoadingSpinner message="Loading products..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => fetchProducts()} />;

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Allura</h1>
        <p>Allura — where every little thing is chosen with care, just for you.</p>

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <SidebarFilter onFilter={handleFilter} />
        </aside>

        {/* Products */}
        <div className="products-section">
          <h2>Featured Products</h2>

          {products.length === 0 ? (
            <div className="no-results">No products found.</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={(product, quantity) => addToCart(product, quantity)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
