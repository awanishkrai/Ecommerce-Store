import { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { apiService } from "../services/api";
import { ACTIONS } from "../context/AppContext";

export const useProducts = () => {
  const { products, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ fetchProducts now accepts params
  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProducts(params);

      // Handle response structure depending on backend pagination
      const data = response.data.products || response.data;
      const pages = response.data.pages || 1;
      const page = response.data.page || 1;

      dispatch({ type: ACTIONS.SET_PRODUCTS, payload: data });
      setTotalPages(pages);
      setCurrentPage(page);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Initial fetch
  useEffect(() => {
    // If we have no products, fetch initial page
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  return {
    products,
    loading,
    error,
    totalPages,
    currentPage,
    fetchProducts, // Exposed for manual refetch with params
  };
};
