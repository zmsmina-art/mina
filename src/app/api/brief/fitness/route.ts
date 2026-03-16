import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-brief';
import { sql } from '@/lib/neon';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { splitId } = await request.json();
  if (!splitId) return NextResponse.json({ error: 'splitId required' }, { status: 400 });

  const db = sql();
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

  // Check if already logged today for this split
  const existing = await db`
    SELECT id FROM fitness_logs WHERE split_id = ${splitId} AND completed_date = ${today}
  ` as Record<string, unknown>[];

  if (existing.length > 0) {
    // Undo — delete the log
    await db`DELETE FROM fitness_logs WHERE id = ${existing[0].id as string}`;
    return NextResponse.json({ action: 'removed' });
  }

  // Log it
  const [row] = await db`
    INSERT INTO fitness_logs (id, split_id, completed_date)
    VALUES (${crypto.randomUUID()}, ${splitId}, ${today})
    RETURNING id
  ` as Record<string, unknown>[];

  return NextResponse.json({ action: 'logged', id: row.id });
}
