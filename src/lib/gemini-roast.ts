import { GRADE_TIERS } from '@/data/positioning-grader';
import {
  computeDeterministicRoastAnalysis,
  normalizeJudgedCopy,
  pickRoastBankLine,
  resolveVerdict,
  type RoastResult,
} from '@/lib/roast';
import type { ScrapedData } from '@/lib/scrape-url';

const SYSTEM_PROMPT = `You are a brutally honest positioning critic for startup websites.

You must analyze ONLY the supplied website copy and return strict JSON.

Rules:
- Quote exact wording from the supplied copy when criticizing.
- Never give generic advice. Every tip must reference this specific site copy.
- Keep roastLine to 1-2 sentences max.
- tips must contain exactly 3 concrete fixes.
- score must be an integer from 0 to 100.
- Do not use emojis.
- verdict must be one of: "Invisible", "Generic Blob", "Needs Seasoning", "Almost There", "Crispy Clean", "Category Flame".`;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    score: { type: 'number' },
    verdict: {
      type: 'string',
      enum: [
        'Invisible',
        'Generic Blob',
        'Needs Seasoning',
        'Almost There',
        'Crispy Clean',
        'Category Flame',
      ],
    },
    roastLine: { type: 'string' },
    tips: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 3,
    },
  },
  required: ['score', 'verdict', 'roastLine', 'tips'],
};

type GeminiRoastResponse = {
  score: number;
  verdict: string;
  roastLine: string;
  tips: string[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

const VALID_VERDICTS = new Set([
  'Invisible',
  'Generic Blob',
  'Needs Seasoning',
  'Almost There',
  'Crispy Clean',
  'Category Flame',
]);

function stripEmoji(value: string): string {
  return value
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export async function callGeminiRoast(scraped: ScrapedData): Promise<GeminiRoastResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const judged = normalizeJudgedCopy(scraped);
  const userPrompt = [
    `Domain: ${scraped.domain}`,
    `URL: ${scraped.url}`,
    `Title: ${scraped.title || '(missing)'}`,
    `Meta Description: ${scraped.description || '(missing)'}`,
    `OG Title: ${scraped.ogTitle || '(missing)'}`,
    `OG Description: ${scraped.ogDescription || '(missing)'}`,
    `H1: ${scraped.h1 || '(missing)'}`,
    `First Paragraph: ${scraped.firstParagraph || '(missing)'}`,
    `Primary Headline To Judge: ${judged.headline}`,
    `Primary Supporting Copy To Judge: ${judged.description}`,
  ].join('\n');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
          },
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Gemini API ${res.status}: ${body.slice(0, 200)}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty Gemini response');

    return JSON.parse(text) as GeminiRoastResponse;
  } finally {
    clearTimeout(timeout);
  }
}

export function mapGeminiRoastToResult(gemini: GeminiRoastResponse, scraped: ScrapedData): RoastResult {
  const score = clamp(Math.round(gemini.score), 0, 100);
  const grade = GRADE_TIERS.find((tier) => score >= tier.minScore) ?? GRADE_TIERS[GRADE_TIERS.length - 1];
  const verdict = VALID_VERDICTS.has(gemini.verdict) ? gemini.verdict : resolveVerdict(score);
  const judged = normalizeJudgedCopy(scraped);
  const analysis = computeDeterministicRoastAnalysis(scraped);

  const tips = (gemini.tips ?? [])
    .map((tip) => stripEmoji(tip))
    .filter(Boolean)
    .slice(0, 3);

  while (tips.length < 3) {
    tips.push('Name a specific buyer, a specific problem, and a measurable outcome in one line.');
  }

  const roastLine = stripEmoji(gemini.roastLine ?? '') || pickRoastBankLine({
    domain: scraped.domain,
    headline: judged.headline,
    score,
    verdict,
  });

  return {
    score,
    grade,
    verdict,
    roastLine,
    tips,
    analysis,
    judged,
    domain: scraped.domain,
    source: 'gemini',
    completedAt: new Date().toISOString(),
  };
}
