import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { useCart } from "../hooks/useCart";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check if image is a URL or an emoji/placeholder
  const isValidImageUrl = (img) => {
    if (!img) return false;
    return img.startsWith('http') || img.startsWith('/') || img.startsWith('data:');
  };

  // Fetch product data
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch product");
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
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) return <LoadingSpinner message="Loading product..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProduct} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  return (
    <div className="product-detail-page">
      <div className="container">
        <button className="back-btn" onClick={handleBackClick}>
          ← Back
        </button>

        <div className="product-detail">
          {/* Product Image */}
          <div className="product-image-section">
            <div className="large-product-image">
              {isValidImageUrl(product.image) && !imageError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  onError={() => setImageError(true)}
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    height: "auto",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    height: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "8rem",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "8px",
                  }}
                >
                  {product.image || "📦"}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-header">
              <span className="product-category">{product.category}</span>
              <h1 className="product-title">{product.name}</h1>
              <div className="product-price-section">
                <span className="current-price">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || "No description available."}</p>
            </div>

            {/* Stock Info */}
            <div className="product-stock-info">
              {product.inStock ? (
                <div className="stock-available">
                  <span className="stock-icon"></span>
                  <span>{product.stock} items in stock</span>
                </div>
              ) : (
                <div className="stock-unavailable">
                  <span className="stock-icon"></span>
                  <span>Currently out of stock</span>
                </div>
              )}
            </div>

            {/* Purchase Section */}
            <div className="purchase-section">
              <div className="quantity-section">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className={`add-to-cart-btn ${isAdding ? "adding" : ""}`}
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding}
                >
                  {isAdding
                    ? " Added to Cart!"
                    : ` Add to Cart - $${(product.price * quantity).toFixed(
                      2
                    )}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
