//ProductCard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  // Check if image is a URL or an emoji/placeholder
  const isValidImageUrl = (img) => {
    if (!img) return false;
    return img.startsWith('http') || img.startsWith('/') || img.startsWith('data:');
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    await onAddToCart(product, quantity);

    // Show feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="product-card">
      {/* Product Image */}
      <div className="product-image" onClick={handleViewDetails}>
        {isValidImageUrl(product.image) && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "4rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              cursor: "pointer",
            }}
          >
            {product.image || "📦"}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <div className="product-stock">
          {product.inStock ? (
            <span className="in-stock"> In Stock</span>
          ) : (
            <span className="out-of-stock"> Out of Stock</span>
          )}
        </div>
      </div>

      {/* Product Actions */}
      <div className="product-actions">
        <div className="quantity-selector">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() =>
              setQuantity(
                product.stock
                  ? Math.min(product.stock, quantity + 1)
                  : quantity + 1
              )
            }
            disabled={product.stock ? quantity >= product.stock : false}
          >
            +
          </button>
        </div>

        <button className="view-details-btn" onClick={handleViewDetails}>
          View Details
        </button>

        <button
          className={`add-to-cart-btn ${isAdding ? "adding" : ""}`}
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
        >
          {isAdding ? " Added!" : " Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
