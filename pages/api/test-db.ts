// ✅ pages/api/test-db.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.status(200).json({ message: '✅ Connected to Neon DB', result });
  } catch (error) {
    console.error('❌ DB error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  } finally {
    await prisma.$disconnect();
  }
}
