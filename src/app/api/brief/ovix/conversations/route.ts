import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/auth-brief';
import { sql } from '@/lib/neon';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = sql();
  const rows = await db`
    SELECT id, mode, summary, transcript, duration_seconds, tags, created_at
    FROM ovix_conversations ORDER BY created_at DESC LIMIT 20
  ` as Record<string, unknown>[];

  return NextResponse.json(rows.map(r => ({
    id: r.id,
    mode: r.mode,
    summary: r.summary,
    transcript: r.transcript,
    durationSeconds: r.duration_seconds,
    tags: r.tags,
    createdAt: r.created_at,
  })));
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { mode, summary, transcript, durationSeconds, tags } = body;

  if (!transcript || !Array.isArray(transcript)) {
    return NextResponse.json({ error: 'transcript required' }, { status: 400 });
  }

  const db = sql();
  const id = crypto.randomUUID();
  await db`
    INSERT INTO ovix_conversations (id, mode, summary, transcript, duration_seconds, tags)
    VALUES (${id}, ${mode ?? 'assistant'}, ${summary ?? null}, ${JSON.stringify(transcript)}, ${durationSeconds ?? null}, ${JSON.stringify(tags ?? [])})
  `;

  // Extract memories in background (best-effort)
  extractMemoriesBg(id, mode ?? 'assistant', transcript);

  return NextResponse.json({ id, mode, summary, transcript, durationSeconds, tags });
}

async function extractMemoriesBg(conversationId: string, mode: string, transcript: { role: string; content: string }[]) {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey || transcript.length < 2) return;

  try {
    const conversationText = transcript.map(t => `[${t.role}]: ${t.content}`).join('\n');
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: EXTRACTION_PROMPT },
          { role: 'user', content: `Mode: ${mode}\n\nTranscript:\n${conversationText}` },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) return;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return;
    const parsed = JSON.parse(jsonMatch[0]);

    const db = sql();

    if (parsed.memories?.length) {
      for (const mem of parsed.memories) {
        await db`INSERT INTO ovix_memory (id, content, category, scope, importance, source_conversation_id) VALUES (${crypto.randomUUID()}, ${mem.content}, ${mem.category ?? 'fact'}, ${mem.scope ?? 'shared'}, ${mem.importance ?? 5}, ${conversationId})`;
      }
    }

    if (parsed.reflection) {
      await db`INSERT INTO ovix_reflections (id, conversation_id, mode, what_worked, what_failed, learned, avoid_next) VALUES (${crypto.randomUUID()}, ${conversationId}, ${mode}, ${parsed.reflection.what_worked ?? null}, ${parsed.reflection.what_failed ?? null}, ${parsed.reflection.learned ?? null}, ${parsed.reflection.avoid_next ?? null})`;
    }

    if (parsed.summary || parsed.tags) {
      await db`UPDATE ovix_conversations SET summary = ${parsed.summary ?? null}, tags = ${JSON.stringify(parsed.tags ?? [])} WHERE id = ${conversationId}`;
    }
  } catch {
    // Best-effort
  }
}

const EXTRACTION_PROMPT = `Analyze this voice conversation transcript between Mina and Ovix. Extract any important information that should be remembered for future conversations.

Output EXACTLY this JSON format (no markdown wrapping):
{
  "memories": [
    { "content": "what to remember", "category": "correction|learning|preference|fact", "scope": "dev|prod|shared", "importance": 5 }
  ],
  "reflection": { "what_worked": "...", "what_failed": "...", "learned": "...", "avoid_next": "..." },
  "summary": "one-line summary",
  "tags": ["topic1"]
}

Rules:
- Only extract genuinely useful memories. Empty array if nothing worth remembering.
- importance: 1-3 trivial, 4-6 useful, 7-8 important, 9-10 critical`;
