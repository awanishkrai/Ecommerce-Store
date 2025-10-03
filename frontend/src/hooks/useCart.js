import { useApp } from "../context/AppContext";
import { ACTIONS } from "../context/AppContext";

export const useCart = () => {
  const { cart, dispatch } = useApp();

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: ACTIONS.ADD_TO_CART,
      payload: { ...product, quantity },
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      dispatch({
        type: ACTIONS.UPDATE_CART_QUANTITY,
        payload: { id, quantity },
      });
    }
  };

  const removeFromCart = (id) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: id });
  };

  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };
};
