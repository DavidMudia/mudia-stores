import { useState } from 'react';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Minus, Plus, ChevronLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { products } from '../data';
import { ProductCard } from './ProductCard';

export function ProductDetail() {
  const { selectedProductId, addToCart, navigate } = useApp();
  const product = products.find(p => p.id === selectedProductId);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <button onClick={() => navigate('home')} className="text-indigo-600 font-medium hover:underline">
          ← Back to shop
        </button>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('home')} className="hover:text-indigo-600 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigate('category', null, product.category)} className="hover:text-indigo-600 capitalize">
          {product.category}
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </div>

      {/* Product */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                <ShoppingCart className="w-24 h-24 text-indigo-300" />
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </div>
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discount > 0 && (
              <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-xl shadow-lg">
                -{discount}% OFF
              </span>
            )}
            {product.featured && (
              <span className="px-3 py-1.5 bg-amber-400 text-amber-900 text-sm font-bold rounded-xl shadow-lg">
                ⭐ Featured
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-lg">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {product.inStock ? (
              <>
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-green-600">In Stock & Ready to Ship</span>
              </>
            ) : (
              <span className="text-sm font-medium text-red-600">Out of Stock</span>
            )}
          </div>

          {/* Quantity & Add to cart */}
          {product.inStock && (
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </button>

              <button className="w-12 h-12 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-all">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <Truck className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-700">Free Shipping</p>
              <p className="text-xs text-gray-500">Over $99</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-700">2-Year Warranty</p>
              <p className="text-xs text-gray-500">Full Coverage</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-gray-700">30-Day Returns</p>
              <p className="text-xs text-gray-500">Easy & Free</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
