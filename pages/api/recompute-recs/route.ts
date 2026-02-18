import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { recomputeRecs } from '@/lib/jobs/recomputeRecs';

// Schema validation
const RequestSchema = z.object({
  userId: z.string().uuid().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const session = await getServerSession({ req });
    if (!session?.user || session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const parsed = RequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    // Run recompute logic
    const result = await recomputeRecs(parsed.data.userId);

    return res.status(202).json(result);
  } catch (err: any) {
    console.error('Error in recompute-recs handler:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
