export type DiagnosticDimensionId =
  | 'positioning'
  | 'icp'
  | 'proof'
  | 'demand'
  | 'funnel'
  | 'operating_system';

export type DiagnosticDimension = {
  id: DiagnosticDimensionId;
  label: string;
  description: string;
};

export type DiagnosticOption = {
  label: string;
  score: number;
};

export type DiagnosticQuestion = {
  id: string;
  dimension: DiagnosticDimensionId;
  prompt: string;
  options: DiagnosticOption[];
};

export type DiagnosticTier = {
  id: 'narrative_risk' | 'emerging_signal' | 'growth_ready' | 'scale_engine';
  label: string;
  summary: string;
};

export type ProfileOption = {
  value: string;
  label: string;
};

export type StageWeightProfile = Record<DiagnosticDimensionId, number>;

export type StageBenchmark = {
  headline: string;
  focus: string;
  commonFailureModes: string[];
};

export type KPIRecommendation = {
  metric: string;
  target: string;
  cadence: string;
  owner: string;
};

export type OperatingCadenceBlock = {
  day: string;
  ritual: string;
  outcome: string;
};

const maturityOptions: DiagnosticOption[] = [
  { label: 'Not in place', score: 0 },
  { label: 'Partially defined', score: 1 },
  { label: 'Documented, not consistent', score: 2 },
  { label: 'Consistent in most motions', score: 3 },
  { label: 'Systematic and measurable', score: 4 },
];

export const DIAGNOSTIC_DIMENSIONS: DiagnosticDimension[] = [
  {
    id: 'positioning',
    label: 'Positioning Clarity',
    description: 'Can buyers immediately understand your wedge and why now?',
  },
  {
    id: 'icp',
    label: 'ICP Precision',
    description: 'Do you know exactly who converts, and who does not?',
  },
  {
    id: 'proof',
    label: 'Proof Assets',
    description: 'Do you have trust artifacts that remove deal friction?',
  },
  {
    id: 'demand',
    label: 'Demand Engine',
    description: 'Is demand generation repeatable beyond founder hustle?',
  },
  {
    id: 'funnel',
    label: 'Funnel Conversion',
    description: 'Do handoffs and stages convert predictably?',
  },
  {
    id: 'operating_system',
    label: 'GTM Operating System',
    description: 'Is there a weekly execution cadence with ownership and feedback loops?',
  },
];

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'q_positioning_claim',
    dimension: 'positioning',
    prompt: 'Your primary positioning claim is specific, testable, and used everywhere.',
    options: maturityOptions,
  },
  {
    id: 'q_positioning_competitor',
    dimension: 'positioning',
    prompt: 'Your team can explain why you win vs alternatives in under 30 seconds.',
    options: maturityOptions,
  },
  {
    id: 'q_icp_segment',
    dimension: 'icp',
    prompt: 'Your ICP is segmented by buying context (not just company size or vertical).',
    options: maturityOptions,
  },
  {
    id: 'q_icp_disqualify',
    dimension: 'icp',
    prompt: 'You have explicit disqualification criteria for poor-fit opportunities.',
    options: maturityOptions,
  },
  {
    id: 'q_proof_assets',
    dimension: 'proof',
    prompt: 'You have current case studies, benchmarks, or technical validation buyers trust.',
    options: maturityOptions,
  },
  {
    id: 'q_proof_sales_use',
    dimension: 'proof',
    prompt: 'Proof assets are embedded in discovery, proposals, and follow-up sequences.',
    options: maturityOptions,
  },
  {
    id: 'q_demand_channel',
    dimension: 'demand',
    prompt: 'You can name 1-2 channels that repeatedly create qualified pipeline.',
    options: maturityOptions,
  },
  {
    id: 'q_demand_content',
    dimension: 'demand',
    prompt: 'Content and founder voice operate on a calendar tied to pipeline goals.',
    options: maturityOptions,
  },
  {
    id: 'q_funnel_stage',
    dimension: 'funnel',
    prompt: 'Conversion rates are tracked by stage, and drop-offs are reviewed weekly.',
    options: maturityOptions,
  },
  {
    id: 'q_funnel_handoff',
    dimension: 'funnel',
    prompt: 'Marketing-to-sales and sales-to-product handoffs are clearly defined.',
    options: maturityOptions,
  },
  {
    id: 'q_ops_rhythm',
    dimension: 'operating_system',
    prompt: 'Your GTM team has a weekly operating rhythm with decisions, owners, and due dates.',
    options: maturityOptions,
  },
  {
    id: 'q_ops_instrumentation',
    dimension: 'operating_system',
    prompt: 'Instrumentation links activities to outcomes (pipeline quality, velocity, revenue).',
    options: maturityOptions,
  },
];

export const DIAGNOSTIC_TIERS: DiagnosticTier[] = [
  {
    id: 'narrative_risk',
    label: 'Narrative Risk',
    summary: 'Your product may be strong, but GTM clarity and operating cadence are blocking growth.',
  },
  {
    id: 'emerging_signal',
    label: 'Emerging Signal',
    summary: 'There is traction potential, but execution is inconsistent across core GTM pillars.',
  },
  {
    id: 'growth_ready',
    label: 'Growth Ready',
    summary: 'Your GTM foundation is solid. Tightening conversion and system discipline can compound results.',
  },
  {
    id: 'scale_engine',
    label: 'Scale Engine',
    summary: 'You have a strong GTM system. Focus on leverage, efficiency, and category authority.',
  },
];

export const STAGE_OPTIONS: ProfileOption[] = [
  { value: 'pre_seed', label: 'Pre-seed / Idea' },
  { value: 'seed', label: 'Seed' },
  { value: 'series_a', label: 'Series A' },
  { value: 'series_b_plus', label: 'Series B+' },
  { value: 'bootstrapped', label: 'Bootstrapped / profitable' },
];

export const TEAM_SIZE_OPTIONS: ProfileOption[] = [
  { value: '1_5', label: '1-5' },
  { value: '6_15', label: '6-15' },
  { value: '16_40', label: '16-40' },
  { value: '41_100', label: '41-100' },
  { value: '100_plus', label: '100+' },
];

export const TRACTION_OPTIONS: ProfileOption[] = [
  { value: 'pre_revenue', label: 'Pre-revenue' },
  { value: 'first_revenue', label: 'First revenue' },
  { value: 'repeatable_revenue', label: 'Repeatable revenue' },
  { value: 'pmf_expansion', label: 'PMF + expansion' },
];

export const STAGE_WEIGHT_PROFILES: Record<string, StageWeightProfile> = {
  pre_seed: {
    positioning: 1.35,
    icp: 1.35,
    proof: 0.8,
    demand: 1.15,
    funnel: 0.75,
    operating_system: 1.1,
  },
  seed: {
    positioning: 1.2,
    icp: 1.2,
    proof: 1.05,
    demand: 1.15,
    funnel: 1,
    operating_system: 1.1,
  },
  series_a: {
    positioning: 1.05,
    icp: 1.1,
    proof: 1.2,
    demand: 1.15,
    funnel: 1.25,
    operating_system: 1.25,
  },
  series_b_plus: {
    positioning: 1,
    icp: 1.05,
    proof: 1.2,
    demand: 1.15,
    funnel: 1.3,
    operating_system: 1.3,
  },
  bootstrapped: {
    positioning: 1.15,
    icp: 1.2,
    proof: 1.1,
    demand: 1.2,
    funnel: 1,
    operating_system: 1.15,
  },
};

export const STAGE_TARGETS: Record<string, Record<DiagnosticDimensionId, number>> = {
  pre_seed: {
    positioning: 70,
    icp: 65,
    proof: 45,
    demand: 55,
    funnel: 40,
    operating_system: 50,
  },
  seed: {
    positioning: 72,
    icp: 68,
    proof: 55,
    demand: 62,
    funnel: 55,
    operating_system: 60,
  },
  series_a: {
    positioning: 75,
    icp: 72,
    proof: 68,
    demand: 70,
    funnel: 70,
    operating_system: 72,
  },
  series_b_plus: {
    positioning: 78,
    icp: 74,
    proof: 72,
    demand: 74,
    funnel: 75,
    operating_system: 78,
  },
  bootstrapped: {
    positioning: 74,
    icp: 70,
    proof: 60,
    demand: 68,
    funnel: 62,
    operating_system: 66,
  },
};

export const STAGE_BENCHMARKS: Record<string, StageBenchmark> = {
  pre_seed: {
    headline: 'At pre-seed, the winners are usually clearer than they are complete.',
    focus: 'Narrative clarity + ICP precision should move first, then demand loops.',
    commonFailureModes: [
      'Broad “for everyone” positioning that makes outreach blend into noise.',
      'No anti-ICP criteria, causing founder time to burn on low-fit meetings.',
      'Demand motion without a repeatable weekly operating rhythm.',
    ],
  },
  seed: {
    headline: 'At seed, GTM drift appears when messaging, proof, and pipeline are not synchronized.',
    focus: 'Translate early traction into a repeatable demand and conversion system.',
    commonFailureModes: [
      'Case evidence exists but is not embedded in sales touchpoints.',
      'Channels generate activity but not quality pipeline.',
      'Stage conversion is discussed qualitatively, not instrumented.',
    ],
  },
  series_a: {
    headline: 'At Series A, execution quality and cross-functional cadence become the growth limiter.',
    focus: 'Tighten conversion mechanics, proof distribution, and GTM operating cadence.',
    commonFailureModes: [
      'Top-of-funnel growth masks mid-funnel conversion leakage.',
      'Marketing and sales operate on different definitions of qualified pipeline.',
      'No single scoreboard tying activity to revenue outcomes.',
    ],
  },
  series_b_plus: {
    headline: 'At growth stage, leverage comes from operational rigor, not more random activity.',
    focus: 'Raise efficiency and velocity through disciplined handoffs and evidence systems.',
    commonFailureModes: [
      'Process complexity creates inconsistent buyer experiences.',
      'Proof assets become stale while deal scrutiny increases.',
      'Forecast confidence drops due to uneven stage governance.',
    ],
  },
  bootstrapped: {
    headline: 'In bootstrapped growth, focus beats volume; clarity compounds faster than spend.',
    focus: 'Protect founder time by enforcing ICP boundaries and high-signal channels.',
    commonFailureModes: [
      'Too many channels with weak feedback loops.',
      'No explicit prioritization framework for GTM experiments.',
      'Sales and delivery learning not captured in a repeatable system.',
    ],
  },
};

export const DIMENSION_OWNER_MAP: Record<DiagnosticDimensionId, string> = {
  positioning: 'Founder + GTM Lead',
  icp: 'Founder + Sales Lead',
  proof: 'Marketing + Product Marketing',
  demand: 'Growth Lead',
  funnel: 'Sales Lead',
  operating_system: 'Founder / Revenue Leader',
};

export const DIMENSION_LEADING_INDICATORS: Record<DiagnosticDimensionId, string> = {
  positioning: 'Message test response quality improves in outbound and first-call notes.',
  icp: 'Qualified meeting ratio rises as low-fit leads are disqualified earlier.',
  proof: 'Prospects reference case evidence during discovery and proposal review.',
  demand: 'Qualified pipeline creation is measurable from one primary channel.',
  funnel: 'Stage-to-stage conversion and time-in-stage stabilize week over week.',
  operating_system: 'Weekly GTM reviews produce clear owners and closed-loop decisions.',
};

export const KPI_PACKS: Record<string, KPIRecommendation[]> = {
  pre_seed: [
    { metric: 'Qualified meetings / month', target: '8-12', cadence: 'Weekly review', owner: 'Founder' },
    { metric: 'Problem-first reply rate', target: '>= 12%', cadence: 'Weekly review', owner: 'GTM Lead' },
    { metric: 'Time from first call to next step', target: '<= 7 days', cadence: 'Weekly review', owner: 'Founder' },
  ],
  seed: [
    { metric: 'Qualified pipeline created / month', target: 'Consistent month-over-month growth', cadence: 'Weekly review', owner: 'Growth Lead' },
    { metric: 'SQL -> Proposal conversion', target: '>= 35%', cadence: 'Weekly review', owner: 'Sales Lead' },
    { metric: 'Proposal -> Closed Won conversion', target: '>= 20%', cadence: 'Biweekly review', owner: 'Founder + Sales Lead' },
  ],
  series_a: [
    { metric: 'Pipeline coverage vs target', target: '>= 3x', cadence: 'Weekly review', owner: 'Revenue Leader' },
    { metric: 'Median time-in-stage (mid funnel)', target: 'Downtrend over 6 weeks', cadence: 'Weekly review', owner: 'Sales Ops / Sales Lead' },
    { metric: 'Win rate in target ICP', target: 'Uptrend vs prior quarter', cadence: 'Monthly review', owner: 'Founder + Revenue Leader' },
  ],
  series_b_plus: [
    { metric: 'Forecast accuracy', target: '>= 85%', cadence: 'Monthly review', owner: 'Revenue Leader' },
    { metric: 'CAC payback trend', target: 'Improving quarter-over-quarter', cadence: 'Monthly review', owner: 'Finance + Growth' },
    { metric: 'Expansion pipeline ratio', target: 'Growing share of total pipeline', cadence: 'Monthly review', owner: 'CS / Sales Leadership' },
  ],
  bootstrapped: [
    { metric: 'Qualified opportunities / month', target: 'Stable or rising with focused channels', cadence: 'Weekly review', owner: 'Founder' },
    { metric: 'Channel efficiency (pipeline per hour)', target: 'Top 1-2 channels improving', cadence: 'Biweekly review', owner: 'Founder + Growth' },
    { metric: 'Close rate in ideal segment', target: 'Uptrend quarter-over-quarter', cadence: 'Monthly review', owner: 'Founder' },
  ],
};

export const OPERATING_CADENCE_TEMPLATE: OperatingCadenceBlock[] = [
  {
    day: 'Monday',
    ritual: 'Pipeline + conversion review',
    outcome: 'Select one conversion bottleneck to fix this week.',
  },
  {
    day: 'Wednesday',
    ritual: 'Narrative + proof sync',
    outcome: 'Update one message block and one proof artifact based on live deals.',
  },
  {
    day: 'Friday',
    ritual: 'Experiment retrospective',
    outcome: 'Close loop on wins/losses and set next experiment owner.',
  },
];

export const ACTION_LIBRARY: Record<DiagnosticDimensionId, string[]> = {
  positioning: [
    'Rewrite your core positioning statement in one sentence: ICP + painful trigger + differentiated outcome.',
    'Create a messaging ladder (headline, 3 value pillars, objection handling) and enforce it across site, deck, and outbound.',
    'Test two narrative variants in outbound and landing copy for two weeks, then keep the higher-quality pipeline variant.',
  ],
  icp: [
    'Define your top two ICP slices with explicit “buying moment” triggers and anti-ICP disqualifiers.',
    'Audit the last 20 deals to identify patterns in win/loss by segment, urgency, and champion profile.',
    'Update qualification checklist and align it with discovery call templates.',
  ],
  proof: [
    'Ship one new case narrative with measurable baseline -> intervention -> result.',
    'Build a proof kit: 3 evidence snippets, 2 customer quotes, 1 implementation snapshot.',
    'Embed proof assets at each funnel stage (discovery, proposal, follow-up).',
  ],
  demand: [
    'Pick one primary and one secondary demand channel; pause low-signal channels for 30 days.',
    'Run a founder-led content sprint tied to three recurring buyer objections.',
    'Install a weekly demand review: content shipped, qualified responses, pipeline contribution.',
  ],
  funnel: [
    'Map full funnel stages with owners and entry/exit criteria, then publish it internally.',
    'Instrument stage conversion and time-in-stage for the last quarter.',
    'Run weekly deal review focused on bottleneck stage and one corrective experiment.',
  ],
  operating_system: [
    'Establish a weekly GTM operating review with clear agenda, owners, and decision log.',
    'Define three north-star metrics and six diagnostic metrics tied to each GTM pod.',
    'Create a 90-day experiment backlog with expected impact, effort, and learning goals.',
  ],
};

export const RECOMMENDED_ARTICLES: Record<
  DiagnosticDimensionId,
  Array<{ title: string; href: string }>
> = {
  positioning: [
    {
      title: 'How to Position Your AI Startup When Everything Sounds the Same',
      href: '/articles/how-to-position-your-ai-startup-when-everything-sounds-the-same',
    },
    {
      title: 'Most AI Startups Will Die with Great Products',
      href: '/articles/most-ai-startups-will-die-with-great-products',
    },
  ],
  icp: [
    {
      title: 'How AI Startups Should Think About Marketing in 2026',
      href: '/articles/how-ai-startups-should-think-about-marketing',
    },
    {
      title: 'Marketing vs. Consulting: What Early-Stage Startups Actually Need',
      href: '/articles/marketing-vs-consulting-what-startups-need',
    },
  ],
  proof: [
    {
      title: 'What I Learned Working With My First 10 Clients',
      href: '/articles/what-i-learned-from-my-first-10-clients',
    },
    {
      title: 'What Nobody Tells You Before You Hire a Marketing Consultant',
      href: '/articles/what-nobody-tells-you-before-you-hire-a-marketing-consultant',
    },
  ],
  demand: [
    {
      title: 'Good Content Doesn’t Win. Here’s Why That’s Our Fault.',
      href: '/articles/good-content-doesnt-win',
    },
    {
      title: 'SEO vs. Paid Ads: Which Should Your Startup Prioritize?',
      href: '/articles/seo-vs-paid-ads-which-should-your-startup-prioritize',
    },
  ],
  funnel: [
    {
      title: 'Why Most Startups Waste Money on Marketing (And How to Fix It)',
      href: '/articles/why-most-startups-waste-money-on-marketing',
    },
    {
      title: 'What Nobody Tells You Before You Hire a Marketing Consultant',
      href: '/articles/what-nobody-tells-you-before-you-hire-a-marketing-consultant',
    },
  ],
  operating_system: [
    {
      title: 'From Engineering to Marketing: Why Systems Thinking Matters',
      href: '/articles/from-engineering-to-marketing-why-systems-thinking-matters',
    },
    {
      title: 'How We Rebranded From GrowByte to Olunix',
      href: '/articles/how-we-rebranded-from-growbyte-to-olunix',
    },
  ],
};
