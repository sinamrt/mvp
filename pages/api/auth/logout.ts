// pages/api/auth/logout.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Clear any session logic here — for now just simulate logout
    res.setHeader('Set-Cookie', [
      `session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`,
    ]);
    return res.status(200).json({ message: 'Logged out' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
