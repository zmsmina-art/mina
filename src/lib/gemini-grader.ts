/* ------------------------------------------------------------------ */
/*  Positioning Grader — Gemini 2.0 Flash Integration                  */
/* ------------------------------------------------------------------ */

import {
  GRADE_TIERS,
  POSITIONING_DIMENSIONS,
  type PositioningDimensionId,
  type PositioningInput,
  type RedFlag,
} from '@/data/positioning-grader';
import {
  computePercentile,
  type DimensionResult,
  type PositioningResult,
} from '@/lib/positioning-grader';

// ── System Prompt ────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert startup positioning analyst. Score the provided headline across 5 dimensions and return structured JSON.

## Scoring Rubric (each dimension 0-100)

### Clarity (weight 0.25)
How quickly can a stranger understand what this product does?
- 90-100: Instantly clear on first read. Zero cognitive load.
- 70-89: Clear on first read but one phrase slows parsing.
- 50-69: Reader needs a second pass. Ambiguous subject or verb.
- 30-49: Hard to parse. Too many clauses or jargon.
- 0-29: Incomprehensible or misleading.

### Specificity (weight 0.20)
Does it name a clear audience, problem, or industry?
- 90-100: Names exact role/industry AND quantified problem.
- 70-89: Names audience or problem, but not both.
- 50-69: Vague audience ("teams", "businesses") or generic problem.
- 30-49: No audience or problem mentioned.
- 0-29: Could describe any company in any industry.

### Differentiation (weight 0.25)
Would a competitor be embarrassed to use the same headline?
- 90-100: Unique mechanism or framing no competitor could copy.
- 70-89: Some differentiation but one element is generic.
- 50-69: Uses common buzzwords (AI-powered, next-gen, etc).
- 30-49: Template language any AI company could use.
- 0-29: Generic category description with no unique angle.

### Brevity (weight 0.15)
Is it tight enough to remember and repeat?
- 90-100: 5-8 words, every word earns its place.
- 70-89: 9-12 words, slightly long but still punchy.
- 50-69: 13-15 words, could be tightened.
- 30-49: 16-20 words, too long to scan.
- 0-29: 21+ words, a paragraph not a headline.

### Value Clarity (weight 0.15)
Does it communicate a concrete outcome the buyer cares about?
- 90-100: Specific, measurable outcome stated.
- 70-89: Outcome implied but not quantified.
- 50-69: Feature-focused, benefit vaguely implied.
- 30-49: All features, no benefits.
- 0-29: No indication of customer value.

## Red Flags
Identify problematic phrases. Each red flag must have:
- "phrase": the exact word/phrase from the input
- "reason": 1 sentence explaining why it hurts positioning
- "category": one of "buzzword", "vague", or "self_referential"

## Quick Wins
Return 1-5 specific, actionable improvements. Each should reference the actual headline text. Do NOT use generic advice — make every suggestion specific to THIS headline.

## Rewrites
Return exactly 3 rewritten headlines:
1. Outcome-Led: Lead with the customer outcome
2. Problem-Agitate: Lead with the pain point
3. Only-We: Lead with a unique differentiator

Each rewrite must be a complete headline (not a template), specific to the startup and audience provided.

## Feedback per Dimension
For each dimension, provide:
- "feedback": 1-2 sentences analyzing THIS headline specifically. Reference actual words from the headline.
- "suggestion": 1 actionable sentence to improve THIS dimension. Be specific, not generic.

IMPORTANT: All feedback must be specific to the actual headline submitted. Never use template responses like "Your headline reads clearly" — always reference the actual text.

When a one-liner description is provided, factor it into your Specificity, Value Clarity, and Differentiation scores — it provides additional context about the product's positioning. The headline is still the primary input being graded.`;

// ── Response Schema ──────────────────────────────────────────────────

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    dimensions: {
      type: 'object',
      properties: {
        clarity: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            feedback: { type: 'string' },
            suggestion: { type: 'string' },
          },
          required: ['score', 'feedback', 'suggestion'],
        },
        specificity: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            feedback: { type: 'string' },
            suggestion: { type: 'string' },
          },
          required: ['score', 'feedback', 'suggestion'],
        },
        differentiation: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            feedback: { type: 'string' },
            suggestion: { type: 'string' },
          },
          required: ['score', 'feedback', 'suggestion'],
        },
        brevity: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            feedback: { type: 'string' },
            suggestion: { type: 'string' },
          },
          required: ['score', 'feedback', 'suggestion'],
        },
        value_clarity: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            feedback: { type: 'string' },
            suggestion: { type: 'string' },
          },
          required: ['score', 'feedback', 'suggestion'],
        },
      },
      required: ['clarity', 'specificity', 'differentiation', 'brevity', 'value_clarity'],
    },
    redFlags: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          phrase: { type: 'string' },
          reason: { type: 'string' },
          category: { type: 'string', enum: ['buzzword', 'vague', 'self_referential'] },
        },
        required: ['phrase', 'reason', 'category'],
      },
    },
    quickWins: {
      type: 'array',
      items: { type: 'string' },
    },
    rewrites: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['dimensions', 'redFlags', 'quickWins', 'rewrites'],
};

// ── Gemini API Call ──────────────────────────────────────────────────

type GeminiDimension = {
  score: number;
  feedback: string;
  suggestion: string;
};

type GeminiResponse = {
  dimensions: Record<PositioningDimensionId, GeminiDimension>;
  redFlags: RedFlag[];
  quickWins: string[];
  rewrites: string[];
};

export async function callGemini(input: PositioningInput): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const userPrompt = [
    `Startup: ${input.startupName}`,
    `Headline: ${input.headline}`,
    input.oneLiner ? `One-liner: ${input.oneLiner}` : null,
    input.targetAudience ? `Target audience: ${input.targetAudience}` : null,
  ].filter(Boolean).join('\n');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.3,
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

    return JSON.parse(text) as GeminiResponse;
  } finally {
    clearTimeout(timeout);
  }
}

// ── Map Gemini → PositioningResult ───────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

const VALID_CATEGORIES = new Set(['buzzword', 'vague', 'self_referential']);

export function mapGeminiToPositioningResult(
  gemini: GeminiResponse,
  input: PositioningInput,
): PositioningResult {
  // Build dimensions from canonical list
  const dimensions: DimensionResult[] = POSITIONING_DIMENSIONS.map((dim) => {
    const gDim = gemini.dimensions[dim.id];
    const score = clamp(Math.round(gDim?.score ?? 50), 0, 100);
    return {
      id: dim.id,
      label: dim.label,
      description: dim.description,
      score,
      weight: dim.weight,
      feedback: gDim?.feedback ?? '',
      suggestion: gDim?.suggestion ?? '',
    };
  });

  // Weighted average
  const overallScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score * d.weight, 0) /
    dimensions.reduce((sum, d) => sum + d.weight, 0),
  );

  // Grade tier
  const grade = GRADE_TIERS.find((t) => overallScore >= t.minScore) ?? GRADE_TIERS[GRADE_TIERS.length - 1];

  // Red flags: validate category, cap at 12
  const redFlags: RedFlag[] = (gemini.redFlags ?? [])
    .filter((f) => f.phrase && f.reason && VALID_CATEGORIES.has(f.category))
    .slice(0, 12)
    .map((f) => ({
      phrase: f.phrase,
      reason: f.reason,
      category: f.category as RedFlag['category'],
    }));

  // Quick wins: cap at 5
  const quickWins = (gemini.quickWins ?? []).filter(Boolean).slice(0, 5);

  // Rewrites: cap at 3
  const rewrites = (gemini.rewrites ?? []).filter(Boolean).slice(0, 3);

  const percentile = computePercentile(overallScore);

  return {
    overallScore,
    percentile,
    grade,
    dimensions,
    redFlags,
    quickWins,
    rewrites,
    input,
    completedAt: new Date().toISOString(),
  };
}
