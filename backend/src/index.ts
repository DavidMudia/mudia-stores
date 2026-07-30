import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { cookie } from '@elysiajs/cookie';
import { authRoutes } from './modules/auth/auth.routes';
import { productsRoutes } from './modules/products/products.routes';
import { ordersRoutes } from './modules/orders/orders.routes';
import { adminRoutes } from './modules/admin/admin.routes';
import { webhookRoutes } from './modules/webhooks/webhooks.routes';

const app = new Elysia()
  .use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    })
  )
  .use(cookie())
  .get('/', () => ({ status: 'OK' }))
  .group('/api', (app) =>
    app
      .use(authRoutes)
      .use(webhookRoutes)
      .use(productsRoutes)
      .use(ordersRoutes)
      .use(adminRoutes)
  )
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);