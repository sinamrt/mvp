// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient({ log: ['warn', 'error'] });
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

///////////////import { prisma } from "../../../lib/prisma"; // adjust path if needed
 
// pages/api/auth/register.ts
 
 
// adjust import to your prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, name, password } = req.body as { email: string; name?: string; password: string };

  try {
    // 1) guard: existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    // 2) hash
    const passwordHash = await bcrypt.hash(password, 10);

    // 3) create user with correct field
    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? 'New User',
        passwordHash, // ✅ correct column
        role: 'USER',
      },
      select: { id: true, email: true, name: true }, // never return hash
    });

    return res.status(201).json({ user });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
