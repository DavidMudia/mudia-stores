import { prisma } from '../../db/client';
import { Product } from '../../types';
import { OrderStatus } from '@prisma/client'; // <-- import Prisma enum

export const AdminService = {
  async getProducts() {
    return prisma.product.findMany();
  },

  async createProduct(data: Omit<Product, 'id'>) {
    return prisma.product.create({ data });
  },

  async updateProduct(id: string, data: Partial<Omit<Product, 'id'>>) {
    return prisma.product.update({ where: { id }, data });
  },

  async deleteProduct(id: string) {
    return prisma.product.delete({ where: { id } });
  },

  async getAllOrders() {
    return prisma.order.findMany({
      include: { items: { include: { product: true } }, shippingAddress: true, user: true },
    });
  },

  // Fix: use OrderStatus enum type
  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({ where: { id: orderId }, data: { status } });
  },

  async getStats() {
    const [totalOrders, totalRevenue, pendingOrders] = await prisma.$transaction([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count({ where: { status: 'pending' } }),
    ]);
    return { totalOrders, totalRevenue: totalRevenue._sum.total || 0, pendingOrders };
  },
};