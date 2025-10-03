import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial State
const initialState = {
  user: null,
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  products: [],
  orders: [],
  loading: false,
  error: null,
};

// Action Types
export const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_USER: "SET_USER",
  LOGOUT_USER: "LOGOUT_USER",
  SET_PRODUCTS: "SET_PRODUCTS",
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_CART_QUANTITY: "UPDATE_CART_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  SET_ORDERS: "SET_ORDERS",
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case ACTIONS.SET_USER:
      return { ...state, user: action.payload, loading: false };

    case ACTIONS.LOGOUT_USER:
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      return { ...state, user: null, cart: [], orders: [] };

    case ACTIONS.SET_PRODUCTS:
      return { ...state, products: action.payload, loading: false };

    case ACTIONS.ADD_TO_CART:
      const newItem = action.payload;
      const existingItem = state.cart.find((item) => item._id === newItem._id);

      let updatedCart;
      if (existingItem) {
        updatedCart = state.cart.map((item) =>
          item._id === newItem._id
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
            : item
        );
      } else {
        updatedCart = [
          ...state.cart,
          { ...newItem, quantity: newItem.quantity || 1 },
        ];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { ...state, cart: updatedCart };

    case ACTIONS.UPDATE_CART_QUANTITY:
      const { id, quantity } = action.payload;
      const cartAfterUpdate = state.cart
        .map((item) => (item._id === id ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);

      localStorage.setItem("cart", JSON.stringify(cartAfterUpdate));
      return { ...state, cart: cartAfterUpdate };

    case ACTIONS.REMOVE_FROM_CART:
      const cartAfterRemoval = state.cart.filter(
        (item) => item._id !== action.payload
      );
      localStorage.setItem("cart", JSON.stringify(cartAfterRemoval));
      return { ...state, cart: cartAfterRemoval };

    case ACTIONS.CLEAR_CART:
      localStorage.removeItem("cart");
      return { ...state, cart: [] };

    case ACTIONS.SET_ORDERS:
      return { ...state, orders: action.payload, loading: false };

    default:
      return state;
  }
};

// Create Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user from localStorage on app start
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: ACTIONS.SET_USER, payload: user });
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Context value
  const value = {
    ...state,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
