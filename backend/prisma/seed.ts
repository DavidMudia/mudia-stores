/// <reference types="bun-types" />
/// <reference types="node" />

import { PrismaClient } from '@prisma/client';
import { products } from '../../frontend/src/data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // Create admin user
  const adminPassword = await Bun.password.hash('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mudia.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@mudia.com',
      password: adminPassword,
      role: 'admin',
      joinDate: new Date(),
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create visitor user
  const visitorPassword = await Bun.password.hash('Password123');
  const visitor = await prisma.user.upsert({
    where: { email: 'visitor@gmail.com' },
    update: {},
    create: {
      name: 'Visitor User',
      email: 'visitor@gmail.com',
      password: visitorPassword,
      role: 'customer',
      joinDate: new Date(),
    },
  });
  console.log(`✅ Visitor user created: ${visitor.email}`);

  // Seed products
  console.log(`📦 Seeding ${products.length} products...`);
  let count = 0;
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        category: p.category,
        rating: p.rating,
        reviews: p.reviews,
        inStock: p.inStock,
        featured: p.featured,
        tags: p.tags,
      },
      create: {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        category: p.category,
        rating: p.rating,
        reviews: p.reviews,
        inStock: p.inStock,
        featured: p.featured,
        tags: p.tags,
      },
    });
    count++;
  }
  console.log(`✅ Seeded ${count} products.`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });