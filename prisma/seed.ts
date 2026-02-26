import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const user = await prisma.user.upsert({
    where:  { email: 'demo@meals4v.com' },
    update: {},
    create: {
      email: 'demo@meals4v.com',
      name:  'Demo User',
    },
  });

  await prisma.mealPreference.upsert({
    where:  { userId: user.id },
    update: {},
    create: {
      userId:         user.id,
      breakfast:      true,
      lunch:          true,
      dinner:         true,
      snack:          true,
      favoriteDishes: ['salad', 'chicken', 'pasta'],
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
