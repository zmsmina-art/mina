import { NextResponse, type NextRequest } from 'next/server';
import Groq from 'groq-sdk';
import { authorizeWorkspace } from '@/lib/lab/auth';
import { rateLimit } from '@/lib/rate-limit';
import type { Workspace } from '@/lib/lab/types';

const limiter = rateLimit({ limit: 30, windowMs: 86_400_000 });

type ModuleExercise = 'audience' | 'pain' | 'differentiator';

const VALID_EXERCISES: ModuleExercise[] = ['audience', 'pain', 'differentiator'];

/* ── System prompts per module ────────────────────────────────────── */

function audienceSystemPrompt(workspace: Workspace): string {
  let ctx = `You are a positioning expert helping a startup founder define their ideal buyer.
Your job is to challenge vague audience definitions and push toward extreme specificity.

RULES:
- If the user says a broad role ("engineers", "marketers"), ask: "What KIND of engineer? At what stage company? In what context?"
- If the user says a broad industry ("SaaS", "tech"), ask: "Which vertical? B2B or B2C? What revenue range?"
- Keep pushing until you reach a definition like: "Platform engineers at Series B infra companies who spend 40%+ of their time on manual deployment pipelines."
- When the audience is specific enough (has role + company type + pain context), respond with EXACTLY this JSON block (no other text before or after):
{"done":true,"role":"...","companyType":"...","painContext":"...","buyerQuote":"..."}
- The buyerQuote should be a synthesized first-person quote from this buyer persona.
- Maximum 5 rounds of narrowing. After 5 exchanges, finalize with what you have.
- Be direct and slightly pushy — you want specificity, not politeness.
- Keep each response to 2-3 sentences max (except the final JSON).
`;

  if (workspace.currentSnapshot?.targetAudience) {
    ctx += `\nTheir current stated audience: "${workspace.currentSnapshot.targetAudience}"`;
  }
  if (workspace.modules.audit) {
    ctx += `\nThey audited ${workspace.modules.audit.domain} (scored ${workspace.modules.audit.score}/100).`;
  }

  return ctx;
}

function painSystemPrompt(workspace: Workspace): string {
  let ctx = `You are a positioning expert helping a founder identify and rank their buyer's pains.

The founder will provide a list of pain points their target buyer experiences. Your job is to evaluate each pain and return a structured analysis.

For each pain, score these dimensions (1-10):
- urgency: How pressing is this problem right now?
- frequency: How often does the buyer encounter this?
- willingness: How much would they pay to solve this?

RULES:
- Be ruthless about "nice to have" pains — score them low on willingness.
- The primary pain should be the one with the highest combined score.
- If a pain is vague, note it but still score it (lower).
- Respond with EXACTLY this JSON (no other text):
{"pains":[{"description":"...","urgency":N,"frequency":N,"willingness":N,"rank":N}],"primaryPain":"...","analysis":"..."}
- The analysis field should be 2-3 sentences explaining why the primary pain is the strongest.
- Rank from 1 (strongest) to N (weakest).
`;

  if (workspace.modules.audience) {
    ctx += `\nTheir defined buyer: ${workspace.modules.audience.role} at ${workspace.modules.audience.companyType}. Pain context: "${workspace.modules.audience.painContext}"`;
  }
  if (workspace.currentSnapshot?.targetAudience) {
    ctx += `\nStated target audience: "${workspace.currentSnapshot.targetAudience}"`;
  }

  return ctx;
}

function differentiatorSystemPrompt(workspace: Workspace): string {
  let ctx = `You are a positioning strategist analyzing competitive differentiation.

The founder will provide:
1. A list of competitive alternatives (direct competitors, indirect, DIY, or "do nothing")
2. Their claimed differentiators

Your job is to analyze which claims are genuinely unique vs. which competitors could also make.

RULES:
- For each alternative, identify which of the founder's claims they also make (sharedClaims) and what's unique to that alternative (uniqueClaims).
- For each user differentiator, determine: is it truly unique? Rate strength as 'weak', 'moderate', or 'strong'.
- A claim is 'weak' if any direct competitor makes it too.
- A claim is 'moderate' if only indirect competitors overlap.
- A claim is 'strong' if no alternative can credibly make it.
- Respond with EXACTLY this JSON (no other text):
{"alternatives":[{"name":"...","type":"direct|indirect|diy|doNothing","sharedClaims":["..."],"uniqueClaims":["..."]}],"userDifferentiators":[{"claim":"...","isUnique":true/false,"strength":"weak|moderate|strong"}],"analysis":"..."}
- The analysis field: 2-3 sentences on their overall competitive position.
`;

  if (workspace.modules.audience) {
    ctx += `\nTarget buyer: ${workspace.modules.audience.role} at ${workspace.modules.audience.companyType}`;
  }
  if (workspace.modules.pain) {
    ctx += `\nPrimary pain: "${workspace.modules.pain.primaryPain}"`;
  }
  if (workspace.currentSnapshot) {
    ctx += `\nCurrent headline: "${workspace.currentSnapshot.headline}"`;
  }

  return ctx;
}

/* ── Route handler ────────────────────────────────────────────────── */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;

  const workspace = await authorizeWorkspace(workspaceId);
  if (!workspace) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!limiter.check(workspaceId)) {
    return NextResponse.json(
      { error: 'Daily exercise limit reached (30). Come back tomorrow.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const exercise = body.exercise as string;
  if (!exercise || !VALID_EXERCISES.includes(exercise as ModuleExercise)) {
    return NextResponse.json({ error: 'Invalid exercise type' }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'AI is not configured. Please try again later.' },
      { status: 503 }
    );
  }

  // Build system prompt based on module
  let systemPrompt: string;
  switch (exercise as ModuleExercise) {
    case 'audience':
      systemPrompt = audienceSystemPrompt(workspace);
      break;
    case 'pain':
      systemPrompt = painSystemPrompt(workspace);
      break;
    case 'differentiator':
      systemPrompt = differentiatorSystemPrompt(workspace);
      break;
  }

  // Build messages
  const history = Array.isArray(body.history)
    ? (body.history as { role: string; content: string }[]).slice(-12)
    : [];
  const userMessage = typeof body.message === 'string' ? body.message.trim() : '';

  if (!userMessage) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.6,
      max_tokens: 1000,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "I couldn't generate a response. Try again.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Exercise API error:', err);
    return NextResponse.json(
      { error: 'AI request failed. Please try again.' },
      { status: 500 }
    );
  }
}
