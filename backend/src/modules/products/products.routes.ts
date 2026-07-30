import { Elysia, t } from 'elysia';
import { ProductService } from './products.service';

export const productsRoutes = new Elysia({ prefix: '/products' })
  .get('/', async ({ query }) => {
    const { category, search } = query;
    const products = await ProductService.getAll(category, search);
    return { products };
  }, {
    query: t.Object({
      category: t.Optional(t.String()),
      search: t.Optional(t.String()),
    }),
  })

  .get('/:id', async ({ params }) => {
    const product = await ProductService.getById(params.id);
    if (!product) throw new Error('Product not found');
    return { product };
  }, {
    params: t.Object({
      id: t.String(),
    }),
  });