import Groq from 'groq-sdk';
import { GRADE_TIERS } from '@/data/positioning-grader';
import {
  computeHeuristicRoast,
  normalizeJudgedCopy,
  type RoastAnalysis,
  type RoastAnalysisDimension,
  type RoastResult,
} from '@/lib/roast';
import type { ScrapedData } from '@/lib/scrape-url';

export const SYSTEM_PROMPT = `You are a brutally honest startup positioning critic.
You will receive scraped website copy. Analyze ONLY the supplied copy and quote exact wording when criticizing.

Your job:
1) Generate a positioning score out of 100.
2) Generate four non-random subscores out of 100:
   - Clarity
   - Specificity
   - Differentiation
   - Value Clarity
Scores must be derived from the page language, never arbitrary.

Scoring logic:
- Clarity: how easy it is to understand what the company does within 5 seconds. Penalize jargon, abstraction, vague phrasing.
- Specificity: how concrete the claims are. Penalize buzzwords; reward measurable outcomes and clear target audiences.
- Differentiation: whether it sounds meaningfully different from competitors. Penalize generic AI SaaS phrasing.
- Value Clarity: whether the user can clearly understand the transformation/outcome offered.

Important consistency rules:
- Internally justify each numeric score from the copy before outputting.
- Compute total score from subscores using:
  total = round(clarity*0.30 + specificity*0.25 + differentiation*0.25 + valueClarity*0.20)
- Numbers and explanations must align. If clarity is criticized, clarity score must be low.

Label mapping by total score:
- 0-40: Positioning Fog
- 41-60: Generic Blob
- 61-75: Promising but Fuzzy
- 76-90: Clear Contender
- 91-100: Positioning Weapon

Output content requirements:
- Roast line: exactly 2 short sentences, witty but intelligent, slightly ruthless, no emojis.
- Roast line must reference the specific company/domain and include at least one exact quoted phrase from the supplied copy in double quotes.
- Do not start roastLine with a domain/URL prefix (e.g., "example.com:").
- Summary: concise paragraph explaining why the score was given.
- Summary must include at least one exact quoted phrase from the supplied copy in double quotes.
- Priority fixes: 3 to 5 actionable fixes, ranked by impact.
- Each priority fix must reference concrete page wording (quote exact phrase when useful), not generic marketing advice.
- Improved headline: one rewritten headline.
- Improved meta description: one rewritten meta description.
- No fluff, no filler, no childish tone.

Respond ONLY as valid JSON with this exact shape:
{
  "score": number,
  "label": string,
  "subscores": {
    "clarity": number,
    "specificity": number,
    "differentiation": number,
    "valueClarity": number
  },
  "roastLine": string,
  "summary": string,
  "priorityFixes": string[],
  "improvedHeadline": string,
  "improvedMetaDescription": string
}
No markdown fences. No extra keys. No text outside JSON.`;

type ParsedGroqRoast = {
  score?: number;
  label?: string;
  verdict?: string;
  subscores?: {
    clarity?: number;
    specificity?: number;
    differentiation?: number;
    valueClarity?: number;
  };
  clarity?: number;
  specificity?: number;
  differentiation?: number;
  valueClarity?: number;
  roastLine?: string;
  summary?: string;
  priorityFixes?: string[];
  tips?: string[];
  improvedHeadline?: string;
  improvedMetaDescription?: string;
};

type LlmRoastSource = Extract<RoastResult['source'], 'groq' | 'openrouter'>;

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not set');
  groqClient ??= new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groqClient;
}

function stripEmoji(value: string): string {
  return value
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function parseScore(value: unknown): number | null {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return clamp(Math.round(numeric), 0, 100);
}

function splitSentences(value: string): string[] {
  return (value.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [])
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function hasQuotedPhrase(value: string): boolean {
  return /"[^"]{2,}"/.test(value);
}

function pickCopyQuote(judged: { headline: string; description: string }): string {
  const source = [judged.headline, judged.description].find((item) => item.trim().length > 0) ?? 'your homepage copy';
  const sanitized = source.replace(/["“”]/g, '').replace(/\s+/g, ' ').trim();
  if (!sanitized) return 'your homepage copy';
  if (sanitized.length <= 92) return sanitized;
  return `${sanitized.slice(0, 89).trimEnd()}...`;
}

function ensureSpecificSummary(summary: string, judged: { headline: string; description: string }): string {
  const normalized = stripEmoji(summary).replace(/\s+/g, ' ').trim();
  if (!normalized) {
    const quote = pickCopyQuote(judged);
    return `Your positioning still reads generic in the most important lines. "${quote}" is too broad to clearly signal buyer, pain, and concrete outcome.`;
  }

  if (hasQuotedPhrase(normalized)) return normalized;

  return `${normalized} Example from your copy: "${pickCopyQuote(judged)}".`;
}

function ensureSpecificRoastLine(params: {
  roastLine: string;
  fallback: string;
  judged: { headline: string; description: string };
  domain: string;
}): string {
  const normalized = stripEmoji(params.roastLine).replace(/\s+/g, ' ').trim();
  const fallbackNormalized = stripEmoji(params.fallback).replace(/\s+/g, ' ').trim();
  const quote = pickCopyQuote(params.judged);

  let sentences = splitSentences(normalized);
  if (sentences.length === 0) {
    sentences = splitSentences(fallbackNormalized);
  }
  if (sentences.length === 0) {
    sentences = ['Your messaging is broad enough to describe half your category.'];
  }

  let twoSentenceRoast = '';
  if (sentences.length >= 2) {
    twoSentenceRoast = `${sentences[0]} ${sentences[1]}`;
  } else {
    twoSentenceRoast = `${sentences[0]} The phrase "${quote}" still sounds generic instead of ownable.`;
  }

  if (!hasQuotedPhrase(twoSentenceRoast)) {
    twoSentenceRoast = `${twoSentenceRoast.replace(/[.!?]+\s*$/, '')}. "${quote}" is where the specificity gap shows up.`;
  }

  // Remove leading domain/url prefix if the model emits it (e.g., "chatbase.co: ...").
  const escapedDomain = params.domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const leadingDomainPrefix = new RegExp(
    `^(?:https?:\\/\\/)?(?:www\\.)?(?:${escapedDomain}|[a-z0-9.-]+\\.[a-z]{2,})(?:\\/[^\\s:]*)?:\\s*`,
    'i',
  );

  return twoSentenceRoast
    .replace(leadingDomainPrefix, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeTipsSpecific(tips: string[], judged: { headline: string; description: string }): string[] {
  const quote = pickCopyQuote(judged);
  return tips.map((tip) => {
    const normalized = stripEmoji(tip).replace(/\s+/g, ' ').trim();
    if (!normalized) return normalized;
    if (hasQuotedPhrase(normalized)) return normalized;
    return `${normalized.replace(/[.!?]+\s*$/, '')}. Tie this directly to "${quote}".`;
  });
}

function resolveRoastLabel(score: number): string {
  if (score <= 40) return 'Positioning Fog';
  if (score <= 60) return 'Generic Blob';
  if (score <= 75) return 'Promising but Fuzzy';
  if (score <= 90) return 'Clear Contender';
  return 'Positioning Weapon';
}

function parseSubscores(parsed: ParsedGroqRoast): {
  clarity: number;
  specificity: number;
  differentiation: number;
  valueClarity: number;
} | null {
  const clarity = parseScore(parsed.subscores?.clarity ?? parsed.clarity);
  const specificity = parseScore(parsed.subscores?.specificity ?? parsed.specificity);
  const differentiation = parseScore(parsed.subscores?.differentiation ?? parsed.differentiation);
  const valueClarity = parseScore(parsed.subscores?.valueClarity ?? parsed.valueClarity);

  if (
    clarity === null ||
    specificity === null ||
    differentiation === null ||
    valueClarity === null
  ) {
    return null;
  }

  return { clarity, specificity, differentiation, valueClarity };
}

function toAiAnalysis(
  subscores: { clarity: number; specificity: number; differentiation: number; valueClarity: number },
  summary: string,
): RoastAnalysis {
  const dimensions: RoastAnalysisDimension[] = [
    { id: 'clarity', label: 'Clarity', weight: 0.3, score: subscores.clarity },
    { id: 'specificity', label: 'Specificity', weight: 0.25, score: subscores.specificity },
    { id: 'differentiation', label: 'Differentiation', weight: 0.25, score: subscores.differentiation },
    { id: 'value_clarity', label: 'Value Clarity', weight: 0.2, score: subscores.valueClarity },
  ];

  return {
    dimensions,
    summary,
  };
}

export function buildUserMessage(scraped: ScrapedData): string {
  const judged = normalizeJudgedCopy(scraped);
  return [
    `Domain: ${scraped.domain}`,
    `URL: ${scraped.url}`,
    `Title: ${scraped.title || '(missing)'}`,
    `Meta description: ${scraped.description || '(missing)'}`,
    `OG title: ${scraped.ogTitle || '(missing)'}`,
    `OG description: ${scraped.ogDescription || '(missing)'}`,
    `H1: ${scraped.h1 || '(missing)'}`,
    `First paragraph: ${scraped.firstParagraph || '(missing)'}`,
    '---',
    `Judged headline: ${judged.headline}`,
    `Judged description: ${judged.description}`,
  ].join('\n');
}

export function mapLlmResponseToResult(
  raw: string,
  scraped: ScrapedData,
  source: LlmRoastSource,
): RoastResult {
  let parsed: ParsedGroqRoast;
  try {
    parsed = JSON.parse(raw) as ParsedGroqRoast;
  } catch {
    console.error(`[roast] ${source} returned invalid JSON, re-throwing to trigger fallback chain:`, raw.slice(0, 300));
    throw new Error(`${source} returned invalid JSON`);
  }

  const heuristic = computeHeuristicRoast(scraped);
  const judged = normalizeJudgedCopy(scraped);

  const subscores = parseSubscores(parsed);
  const weightedScore = subscores
    ? Math.round(
      subscores.clarity * 0.3 +
      subscores.specificity * 0.25 +
      subscores.differentiation * 0.25 +
      subscores.valueClarity * 0.2,
    )
    : null;

  const modelScore = parseScore(parsed.score);
  const score = weightedScore ?? modelScore ?? heuristic.score;
  const verdict = resolveRoastLabel(score);
  const grade = GRADE_TIERS.find((tier) => score >= tier.minScore) ?? GRADE_TIERS[GRADE_TIERS.length - 1];

  const summary = ensureSpecificSummary(
    stripEmoji(typeof parsed.summary === 'string' ? parsed.summary : '').trim()
    || heuristic.analysis?.summary
    || 'The copy still sounds broad and undifferentiated. Sharpen who this is for, what outcome it creates, and why your approach is meaningfully different.',
    judged,
  );

  let tips = (parsed.priorityFixes ?? parsed.tips ?? [])
    .filter((tip): tip is string => typeof tip === 'string' && tip.trim().length > 0)
    .map((tip) => stripEmoji(tip.replace(/^\d+[\).\s-]*/, '')));

  while (tips.length < 3) {
    tips.push('Rewrite your headline to name your buyer and their #1 pain point.');
  }
  tips = makeTipsSpecific(tips.slice(0, 5), judged);

  const roastLine = ensureSpecificRoastLine({
    roastLine: parsed.roastLine ?? '',
    fallback: heuristic.roastLine,
    judged,
    domain: scraped.domain,
  });
  const improvedHeadline = stripEmoji(parsed.improvedHeadline ?? '').trim() || judged.headline;
  const improvedMetaDescription = stripEmoji(parsed.improvedMetaDescription ?? '').trim() || judged.description;
  const analysis = subscores
    ? toAiAnalysis(subscores, summary)
    : heuristic.analysis;

  return {
    score,
    grade,
    verdict,
    roastLine,
    tips,
    analysis,
    judged,
    domain: scraped.domain,
    source,
    improvedHeadline,
    improvedMetaDescription,
    completedAt: new Date().toISOString(),
  };
}

export async function groqRoast(scraped: ScrapedData): Promise<RoastResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await getGroqClient().chat.completions.create(
      {
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 650,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserMessage(scraped) },
        ],
      },
      { signal: controller.signal },
    );

    const raw = response.choices[0]?.message?.content?.trim() ?? '';
    return mapLlmResponseToResult(raw, scraped, 'groq');
  } finally {
    clearTimeout(timeout);
  }
}
