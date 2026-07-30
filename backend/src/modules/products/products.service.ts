import { prisma } from '../../db/client';
import { Product } from '../../types';

export const ProductService = {
  async getAll(category?: string, search?: string): Promise<Product[]> {
    const where: any = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    const products = await prisma.product.findMany({ where });
    return products as Product[];
  },

  async getById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({ where: { id } });
    return product as Product | null;
  },

  async create(data: Omit<Product, 'id'>): Promise<Product> {
    const product = await prisma.product.create({ data });
    return product as Product;
  },

  async update(id: string, data: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
    const product = await prisma.product.update({ where: { id }, data });
    return product as Product;
  },

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  },
};