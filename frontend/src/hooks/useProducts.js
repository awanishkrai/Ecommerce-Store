import { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { apiService } from "../services/api";
import { ACTIONS } from "../context/AppContext";

export const useProducts = () => {
  const { products, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ useCallback prevents re-creating fetchProducts on every render
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProducts();
      dispatch({ type: ACTIONS.SET_PRODUCTS, payload: response.data });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // ✅ Now we can safely include fetchProducts and products.length
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};
