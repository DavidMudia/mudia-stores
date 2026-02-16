import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Product, CartItem, User, Order, Page } from '../types';
import { sampleOrders } from '../data';

interface AppState {
    user: User | null;
    cart: CartItem[];
    orders: Order[];
    currentPage: Page;
    selectedProductId: string | null;
    selectedCategory: string | null;
    searchQuery: string;
    notification: { message: string; type: 'success' | 'error' | 'info' } | null;
}

interface AppContextType extends AppState {
    login: (email: string, password: string) => boolean;
    register: (name: string, email: string, password: string) => boolean;
    logout: () => void;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
    navigate: (page: Page, productId?: string | null, category?: string | null) => void;
    placeOrder: (shippingAddress: Order['shippingAddress'], paymentMethod: string) => void;
    updateOrderStatus: (orderId: string, status: Order['status']) => void;
    setSearchQuery: (query: string) => void;
    showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USERS_KEY = 'shopvault_users';
const CURRENT_USER_KEY = 'shopvault_current_user';
const CART_KEY = 'shopvault_cart';
const ORDERS_KEY = 'shopvault_orders';

function loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch {
        return defaultValue;
    }
}

function saveToStorage<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}

interface StoredUser {
    user: User;
    password: string;
}

export function AppProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => loadFromStorage(CURRENT_USER_KEY, null));
    const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage(CART_KEY, []));
    const [orders, setOrders] = useState<Order[]>(() => loadFromStorage(ORDERS_KEY, sampleOrders));
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState<AppState['notification']>(null);

    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const login = useCallback((email: string, password: string): boolean => {
        const users: StoredUser[] = loadFromStorage(USERS_KEY, [
            {
                user: { id: 'admin-1', name: 'Admin User', email: 'admin@mudia.com', role: 'admin' as const, joinDate: '2024-01-01' },
                password: 'admin123',
            },
        ]);
        const found = users.find(u => u.user.email === email && u.password === password);
        if (found) {
            setUser(found.user);
            saveToStorage(CURRENT_USER_KEY, found.user);
            showNotification(`Welcome back, ${found.user.name}!`, 'success');
            return true;
        }
        showNotification('Invalid email or password', 'error');
        return false;
    }, [showNotification]);

    const register = useCallback((name: string, email: string, password: string): boolean => {
        const users: StoredUser[] = loadFromStorage(USERS_KEY, [
            {
                user: { id: 'admin-1', name: 'Admin User', email: 'admin@mudia.com', role: 'admin' as const, joinDate: '2024-01-01' },
                password: 'admin123',
            },
        ]);
        if (users.some(u => u.user.email === email)) {
            showNotification('Email already registered', 'error');
            return false;
        }
        const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            role: 'customer',
            joinDate: new Date().toISOString().split('T')[0],
        };
        users.push({ user: newUser, password });
        saveToStorage(USERS_KEY, users);
        setUser(newUser);
        saveToStorage(CURRENT_USER_KEY, newUser);
        showNotification(`Welcome to Mudia Stores, ${name}!`, 'success');
        return true;
    }, [showNotification]);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
        setCurrentPage('home');
        showNotification('Logged out successfully', 'info');
    }, [showNotification]);

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
            saveToStorage(CART_KEY, newCart);
            return newCart;
        });
        showNotification(`${product.name} added to cart`, 'success');
    }, [showNotification]);

    const removeFromCart = useCallback((productId: string) => {
        setCart(prev => {
            const newCart = prev.filter(item => item.product.id !== productId);
            saveToStorage(CART_KEY, newCart);
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
            saveToStorage(CART_KEY, newCart);
            return newCart;
        });
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setCart([]);
        saveToStorage(CART_KEY, []);
    }, []);

    const getCartTotal = useCallback(() => {
        return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }, [cart]);

    const getCartCount = useCallback(() => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    const navigate = useCallback((page: Page, productId: string | null = null, category: string | null = null) => {
        setCurrentPage(page);
        setSelectedProductId(productId);
        setSelectedCategory(category);
        window.scrollTo(0, 0);
    }, []);

    const placeOrder = useCallback((shippingAddress: Order['shippingAddress'], paymentMethod: string) => {
        if (!user) return;
        const newOrder: Order = {
            id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
            userId: user.id,
            userName: user.name,
            items: [...cart],
            total: getCartTotal(),
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            shippingAddress,
            paymentMethod,
        };
        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        saveToStorage(ORDERS_KEY, updatedOrders);
        clearCart();
        showNotification('Order placed successfully!', 'success');
        setCurrentPage('orders');
    }, [user, cart, orders, getCartTotal, clearCart, showNotification]);

    const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
        setOrders(prev => {
            const updated = prev.map(o => o.id === orderId ? { ...o, status } : o);
            saveToStorage(ORDERS_KEY, updated);
            return updated;
        });
        showNotification(`Order ${orderId} updated to ${status}`, 'success');
    }, [showNotification]);

    return (
        <AppContext.Provider value={{
            user, cart, orders, currentPage, selectedProductId, selectedCategory, searchQuery, notification,
            login, register, logout, addToCart, removeFromCart, updateCartQuantity, clearCart,
            getCartTotal, getCartCount, navigate, placeOrder, updateOrderStatus, setSearchQuery, showNotification,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}
