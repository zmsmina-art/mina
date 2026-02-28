/* ------------------------------------------------------------------ */
/*  Positioning Grader — Scoring engine (all client-side)              */
/* ------------------------------------------------------------------ */

import {
  CONTRAST_WORDS,
  CUSTOMER_CENTRIC_WORDS,
  FEEDBACK_TEMPLATES,
  GENERIC_PATTERNS,
  GRADE_TIERS,
  OUTCOME_WORDS,
  OVERUSED_AI_PHRASES,
  POSITIONING_DIMENSIONS,
  REWRITE_TEMPLATES,
  SELF_REFERENTIAL_WORDS,
  SPECIFICITY_INDICATORS,
  VAGUE_WORDS,
  type GradeTier,
  type PositioningDimensionId,
  type PositioningInput,
  type RedFlag,
  type RewriteTemplate,
} from '@/data/positioning-grader';

// ── Result types ─────────────────────────────────────────────────────

export type DimensionResult = {
  id: PositioningDimensionId;
  label: string;
  description: string;
  score: number;
  weight: number;
  feedback: string;
  suggestion: string;
};

export type PositioningResult = {
  overallScore: number;
  grade: GradeTier;
  dimensions: DimensionResult[];
  redFlags: RedFlag[];
  quickWins: string[];
  rewrites: string[];
  input: PositioningInput;
  completedAt: string;
};

// ── Gibberish Detection ──────────────────────────────────────────────

// Common English bigrams (two-letter combinations) for coherence checking
const COMMON_BIGRAMS = new Set([
  'th','he','in','en','nt','re','er','an','ti','es','on','at','se','nd',
  'or','ar','al','te','co','de','to','ra','et','ed','it','sa','em','ro',
  'of','is','ha','ou','el','le','st','si','io','li','so','me','ne','no',
  'ta','ri','ng','ic','ce','ea','ve','ma','as','ur','wi','be','la','ca',
  'mo','di','pr','fo','wa','ge','pe','ai','ch','tr','us','lo','wo','do',
  'wh','ho','sh','ac','un','ut','ad','we','po','ee','ab','su','go','ow',
  'if','up','my','am','by','ay','oo','hi','ag','mi','ke','pa','na','da',
  'op','ig','im','pl','ck','ct','il','ly','ie','ld','ry','iv','ia','ir',
]);

function isGibberish(text: string): boolean {
  const cleaned = text.toLowerCase().replace(/[^a-z\s]/g, '');
  const words = cleaned.split(/\s+/).filter((w) => w.length > 0);

  if (words.length === 0) return true;

  let gibberishWords = 0;

  for (const word of words) {
    if (word.length <= 2) continue; // Skip very short words

    // Check consonant clusters: 4+ consecutive consonants is suspicious
    if (/[^aeiouy]{4,}/i.test(word)) {
      gibberishWords++;
      continue;
    }

    // Check vowel ratio: real English words typically have 25-60% vowels
    const vowels = (word.match(/[aeiouy]/gi) || []).length;
    const vowelRatio = vowels / word.length;
    if (vowelRatio < 0.15 || vowelRatio > 0.8) {
      gibberishWords++;
      continue;
    }

    // Check bigram plausibility: if most bigrams are uncommon, it's likely gibberish
    if (word.length >= 4) {
      let knownBigrams = 0;
      const totalBigrams = word.length - 1;
      for (let i = 0; i < totalBigrams; i++) {
        if (COMMON_BIGRAMS.has(word.slice(i, i + 2))) knownBigrams++;
      }
      if (knownBigrams / totalBigrams < 0.25) {
        gibberishWords++;
      }
    }
  }

  // If more than half the significant words look like gibberish, reject
  const significantWords = words.filter((w) => w.length > 2);
  if (significantWords.length === 0) return true;
  return gibberishWords / significantWords.length > 0.5;
}

export function validateInput(input: { headline: string; startupName: string }): string | null {
  if (isGibberish(input.headline)) {
    return 'Your headline doesn\u2019t appear to contain coherent text. Please enter a real headline or tagline.';
  }
  if (isGibberish(input.startupName)) {
    return 'Your startup name doesn\u2019t appear to be valid. Please enter a real name.';
  }
  return null;
}

// ── Helpers ──────────────────────────────────────────────────────────

export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 2) return 1;
  let count = 0;
  const vowels = 'aeiouy';
  let prevVowel = false;
  for (let i = 0; i < w.length; i++) {
    const isVowel = vowels.includes(w[i]);
    if (isVowel && !prevVowel) count++;
    prevVowel = isVowel;
  }
  // Silent e
  if (w.endsWith('e') && count > 1) count--;
  // -le ending
  if (w.endsWith('le') && w.length > 2 && !vowels.includes(w[w.length - 3])) count++;
  return Math.max(1, count);
}

function averageSyllables(words: string[]): number {
  if (words.length === 0) return 0;
  const total = words.reduce((sum, w) => sum + countSyllables(w), 0);
  return total / words.length;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function containsPhrase(text: string, phrase: string): boolean {
  return text.toLowerCase().includes(phrase.toLowerCase());
}

function countMatches(text: string, list: string[]): number {
  const lower = text.toLowerCase();
  return list.filter((item) => lower.includes(item.toLowerCase())).length;
}

function hasSubjectVerb(text: string): boolean {
  // Simple heuristic: check for common sentence patterns
  const patterns = [
    /\b(?:we|you|it|they|i)\s+\w+/i,
    /\b\w+s?\s+(?:helps?|lets?|makes?|gives?|gets?|turns?|cuts?|saves?|shows?)\b/i,
    /\b(?:stop|start|get|find|build|grow|ship|close|convert)\b/i,
  ];
  return patterns.some((p) => p.test(text));
}

function hasNumbers(text: string): boolean {
  return /\d+/.test(text) || /\b(?:zero|one|two|three|four|five|ten|hundred|thousand|million)\b/i.test(text);
}

// ── Dimension Scorers ────────────────────────────────────────────────

function scoreClarity(input: PositioningInput): number {
  const text = input.headline;
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  let score = 70;

  // Word count sweet spot: 5-12
  if (wordCount >= 5 && wordCount <= 12) score += 10;
  else if (wordCount < 5) score -= 5;

  // Low average syllables = clearer
  const avgSyl = averageSyllables(words);
  if (avgSyl <= 1.6) score += 10;
  else if (avgSyl > 2.2) score -= 15;

  // Has subject + verb structure
  if (hasSubjectVerb(text)) score += 10;

  // Penalty for overly long sentences
  if (wordCount > 15) {
    score -= (wordCount - 15) * 3;
  }

  return clamp(Math.round(score), 0, 100);
}

function scoreSpecificity(input: PositioningInput): number {
  const combinedText = [input.headline, input.oneLiner, input.targetAudience].join(' ');

  let score = 40;

  // Role/industry mentions
  const specificityHits = countMatches(combinedText, SPECIFICITY_INDICATORS);
  if (specificityHits >= 1) score += 15;
  if (specificityHits >= 2) score += 15;

  // Numbers
  if (hasNumbers(combinedText)) score += 10;

  // Target audience field filled and specific
  if (input.targetAudience.trim().length > 3) score += 10;

  // Vague word penalty
  const vagueHits = countMatches(combinedText, VAGUE_WORDS);
  score -= vagueHits * 5;

  return clamp(Math.round(score), 0, 100);
}

function scoreDifferentiation(input: PositioningInput): number {
  const text = [input.headline, input.oneLiner].join(' ');

  let score = 80;

  // Buzzword penalty
  const buzzHits = OVERUSED_AI_PHRASES.filter((p) => containsPhrase(text, p)).length;
  score -= buzzHits * 8;

  // Zero buzzwords bonus
  if (buzzHits === 0) score += 10;

  // Contrast words bonus
  const contrastHits = countMatches(text, CONTRAST_WORDS);
  if (contrastHits > 0) score += 10;

  // Generic patterns penalty
  const genericHits = GENERIC_PATTERNS.filter((p) => p.test(text)).length;
  score -= genericHits * 15;

  return clamp(Math.round(score), 0, 100);
}

function scoreBrevity(input: PositioningInput): number {
  const words = input.headline.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount >= 5 && wordCount <= 8) return 90;
  if (wordCount >= 9 && wordCount <= 12) return 80;
  if (wordCount >= 3 && wordCount <= 4) return 75;
  if (wordCount >= 13 && wordCount <= 15) return 60;
  if (wordCount >= 16 && wordCount <= 20) return 40;
  if (wordCount >= 1 && wordCount <= 2) return 50;
  return 20; // 21+
}

function scoreValueClarity(input: PositioningInput): number {
  const text = [input.headline, input.oneLiner].join(' ');

  let score = 40;

  // Outcome words
  const outcomeHits = countMatches(text, OUTCOME_WORDS);
  if (outcomeHits > 0) score += 15;

  // Customer-centric language
  const customerHits = countMatches(text, CUSTOMER_CENTRIC_WORDS);
  if (customerHits > 0) score += 15;

  // Quantified value (numbers + outcome context)
  if (hasNumbers(text) && outcomeHits > 0) score += 10;

  // Self-referential penalty
  const selfHits = SELF_REFERENTIAL_WORDS.filter((p) => containsPhrase(text, p)).length;
  const hasCustomer = customerHits > 0;
  if (selfHits > 0 && !hasCustomer) score -= 15;

  return clamp(Math.round(score), 0, 100);
}

// ── Red Flags ────────────────────────────────────────────────────────

export function findRedFlags(input: PositioningInput): RedFlag[] {
  const text = [input.headline, input.oneLiner].join(' ');
  const flags: RedFlag[] = [];

  for (const phrase of OVERUSED_AI_PHRASES) {
    if (containsPhrase(text, phrase)) {
      flags.push({
        phrase,
        reason: `"${phrase}" is used by thousands of AI startups and adds no differentiation.`,
        category: 'buzzword',
      });
    }
  }

  for (const word of VAGUE_WORDS) {
    if (containsPhrase(text, word) && !flags.some((f) => f.phrase === word)) {
      flags.push({
        phrase: word,
        reason: `"${word}" is abstract. Replace with the specific thing you mean.`,
        category: 'vague',
      });
    }
  }

  for (const phrase of SELF_REFERENTIAL_WORDS) {
    if (containsPhrase(text, phrase) && !flags.some((f) => f.phrase === phrase)) {
      flags.push({
        phrase,
        reason: `"${phrase}" centers the company instead of the customer. Flip the perspective.`,
        category: 'self_referential',
      });
    }
  }

  return flags.slice(0, 12); // Cap to avoid overwhelming
}

// ── Quick Wins ───────────────────────────────────────────────────────

export function generateQuickWins(dimensions: DimensionResult[], input: PositioningInput): string[] {
  const sorted = [...dimensions].sort((a, b) => a.score - b.score);
  const wins: string[] = [];

  for (const dim of sorted) {
    if (wins.length >= 5) break;

    switch (dim.id) {
      case 'clarity':
        if (dim.score < 70) {
          const wordCount = input.headline.split(/\s+/).filter(Boolean).length;
          if (wordCount > 12) wins.push('Shorten your headline to 8-12 words. Cut every adjective that isn\'t doing work.');
          else wins.push('Simplify the sentence structure. Use: "[Product] [verb] [outcome] for [audience]."');
        }
        break;
      case 'specificity':
        if (dim.score < 70) {
          if (!input.targetAudience.trim()) wins.push('Add your target audience. "For [specific role] at [specific company type]" instantly adds specificity.');
          else wins.push('Name a specific industry, role, or pain point in your headline instead of generic terms.');
        }
        break;
      case 'differentiation':
        if (dim.score < 70) {
          const buzzHits = OVERUSED_AI_PHRASES.filter((p) => containsPhrase(input.headline, p));
          if (buzzHits.length > 0) wins.push(`Remove "${buzzHits[0]}" and describe what your product actually does differently.`);
          else wins.push('Add a contrast: "Unlike [alternative], [Product] [unique mechanism]."');
        }
        break;
      case 'brevity':
        if (dim.score < 70) wins.push('Cut your headline to under 10 words. If you need more, use a subheadline.');
        break;
      case 'value_clarity':
        if (dim.score < 70) wins.push('End with a concrete outcome: "…so you can [measurable result]."');
        break;
    }
  }

  if (wins.length === 0) {
    wins.push('Your positioning is strong across all dimensions. Test it with 5 potential buyers and measure comprehension.');
  }

  return wins;
}

// ── Rewrite Suggestions ──────────────────────────────────────────────

export function generateRewrites(input: PositioningInput): string[] {
  const name = input.startupName || 'YourProduct';
  const audience = input.targetAudience || '[your audience]';

  return REWRITE_TEMPLATES.map((t: RewriteTemplate) =>
    t.template
      .replace('[Product]', name)
      .replace('[Audience]', audience)
      .replace('[audience]', audience.toLowerCase())
      .replace('[specific audience]', audience.toLowerCase())
  );
}

// ── Shareable URL Encoding ───────────────────────────────────────────

export type EncodedResult = {
  s: number;        // score
  g: string;        // grade letter
  n: string;        // startup name
  t: string;        // tier name
  d: string;        // dimensions: "clarity:78,specificity:65,..."
  h: string;        // headline (truncated)
};

export function encodeResult(result: PositioningResult): string {
  const payload: EncodedResult = {
    s: result.overallScore,
    g: result.grade.letter,
    n: result.input.startupName.slice(0, 40),
    t: result.grade.name,
    d: result.dimensions.map((d) => `${d.id}:${d.score}`).join(','),
    h: result.input.headline.slice(0, 80),
  };
  try {
    return btoa(encodeURIComponent(JSON.stringify(payload)));
  } catch {
    return '';
  }
}

export function decodeResult(encoded: string): EncodedResult | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(json) as EncodedResult;
    if (typeof parsed.s !== 'number' || typeof parsed.g !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

// ── Main Scoring Function ────────────────────────────────────────────

export function computePositioningResult(input: PositioningInput): PositioningResult {
  const dimensionScores: Record<PositioningDimensionId, number> = {
    clarity: scoreClarity(input),
    specificity: scoreSpecificity(input),
    differentiation: scoreDifferentiation(input),
    brevity: scoreBrevity(input),
    value_clarity: scoreValueClarity(input),
  };

  const dimensions: DimensionResult[] = POSITIONING_DIMENSIONS.map((dim) => {
    const score = dimensionScores[dim.id];
    const template = FEEDBACK_TEMPLATES.find(
      (ft) => ft.dimensionId === dim.id && score >= ft.minScore && score <= ft.maxScore,
    );
    return {
      id: dim.id,
      label: dim.label,
      description: dim.description,
      score,
      weight: dim.weight,
      feedback: template?.feedback ?? '',
      suggestion: template?.suggestion ?? '',
    };
  });

  // Weighted average
  const overallScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score * d.weight, 0) /
    dimensions.reduce((sum, d) => sum + d.weight, 0),
  );

  // Resolve grade tier
  const grade = GRADE_TIERS.find((t) => overallScore >= t.minScore) ?? GRADE_TIERS[GRADE_TIERS.length - 1];

  const redFlags = findRedFlags(input);
  const quickWins = generateQuickWins(dimensions, input);
  const rewrites = generateRewrites(input);

  return {
    overallScore,
    grade,
    dimensions,
    redFlags,
    quickWins,
    rewrites,
    input,
    completedAt: new Date().toISOString(),
  };
}
