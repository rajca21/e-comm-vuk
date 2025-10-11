import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
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
  console.log('Seed OK: admin@velora.test');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
