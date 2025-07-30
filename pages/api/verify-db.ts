import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Try to count users (simple query)
    const userCount = await prisma.user.count();
    
    // Try to get the latest user (without sensitive data)
    const latestUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        createdAt: true,
        role: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Database connection successful',
      data: {
        userCount,
        latestUser,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('Database verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } finally {
    await prisma.$disconnect();
  }
} 