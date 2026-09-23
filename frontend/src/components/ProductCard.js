// ProductCard.js — Allura editorial tile
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const hasValidImage = (img) =>
    img && (img.startsWith("http") || img.startsWith("/") || img.startsWith("data:"));

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAdding(true);
    await onAddToCart(product, 1);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <article
      className="product-tile"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={`${product.name}, $${product.price?.toFixed(2)}`}
    >
      {/* Image */}
      <div className="tile-image">
        {hasValidImage(product.image) && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="tile-placeholder" />
        )}

        {/* Hover overlay — "Add to bag" */}
        {product.inStock && (
          <div className="tile-overlay">
            <button
              className={`tile-add-btn ${isAdding ? "tile-add-btn--added" : ""}`}
              onClick={handleAddToCart}
              disabled={isAdding}
              aria-label={`Add ${product.name} to bag`}
            >
              {isAdding ? "Added" : "Add to bag"}
            </button>
          </div>
        )}

        {!product.inStock && (
          <span className="tile-sold-out">Sold out</span>
        )}
      </div>

      {/* Meta */}
      <div className="tile-meta">
        <span className="tile-category">{product.category}</span>
        <span className="tile-name">{product.name}</span>
        <span className="tile-price">${product.price?.toFixed(2)}</span>
      </div>
    </article>
  );
};

export default ProductCard;
