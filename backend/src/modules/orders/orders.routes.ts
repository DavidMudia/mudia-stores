import { Elysia, t } from 'elysia';
import { authGuard } from '../../plugins/auth-guard';
import { OrdersService } from './orders.service';

export const ordersRoutes = new Elysia({ prefix: '/orders' })
  .use(authGuard)
  .post(
    '/',
    async ({ body, user, set }) => {
      const { items, shippingAddress, paymentMethod } = body;
      const userId = user.id as string;
      const userName = user.name as string;
      try {
        const result = await OrdersService.createOrder(
          userId,
          userName,
          items,
          shippingAddress,
          paymentMethod
        );
        return result;
      } catch (e: any) {
        set.status = 400;
        return { error: e.message || 'Order creation failed' };
      }
    },
    {
      body: t.Object({
        items: t.Array(
          t.Object({
            productId: t.String(),
            quantity: t.Number({ minimum: 1 }),
          })
        ),
        shippingAddress: t.Object({
          fullName: t.String(),
          address: t.String(),
          city: t.String(),
          state: t.String(),
          zip: t.String(),
          country: t.String(),
        }),
        paymentMethod: t.String(),
      }),
    }
  )

  .get('/', async ({ user }) => {
    const orders = await OrdersService.getOrdersByUser(user.id as string);
    return { orders };
  })

  .get('/:id', async ({ params, user, set }) => {
    const order = await OrdersService.getOrderById(params.id as string);
    if (!order) {
      set.status = 404;
      return { error: 'Order not found' };
    }
    if (order.userId !== (user.id as string) && user.role !== 'admin') {
      set.status = 403;
      return { error: 'Forbidden' };
    }
    return { order };
  }, {
    params: t.Object({
      id: t.String(),
    }),
  })

  // ✅ New endpoint for bank transfer confirmation
  .patch('/:id/confirm', async ({ params, user, set }) => {
    const orderId = params.id as string;
    const order = await OrdersService.getOrderById(orderId);
    if (!order) {
      set.status = 404;
      return { error: 'Order not found' };
    }
    // Allow only the order owner or admin to confirm
    if (order.userId !== (user.id as string) && user.role !== 'admin') {
      set.status = 403;
      return { error: 'Forbidden' };
    }
    // Update status to 'processing' to indicate payment confirmation
    const updated = await OrdersService.updateOrderStatus(orderId, 'processing');
    return { order: updated };
  }, {
    params: t.Object({
      id: t.String(),
    }),
  });