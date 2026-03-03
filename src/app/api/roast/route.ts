import { NextResponse, type NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { callGeminiRoast, mapGeminiRoastToResult } from '@/lib/gemini-roast';
import { computeHeuristicRoast } from '@/lib/roast';
import { scrapeUrl, ScrapeError } from '@/lib/scrape-url';

const limiter = rateLimit({ limit: 5, windowMs: 60_000 });

type RoastRequestBody = {
  url: string;
};

function parseBody(body: Record<string, unknown>): RoastRequestBody | null {
  const url = typeof body.url === 'string' ? body.url.trim() : '';
  if (!url || url.length > 2048) return null;
  return { url };
}

function csrfRejected(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const allowedOrigins = ['https://minamankarious.com', 'https://www.minamankarious.com'];
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000');
  }

  return !origin || !allowedOrigins.includes(origin);
}

function extractIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';
}

function toScrapeResponse(error: unknown): NextResponse {
  if (error instanceof ScrapeError) {
    if (error.code === 'INVALID_URL' || error.code === 'BLOCKED_URL') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: error.message }, { status: 422 });
  }

  return NextResponse.json({ error: 'Could not analyze this URL.' }, { status: 422 });
}

export async function POST(request: NextRequest) {
  if (csrfRejected(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = parseBody(body);
  if (!parsed) {
    return NextResponse.json({ error: 'Missing or invalid URL.' }, { status: 400 });
  }

  let scraped: Awaited<ReturnType<typeof scrapeUrl>>;
  try {
    scraped = await scrapeUrl(parsed.url);
  } catch (error) {
    return toScrapeResponse(error);
  }

  const canUseGemini = limiter.check(extractIp(request)) && !!process.env.GEMINI_API_KEY;

  if (!canUseGemini) {
    return NextResponse.json(computeHeuristicRoast(scraped));
  }

  try {
    const geminiResponse = await callGeminiRoast(scraped);
    return NextResponse.json(mapGeminiRoastToResult(geminiResponse, scraped));
  } catch (error) {
    console.error('[roast] Gemini failed, using heuristic fallback:', error);
    return NextResponse.json(computeHeuristicRoast(scraped));
  }
}
