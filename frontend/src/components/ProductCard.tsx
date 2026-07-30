import { Eye, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useApp();
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group">
      {/* Image – now clickable */}
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer"
        onClick={handleImageClick}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg">
            Out of Stock
          </span>
        )}
        {/* Quick view button (Eye) – also triggers navigation */}
        <button
          onClick={handleImageClick}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          aria-label="View product details"
        >
          <Eye className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 text-sm text-amber-500 mb-1">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-gray-400">({product.reviews})</span>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <button
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}