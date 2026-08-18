import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET CART
  // ==========================================

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCart({
        items: [],
        subtotal: 0,
      });

      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/cart");

      setCart(
        response.data.cart || {
          items: [],
          subtotal: 0,
        },
      );
    } catch (error) {
      console.error("Fetch Cart Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async (foodId, quantity = 1) => {
    const response = await api.post("/cart", {
      foodId,
      quantity,
    });

    setCart(response.data.cart);

    return response.data;
  };

  // ==========================================
  // UPDATE CART ITEM
  // ==========================================

  const updateCartItem = async (foodId, quantity) => {
    const response = await api.put(`/cart/${foodId}`, {
      quantity,
    });

    setCart(response.data.cart);

    return response.data;
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeFromCart = async (foodId) => {
    const response = await api.delete(`/cart/${foodId}`);

    setCart(response.data.cart);

    return response.data;
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = async () => {
    const response = await api.delete("/cart");

    setCart(
      response.data.cart || {
        items: [],
        subtotal: 0,
      },
    );

    return response.data;
  };

  // ==========================================
  // LOAD CART WHEN USER LOGS IN
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchCart();
    }
  }, []);

  const itemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
