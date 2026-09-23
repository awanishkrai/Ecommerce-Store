// HomePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import ProductCard from "../components/ProductCard";
import TopFilterBar from "../components/TopFilterBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import "./HomePage.css";

const EDITORIAL_CATEGORIES = [
  { label: "Ready to Wear", slug: "Clothing" },
  { label: "Accessories", slug: "Accessories" },
  { label: "Footwear", slug: "Footwear" },
  { label: "Beauty", slug: "Beauty" },
];

const HomePage = () => {
  const { products, loading, error, fetchProducts, totalPages, currentPage } =
    useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) return <LoadingSpinner message="Loading…" />;
  if (error) return <ErrorMessage message={error} onRetry={() => fetchProducts()} />;

  // Hero uses first product; editorial strip uses next 3
  const heroProduct = products[0] || null;
  const stripProducts = products.slice(1, 4);

  const hasValidImage = (img) =>
    img && (img.startsWith("http") || img.startsWith("/") || img.startsWith("data:"));

  return (
    <div className="home-page">

      {/* ─── Asymmetric Editorial Hero ─────────────────────────────── */}
      <section className="hero" aria-label="Featured product">
        {/* Left: full-bleed portrait image */}
        <div className="hero-image">
          {heroProduct && hasValidImage(heroProduct.image) ? (
            <img
              src={heroProduct.image}
              alt={heroProduct.name}
              onClick={() => navigate(`/product/${heroProduct._id}`)}
            />
          ) : (
            <div className="hero-image-placeholder" />
          )}
        </div>

        {/* Right: editorial copy, left-aligned */}
        <div className="hero-copy">
          <p className="hero-eyebrow">New Season</p>
          <h1 className="hero-headline">
            {heroProduct ? heroProduct.name : "Chosen with care,\njust for you."}
          </h1>
          {heroProduct && (
            <p className="hero-price">${heroProduct.price?.toFixed(2)}</p>
          )}
          <button
            className="hero-cta"
            onClick={() => heroProduct && navigate(`/product/${heroProduct._id}`)}
          >
            View piece
          </button>
        </div>
      </section>

      {/* ─── Editorial Strip ────────────────────────────────────────── */}
      {stripProducts.length > 0 && (
        <section className="editorial-strip" aria-label="Editorial selection">
          {stripProducts.map((product, i) => (
            <div
              key={product._id}
              className={`strip-tile strip-tile--${i + 1}`}
              onClick={() => navigate(`/product/${product._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${product._id}`)}
            >
              {hasValidImage(product.image) ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="strip-placeholder" />
              )}
              <div className="strip-meta">
                <span className="strip-name">{product.name}</span>
                <span className="strip-price">${product.price?.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ─── "The Edit" — Horizontal Category Scroll ────────────────── */}
      <section className="the-edit" aria-label="Shop by category">
        <h2 className="the-edit-heading">The Edit</h2>
        <div className="the-edit-track">
          {EDITORIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              className="edit-card"
              onClick={() => handleFilter({ category: cat.slug })}
              aria-label={`Browse ${cat.label}`}
            >
              <div className="edit-card-fill" />
              <span className="edit-card-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Search ─────────────────────────────────────────────────── */}
      <section className="search-section">
        <form className="search-form" onSubmit={handleSearch} role="search">
          <input
            type="search"
            placeholder="Search the collection"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {/* ─── Filter + Masonry Grid ──────────────────────────────────── */}
      <section className="collection" aria-label="Product collection">
        <div className="collection-inner">
          <TopFilterBar onFilter={handleFilter} />

          {products.length === 0 ? (
            <p className="no-results">No pieces found.</p>
          ) : (
            <div className="masonry-grid">
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
            <div className="pagination" role="navigation" aria-label="Page navigation">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-btn"
              >
                Previous
              </button>
              <span className="page-indicator">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
