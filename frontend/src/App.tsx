import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import ScrollToTop from './components/ScrollToTop';
import { ProductDetail } from './components/ProductDetail';
import { CategoryPage } from './components/CategoryPage';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Auth } from './components/Auth';
import { AdminDashboard } from './components/AdminDashboard';
import { Orders } from './components/Orders';
import { Notification } from './components/Notification';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Notification />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}