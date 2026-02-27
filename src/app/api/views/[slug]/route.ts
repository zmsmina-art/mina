import { NextRequest, NextResponse } from 'next/server';

/**
 * Parse REDIS_URL (rediss://default:TOKEN@HOST:PORT) into Upstash REST credentials.
 * Vercel's Redis (powered by Upstash) exposes a REST API at https://HOST.
 */
function getRedisCredentials() {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error('REDIS_URL is not set');
  const parsed = new URL(url);
  return {
    restUrl: `https://${parsed.hostname}`,
    token: parsed.password,
  };
}

async function redis(command: string[]) {
  const { restUrl, token } = getRedisCredentials();
  const res = await fetch(`${restUrl}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  return data.result;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const views = (await redis(['GET', `views:${slug}`])) ?? 0;
  return NextResponse.json({ views: Number(views) });
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const views = await redis(['INCR', `views:${slug}`]);
  return NextResponse.json({ views: Number(views) });
}
