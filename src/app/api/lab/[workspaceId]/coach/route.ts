import { NextResponse, type NextRequest } from 'next/server';
import Groq from 'groq-sdk';
import { authorizeWorkspace } from '@/lib/lab/auth';
import { addCoachMessages } from '@/lib/lab/storage';
import { LAB_MODULES, type CoachMessage, type Workspace } from '@/lib/lab/types';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({ limit: 20, windowMs: 86_400_000 }); // 20/day per workspace

function buildSystemPrompt(workspace: Workspace): string {
  const snap = workspace.currentSnapshot;
  const completedModules = LAB_MODULES.filter((m) => workspace.modules[m.id]).map((m) => m.title);
  const incompleteModules = LAB_MODULES.filter((m) => !workspace.modules[m.id]).map((m) => m.title);

  let context = `You are Mina's AI positioning coach inside Positioning Lab.
You help founders sharpen their startup positioning with specific, actionable advice.

RULES:
- Reference the founder's SPECIFIC positioning data, not generic advice.
- Be direct, expert, and slightly opinionated — like Mina's writing voice.
- Never be sycophantic. If their positioning is weak, say so clearly.
- Always end with ONE specific, actionable next step.
- If they haven't done a module that would help, recommend it.
- Keep responses concise (2-4 paragraphs max).
- Never invent data they haven't provided.

WORKSPACE CONTEXT:
`;

  if (snap) {
    context += `\nCurrent headline: "${snap.headline}"`;
    context += `\nOverall score: ${snap.scores.overall}/100`;
    context += `\nDimension scores: Clarity ${snap.scores.clarity}, Specificity ${snap.scores.specificity}, Differentiation ${snap.scores.differentiation}, Brevity ${snap.scores.brevity}, Value Clarity ${snap.scores.value_clarity}`;
    context += `\nGrade: ${snap.grade}`;
    if (snap.targetAudience) context += `\nTarget audience: "${snap.targetAudience}"`;
    if (snap.oneLiner) context += `\nOne-liner: "${snap.oneLiner}"`;
  } else {
    context += '\nNo positioning snapshot yet. They haven\'t scored anything.';
  }

  context += `\n\nCompleted modules: ${completedModules.length > 0 ? completedModules.join(', ') : 'None'}`;
  context += `\nAvailable but not done: ${incompleteModules.join(', ')}`;

  if (workspace.snapshots.length > 1) {
    const first = workspace.snapshots[0];
    const latest = workspace.snapshots[workspace.snapshots.length - 1];
    const delta = latest.scores.overall - first.scores.overall;
    context += `\n\nProgress: ${workspace.snapshots.length} snapshots taken. Score went from ${first.scores.overall} to ${latest.scores.overall} (${delta >= 0 ? '+' : ''}${delta}).`;
  }

  if (workspace.modules.audit) {
    context += `\n\nAudit result: Roasted ${workspace.modules.audit.domain}, scored ${workspace.modules.audit.score}/100. Verdict: "${workspace.modules.audit.verdict}".`;
    if (workspace.modules.audit.roastLine) {
      context += ` Roast: "${workspace.modules.audit.roastLine}"`;
    }
  }

  return context;
}

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
      { error: 'You\'ve reached the daily coaching limit (20 messages). Come back tomorrow.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > 2000) {
    return NextResponse.json({ error: 'Message is required (max 2000 chars)' }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'AI coaching is not configured. Please try again later.' },
      { status: 503 }
    );
  }

  const systemPrompt = buildSystemPrompt(workspace);

  // Build conversation history (last 10 messages for context)
  const recentHistory = workspace.coachHistory.slice(-10);
  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    ...recentHistory.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: message },
  ];

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    const reply = completion.choices[0]?.message?.content ?? 'I couldn\'t generate a response. Try asking differently.';

    // Save both messages to workspace
    const now = new Date().toISOString();
    const newMessages: CoachMessage[] = [
      { role: 'user', content: message, createdAt: now },
      { role: 'assistant', content: reply, createdAt: now },
    ];

    await addCoachMessages(workspaceId, newMessages);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Coach API error:', err);
    return NextResponse.json(
      { error: 'Failed to get coaching response. Please try again.' },
      { status: 500 }
    );
  }
}
