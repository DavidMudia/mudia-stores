import { Elysia, t } from 'elysia';
import { adminGuard } from '../../plugins/admin-guard';
import { AdminService } from './admin.service';
import { OrderStatus } from '@prisma/client'; // <-- import Prisma enum

export const adminRoutes = new Elysia({ prefix: '/admin' })
  .use(adminGuard)
  .get('/stats', async () => {
    const stats = await AdminService.getStats();
    return { stats };
  })

  .get('/orders', async () => {
    const orders = await AdminService.getAllOrders();
    return { orders };
  })

  .patch('/orders/:id/status', async ({ params, body, set }) => {
    const { status } = body;
    // Validate that the provided status is a valid OrderStatus
    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      set.status = 400;
      return { error: 'Invalid status value' };
    }
    const order = await AdminService.updateOrderStatus(params.id, status as OrderStatus);
    return { order };
  }, {
    params: t.Object({ id: t.String() }),
    body: t.Object({ 
      status: t.String() // we validate manually, but we could also use t.Enum
    }),
  })

  .get('/products', async () => {
    const products = await AdminService.getProducts();
    return { products };
  })

  .post('/products', async ({ body }) => {
    const product = await AdminService.createProduct(body);
    return { product };
  }, {
    body: t.Object({
      name: t.String(),
      description: t.String(),
      price: t.Number(),
      originalPrice: t.Optional(t.Number()),
      image: t.String(),
      category: t.String(),
      rating: t.Number(),
      reviews: t.Number(),
      inStock: t.Boolean(),
      featured: t.Optional(t.Boolean()),
      tags: t.Array(t.String()),
    }),
  })

  .put('/products/:id', async ({ params, body }) => {
    const product = await AdminService.updateProduct(params.id, body);
    return { product };
  }, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
      price: t.Optional(t.Number()),
      originalPrice: t.Optional(t.Number()),
      image: t.Optional(t.String()),
      category: t.Optional(t.String()),
      rating: t.Optional(t.Number()),
      reviews: t.Optional(t.Number()),
      inStock: t.Optional(t.Boolean()),
      featured: t.Optional(t.Boolean()),
      tags: t.Optional(t.Array(t.String())),
    }),
  })

  .delete('/products/:id', async ({ params }) => {
    await AdminService.deleteProduct(params.id);
    return { success: true };
  }, {
    params: t.Object({ id: t.String() }),
  });