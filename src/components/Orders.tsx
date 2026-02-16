import { Package, ShoppingBag, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Orders() {
  const { orders, user, navigate } = useApp();

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view orders</h2>
        <p className="text-gray-500 mb-6">You need to be signed in to view your order history.</p>
        <button
          onClick={() => navigate('auth')}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all"
        >
          Sign In
        </button>
      </div>
    );
  }

  const userOrders = user.role === 'admin' ? orders : orders.filter(o => o.userId === user.id);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    shipped: 'bg-purple-100 text-purple-700 border-purple-200',
    delivered: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusIcons: Record<string, string> = {
    pending: '⏳',
    processing: '⚙️',
    shipped: '🚚',
    delivered: '✅',
    cancelled: '❌',
  };

  if (userOrders.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
        <button
          onClick={() => navigate('home')}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        {user.role === 'admin' ? 'All Orders' : 'My Orders'} ({userOrders.length})
      </h1>

      <div className="space-y-4">
        {userOrders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Order header */}
            <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-bold text-indigo-600">{order.id}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1.5 rounded-full font-bold border ${statusColors[order.status]}`}>
                  {statusIcons[order.status]} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Order items */}
            <div className="p-5">
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 cursor-pointer"
                      onClick={() => navigate('product', item.product.id)}
                    >
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors truncate"
                        onClick={() => navigate('product', item.product.id)}
                      >
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping info */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-between gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium text-gray-700">Ship to: </span>
                  {order.shippingAddress.fullName}, {order.shippingAddress.city}, {order.shippingAddress.state}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Payment: </span>
                  {order.paymentMethod}
                </div>
              </div>

              {/* Track order link */}
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <button className="mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
                  Track Order <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
