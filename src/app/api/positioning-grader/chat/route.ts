import { NextResponse, type NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import type { ChatContext, ChatMessage } from '@/lib/positioning-chat';
import { CHAT_MESSAGE_LIMIT } from '@/lib/positioning-chat';

// ── Rate Limiter (5 RPM — conservative for 15 RPM free tier) ────────

const limiter = rateLimit({ limit: 5, windowMs: 60_000 });

// ── System Prompt Builder ───────────────────────────────────────────

function buildSystemPrompt(ctx: ChatContext): string {
  const dimLines = ctx.dimensions
    .map((d) => `- ${d.label}: ${d.score}/100 — ${d.feedback}`)
    .join('\n');

  const flagLines = ctx.redFlags.length > 0
    ? ctx.redFlags.map((f) => `- "${f.phrase}": ${f.reason}`).join('\n')
    : 'None detected.';

  const winLines = ctx.quickWins.map((w, i) => `${i + 1}. ${w}`).join('\n');
  const rewriteLines = ctx.rewrites.map((r, i) => `${i + 1}. ${r}`).join('\n');

  return `You are a startup positioning coach helping the user improve their headline based on their grading results.

## Grading Context

**Startup:** ${ctx.startupName}
**Headline:** "${ctx.headline}"
${ctx.oneLiner ? `**One-liner:** ${ctx.oneLiner}` : ''}
${ctx.targetAudience ? `**Target Audience:** ${ctx.targetAudience}` : ''}
**Overall Score:** ${ctx.overallScore}/100 (Grade: ${ctx.grade})

### Dimension Scores
${dimLines}

### Red Flags
${flagLines}

### Quick Wins
${winLines}

### AI Rewrites
${rewriteLines}

## Instructions
- Answer questions about the user's specific positioning results. Always reference their actual headline and scores.
- When suggesting improvements, be concrete and specific — rewrite their actual headline, don't give generic templates.
- Keep responses concise (2-4 sentences for simple questions, up to a short paragraph for rewrites).
- You can suggest new headline rewrites, explain scoring rationale, or help iterate on improvements.
- Be encouraging but honest. If something is weak, say so directly with a fix.
- Do not discuss topics unrelated to positioning, marketing, or copywriting.`;
}

// ── POST Handler ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // CSRF: origin header check
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
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  // Parse body
  let body: { context?: ChatContext; messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { context, messages } = body;

  // Validate context
  if (!context?.headline || !context?.startupName || !Array.isArray(context?.dimensions)) {
    return NextResponse.json({ error: 'Missing chat context' }, { status: 400 });
  }

  // Validate messages
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Messages required' }, { status: 400 });
  }

  // Cap at 11 messages (5 user + 5 assistant + 1 new user)
  const maxMessages = CHAT_MESSAGE_LIMIT * 2 + 1;
  if (messages.length > maxMessages) {
    return NextResponse.json({ error: 'Message limit reached' }, { status: 400 });
  }

  // Require API key for chat (no fallback)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Chat is temporarily unavailable' }, { status: 503 });
  }

  // Build Gemini request
  const systemPrompt = buildSystemPrompt(context);
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      },
    );

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      console.error('[positioning-chat] Gemini error:', res.status, errBody.slice(0, 200));
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    // Stream SSE → text/plain
    const reader = res.body?.getReader();
    if (!reader) {
      return NextResponse.json({ error: 'No response stream' }, { status: 502 });
    }

    const decoder = new TextDecoder();
    let buffer = '';

    const stream = new ReadableStream({
      async pull(ctrl) {
        try {
          const { done, value } = await reader.read();
          if (done) {
            // Process any remaining buffer
            if (buffer.trim()) {
              const text = extractTextFromSSE(buffer);
              if (text) ctrl.enqueue(new TextEncoder().encode(text));
            }
            ctrl.close();
            return;
          }

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE events (separated by double newline)
          const parts = buffer.split('\n\n');
          buffer = parts.pop() ?? '';

          for (const part of parts) {
            const text = extractTextFromSSE(part);
            if (text) {
              ctrl.enqueue(new TextEncoder().encode(text));
            }
          }
        } catch {
          ctrl.close();
        }
      },
      cancel() {
        reader.cancel();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out' }, { status: 504 });
    }
    console.error('[positioning-chat] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}

// ── SSE Parser ──────────────────────────────────────────────────────

function extractTextFromSSE(event: string): string | null {
  for (const line of event.split('\n')) {
    if (line.startsWith('data: ')) {
      const json = line.slice(6).trim();
      if (!json || json === '[DONE]') return null;
      try {
        const parsed = JSON.parse(json);
        return parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
      } catch {
        return null;
      }
    }
  }
  return null;
}
