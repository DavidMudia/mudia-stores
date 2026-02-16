import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, navigate } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
            <ShoppingCart className="w-16 h-16 text-indigo-300" />
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={() => setImgError(true)}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-lg shadow-lg">
              ⭐ Featured
            </span>
          )}
          {!product.inStock && (
            <span className="px-2.5 py-1 bg-gray-800 text-white text-xs font-bold rounded-lg shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* Action buttons on hover */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
          <button className="w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('product', product.id)}
            className="w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-500 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick add button */}
        {product.inStock && (
          <div className={`absolute bottom-0 inset-x-0 p-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider mb-1">{product.category}</p>
        <h3
          className="font-semibold text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors"
          onClick={() => navigate('product', product.id)}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
