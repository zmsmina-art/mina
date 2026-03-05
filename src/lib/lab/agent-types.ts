/* ------------------------------------------------------------------ */
/*  Positioning Lab — Agent Types                                     */
/* ------------------------------------------------------------------ */

import type { RoastAnalysisDimension } from '@/lib/roast';
import type { CoachMessage } from './types';

// ── Positioning Analysis Card ────────────────────────────────────────

export type PositioningAnalysis = {
  url: string;
  domain: string;
  score: number;
  grade: string;
  verdict: string;
  dimensions: RoastAnalysisDimension[];
  fixes: string[];
  judgedHeadline: string;
  judgedDescription: string;
  improvedHeadline: string;
  improvedDescription: string;
};

// ── Competitor Matrix Card ───────────────────────────────────────────

export type CompetitorEntry = {
  url: string;
  domain: string;
  score: number;
  grade: string;
  headline: string;
  strengths: string[];
  weaknesses: string[];
};

export type CompetitorMatrix = {
  competitors: CompetitorEntry[];
  userScore: number | null;
  userDomain: string | null;
  summary: string;
};

// ── Copy Suggestions Card ────────────────────────────────────────────

export type CopySuggestion = {
  headline: string;
  description: string;
  reasoning: string;
  estimatedScoreImprovement: number;
};

// ── Agent Card Union ─────────────────────────────────────────────────

export type AgentCard =
  | { type: 'positioning_analysis'; data: PositioningAnalysis }
  | { type: 'competitor_matrix'; data: CompetitorMatrix }
  | { type: 'copy_suggestions'; data: CopySuggestion[] };

// ── Agent Message ────────────────────────────────────────────────────

export type AgentMessage = CoachMessage & {
  cards?: AgentCard[];
};

// ── API Request / Response ───────────────────────────────────────────

export type AgentAction = 'analyze_url' | 'analyze_competitors' | 'rewrite';

export type AgentRequest = {
  message: string;
  action?: AgentAction;
  urls?: string[];
  copy?: { headline: string; description: string };
};

export type AgentResponse = {
  reply: string;
  cards?: AgentCard[];
};
