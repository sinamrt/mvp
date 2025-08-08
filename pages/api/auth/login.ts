// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email, password } = req.body;

  if (email === 'user@example.com' && password === 'SecurePass123!') {
    res.setHeader('Set-Cookie', [
      `session=ok; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600${process.env.VERCEL ? '; Secure' : ''}`,
    ]);
    return res.status(200).json({ success: true });
  }

  // Only one 401 return
  return res.status(401).json({ message: 'Invalid credentials' });
}
