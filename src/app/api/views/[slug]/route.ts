import { createClient } from 'redis';
import { NextRequest, NextResponse } from 'next/server';

let client: ReturnType<typeof createClient> | null = null;

async function getClient() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on('error', () => {});
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
    const redis = await getClient();
    const views = await redis.get(`views:${slug}`);
    return NextResponse.json({ views: Number(views ?? 0) });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const redis = await getClient();
    const views = await redis.incr(`views:${slug}`);
    return NextResponse.json({ views });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}
