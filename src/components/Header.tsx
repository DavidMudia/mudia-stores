import { ShoppingCart, User, Search, Menu, X, ShieldCheck, Package, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { categories } from '../data';

export function Header() {
    const { user, getCartCount, navigate, currentPage, searchQuery, setSearchQuery, logout } = useApp();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
    const cartCount = getCartCount();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('home');
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            {/* Top bar */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs py-1.5">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <span>🚚 Free shipping on orders over $99</span>
                    <span className="hidden sm:block">📞 Support: 1-800-MUDIA</span>
                </div>
            </div>

            {/* Main header */}
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <button onClick={() => navigate('home')} className="flex items-center gap-2 shrink-0">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Mudia Stores
                        </span>
                    </button>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products, categories, brands..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                            />
                        </div>
                    </form>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        {/* Cart */}
                        <button
                            onClick={() => navigate('cart')}
                            className={`relative p-2.5 rounded-xl transition-all ${currentPage === 'cart' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-700'}`}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* User */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-all"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="hidden lg:block text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.name}</span>
                                    <ChevronDown className="w-3 h-3 text-gray-500 hidden lg:block" />
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                                                    {user.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                                                </span>
                                            </div>
                                            <button onClick={() => { navigate('orders'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                <Package className="w-4 h-4" /> My Orders
                                            </button>
                                            {user.role === 'admin' && (
                                                <button onClick={() => { navigate('admin'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                    <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                                                </button>
                                            )}
                                            <div className="border-t border-gray-100 mt-1">
                                                <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                                    <LogOut className="w-4 h-4" /> Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('auth')}
                                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-sm font-medium"
                            >
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">Sign In</span>
                            </button>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile search */}
                {mobileMenuOpen && (
                    <form onSubmit={handleSearch} className="mt-3 md:hidden">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:border-indigo-500 outline-none text-sm"
                            />
                        </div>
                    </form>
                )}
            </div>

            {/* Category nav */}
            <div className="border-t border-gray-100 bg-gray-50/80">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="hidden md:flex items-center gap-1 py-1">
                        <div className="relative">
                            <button
                                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-white transition-all"
                            >
                                <Menu className="w-4 h-4" />
                                All Categories
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            {categoryMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setCategoryMenuOpen(false)} />
                                    <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => { navigate('category', null, cat.id); setCategoryMenuOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            >
                                                <span>{cat.icon}</span>
                                                <span>{cat.name}</span>
                                                <span className="ml-auto text-xs text-gray-400">{cat.count}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="w-px h-5 bg-gray-300 mx-1" />
                        {categories.slice(0, 5).map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => navigate('category', null, cat.id)}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-white transition-all whitespace-nowrap"
                            >
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile categories */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { navigate('category', null, cat.id); setMobileMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </header>
    );
}
