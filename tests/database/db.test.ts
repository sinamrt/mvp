import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT NOW()`;
  console.log('✅ Prisma import and query successful:', result);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('❌ Import failed or query error:', err);
});
