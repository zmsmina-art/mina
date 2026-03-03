import {
  CONTRAST_WORDS,
  CUSTOMER_CENTRIC_WORDS,
  GENERIC_PATTERNS,
  GRADE_TIERS,
  OUTCOME_WORDS,
  OVERUSED_AI_PHRASES,
  SELF_REFERENTIAL_WORDS,
  SPECIFICITY_INDICATORS,
  VAGUE_WORDS,
  type GradeTier,
} from '@/data/positioning-grader';
import type { ScrapedData } from '@/lib/scrape-url';

export type RoastInput = {
  url: string;
};

export type RoastResult = {
  score: number;
  grade: GradeTier;
  verdict: string;
  roastLine: string;
  tips: string[];
  analysis?: RoastAnalysis;
  judged: {
    headline: string;
    description: string;
  };
  domain: string;
  source: 'gemini' | 'heuristic';
  completedAt: string;
};

export type EncodedRoast = {
  s: number; // score
  g: string; // grade letter
  t: string; // tier name
  v: string; // verdict
  d: string; // domain
  r: string; // roast line
  h: string; // headline
  m: string; // description
  p: string; // tips joined by "~"
};

export type RoastAnalysisDimensionId = 'clarity' | 'specificity' | 'differentiation' | 'value_clarity';

export type RoastAnalysisDimension = {
  id: RoastAnalysisDimensionId;
  label: string;
  weight: number;
  score: number;
};

export type RoastAnalysis = {
  dimensions: RoastAnalysisDimension[];
  summary: string;
};

const ROAST_LINE_BANK = [
  'Your homepage reads like it was assembled by three consultants and one panic attack.',
  '"AI-powered platform" is not positioning. It is corporate oatmeal.',
  'This headline says everything except what you actually do.',
  'Your value prop is so broad it could apply to a toaster.',
  'Bold claim. Zero specifics. Confident delivery, though.',
  'If your copy were any safer, it would come with a helmet.',
  'This is not category-defining. It is category-participating.',
  'You are one concrete outcome away from sounding ten times sharper.',
  'Your messaging is trying to impress everyone and converting no one.',
  'Great product energy. Mid copy. Fixable, but currently cooked.',
];

const ROAST_DIMENSIONS: Array<{
  id: RoastAnalysisDimensionId;
  label: string;
  weight: number;
}> = [
  { id: 'clarity', label: 'Clarity', weight: 0.3 },
  { id: 'specificity', label: 'Specificity', weight: 0.25 },
  { id: 'differentiation', label: 'Differentiation', weight: 0.25 },
  { id: 'value_clarity', label: 'Value Clarity', weight: 0.2 },
];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function countMatches(text: string, list: string[]): number {
  const lower = text.toLowerCase();
  return list.filter((item) => lower.includes(item.toLowerCase())).length;
}

function findMatchedPhrases(text: string, list: string[]): string[] {
  const lower = text.toLowerCase();
  return list.filter((item) => lower.includes(item.toLowerCase()));
}

function hasNumbers(text: string): boolean {
  return /\d+/.test(text) || /\b(?:zero|one|two|three|four|five|ten|hundred|thousand|million)\b/i.test(text);
}

function firstNonEmpty(values: string[]): string {
  return values.find((value) => value.trim().length > 0)?.trim() ?? '';
}

export function normalizeJudgedCopy(scraped: ScrapedData): { headline: string; description: string } {
  const headline = firstNonEmpty([scraped.ogTitle, scraped.title, scraped.h1]);
  const description = firstNonEmpty([scraped.ogDescription, scraped.description, scraped.firstParagraph]);

  return {
    headline: headline || scraped.domain,
    description: description || 'No supporting description found on the page.',
  };
}

export function resolveVerdict(score: number): string {
  if (score < 20) return 'Invisible';
  if (score < 38) return 'Generic Blob';
  if (score < 56) return 'Needs Seasoning';
  if (score < 74) return 'Almost There';
  if (score < 90) return 'Crispy Clean';
  return 'Category Flame';
}

function resolveGrade(score: number): GradeTier {
  return GRADE_TIERS.find((tier) => score >= tier.minScore) ?? GRADE_TIERS[GRADE_TIERS.length - 1];
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return hash;
}

export function pickRoastBankLine(params: {
  domain: string;
  headline: string;
  score: number;
  verdict: string;
}): string {
  const seed = `${params.domain}|${params.headline}|${params.score}|${params.verdict}`;
  const index = Math.abs(hashString(seed)) % ROAST_LINE_BANK.length;
  return ROAST_LINE_BANK[index] ?? ROAST_LINE_BANK[0];
}

function truncate(value: string, max = 180): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

type RoastSignals = {
  clarity: number;
  specificity: number;
  differentiation: number;
  valueClarity: number;
  headline: string;
  description: string;
  buzzHits: string[];
  vagueHits: string[];
  specificityHits: number;
  outcomeHits: number;
  headlineWordCount: number;
  genericPattern?: string;
};

function computeRoastSignals(judged: { headline: string; description: string }): RoastSignals {
  const combined = `${judged.headline} ${judged.description}`.toLowerCase();
  const headlineWords = judged.headline.split(/\s+/).filter(Boolean);
  const headlineWordCount = headlineWords.length;

  // Clarity
  let clarity = 62;
  if (headlineWordCount >= 4 && headlineWordCount <= 11) clarity += 20;
  else if (headlineWordCount > 15) clarity -= 16;
  else if (headlineWordCount <= 2) clarity -= 14;

  if (/[,:;()]/.test(judged.headline) && headlineWordCount > 12) clarity -= 6;

  // Specificity
  const specificityHits = countMatches(combined, SPECIFICITY_INDICATORS);
  let specificity = 34 + specificityHits * 10;
  if (hasNumbers(combined)) specificity += 10;
  specificity -= countMatches(combined, VAGUE_WORDS) * 3;

  // Differentiation
  const buzzHits = findMatchedPhrases(combined, OVERUSED_AI_PHRASES);
  const vagueHits = findMatchedPhrases(combined, VAGUE_WORDS);
  const genericPattern = GENERIC_PATTERNS
    .map((pattern) => combined.match(pattern)?.[0] ?? '')
    .find(Boolean);
  let differentiation = 78;
  differentiation -= buzzHits.length * 8;
  differentiation -= vagueHits.length * 4;
  differentiation -= genericPattern ? 12 : 0;
  differentiation += countMatches(combined, CONTRAST_WORDS) * 6;

  // Value clarity
  const outcomeHits = countMatches(combined, OUTCOME_WORDS);
  const customerHits = countMatches(combined, CUSTOMER_CENTRIC_WORDS);
  const selfHits = countMatches(combined, SELF_REFERENTIAL_WORDS);
  let valueClarity = 38 + outcomeHits * 12;
  if (customerHits > 0) valueClarity += 12;
  if (hasNumbers(combined) && outcomeHits > 0) valueClarity += 8;
  if (selfHits > 0 && customerHits === 0) valueClarity -= 12;

  return {
    clarity: clamp(Math.round(clarity), 0, 100),
    specificity: clamp(Math.round(specificity), 0, 100),
    differentiation: clamp(Math.round(differentiation), 0, 100),
    valueClarity: clamp(Math.round(valueClarity), 0, 100),
    headline: judged.headline,
    description: judged.description,
    buzzHits,
    vagueHits,
    specificityHits,
    outcomeHits,
    headlineWordCount,
    genericPattern,
  };
}

function buildRoastAnalysis(signals: RoastSignals): RoastAnalysis {
  const dimensions: RoastAnalysisDimension[] = ROAST_DIMENSIONS.map((dim) => {
    let score = signals.clarity;
    if (dim.id === 'specificity') score = signals.specificity;
    if (dim.id === 'differentiation') score = signals.differentiation;
    if (dim.id === 'value_clarity') score = signals.valueClarity;

    return {
      id: dim.id,
      label: dim.label,
      weight: dim.weight,
      score,
    };
  });

  const sorted = [...dimensions].sort((a, b) => a.score - b.score);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];

  const summary = `Strongest: ${strongest.label} (${strongest.score}/100). Priority fix: ${weakest.label} (${weakest.score}/100).`;
  return { dimensions, summary };
}

export function computeDeterministicRoastAnalysis(scraped: ScrapedData): RoastAnalysis {
  const judged = normalizeJudgedCopy(scraped);
  const signals = computeRoastSignals(judged);
  return buildRoastAnalysis(signals);
}

function buildHeuristicTips(params: {
  headline: string;
  description: string;
  buzzHits: string[];
  vagueHits: string[];
  specificityHits: number;
  outcomeHits: number;
  headlineWordCount: number;
  genericPattern?: string;
}): string[] {
  const tips: string[] = [];

  if (params.buzzHits[0]) {
    tips.push(`Replace "${params.buzzHits[0]}" with your actual mechanism in plain words (what you do that competitors do not).`);
  }

  if (params.specificityHits === 0) {
    tips.push('Name one concrete buyer in the first line (for example: "for Series A B2B SaaS founders").');
  }

  if (params.outcomeHits === 0) {
    tips.push('Add one measurable outcome buyers care about (time saved, pipeline increased, churn reduced, etc.).');
  }

  if (params.headlineWordCount > 12) {
    tips.push(`Cut the headline from ${params.headlineWordCount} words to 8-10 words so it is repeatable.`);
  }

  if (params.genericPattern) {
    tips.push(`Delete the template phrase "${params.genericPattern}" and replace it with a specific claim only your team can own.`);
  }

  if (tips.length < 3 && params.vagueHits[0]) {
    tips.push(`Replace abstract wording like "${params.vagueHits[0]}" with concrete language from customer calls.`);
  }

  while (tips.length < 3) {
    if (tips.length === 1) {
      tips.push(`Use your supporting copy ("${truncate(params.description, 90)}") as proof, but keep the headline focused on one buyer + one outcome.`);
      continue;
    }
    tips.push('Add one contrast statement ("unlike X, we do Y") so your positioning is harder to copy.');
  }

  return tips.slice(0, 3);
}

export function computeHeuristicRoast(scraped: ScrapedData): RoastResult {
  const judged = normalizeJudgedCopy(scraped);
  const signals = computeRoastSignals(judged);

  const score = clamp(
    Math.round(
      signals.clarity * 0.3 +
      signals.specificity * 0.25 +
      signals.differentiation * 0.25 +
      signals.valueClarity * 0.2,
    ),
    0,
    100,
  );

  const grade = resolveGrade(score);
  const verdict = resolveVerdict(score);
  const roastLine = pickRoastBankLine({ domain: scraped.domain, headline: judged.headline, score, verdict });
  const analysis = buildRoastAnalysis(signals);

  const tips = buildHeuristicTips({
    headline: signals.headline,
    description: signals.description,
    buzzHits: signals.buzzHits,
    vagueHits: signals.vagueHits,
    specificityHits: signals.specificityHits,
    outcomeHits: signals.outcomeHits,
    headlineWordCount: signals.headlineWordCount,
    genericPattern: signals.genericPattern,
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
    source: 'heuristic',
    completedAt: new Date().toISOString(),
  };
}

export function encodeRoast(result: RoastResult): string {
  const payload: EncodedRoast = {
    s: result.score,
    g: result.grade.letter,
    t: result.grade.name.slice(0, 32),
    v: result.verdict.slice(0, 40),
    d: result.domain.slice(0, 80),
    r: result.roastLine.slice(0, 220),
    h: result.judged.headline.slice(0, 160),
    m: result.judged.description.slice(0, 220),
    p: result.tips.map((tip) => tip.slice(0, 140)).join('~'),
  };

  try {
    return btoa(encodeURIComponent(JSON.stringify(payload)));
  } catch {
    return '';
  }
}

export function decodeRoast(encoded: string): EncodedRoast | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(json) as EncodedRoast;

    if (
      typeof parsed.s !== 'number' ||
      typeof parsed.g !== 'string' ||
      typeof parsed.t !== 'string' ||
      typeof parsed.v !== 'string' ||
      typeof parsed.d !== 'string' ||
      typeof parsed.r !== 'string' ||
      typeof parsed.h !== 'string' ||
      typeof parsed.m !== 'string' ||
      typeof parsed.p !== 'string'
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
