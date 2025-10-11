import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1) Admin user
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@velora.test' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@velora.test',
      password: hash,
      role: 'ADMIN',
    },
  });
  console.log('✅ Seed OK: admin@velora.test');

  // 2) Products
  const imageUrl =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjt-ewgNomB7qqJH9Hn5VxQsnOgH_rRb2u9Q&s';

  const products = [
    {
      name: 'Samsung Galaxy S24 Ultra',
      description:
        'Flagship Android smartphone with Snapdragon 8 Gen 3 and a 200MP camera.',
      price: 1299.99,
      currency: 'EUR',
      stock: 25,
      imageUrl,
      category: 'phone',
    },
    {
      name: 'Apple iPhone 15 Pro Max',
      description: 'Premium iPhone with A17 Pro chip and titanium build.',
      price: 1399.99,
      currency: 'EUR',
      stock: 30,
      imageUrl,
      category: 'phone',
    },
    {
      name: 'Xiaomi Redmi Note 13 Pro',
      description: 'Great price-to-performance with AMOLED 120Hz display.',
      price: 349.99,
      currency: 'EUR',
      stock: 50,
      imageUrl,
      category: 'phone',
    },
    {
      name: 'Apple iPad Air (2024)',
      description: 'Thin and fast tablet powered by Apple M2 chip.',
      price: 699.99,
      currency: 'EUR',
      stock: 20,
      imageUrl,
      category: 'tablet',
    },
    {
      name: 'Samsung Galaxy Tab S9',
      description: 'High-end Android tablet with AMOLED and S-Pen support.',
      price: 799.99,
      currency: 'EUR',
      stock: 18,
      imageUrl,
      category: 'tablet',
    },
    {
      name: 'Logitech MX Master 3S',
      description: 'Ergonomic wireless mouse with precise tracking.',
      price: 99.99,
      currency: 'EUR',
      stock: 40,
      imageUrl,
      category: 'mouse',
    },
    {
      name: 'Razer DeathAdder V3 Pro',
      description: 'Lightweight gaming mouse with Focus Pro 30K sensor.',
      price: 159.99,
      currency: 'EUR',
      stock: 35,
      imageUrl,
      category: 'mouse',
    },
    {
      name: 'Keychron K8 Pro Mechanical Keyboard',
      description: 'Compact mechanical keyboard with RGB and wireless mode.',
      price: 129.99,
      currency: 'EUR',
      stock: 28,
      imageUrl,
      category: 'keyboard',
    },
    {
      name: 'Logitech G Pro X Keyboard',
      description: 'Modular mechanical keyboard with hot-swappable switches.',
      price: 149.99,
      currency: 'EUR',
      stock: 22,
      imageUrl,
      category: 'keyboard',
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Top-tier wireless headphones with industry-leading ANC.',
      price: 379.99,
      currency: 'EUR',
      stock: 15,
      imageUrl,
      category: 'headphones',
    },
    {
      name: 'Apple AirPods Pro (2nd Gen)',
      description: 'True wireless earbuds with ANC and MagSafe charging.',
      price: 279.99,
      currency: 'EUR',
      stock: 25,
      imageUrl,
      category: 'earbuds',
    },
    {
      name: 'Samsung Odyssey G9',
      description:
        'Ultra-wide 49" curved QLED monitor for gaming and productivity.',
      price: 1499.99,
      currency: 'EUR',
      stock: 10,
      imageUrl,
      category: 'monitor',
    },
    {
      name: 'LG Ultragear 27GN950-B',
      description: '27" 4K Nano IPS gaming monitor, 144Hz, 1ms response.',
      price: 799.99,
      currency: 'EUR',
      stock: 12,
      imageUrl,
      category: 'monitor',
    },
    {
      name: 'Anker PowerCore 26800mAh',
      description: 'High-capacity power bank with fast charging.',
      price: 79.99,
      currency: 'EUR',
      stock: 45,
      imageUrl,
      category: 'power-bank',
    },
    {
      name: 'Amazon Echo Dot (5th Gen)',
      description: 'Smart speaker with Alexa and improved sound.',
      price: 59.99,
      currency: 'EUR',
      stock: 60,
      imageUrl,
      category: 'smart-speaker',
    },
  ];

  console.log(`🌱 Seeding ${products.length} products...`);
  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: {
        ...product,
        isActive: true,
      },
    });
  }
  console.log('✅ Products seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
