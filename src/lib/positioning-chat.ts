/* ------------------------------------------------------------------ */
/*  Positioning Chat — Shared types & context builder                  */
/* ------------------------------------------------------------------ */

import type { PositioningResult, DimensionResult } from '@/lib/positioning-grader';

// ── Types ────────────────────────────────────────────────────────────

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatContext = {
  headline: string;
  startupName: string;
  oneLiner: string;
  targetAudience: string;
  overallScore: number;
  grade: string;
  dimensions: Pick<DimensionResult, 'id' | 'label' | 'score' | 'feedback' | 'suggestion'>[];
  redFlags: { phrase: string; reason: string }[];
  quickWins: string[];
  rewrites: string[];
};

// ── Constants ────────────────────────────────────────────────────────

export const CHAT_MESSAGE_LIMIT = 5;

// ── Context Builder ──────────────────────────────────────────────────

export function buildChatContext(result: PositioningResult): ChatContext {
  return {
    headline: result.input.headline,
    startupName: result.input.startupName,
    oneLiner: result.input.oneLiner,
    targetAudience: result.input.targetAudience,
    overallScore: result.overallScore,
    grade: result.grade.letter,
    dimensions: result.dimensions.map((d) => ({
      id: d.id,
      label: d.label,
      score: d.score,
      feedback: d.feedback,
      suggestion: d.suggestion,
    })),
    redFlags: result.redFlags.map((f) => ({
      phrase: f.phrase,
      reason: f.reason,
    })),
    quickWins: result.quickWins,
    rewrites: result.rewrites,
  };
}
