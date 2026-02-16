import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Auth } from './components/Auth';
import { AdminDashboard } from './components/AdminDashboard';
import { Orders } from './components/Orders';
import { products, categories } from './data';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones, Star, TrendingUp, Sparkles, ChevronRight, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

function HomePage() {
    const { navigate, searchQuery } = useApp();

    const filteredProducts = searchQuery
        ? products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : products;

    const featuredProducts = products.filter(p => p.featured);

    if (searchQuery) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Search Results for "{searchQuery}"
                    </h2>
                    <p className="text-gray-500 mt-1">{filteredProducts.length} products found</p>
                </div>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {filteredProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-6xl mb-4">🔍</p>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">Try a different search term</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
                <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span>New Season Collection 2024</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                Discover Premium
                                <br />
                                <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">
                                    Products
                                </span>
                            </h1>
                            <p className="text-lg text-indigo-100 mb-8 max-w-lg">
                                Shop the latest trends with unbeatable prices. Free shipping on orders over $99 and hassle-free returns.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate('category', null, 'electronics')}
                                    className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/20 flex items-center gap-2"
                                >
                                    Shop Now <ArrowRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => {
                                        const el = document.getElementById('featured');
                                        el?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="px-8 py-4 bg-white/15 text-white font-bold rounded-xl hover:bg-white/25 backdrop-blur-sm transition-all border border-white/20"
                                >
                                    Explore Featured
                                </button>
                            </div>
                        </div>
                        <div className="hidden md:grid grid-cols-2 gap-4">
                            {featuredProducts.slice(0, 4).map((p, i) => (
                                <div
                                    key={p.id}
                                    onClick={() => navigate('product', p.id)}
                                    className={`bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20 cursor-pointer hover:bg-white/20 transition-all ${i === 0 ? 'row-span-2' : ''
                                        }`}
                                >
                                    <div className={`rounded-xl overflow-hidden bg-white/10 ${i === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </div>
                                    <p className="text-white text-sm font-medium mt-2 truncate">{p.name}</p>
                                    <p className="text-indigo-200 text-sm font-bold">${p.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust badges */}
            <section className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: Truck, title: 'Free Shipping', desc: 'On orders over $99' },
                            { icon: Shield, title: 'Secure Payment', desc: '256-bit SSL encryption' },
                            { icon: RotateCcw, title: 'Easy Returns', desc: '30-day money back' },
                            { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
                        ].map(item => (
                            <div key={item.title} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                                    <item.icon className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
                        <p className="text-gray-500 mt-1">Find what you're looking for</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => navigate('category', null, cat.id)}
                            className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:shadow-lg hover:border-indigo-200 transition-all group"
                        >
                            <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                            <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{cat.count} Products</p>
                        </button>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section id="featured" className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                            <p className="text-gray-500 text-sm">Handpicked for you</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {featuredProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>

            {/* Deal Banner */}
            <section className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4" />
                    <div className="relative">
                        <span className="text-sm font-bold bg-white/20 backdrop-blur px-4 py-1.5 rounded-full inline-block mb-4">
                            🔥 Limited Time Offer
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Up to 50% Off!</h2>
                        <p className="text-pink-100 mb-6 max-w-lg">
                            Don't miss out on our biggest sale of the season. Premium products at unbeatable prices.
                        </p>
                        <button
                            onClick={() => navigate('category', null, 'electronics')}
                            className="px-8 py-3.5 bg-white text-pink-600 font-bold rounded-xl hover:bg-pink-50 transition-all shadow-xl inline-flex items-center gap-2"
                        >
                            Shop the Sale <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Trending Products */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
                            <p className="text-gray-500 text-sm">Most popular this week</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('category', null, 'clothing')}
                        className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1"
                    >
                        View All <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    {products.slice(6, 11).map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl font-bold mb-3">Stay in the Loop</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Subscribe to our newsletter for exclusive deals, new arrivals, and insider-only discounts.
                    </p>
                    <form className="max-w-md mx-auto flex gap-3" onSubmit={e => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-5 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 outline-none text-sm"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shrink-0"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

function CategoryPage() {
    const { selectedCategory, navigate } = useApp();
    const category = categories.find(c => c.id === selectedCategory);
    const categoryProducts = products.filter(p => p.category === selectedCategory);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <button onClick={() => navigate('home')} className="hover:text-indigo-600">Home</button>
                <span>/</span>
                <span className="text-gray-900 font-medium">{category?.name || selectedCategory}</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <span className="text-5xl">{category?.icon}</span>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{category?.name}</h1>
                    <p className="text-gray-500">{categoryProducts.length} products</p>
                </div>
            </div>

            {categoryProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {categoryProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-6xl mb-4">📦</p>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No products in this category</h3>
                    <p className="text-gray-500">Check back soon for new arrivals</p>
                </div>
            )}
        </div>
    );
}

function Notification() {
    const { notification, showNotification } = useApp();
    if (!notification) return null;

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const colors = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    return (
        <div className="fixed top-20 right-4 z-[100] animate-slide-in">
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-lg ${colors[notification.type]}`}>
                {icons[notification.type]}
                <span className="text-sm font-medium">{notification.message}</span>
                <button onClick={() => showNotification('', 'info')} className="ml-2 opacity-50 hover:opacity-100">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function Footer() {
    const { navigate } = useApp();
    return (
        <footer className="bg-gray-900 text-gray-400 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    <div>
                        <h3 className="text-white font-bold mb-4">Shop</h3>
                        <div className="space-y-2.5">
                            {categories.slice(0, 4).map(cat => (
                                <button key={cat.id} onClick={() => navigate('category', null, cat.id)} className="block text-sm hover:text-white transition-colors">
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-4">Account</h3>
                        <div className="space-y-2.5">
                            <button onClick={() => navigate('auth')} className="block text-sm hover:text-white transition-colors">Sign In</button>
                            <button onClick={() => navigate('cart')} className="block text-sm hover:text-white transition-colors">Cart</button>
                            <button onClick={() => navigate('orders')} className="block text-sm hover:text-white transition-colors">Orders</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-4">Support</h3>
                        <div className="space-y-2.5 text-sm">
                            <p>Help Center</p>
                            <p>Shipping Info</p>
                            <p>Returns & Exchanges</p>
                            <p>Contact Us</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-4">Company</h3>
                        <div className="space-y-2.5 text-sm">
                            <p>About Us</p>
                            <p>Careers</p>
                            <p>Privacy Policy</p>
                            <p>Terms of Service</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">MS</span>
                        </div>
                        <div>
                            <span className="text-white font-bold">Mudia Stores</span>
                        </div>
                    </div>
                    <p className="text-sm">© 2024 Mudia Stores. All rights reserved.</p>
                    <div className="flex gap-4">
                        <div className="w-10 h-6 bg-gray-700 rounded" title="Visa" />
                        <div className="w-10 h-6 bg-gray-700 rounded" title="Mastercard" />
                        <div className="w-10 h-6 bg-gray-700 rounded" title="PayPal" />
                        <div className="w-10 h-6 bg-gray-700 rounded" title="Apple Pay" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

function AppContent() {
    const { currentPage } = useApp();

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case 'product':
                return <ProductDetail />;
            case 'cart':
                return <Cart />;
            case 'checkout':
                return <Checkout />;
            case 'auth':
                return <Auth />;
            case 'admin':
                return <AdminDashboard />;
            case 'orders':
                return <Orders />;
            case 'category':
                return <CategoryPage />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <Notification />
            <main className="flex-1">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
}

export function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}
