//HomePage.js
import React from "react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import "./HomePage.css";

const HomePage = () => {
  const { products, loading, error, refetch } = useProducts();
  const { addToCart } = useCart();

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Allura</h1>
        <p>
          Allura — where every little thing is chosen with care, just for you.
        </p>
      </div>

      <div className="products-section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={(product, quantity) => addToCart(product, quantity)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
