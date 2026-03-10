import { NextResponse, type NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { callGemini, mapGeminiToPositioningResult } from '@/lib/gemini-grader';
import { computePositioningResult, validateInput } from '@/lib/positioning-grader';
import type { PositioningInput } from '@/data/positioning-grader';

// ── Rate Limiter ─────────────────────────────────────────────────────

const limiter = rateLimit({ limit: 10, windowMs: 60_000 });

// ── POST Handler ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // CSRF: origin header check (must run before anything else)
  const origin = request.headers.get('origin');
  const allowedOrigins = ['https://minamankarious.com', 'https://www.minamankarious.com'];
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000');
  }
  if (!origin || !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Rate limiting by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';

  if (!limiter.check(ip)) {
    // Fallback to heuristic instead of blocking
    return handleWithFallback(request);
  }

  // Parse & validate input
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const input = parseInput(body);
  if (!input) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  const validationError = validateInput({ headline: input.headline, startupName: input.startupName });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  // If no Gemini key, fall back immediately
  if (!process.env.GEMINI_API_KEY) {
    const result = computePositioningResult(input);
    return NextResponse.json(result);
  }

  // Try Gemini, fall back to heuristic on failure
  try {
    const geminiResponse = await callGemini(input);
    const result = mapGeminiToPositioningResult(geminiResponse, input);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[positioning-grader] Gemini failed, using heuristic fallback:', err);
    const result = computePositioningResult(input);
    return NextResponse.json(result);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────

function parseInput(body: Record<string, unknown>): PositioningInput | null {
  const startupName = typeof body.startupName === 'string' ? body.startupName.trim() : '';
  const headline = typeof body.headline === 'string' ? body.headline.trim() : '';
  const oneLiner = typeof body.oneLiner === 'string' ? body.oneLiner.trim() : '';
  const targetAudience = typeof body.targetAudience === 'string' ? body.targetAudience.trim() : '';

  if (!startupName || startupName.length > 100) return null;
  if (!headline || headline.length > 500) return null;
  if (oneLiner.length > 1000) return null;
  if (targetAudience.length > 200) return null;

  return { startupName, headline, oneLiner, targetAudience };
}

/** Rate-limited requests still get heuristic scoring */
async function handleWithFallback(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const input = parseInput(body);
  if (!input) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  const validationError = validateInput({ headline: input.headline, startupName: input.startupName });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const result = computePositioningResult(input);
  return NextResponse.json(result);
}
