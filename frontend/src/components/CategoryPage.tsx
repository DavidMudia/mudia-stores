import { useParams } from 'react-router-dom';
import { categories, products } from '../data';
import { ProductCard } from './ProductCard';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categories.find(c => c.id === categoryId);
  const categoryProducts = products.filter(p => p.category === categoryId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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