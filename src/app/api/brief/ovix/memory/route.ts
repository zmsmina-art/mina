import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/auth-brief';
import { sql } from '@/lib/neon';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = sql();
  const rows = await db`SELECT id, content, category, scope, importance, created_at FROM ovix_memory WHERE active = true ORDER BY importance DESC LIMIT 100` as Record<string, unknown>[];
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content, category, scope, importance } = await request.json();
  if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 });

  const db = sql();
  const id = crypto.randomUUID();
  await db`INSERT INTO ovix_memory (id, content, category, scope, importance) VALUES (${id}, ${content}, ${category ?? 'fact'}, ${scope ?? 'shared'}, ${importance ?? 5})`;
  return NextResponse.json({ id, content, category, scope, importance });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const db = sql();
  await db`UPDATE ovix_memory SET active = false WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
