import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Product, CartItem, User, Order, ShippingAddress } from '../types';

// API base URL (adjust if your backend runs on a different port)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface AppState {
  user: User | null;
  cart: CartItem[];
  orders: Order[];
  searchQuery: string;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  placeOrder: (shippingAddress: ShippingAddress, paymentMethod: string) => Promise<{ clientSecret: string; orderId: string }>;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  setSearchQuery: (query: string) => void;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  fetchUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// LocalStorage key for cart only (no longer storing auth or orders)
const CART_KEY = 'shopvault_cart';

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<AppState['notification']>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Helper: fetch wrapper with credentials (includes HttpOnly cookie)
  const fetchWithAuth = useCallback(async (path: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${res.status}`);
    }
    return res.json();
  }, []);

  // Fetch current user (called on app mount)
  const fetchUser = useCallback(async () => {
    try {
      const data = await fetchWithAuth('/auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
    }
  }, [fetchWithAuth]);

  // Login
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setUser(data.user);
      showNotification(`Welcome back, ${data.user.name}!`, 'success');
      return true;
    } catch (error: any) {
      showNotification(error.message || 'Invalid credentials', 'error');
      return false;
    }
  }, [fetchWithAuth, showNotification]);

  // Register
  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const data = await fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      setUser(data.user);
      showNotification(`Welcome to Mudia Stores, ${data.user.name}!`, 'success');
      return true;
    } catch (error: any) {
      showNotification(error.message || 'Registration failed', 'error');
      return false;
    }
  }, [fetchWithAuth, showNotification]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await fetchWithAuth('/auth/logout', { method: 'POST' });
      setUser(null);
      setOrders([]);
      showNotification('Logged out successfully', 'info');
    } catch {
      // ignore
    }
  }, [fetchWithAuth, showNotification]);

  // ---- Cart actions (local storage only) ----
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prev, { product, quantity }];
      }
      saveCart(newCart);
      return newCart;
    });
    showNotification(`${product.name} added to cart`, 'success');
  }, [showNotification]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.product.id !== productId);
      saveCart(newCart);
      return newCart;
    });
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      const newCart = prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCart(newCart);
      return newCart;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    saveCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Place order (calls backend to create PaymentIntent)
  const placeOrder = useCallback(async (shippingAddress: ShippingAddress, paymentMethod: string) => {
    if (!user) throw new Error('You must be logged in');
    if (cart.length === 0) throw new Error('Cart is empty');

    const items = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    try {
      const data = await fetchWithAuth('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items,
          shippingAddress,
          paymentMethod,
        }),
      });
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Order creation failed');
    }
  }, [user, cart, fetchWithAuth]);

  // Fetch orders for the current user
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchWithAuth('/orders');
      setOrders(data.orders);
    } catch {
      setOrders([]);
    }
  }, [user, fetchWithAuth]);

  // Update order status (admin only)
  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    if (!user || user.role !== 'admin') return;
    try {
      await fetchWithAuth(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await fetchOrders();
      showNotification(`Order ${orderId} updated to ${status}`, 'success');
    } catch (error: any) {
      showNotification(error.message || 'Status update failed', 'error');
    }
  }, [user, fetchWithAuth, fetchOrders, showNotification]);

  // Auto-fetch user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        orders,
        searchQuery,
        notification,
        login,
        register,
        logout,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        placeOrder,
        fetchOrders,
        updateOrderStatus,
        setSearchQuery,
        showNotification,
        fetchUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}