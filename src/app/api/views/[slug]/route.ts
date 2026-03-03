import { createClient } from 'redis';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,128}$/;
const viewsLimiter = rateLimit({ limit: 10, windowMs: 60_000 });

let client: ReturnType<typeof createClient> | null = null;

async function getClient() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on('error', (err) => console.error('[redis]', err.message));
    await client.connect();
  }
  return client;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!SLUG_RE.test(slug)) return NextResponse.json({ views: 0 });
    const redis = await getClient();
    const views = await redis.get(`views:${slug}`);
    return NextResponse.json({ views: Number(views ?? 0) });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!SLUG_RE.test(slug)) return NextResponse.json({ views: 0 });

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (!viewsLimiter.check(`${ip}:${slug}`)) {
      return NextResponse.json({ views: 0 });
    }

    const redis = await getClient();
    const views = await redis.incr(`views:${slug}`);
    return NextResponse.json({ views });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}
