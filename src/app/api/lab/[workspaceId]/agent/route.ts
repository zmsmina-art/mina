import { NextResponse, type NextRequest } from 'next/server';
import Groq from 'groq-sdk';
import { authorizeWorkspace } from '@/lib/lab/auth';
import { addCoachMessages, updateWorkspace } from '@/lib/lab/storage';
import { LAB_MODULES, type CoachMessage, type Workspace } from '@/lib/lab/types';
import type {
  AgentCard,
  AgentRequest,
  PositioningAnalysis,
  CompetitorMatrix,
  CopySuggestion,
  CompetitorEntry as AgentCompetitorEntry,
} from '@/lib/lab/agent-types';
import { scrapeUrl, ScrapeError } from '@/lib/scrape-url';
import { groqRoast, buildUserMessage, mapLlmResponseToResult } from '@/lib/groq-roast';
import { computeHeuristicRoast, normalizeJudgedCopy } from '@/lib/roast';
import { labAgentLimiter } from '@/lib/rate-limit';

// ── Helpers ──────────────────────────────────────────────────────────

function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"']+|(?:www\.)?[a-z0-9][-a-z0-9]*\.[a-z]{2,}(?:\/[^\s<>"']*)?/gi;
  const matches = text.match(urlRegex) ?? [];
  return [...new Set(matches.map((u) => (u.startsWith('http') ? u : `https://${u}`)))];
}

function buildAgentSystemPrompt(workspace: Workspace): string {
  const snap = workspace.currentSnapshot;
  const completedModules = LAB_MODULES.filter((m) => workspace.modules[m.id]).map((m) => m.title);

  let prompt = `You are the Olunix Positioning Agent — a senior positioning strategist who helps startup founders sharpen their messaging.

YOUR PERSONALITY:
- Direct, expert, slightly opinionated, but always constructive
- Pair every critique with a concrete fix
- Reference the founder's SPECIFIC copy, not generic advice
- Use "positioning analysis" language, never "roast" or "brutal"
- Keep responses concise (2-4 paragraphs max)
- End with ONE clear next step when appropriate
- Never invent data that hasn't been provided

WORKSPACE CONTEXT:
`;

  if (snap) {
    prompt += `Current headline: "${snap.headline}"\n`;
    prompt += `Overall score: ${snap.scores.overall}/100\n`;
    prompt += `Dimension scores: Clarity ${snap.scores.clarity}, Specificity ${snap.scores.specificity}, Differentiation ${snap.scores.differentiation}, Brevity ${snap.scores.brevity}, Value Clarity ${snap.scores.value_clarity}\n`;
    prompt += `Grade: ${snap.grade}\n`;
    if (snap.targetAudience) prompt += `Target audience: "${snap.targetAudience}"\n`;
    if (snap.oneLiner) prompt += `One-liner: "${snap.oneLiner}"\n`;
  } else {
    prompt += 'No positioning snapshot yet.\n';
  }

  prompt += `Completed modules: ${completedModules.length > 0 ? completedModules.join(', ') : 'None'}\n`;

  if (workspace.modules.audit) {
    const audit = workspace.modules.audit;
    prompt += `\nPrevious analysis: ${audit.domain} scored ${audit.score}/100.`;
    prompt += ` Headline: "${audit.judgedHeadline}". Verdict: "${audit.verdict}".`;
    if (audit.tips?.length) {
      prompt += ` Key fixes: ${audit.tips.slice(0, 3).join('; ')}.`;
    }
  }

  if (workspace.modules.audience) {
    const aud = workspace.modules.audience;
    prompt += `\nTarget buyer: ${aud.role} at ${aud.companyType}. Pain context: "${aud.painContext}".`;
  }

  if (workspace.modules.pain) {
    prompt += `\nPrimary pain: "${workspace.modules.pain.primaryPain}".`;
  }

  if (workspace.competitors.length > 0) {
    const comps = workspace.competitors.map((c) => `${c.domain} (${c.currentScore}/100)`).join(', ');
    prompt += `\nTracked competitors: ${comps}.`;
  }

  return prompt;
}

async function analyzeUrl(url: string): Promise<{ card: AgentCard; analysis: PositioningAnalysis }> {
  const scraped = await scrapeUrl(url);
  let result;
  try {
    result = await groqRoast(scraped);
  } catch {
    result = computeHeuristicRoast(scraped);
  }

  const analysis: PositioningAnalysis = {
    url: scraped.url,
    domain: scraped.domain,
    score: result.score,
    grade: result.grade.letter,
    verdict: result.verdict,
    dimensions: result.analysis?.dimensions ?? [],
    fixes: result.tips,
    judgedHeadline: result.judged.headline,
    judgedDescription: result.judged.description,
    improvedHeadline: result.improvedHeadline ?? result.judged.headline,
    improvedDescription: result.improvedMetaDescription ?? result.judged.description,
  };

  return {
    card: { type: 'positioning_analysis', data: analysis },
    analysis,
  };
}

async function analyzeCompetitors(
  urls: string[],
  userScore: number | null,
  userDomain: string | null,
): Promise<AgentCard> {
  const competitors: AgentCompetitorEntry[] = [];

  for (const url of urls.slice(0, 5)) {
    try {
      const scraped = await scrapeUrl(url);
      let result;
      try {
        result = await groqRoast(scraped);
      } catch {
        result = computeHeuristicRoast(scraped);
      }
      const judged = normalizeJudgedCopy(scraped);

      const strengths: string[] = [];
      const weaknesses: string[] = [];
      if (result.analysis?.dimensions) {
        const sorted = [...result.analysis.dimensions].sort((a, b) => b.score - a.score);
        strengths.push(`${sorted[0].label}: ${sorted[0].score}/100`);
        weaknesses.push(`${sorted[sorted.length - 1].label}: ${sorted[sorted.length - 1].score}/100`);
      }

      competitors.push({
        url: scraped.url,
        domain: scraped.domain,
        score: result.score,
        grade: result.grade.letter,
        headline: judged.headline,
        strengths,
        weaknesses,
      });
    } catch {
      competitors.push({
        url,
        domain: new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, ''),
        score: 0,
        grade: '?',
        headline: 'Could not analyze',
        strengths: [],
        weaknesses: ['Failed to scrape this URL'],
      });
    }
  }

  const avgScore = competitors.length > 0
    ? Math.round(competitors.reduce((sum, c) => sum + c.score, 0) / competitors.length)
    : 0;

  let summary = `Analyzed ${competitors.length} competitor${competitors.length === 1 ? '' : 's'}.`;
  summary += ` Average positioning score: ${avgScore}/100.`;
  if (userScore !== null) {
    const delta = userScore - avgScore;
    summary += delta > 0
      ? ` You're ${delta} points ahead of the average.`
      : delta < 0
        ? ` You're ${Math.abs(delta)} points behind the average.`
        : ' You match the average.';
  }

  const matrix: CompetitorMatrix = {
    competitors,
    userScore,
    userDomain,
    summary,
  };

  return { type: 'competitor_matrix', data: matrix };
}

// ── Route handler ────────────────────────────────────────────────────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;

  const workspace = await authorizeWorkspace(workspaceId);
  if (!workspace) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!labAgentLimiter.check(workspaceId)) {
    return NextResponse.json(
      { error: 'Daily limit reached (30 messages). Come back tomorrow.' },
      { status: 429 }
    );
  }

  let body: AgentRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > 4000) {
    return NextResponse.json({ error: 'Message is required (max 4000 chars)' }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'AI agent is not configured. Please try again later.' },
      { status: 503 }
    );
  }

  const cards: AgentCard[] = [];
  let toolContext = '';

  try {
    // ── Handle structured actions ─────────────────────────────────
    if (body.action === 'analyze_url') {
      const url = body.urls?.[0];
      if (!url) {
        return NextResponse.json({ error: 'URL is required for analysis' }, { status: 400 });
      }

      try {
        const { card, analysis } = await analyzeUrl(url);
        cards.push(card);
        toolContext = `[POSITIONING ANALYSIS RESULT for ${analysis.domain}]\nScore: ${analysis.score}/100 (${analysis.grade})\nVerdict: ${analysis.verdict}\nHeadline: "${analysis.judgedHeadline}"\nDescription: "${analysis.judgedDescription}"\nDimensions: ${analysis.dimensions.map((d) => `${d.label}: ${d.score}/100`).join(', ')}\nTop fixes: ${analysis.fixes.slice(0, 3).join('; ')}\nImproved headline: "${analysis.improvedHeadline}"\nImproved description: "${analysis.improvedDescription}"`;

        // Save as audit result
        await updateWorkspace(workspaceId, (ws) => ({
          ...ws,
          modules: {
            ...ws.modules,
            audit: {
              completedAt: new Date().toISOString(),
              url: analysis.url,
              domain: analysis.domain,
              score: analysis.score,
              grade: analysis.grade,
              verdict: analysis.verdict,
              roastLine: analysis.verdict,
              tips: analysis.fixes,
              dimensions: analysis.dimensions,
              improvedHeadline: analysis.improvedHeadline,
              improvedMetaDescription: analysis.improvedDescription,
              judgedHeadline: analysis.judgedHeadline,
              judgedDescription: analysis.judgedDescription,
            },
          },
        }));
      } catch (err) {
        if (err instanceof ScrapeError) {
          toolContext = `[SCRAPE ERROR] Could not analyze URL: ${err.message}`;
        } else {
          toolContext = '[ANALYSIS ERROR] Something went wrong analyzing the URL. Ask them to try again.';
        }
      }
    }

    if (body.action === 'analyze_competitors') {
      const urls = body.urls;
      if (!urls?.length) {
        return NextResponse.json({ error: 'At least one competitor URL is required' }, { status: 400 });
      }

      const userScore = workspace.modules.audit?.score ?? null;
      const userDomain = workspace.modules.audit?.domain ?? null;

      const card = await analyzeCompetitors(urls, userScore, userDomain);
      cards.push(card);

      if (card.type === 'competitor_matrix') {
        toolContext = `[COMPETITOR ANALYSIS]\n${card.data.summary}\n${card.data.competitors.map((c) => `- ${c.domain}: ${c.score}/100, headline: "${c.headline}"`).join('\n')}`;
      }
    }

    if (body.action === 'rewrite') {
      const audit = workspace.modules.audit;
      const headline = body.copy?.headline ?? audit?.judgedHeadline ?? '';
      const description = body.copy?.description ?? audit?.judgedDescription ?? '';

      if (!headline && !description) {
        toolContext = '[NO COPY FOUND] No headline or description available. Ask the user to analyze their site first or paste their copy.';
      } else {
        toolContext = `[REWRITE REQUEST]\nCurrent headline: "${headline}"\nCurrent description: "${description}"\nGenerate 2-3 improved variants. For each, provide the rewritten headline, description, reasoning, and estimated score improvement. Consider the workspace context (audience, pain, differentiators) when rewriting.`;
      }
    }

    // ── Handle free-form with URL detection ───────────────────────
    if (!body.action) {
      const detectedUrls = extractUrls(message);
      if (detectedUrls.length > 0) {
        try {
          const { card, analysis } = await analyzeUrl(detectedUrls[0]);
          cards.push(card);
          toolContext = `[AUTO-ANALYZED URL: ${analysis.domain}]\nScore: ${analysis.score}/100 (${analysis.grade})\nHeadline: "${analysis.judgedHeadline}"\nTop fixes: ${analysis.fixes.slice(0, 3).join('; ')}`;
        } catch {
          toolContext = `[URL DETECTED but could not be analyzed. Respond to the message conversationally.]`;
        }
      }
    }

    // ── Build AI prompt and get response ──────────────────────────
    const systemPrompt = buildAgentSystemPrompt(workspace);

    const recentHistory = workspace.coachHistory.slice(-16);
    const aiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    // Build the user message with tool context
    let userContent = message;
    if (toolContext) {
      userContent = `${toolContext}\n\n---\nUser message: ${message}`;
    }

    // For rewrite action, ask the AI to return structured suggestions
    if (body.action === 'rewrite' && toolContext && !toolContext.includes('NO COPY FOUND')) {
      userContent += '\n\nRespond conversationally, then include your suggestions in this exact JSON block at the end of your response:\n```json\n[{"headline":"...","description":"...","reasoning":"...","estimatedScoreImprovement":N}]\n```';
    }

    aiMessages.push({ role: 'user', content: userContent });

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: aiMessages,
      temperature: 0.7,
      max_tokens: 1200,
    });

    let reply = completion.choices[0]?.message?.content ?? "I couldn't generate a response. Try asking differently.";

    // Parse out copy suggestions from rewrite response
    if (body.action === 'rewrite') {
      const jsonMatch = reply.match(/```json\s*\n?([\s\S]*?)\n?```/);
      if (jsonMatch?.[1]) {
        try {
          const suggestions = JSON.parse(jsonMatch[1]) as CopySuggestion[];
          if (Array.isArray(suggestions) && suggestions.length > 0) {
            cards.push({ type: 'copy_suggestions', data: suggestions });
          }
          // Remove the JSON block from the conversational reply
          reply = reply.replace(/```json\s*\n?[\s\S]*?\n?```/, '').trim();
        } catch {
          // JSON parse failed — keep reply as-is
        }
      }
    }

    // ── Save messages to workspace ────────────────────────────────
    const now = new Date().toISOString();
    const newMessages: CoachMessage[] = [
      { role: 'user', content: message, createdAt: now },
      { role: 'assistant', content: reply, createdAt: now, cards: cards.length > 0 ? cards : undefined },
    ];

    await addCoachMessages(workspaceId, newMessages);

    return NextResponse.json({ reply, cards: cards.length > 0 ? cards : undefined });
  } catch (err) {
    console.error('Agent API error:', err);
    return NextResponse.json(
      { error: 'Failed to get agent response. Please try again.' },
      { status: 500 }
    );
  }
}
