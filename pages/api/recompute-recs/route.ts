import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { recomputeRecs } from '@/lib/jobs/recomputeRecs';

// ✅ Schema validation using Zod (optional, adjust as needed)
const RequestSchema = z.object({
  userId: z.string().uuid().optional(),
});

// ✅ POST handler — App Router style
export async function POST(req: Request) {
  try {
    // 1️⃣ Validate session
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2️⃣ Validate body
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // 3️⃣ Run recompute logic
    await recomputeRecs(parsed.data.userId);

    // 4️⃣ Return success
    return NextResponse.json({ ok: true, message: 'Recomputation triggered' }, { status: 202 });
  } catch (err: any) {
    console.error('Error in recompute-recs route:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// ✅ (Optional) Reject GET requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405 }
  );
}
