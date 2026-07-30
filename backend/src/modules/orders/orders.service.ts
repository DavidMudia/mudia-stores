import { prisma } from '../../db/client';
import { Order, ShippingAddress } from '../../types';
import Stripe from 'stripe';
import { OrderStatus } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const OrdersService = {
  async createOrder(
    userId: string,
    userName: string,
    items: { productId: string; quantity: number }[],
    shippingAddress: ShippingAddress,
    paymentMethod: string
  ) {
    // 1. Fetch current product data from DB
    const productIds = items.map(i => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // 2. Recalculate total and prepare order items
    let total = 0;
    const orderItems = items.map(item => {
      const dbProduct = dbProducts.find(p => p.id === item.productId);
      if (!dbProduct) throw new Error(`Product ${item.productId} not found`);
      if (!dbProduct.inStock) throw new Error(`Product ${dbProduct.name} is out of stock`);
      const price = dbProduct.price;
      total += price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtOrder: price,
      };
    });

    // 3. Create Order in DB (status pending) – get the order ID
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        paymentMethod,
        status: 'pending',
        date: new Date(),
        shippingAddress: {
          create: {
            fullName: shippingAddress.fullName,
            address: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zip: shippingAddress.zip,
            country: shippingAddress.country,
          },
        },
        items: {
          create: orderItems,
        },
      },
    });

    // 4. Create Stripe PaymentIntent WITH orderId in metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'usd',
      metadata: {
        userId,
        orderId: order.id, // ✅ now we can track back
      },
    });

    // 5. Update order with stripePaymentIntentId
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    // 6. Return to frontend
    return {
      orderId: order.id,
      clientSecret: paymentIntent.client_secret,
      total,
    };
  },

  async confirmOrder(orderId: string, paymentIntentId: string) {
    // Called by webhook – mark order as processing
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'processing' },
      include: { items: { include: { product: true } }, shippingAddress: true, user: true },
    });
    return order;
  },

  async getOrdersByUser(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } }, shippingAddress: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders;
  },

  async getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, shippingAddress: true, user: true },
    });
    return order;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return order;
  },

  async getAllOrders() {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, shippingAddress: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders;
  },

  async getStats() {
    const [totalOrders, revenueResult, pendingCount] = await prisma.$transaction([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count({ where: { status: 'pending' } }),
    ]);
    return {
      totalOrders,
      totalRevenue: revenueResult._sum.total || 0,
      pendingOrders: pendingCount,
    };
  },
};