import { NextResponse, type NextRequest } from 'next/server';
import { groqRoast } from '@/lib/groq-roast';
import { openRouterRoast } from '@/lib/openrouter-roast';
import { scrapeUrl, ScrapeError } from '@/lib/scrape-url';

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

  // Try Groq first, then OpenRouter. Both must fail before we 503.
  const errors: string[] = [];

  if (process.env.GROQ_API_KEY) {
    try {
      const result = await groqRoast(scraped);
      return NextResponse.json(result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      errors.push(`Groq: ${msg}`);
      console.error('[roast] Groq failed, trying OpenRouter:', msg);
    }
  } else {
    errors.push('Groq: GROQ_API_KEY not set');
  }

  if (process.env.OPENROUTER_API_KEY) {
    try {
      const result = await openRouterRoast(scraped);
      return NextResponse.json(result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      errors.push(`OpenRouter: ${msg}`);
      console.error('[roast] OpenRouter also failed:', msg);
    }
  } else {
    errors.push('OpenRouter: OPENROUTER_API_KEY not set');
  }

  // Both providers failed — return a clear error instead of a silent heuristic downgrade
  console.error('[roast] All AI providers failed:', errors.join(' | '));
  return NextResponse.json(
    { error: 'Our AI is temporarily unavailable. Please try again in a moment.' },
    { status: 503 },
  );
}
