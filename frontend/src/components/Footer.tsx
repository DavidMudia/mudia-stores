import { Link } from 'react-router-dom';
import { categories } from '../data';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-white font-bold mb-4">Shop</h3>
            <div className="space-y-2.5">
              {categories.slice(0, 4).map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="block text-sm hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Account</h3>
            <div className="space-y-2.5">
              <Link to="/login" className="block text-sm hover:text-white transition-colors">Sign In</Link>
              <Link to="/cart" className="block text-sm hover:text-white transition-colors">Cart</Link>
              <Link to="/orders" className="block text-sm hover:text-white transition-colors">Orders</Link>
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
          <p className="text-sm">© 2026 Mudia Stores. All rights reserved.</p>
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