/* ------------------------------------------------------------------ */
/*  Positioning Grader — Data, types, word lists, tiers, feedback      */
/* ------------------------------------------------------------------ */

// ── Types ────────────────────────────────────────────────────────────

export type PositioningDimensionId =
  | 'clarity'
  | 'specificity'
  | 'differentiation'
  | 'brevity'
  | 'value_clarity';

export type PositioningInput = {
  startupName: string;
  headline: string;
  oneLiner: string;
  targetAudience: string;
};

export type GradeTier = {
  id: string;
  letter: string;
  name: string;
  minScore: number;
  summary: string;
};

export type RedFlag = {
  phrase: string;
  reason: string;
  category: 'buzzword' | 'vague' | 'self_referential';
};

export type FeedbackTemplate = {
  dimensionId: PositioningDimensionId;
  minScore: number;
  maxScore: number;
  feedback: string;
  suggestion: string;
};

export type PositioningDimension = {
  id: PositioningDimensionId;
  label: string;
  description: string;
  weight: number;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type RewriteTemplate = {
  label: string;
  template: string;
  example: string;
};

// ── Dimensions ───────────────────────────────────────────────────────

export const POSITIONING_DIMENSIONS: PositioningDimension[] = [
  {
    id: 'clarity',
    label: 'Clarity',
    description: 'Can someone understand what you do in one read?',
    weight: 0.25,
  },
  {
    id: 'specificity',
    label: 'Specificity',
    description: 'Does it name a clear audience, problem, or industry?',
    weight: 0.20,
  },
  {
    id: 'differentiation',
    label: 'Differentiation',
    description: 'Does it stand apart from every other AI startup?',
    weight: 0.25,
  },
  {
    id: 'brevity',
    label: 'Brevity',
    description: 'Is it tight enough to remember and repeat?',
    weight: 0.15,
  },
  {
    id: 'value_clarity',
    label: 'Value Clarity',
    description: 'Does it communicate a concrete outcome for the buyer?',
    weight: 0.15,
  },
];

// ── Grade Tiers ──────────────────────────────────────────────────────

export const GRADE_TIERS: GradeTier[] = [
  { id: 'a_plus',  letter: 'A+', name: 'Category Leader',   minScore: 95, summary: 'Your positioning is world-class. Ship it.' },
  { id: 'a',       letter: 'A',  name: 'Category Leader',   minScore: 90, summary: 'Excellent positioning that clearly owns a space.' },
  { id: 'a_minus', letter: 'A-', name: 'Sharp Contender',   minScore: 85, summary: 'Very strong. A small tweak could make it iconic.' },
  { id: 'b_plus',  letter: 'B+', name: 'Sharp Contender',   minScore: 80, summary: 'Strong foundation with room to sharpen further.' },
  { id: 'b',       letter: 'B',  name: 'Getting Warmer',    minScore: 73, summary: 'Good instincts. Needs more specificity to break through.' },
  { id: 'b_minus', letter: 'B-', name: 'Getting Warmer',    minScore: 65, summary: 'On the right track but still too generic to stick.' },
  { id: 'c_plus',  letter: 'C+', name: 'Needs Work',        minScore: 55, summary: 'The core idea is there, but it reads like a category description.' },
  { id: 'c',       letter: 'C',  name: 'Needs Work',        minScore: 45, summary: 'Too vague for buyers to self-select. Time to rewrite.' },
  { id: 'c_minus', letter: 'C-', name: 'Needs Work',        minScore: 35, summary: 'Positioning is generic enough to describe hundreds of companies.' },
  { id: 'd',       letter: 'D',  name: 'Invisible',         minScore: 20, summary: 'Buyers cannot tell what you do or who it is for.' },
  { id: 'f',       letter: 'F',  name: 'Invisible',         minScore: 0,  summary: 'No clear positioning detected. Start from your customer\'s pain.' },
];

// ── Overused AI Phrases (~50) ────────────────────────────────────────

export const OVERUSED_AI_PHRASES: string[] = [
  'ai-powered', 'ai powered', 'powered by ai', 'leveraging ai',
  'harness the power of ai', 'next-generation', 'next generation',
  'cutting-edge', 'cutting edge', 'state-of-the-art', 'state of the art',
  'revolutionary', 'game-changing', 'game changing', 'disruptive',
  'transformative', 'world-class', 'world class', 'best-in-class',
  'best in class', 'end-to-end', 'end to end', 'seamless',
  'seamlessly', 'intelligent', 'smart', 'advanced',
  'innovative', 'innovation', 'breakthrough', 'paradigm shift',
  'synergy', 'holistic', 'robust', 'scalable',
  'enterprise-grade', 'enterprise grade', 'mission-critical',
  'turnkey', 'comprehensive', 'all-in-one', 'all in one',
  'one-stop', 'full-stack', 'deep learning', 'machine learning',
  'neural', 'generative ai', 'gen ai', 'llm-powered',
  'gpt-powered', 'powered by llms', 'supercharge',
  'supercharged', 'turbocharge', 'unlock', 'unleash',
  'empower', 'empowering',
];

// ── Vague Words (~40) ────────────────────────────────────────────────

export const VAGUE_WORDS: string[] = [
  'solution', 'solutions', 'platform', 'tool', 'tools',
  'suite', 'ecosystem', 'framework', 'infrastructure',
  'optimize', 'optimization', 'streamline', 'streamlined',
  'enhance', 'enhanced', 'improve', 'improved',
  'better', 'faster', 'smarter', 'easier',
  'efficient', 'efficiency', 'effective', 'productivity',
  'workflow', 'workflows', 'automate', 'automation',
  'insights', 'analytics', 'data-driven', 'data driven',
  'digital transformation', 'modernize', 'modernization',
  'experience', 'experiences', 'engagement', 'enable',
  'enables', 'enabling', 'facilitate', 'facilitates',
];

// ── Outcome Words (~30) ──────────────────────────────────────────────

export const OUTCOME_WORDS: string[] = [
  'reduce', 'reduces', 'cut', 'cuts', 'save', 'saves',
  'eliminate', 'eliminates', 'prevent', 'prevents',
  'increase', 'increases', 'grow', 'grows', 'double', 'triple',
  'boost', 'boosts', 'accelerate', 'accelerates',
  'deliver', 'delivers', 'generate', 'generates',
  'earn', 'recover', 'protect', 'guarantee',
  'ship', 'close', 'convert', 'win',
];

// ── Customer-Centric Words ───────────────────────────────────────────

export const CUSTOMER_CENTRIC_WORDS: string[] = [
  'you', 'your', 'yours', 'teams', 'founders',
  'engineers', 'developers', 'marketers', 'operators',
  'leaders', 'managers', 'ctos', 'ceos', 'cmos',
  'buyers', 'customers', 'users', 'clients',
  'agencies', 'startups', 'companies', 'brands',
];

// ── Self-Referential Words ───────────────────────────────────────────

export const SELF_REFERENTIAL_WORDS: string[] = [
  'we', 'our', 'us', 'my', 'i am', 'we are',
  'we build', 'we create', 'we provide', 'we offer',
  'we help', 'we make', 'we deliver', 'we enable',
  'our mission', 'our platform', 'our solution',
  'our technology', 'our team', 'our product',
];

// ── Specificity Indicators (~50: roles + industries + problems) ──────

export const SPECIFICITY_INDICATORS: string[] = [
  // Roles
  'engineer', 'engineers', 'developer', 'developers',
  'marketer', 'marketers', 'designer', 'designers',
  'recruiter', 'recruiters', 'salesperson', 'sales team',
  'founder', 'founders', 'cto', 'ceo', 'cfo', 'cmo',
  'product manager', 'product managers', 'ops', 'operations',
  // Industries
  'saas', 'fintech', 'healthtech', 'medtech', 'edtech',
  'e-commerce', 'ecommerce', 'logistics', 'legal',
  'healthcare', 'insurance', 'real estate', 'construction',
  'manufacturing', 'retail', 'hospitality', 'agriculture',
  'cybersecurity', 'biotech', 'cleantech', 'proptech',
  // Problems
  'churn', 'onboarding', 'compliance', 'hiring',
  'revenue', 'pipeline', 'support tickets', 'invoicing',
  'inventory', 'scheduling', 'billing', 'documentation',
  'code review', 'deployment', 'monitoring', 'security audit',
];

// ── Contrast / Differentiation Words ─────────────────────────────────

export const CONTRAST_WORDS: string[] = [
  'unlike', 'instead of', 'without', 'not another',
  'the only', 'first', 'only', 'replaces',
  'no more', 'forget', 'stop', 'ditch',
  'finally', 'actually', 'built for',
];

// ── Generic Patterns ─────────────────────────────────────────────────

export const GENERIC_PATTERNS: RegExp[] = [
  /\bai\s+(?:for|that|which)\s+(?:everyone|everything|all)\b/i,
  /\bthe\s+future\s+of\b/i,
  /\bone\s+platform\s+(?:for|to)\b/i,
  /\bai\s+(?:platform|solution|tool)\s+for\s+(?:businesses|companies|enterprises|teams)\b/i,
  /\bmaking\s+\w+\s+(?:simple|easy|accessible)\b/i,
  /\bbuilding\s+the\s+(?:future|next)\b/i,
];

// ── Feedback Templates ───────────────────────────────────────────────

export const FEEDBACK_TEMPLATES: FeedbackTemplate[] = [
  // Clarity
  { dimensionId: 'clarity', minScore: 80, maxScore: 100, feedback: 'Your headline reads clearly on first pass. The structure makes it easy to parse what you do.', suggestion: 'Test it with someone outside your industry — if they get it in 3 seconds, you\'re golden.' },
  { dimensionId: 'clarity', minScore: 60, maxScore: 79, feedback: 'Mostly clear, but some phrasing adds cognitive load. A reader might need a second pass.', suggestion: 'Try reading it aloud. If you stumble or need to explain, simplify the sentence structure.' },
  { dimensionId: 'clarity', minScore: 40, maxScore: 59, feedback: 'The headline is trying to say too much at once. Key information gets buried.', suggestion: 'Pick one thing: who you serve, what you do, or the outcome. Lead with that.' },
  { dimensionId: 'clarity', minScore: 0, maxScore: 39, feedback: 'The headline is hard to parse. A visitor would struggle to explain what you do after reading it.', suggestion: 'Start over with: "[Product] helps [audience] [do what] by [how]." Fill in the blanks, then edit down.' },

  // Specificity
  { dimensionId: 'specificity', minScore: 80, maxScore: 100, feedback: 'You\'ve named a clear audience, use case, or industry. This makes it immediately relevant.', suggestion: 'Consider adding a number or timeframe to make it even more concrete.' },
  { dimensionId: 'specificity', minScore: 60, maxScore: 79, feedback: 'Some specificity is present, but it could go further. "Teams" or "businesses" is still broad.', suggestion: 'Replace generic audience words with a specific role or industry (e.g., "Series A SaaS founders").' },
  { dimensionId: 'specificity', minScore: 40, maxScore: 59, feedback: 'The headline is vague about who this is for and what problem it solves.', suggestion: 'Name your best customer. If your headline doesn\'t describe them, rewrite it until it does.' },
  { dimensionId: 'specificity', minScore: 0, maxScore: 39, feedback: 'No specific audience, industry, or problem is mentioned. This could describe any company.', suggestion: 'Interview your 3 best customers. Use their exact words for the problem you solve.' },

  // Differentiation
  { dimensionId: 'differentiation', minScore: 80, maxScore: 100, feedback: 'Your positioning avoids clichés and stands apart from the pack. This would catch attention.', suggestion: 'Validate by listing 3 competitors — if none could use your headline, you\'re differentiated.' },
  { dimensionId: 'differentiation', minScore: 60, maxScore: 79, feedback: 'Reasonable differentiation, but some phrases are shared by many AI startups.', suggestion: 'Remove every word that a competitor could also use. What\'s left is your real positioning.' },
  { dimensionId: 'differentiation', minScore: 40, maxScore: 59, feedback: 'The headline relies on common AI buzzwords that dilute your uniqueness.', suggestion: 'Ban "AI-powered," "intelligent," and "smart" from your vocabulary. Describe the mechanism instead.' },
  { dimensionId: 'differentiation', minScore: 0, maxScore: 39, feedback: 'This reads like a template any AI company could use. There\'s nothing distinctive.', suggestion: 'Answer: "What can we do that nobody else can, and who cares the most?" Lead with that answer.' },

  // Brevity
  { dimensionId: 'brevity', minScore: 80, maxScore: 100, feedback: 'Tight and punchy. This is easy to remember, repeat, and share.', suggestion: 'Perfect length. Make sure every remaining word earns its place.' },
  { dimensionId: 'brevity', minScore: 60, maxScore: 79, feedback: 'Slightly long but still manageable. Could tighten by one or two words.', suggestion: 'Try cutting adjectives first — they\'re usually the weakest words in a headline.' },
  { dimensionId: 'brevity', minScore: 40, maxScore: 59, feedback: 'Too long to scan quickly. Visitors will skim past this.', suggestion: 'Set a 10-word limit and force yourself to hit it. Constraint breeds clarity.' },
  { dimensionId: 'brevity', minScore: 0, maxScore: 39, feedback: 'This is a paragraph, not a headline. Nobody will read or remember it.', suggestion: 'Split into a 6-word headline + a supporting subhead. The headline should work alone.' },

  // Value Clarity
  { dimensionId: 'value_clarity', minScore: 80, maxScore: 100, feedback: 'The outcome is crystal clear. A buyer can immediately see what they\'d gain.', suggestion: 'If possible, add a specific number or timeframe: "in 2 weeks" or "by 40%."' },
  { dimensionId: 'value_clarity', minScore: 60, maxScore: 79, feedback: 'There\'s a value signal, but it\'s implied rather than stated directly.', suggestion: 'Swap feature language ("we use AI to…") for outcome language ("so you can…").' },
  { dimensionId: 'value_clarity', minScore: 40, maxScore: 59, feedback: 'The headline focuses on what you built, not what the customer gets.', suggestion: 'End your headline with a "so that" clause: "...so you can [outcome]."' },
  { dimensionId: 'value_clarity', minScore: 0, maxScore: 39, feedback: 'No customer benefit is mentioned. This reads like an internal product description.', suggestion: 'Ask your best customers why they bought. Put that reason in your headline verbatim.' },
];

// ── FAQ Items ────────────────────────────────────────────────────────

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is startup positioning and why does it matter?',
    answer: 'Positioning is how your startup occupies a distinct, valuable space in your buyer\'s mind. Strong positioning means buyers immediately understand what you do, who it\'s for, and why they should care — which directly impacts conversion rates, sales cycle length, and word-of-mouth growth.',
  },
  {
    question: 'How does the positioning grader score my headline?',
    answer: 'The grader analyzes your headline across 5 dimensions: Clarity, Specificity, Differentiation, Brevity, and Value Clarity. Each dimension is scored using linguistic heuristics — word count, syllable complexity, buzzword detection, audience signals, and outcome language. All scoring happens instantly in your browser with no AI API calls.',
  },
  {
    question: 'What makes good AI startup positioning?',
    answer: 'Great AI startup positioning avoids generic buzzwords like "AI-powered platform" and instead names a specific audience, a concrete problem, and a clear outcome. The best headlines could only describe one company — yours. They\'re short enough to remember and specific enough to self-select the right buyer.',
  },
  {
    question: 'Can I use this tool for non-AI startups?',
    answer: 'Absolutely. While the buzzword detection is tuned for AI/tech startups, the core dimensions — clarity, specificity, differentiation, brevity, and value clarity — apply to any startup or product headline regardless of industry.',
  },
  {
    question: 'Is my data stored or shared?',
    answer: 'No. All analysis runs entirely in your browser. Your headline and startup name are never sent to any server. The only data transmitted is anonymous analytics events (e.g., "grader completed") to help us improve the tool.',
  },
  {
    question: 'How can I improve my positioning score?',
    answer: 'Start with your lowest-scoring dimension. The most common fixes: replace buzzwords with specific mechanism language, name your exact audience instead of "businesses" or "teams," and end with a concrete outcome the buyer cares about. Then re-test. Most startups can jump 20+ points in one rewrite.',
  },
];

// ── Rewrite Templates ────────────────────────────────────────────────

export const REWRITE_TEMPLATES: RewriteTemplate[] = [
  {
    label: 'Outcome-Led',
    template: '[Audience] [outcome verb] [specific result] with [Product].',
    example: 'SaaS founders close deals 40% faster with Acme.',
  },
  {
    label: 'Problem-Agitate',
    template: 'Stop [pain point]. [Product] [mechanism] so [audience] can [outcome].',
    example: 'Stop losing deals to slow proposals. Acme auto-generates decks so founders can close same-day.',
  },
  {
    label: 'Only-We',
    template: 'The only [category] that [unique mechanism] for [specific audience].',
    example: 'The only proposal tool that learns your win patterns for B2B SaaS teams.',
  },
];
