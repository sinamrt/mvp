// scripts/test-db.ts
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Connected to DB. Current time:', result);
  } catch (error) {
    console.error('❌ Prisma DB error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
