import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShoppingCart, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Helper to format Naira
const formatCurrency = (amount: number) => `₦${amount.toFixed(2)}`;

export function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, user } = useApp();
  const total = getCartTotal();
  
  // Shipping: free over ₦99 (numeric equivalent of $99)
  const shipping = total > 99 ? 0 : 9.99;
  // Tax: 7.5% VAT (Nigerian standard)
  const tax = total * 0.075;
  const grandTotal = total + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 inline-flex items-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({cart.length} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.product.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-5 hover:shadow-md transition-shadow">
              <div
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-100 shrink-0 cursor-pointer"
                onClick={() => navigate(`/products/${item.product.id}`)}
              >
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-indigo-600 uppercase">{item.product.category}</p>
                    <h3
                      className="font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors line-clamp-1"
                      onClick={() => navigate(`/products/${item.product.id}`)}
                    >
                      {item.product.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  {/* Quantity */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(item.product.price * item.quantity)}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500">{formatCurrency(item.product.price)} each</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-32">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-medium">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                  {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT (7.5%)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>

              {shipping > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                  <Tag className="w-3.5 h-3.5 inline mr-1" />
                  Add {formatCurrency(99 - total)} more for free shipping!
                </div>
              )}

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!user) {
                  navigate('/login');
                } else {
                  navigate('/checkout');
                }
              }}
              className="w-full mt-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full mt-3 py-3 text-indigo-600 font-medium text-sm hover:bg-indigo-50 rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}