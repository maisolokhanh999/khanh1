import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from './config/apiConfig.js';

// ── Context ──────────────────────────────────────────────────
export const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const getId = (item) => item.productId?._id || item.productId || item._id || item.id;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = () => !!localStorage.getItem('token');

  // ── GET /api/cart ─────────────────────────────────────────
  const fetchCart = async () => {
    if (!isLoggedIn()) return;
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data.items || []);
    } catch (err) {
      console.error('fetchCart:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ── POST /api/cart/items ──────────────────────────────────
  const addToCart = async (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity) || 1);
    const productId = product._id || product.id;
    try {
      const { data } = await api.post('/cart/items', { productId, quantity: qty });
      setCart(data.items || []);
    } catch (err) {
      console.error('addToCart:', err.response?.data?.message || err.message);
    }
  };

  // ── PUT /api/cart/items/:productId ────────────────────────
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    try {
      const { data } = await api.put(`/cart/items/${productId}`, { quantity });
      setCart(data.items || []);
    } catch (err) {
      console.error('updateQuantity:', err.response?.data?.message || err.message);
    }
  };

  const increaseQuantity = (productId) => {
    const item = cart.find((i) => getId(i) === productId);
    if (item) updateQuantity(productId, item.quantity + 1);
  };

  const decreaseQuantity = (productId) => {
    const item = cart.find((i) => getId(i) === productId);
    if (item) updateQuantity(productId, item.quantity - 1);
  };

  const setQuantity = (productId, quantity) => updateQuantity(productId, quantity);

  // ── DELETE /api/cart/items/:productId ─────────────────────
  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/items/${productId}`);
      setCart(data.items || []);
    } catch (err) {
      console.error('removeFromCart:', err.response?.data?.message || err.message);
    }
  };

  // ── DELETE /api/cart ──────────────────────────────────────
  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart([]);
    } catch (err) {
      console.error('clearCart:', err.response?.data?.message || err.message);
    }
  };

  // ── Tổng ─────────────────────────────────────────────────
  const totalQuantity = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => {
    const price = i.productId?.price ?? i.price ?? 0;
    return sum + price * i.quantity;
  }, 0);

  const value = useMemo(() => ({
    cart,
    loading,
    fetchCart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    setQuantity,
    clearCart,
    totalQuantity,
    totalPrice,
  }), [cart, loading]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};