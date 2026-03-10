import { createClient } from 'redis';
import { NextResponse } from 'next/server';
import { articles } from '@/data/articles';

let client: ReturnType<typeof createClient> | null = null;

async function getClient() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on('error', () => {});
    await client.connect();
  }
  return client;
}

export async function GET() {
  try {
    const redis = await getClient();
    const slugs = articles.map((a) => a.slug);
    const keys = slugs.map((s) => `views:${s}`);
    const values = await redis.mGet(keys);

    const data = slugs.map((slug, i) => ({
      slug,
      title: articles[i].title,
      views: Number(values[i] ?? 0),
    }));

    data.sort((a, b) => b.views - a.views);

    return NextResponse.json({ articles: data });
  } catch {
    return NextResponse.json({ articles: [] });
  }
}
