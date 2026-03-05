/* ------------------------------------------------------------------ */
/*  Positioning Lab — Types                                           */
/* ------------------------------------------------------------------ */

import type { RoastAnalysisDimension } from '@/lib/roast';

// ── Scoring dimensions (shared with Grader) ─────────────────────────

export type LabDimensionId =
  | 'clarity'
  | 'specificity'
  | 'differentiation'
  | 'brevity'
  | 'value_clarity';

// ── Positioning Snapshot ────────────────────────────────────────────

export type PositioningSnapshot = {
  id: string;
  createdAt: string;
  headline: string;
  oneLiner: string;
  targetAudience: string;
  valueProposition: string;
  differentiators: string[];
  proofPoints: string[];
  scores: {
    overall: number;
    clarity: number;
    specificity: number;
    differentiation: number;
    brevity: number;
    value_clarity: number;
  };
  percentile: number;
  grade: string;
};

// ── Module Artifacts ────────────────────────────────────────────────

export type AuditResult = {
  completedAt: string;
  url: string;
  domain: string;
  score: number;
  grade: string;
  verdict: string;
  roastLine: string;
  tips: string[];
  dimensions: RoastAnalysisDimension[];
  improvedHeadline?: string;
  improvedMetaDescription?: string;
  judgedHeadline: string;
  judgedDescription: string;
};

export type AudienceCard = {
  completedAt: string;
  role: string;
  companyType: string;
  painContext: string;
  buyerQuote: string;
  refinementHistory: {
    input: string;
    aiChallenge: string;
    refined: string;
  }[];
};

export type PainStack = {
  completedAt: string;
  pains: {
    description: string;
    urgency: number;
    frequency: number;
    willingness: number;
    rank: number;
  }[];
  primaryPain: string;
};

export type CompetitiveMap = {
  completedAt: string;
  alternatives: {
    name: string;
    type: 'direct' | 'indirect' | 'diy' | 'doNothing';
    sharedClaims: string[];
    uniqueClaims: string[];
  }[];
  userDifferentiators: {
    claim: string;
    isUnique: boolean;
    strength: 'weak' | 'moderate' | 'strong';
  }[];
};

export type HeadlineVariants = {
  completedAt: string;
  variants: {
    text: string;
    score: number;
    dimensions: Record<string, number>;
    isUserWritten: boolean;
    isAiGenerated: boolean;
  }[];
  selectedIndex: number;
  comparisonWithOriginal: {
    originalScore: number;
    selectedScore: number;
    delta: number;
  };
};

export type ProofInventory = {
  completedAt: string;
  proofs: {
    type: 'metric' | 'testimonial' | 'caseStudy' | 'credential' | 'mediaFeature';
    content: string;
    strength: number;
    suggestion: string;
  }[];
};

export type StressTestResult = {
  completedAt: string;
  challenges: {
    question: string;
    userResponse: string;
    aiFollowUp: string;
    passed: boolean;
  }[];
  overallResilience: number;
  revisedPositioning: string;
};

export type OnePagerData = {
  completedAt: string;
  startupName: string;
  audience: string;
  pain: string;
  differentiator: string;
  headline: string;
  proofPoints: string[];
  valueProposition: string;
  overallScore: number;
  publicId: string;
};

// ── Coach ───────────────────────────────────────────────────────────

export type CoachMessage = {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  cards?: import('./agent-types').AgentCard[];
};

// ── Competitors ─────────────────────────────────────────────────────

export type CompetitorEntry = {
  url: string;
  domain: string;
  lastScrapedAt: string;
  currentScore: number;
  scoreHistory: { date: string; score: number }[];
  sharedLanguage: string[];
};

// ── Module IDs ──────────────────────────────────────────────────────

export type LabModuleId =
  | 'audit'
  | 'audience'
  | 'pain'
  | 'differentiator'
  | 'headlines'
  | 'proof'
  | 'stress'
  | 'onepager';

export const LAB_MODULES: {
  id: LabModuleId;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  path: string;
  phase: 1 | 2 | 3;
}[] = [
  {
    id: 'audit',
    number: 1,
    title: 'The Audit',
    subtitle: 'Get roasted',
    description: 'Paste your URL and get a brutal analysis of your current positioning.',
    path: 'audit',
    phase: 1,
  },
  {
    id: 'audience',
    number: 2,
    title: 'Audience Lock',
    subtitle: 'Define your buyer',
    description: 'Guided exercise to define ONE specific buyer with extreme precision.',
    path: 'audience',
    phase: 2,
  },
  {
    id: 'pain',
    number: 3,
    title: 'Pain Excavation',
    subtitle: 'Find the #1 pain',
    description: 'Surface and rank your buyer\'s pains by urgency, frequency, and willingness to pay.',
    path: 'pain',
    phase: 2,
  },
  {
    id: 'differentiator',
    number: 4,
    title: 'The Differentiator',
    subtitle: 'Map your edge',
    description: 'Map competitive alternatives and extract what\'s genuinely different about you.',
    path: 'differ',
    phase: 2,
  },
  {
    id: 'headlines',
    number: 5,
    title: 'Headline Forge',
    subtitle: 'Sharpen your copy',
    description: 'Generate, score, and compare headline variants using the Positioning Grader engine.',
    path: 'headlines',
    phase: 1,
  },
  {
    id: 'proof',
    number: 6,
    title: 'Proof Builder',
    subtitle: 'Back it up',
    description: 'Collect and structure your proof points: metrics, testimonials, credentials.',
    path: 'proof',
    phase: 3,
  },
  {
    id: 'stress',
    number: 7,
    title: 'The Stress Test',
    subtitle: 'Defend your position',
    description: 'AI plays devil\'s advocate and forces you to defend your positioning.',
    path: 'stress',
    phase: 3,
  },
  {
    id: 'onepager',
    number: 8,
    title: 'The One-Pager',
    subtitle: 'Ship it',
    description: 'Assemble everything into a shareable Positioning One-Pager with a unique URL.',
    path: 'onepager',
    phase: 3,
  },
];

// ── Workspace ───────────────────────────────────────────────────────

export type Workspace = {
  id: string;
  email: string; // hashed
  token: string;
  createdAt: string;
  lastVisitedAt: string;

  startupName?: string;

  currentSnapshot: PositioningSnapshot | null;
  snapshots: PositioningSnapshot[];

  modules: {
    audit?: AuditResult;
    audience?: AudienceCard;
    pain?: PainStack;
    differentiator?: CompetitiveMap;
    headlines?: HeadlineVariants;
    proof?: ProofInventory;
    stress?: StressTestResult;
    onepager?: OnePagerData;
  };

  competitors: CompetitorEntry[];
  coachHistory: CoachMessage[];
};
