// ProductDetailPage.js — Allura full-bleed editorial layout
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../services/api";
import { useCart } from "../hooks/useCart";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasValidImage = (img) =>
    img && (img.startsWith("http") || img.startsWith("/") || img.startsWith("data:"));

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProduct(id);
      setProduct(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 1200);
  };

  if (loading) return <LoadingSpinner message="Loading…" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProduct} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  return (
    <main className="pdp" aria-label={product.name}>
      {/* Left — full-bleed sticky image column */}
      <div className="pdp-image-col">
        {hasValidImage(product.image) && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="pdp-image-placeholder" />
        )}
      </div>

      {/* Right — scrollable info column */}
      <div className="pdp-info-col">
        <div className="pdp-info-inner">
          {/* Category */}
          <span className="pdp-category">{product.category}</span>

          {/* Name */}
          <h1 className="pdp-name">{product.name}</h1>

          {/* Price */}
          <p className="pdp-price">${product.price?.toFixed(2)}</p>

          {/* Divider */}
          <hr className="pdp-divider" />

          {/* Description */}
          {product.description && (
            <p className="pdp-description">{product.description}</p>
          )}

          {/* Stock */}
          <p className="pdp-stock">
            {product.inStock
              ? `${product.stock} in stock`
              : "Currently out of stock"}
          </p>

          {/* Quantity */}
          {product.inStock && (
            <div className="pdp-qty">
              <button
                className="pdp-qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="pdp-qty-value" aria-label={`Quantity: ${quantity}`}>
                {quantity}
              </span>
              <button
                className="pdp-qty-btn"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}

          {/* CTA — the only oxblood element on this page */}
          <button
            className={`pdp-cta ${isAdding ? "pdp-cta--added" : ""}`}
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
          >
            {isAdding
              ? "Added to bag"
              : product.inStock
              ? `Add to bag — $${(product.price * quantity).toFixed(2)}`
              : "Sold out"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
