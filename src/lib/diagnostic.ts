import {
  ACTION_LIBRARY,
  DIAGNOSTIC_DIMENSIONS,
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_TIERS,
  DIMENSION_LEADING_INDICATORS,
  DIMENSION_OWNER_MAP,
  KPI_PACKS,
  OPERATING_CADENCE_TEMPLATE,
  STAGE_BENCHMARKS,
  STAGE_TARGETS,
  STAGE_WEIGHT_PROFILES,
  type DiagnosticDimension,
  type DiagnosticDimensionId,
  type DiagnosticTier,
  type KPIRecommendation,
  type OperatingCadenceBlock,
} from '@/data/diagnostic';

export type DiagnosticProfile = {
  stage: string;
  teamSize: string;
  traction: string;
};

export type DiagnosticAnswers = Record<string, number>;

export type DimensionScore = {
  id: DiagnosticDimensionId;
  label: string;
  description: string;
  score: number;
  maxScore: number;
  percentage: number;
  target: number;
  gap: number;
  weight: number;
};

export type ActionItem = {
  title: string;
  action: string;
  owner: string;
  impact: 'High' | 'Medium';
  window: string;
  leadingIndicator: string;
};

export type PlanPhase = {
  phase: string;
  window: string;
  objective: string;
  actions: string[];
};

export type DiagnosticResult = {
  completedAt: string;
  stageKey: string;
  profile: DiagnosticProfile;
  totalQuestions: number;
  answeredQuestions: number;
  rawScore: number;
  maxScore: number;
  unweightedScore: number;
  overallScore: number;
  tier: DiagnosticTier;
  dimensions: DimensionScore[];
  bottlenecks: DimensionScore[];
  strengths: DimensionScore[];
  allAboveTarget: boolean;
  stageBenchmark: string;
  stageFocus: string;
  failureModes: string[];
  priorityActions: string[];
  thisWeekActions: ActionItem[];
  ninetyDayPlan: PlanPhase[];
  kpiPack: KPIRecommendation[];
  operatingCadence: OperatingCadenceBlock[];
  alignmentChecklist: string[];
};

function resolveTier(overallScore: number): DiagnosticTier {
  if (overallScore < 40) return DIAGNOSTIC_TIERS[0];
  if (overallScore < 60) return DIAGNOSTIC_TIERS[1];
  if (overallScore < 80) return DIAGNOSTIC_TIERS[2];
  return DIAGNOSTIC_TIERS[3];
}

function resolveDimension(id: DiagnosticDimensionId): DiagnosticDimension {
  const dimension = DIAGNOSTIC_DIMENSIONS.find((item) => item.id === id);
  if (!dimension) {
    throw new Error(`Unknown diagnostic dimension: ${id}`);
  }
  return dimension;
}

function resolveStageKey(stage: string): string {
  return STAGE_WEIGHT_PROFILES[stage] ? stage : 'seed';
}

function buildBaseDimensionScores(answers: DiagnosticAnswers): Array<Omit<DimensionScore, 'target' | 'gap' | 'weight'>> {
  const buckets = new Map<DiagnosticDimensionId, { score: number; maxScore: number }>();

  DIAGNOSTIC_DIMENSIONS.forEach((dimension) => {
    buckets.set(dimension.id, { score: 0, maxScore: 0 });
  });

  DIAGNOSTIC_QUESTIONS.forEach((question) => {
    const bucket = buckets.get(question.dimension);
    if (!bucket) return;

    const answer = answers[question.id];
    bucket.maxScore += 4;
    if (typeof answer === 'number') {
      bucket.score += answer;
    }
  });

  return DIAGNOSTIC_DIMENSIONS.map((dimension) => {
    const bucket = buckets.get(dimension.id);
    const score = bucket?.score ?? 0;
    const maxScore = bucket?.maxScore ?? 0;
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    return {
      id: dimension.id,
      label: dimension.label,
      description: dimension.description,
      score,
      maxScore,
      percentage,
    };
  });
}

function buildPriorityActions(
  bottlenecks: DimensionScore[],
  strengths: DimensionScore[],
  stageKey: string,
): string[] {
  const actions: string[] = [];

  bottlenecks.forEach((dimension) => {
    const nextAction = ACTION_LIBRARY[dimension.id][0];
    if (nextAction && !actions.includes(nextAction)) {
      actions.push(nextAction);
    }
  });

  const stageSpecific = KPI_PACKS[stageKey]?.[0];
  if (stageSpecific) {
    actions.push(
      `Install a weekly scoreboard for "${stageSpecific.metric}" with a clear owner (${stageSpecific.owner}).`,
    );
  }

  const leverageDimension = strengths[0];
  if (leverageDimension) {
    const leverageAction = ACTION_LIBRARY[leverageDimension.id][2];
    if (leverageAction && !actions.includes(leverageAction)) {
      actions.push(leverageAction);
    }
  }

  return actions.slice(0, 5);
}

function buildThisWeekActions(bottlenecks: DimensionScore[], dimensions: DimensionScore[]): ActionItem[] {
  const items: ActionItem[] = bottlenecks.slice(0, 2).map((dimension) => ({
    title: `Fix ${dimension.label.toLowerCase()}`,
    action: ACTION_LIBRARY[dimension.id][0],
    owner: DIMENSION_OWNER_MAP[dimension.id],
    impact: dimension.gap > 20 ? 'High' : 'Medium',
    window: 'Days 1-7',
    leadingIndicator: DIMENSION_LEADING_INDICATORS[dimension.id],
  }));

  const opsScore = dimensions.find((d) => d.id === 'operating_system');
  const opsIsBottleneck = bottlenecks.some((d) => d.id === 'operating_system');
  if (opsScore && opsScore.gap > 0 && !opsIsBottleneck) {
    items.push({
      title: 'Install weekly GTM operating review',
      action: ACTION_LIBRARY.operating_system[0],
      owner: DIMENSION_OWNER_MAP.operating_system,
      impact: 'High',
      window: 'Day 1',
      leadingIndicator: DIMENSION_LEADING_INDICATORS.operating_system,
    });
  }

  return items.slice(0, 3);
}

function buildNinetyDayPlan(bottlenecks: DimensionScore[], stageKey: string, dimensions: DimensionScore[]): PlanPhase[] {
  const [primary, secondary] = bottlenecks;
  const primaryLabel = primary?.label ?? 'Positioning Clarity';
  const secondaryLabel = secondary?.label ?? 'Funnel Conversion';
  const primaryActionSet = primary ? ACTION_LIBRARY[primary.id] : ACTION_LIBRARY.positioning;
  const secondaryActionSet = secondary ? ACTION_LIBRARY[secondary.id] : ACTION_LIBRARY.funnel;
  const stageFocus = STAGE_BENCHMARKS[stageKey]?.focus ?? 'Align execution with GTM bottlenecks.';

  const addressedIds = new Set(bottlenecks.map((b) => b.id));
  const phase4Dimension = [...dimensions]
    .filter((d) => !addressedIds.has(d.id))
    .sort((a, b) => b.gap - a.gap)[0];
  const phase4ActionSet = phase4Dimension ? ACTION_LIBRARY[phase4Dimension.id] : ACTION_LIBRARY.operating_system;
  const phase4Label = phase4Dimension?.label ?? 'GTM Operating System';

  return [
    {
      phase: 'Phase 1',
      window: 'Weeks 1-2',
      objective: `Executive alignment on ${primaryLabel.toLowerCase()} and one shared scoreboard.`,
      actions: [
        primaryActionSet[0],
        `Run a leadership alignment session to lock decision rights and goals: ${stageFocus}`,
      ],
    },
    {
      phase: 'Phase 2',
      window: 'Weeks 3-6',
      objective: `Ship artifacts and experiments for ${primaryLabel.toLowerCase()}.`,
      actions: [primaryActionSet[1], primaryActionSet[2]],
    },
    {
      phase: 'Phase 3',
      window: 'Weeks 7-10',
      objective: `Resolve constraints in ${secondaryLabel.toLowerCase()}.`,
      actions: [secondaryActionSet[0], secondaryActionSet[1]],
    },
    {
      phase: 'Phase 4',
      window: 'Weeks 11-12',
      objective: `Institutionalize cadence and strengthen ${phase4Label.toLowerCase()}.`,
      actions: [phase4ActionSet[1], phase4ActionSet[2]],
    },
  ];
}

function buildAlignmentChecklist(bottlenecks: DimensionScore[]): string[] {
  return [
    'Founder, GTM, and sales leads agree on one primary ICP and anti-ICP.',
    `Primary bottleneck owner is assigned (${DIMENSION_OWNER_MAP[bottlenecks[0]?.id ?? 'positioning']}).`,
    'Weekly GTM operating review is on calendar with a fixed decision agenda.',
    'Top three GTM metrics have owners, data source, and weekly targets.',
    'Proof assets are mapped to each stage from discovery to close.',
  ];
}

export function computeDiagnosticResult(params: {
  answers: DiagnosticAnswers;
  profile: DiagnosticProfile;
}): DiagnosticResult {
  const { answers, profile } = params;
  const stageKey = resolveStageKey(profile.stage);
  const weights = STAGE_WEIGHT_PROFILES[stageKey];
  const targets = STAGE_TARGETS[stageKey];
  const stageBenchmark = STAGE_BENCHMARKS[stageKey];

  const baseDimensions = buildBaseDimensionScores(answers);
  const dimensions: DimensionScore[] = baseDimensions.map((dimension) => {
    const target = targets[dimension.id];
    const gap = target - dimension.percentage;
    return {
      ...dimension,
      target,
      gap,
      weight: weights[dimension.id],
    };
  });

  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
  const answeredQuestions = DIAGNOSTIC_QUESTIONS.filter((question) => typeof answers[question.id] === 'number').length;

  const rawScore = dimensions.reduce((sum, item) => sum + item.score, 0);
  const maxScore = dimensions.reduce((sum, item) => sum + item.maxScore, 0);
  const unweightedScore = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;

  const weightedNumerator = dimensions.reduce((sum, item) => sum + item.percentage * item.weight, 0);
  const weightedDenominator = dimensions.reduce((sum, item) => sum + item.weight, 0);
  const overallScore = weightedDenominator > 0 ? Math.round(weightedNumerator / weightedDenominator) : unweightedScore;

  const rankedByRisk = [...dimensions].sort((a, b) => {
    if (b.gap !== a.gap) return b.gap - a.gap;
    return a.percentage - b.percentage;
  });

  const positiveGap = rankedByRisk.filter((item) => item.gap > 0);
  const allAboveTarget = positiveGap.length === 0;
  const bottlenecks = (positiveGap.length > 0 ? positiveGap : rankedByRisk).slice(0, 2);
  const strengths = [...dimensions].sort((a, b) => b.percentage - a.percentage).slice(0, 2);

  const tier = resolveTier(overallScore);
  const priorityActions = buildPriorityActions(bottlenecks, strengths, stageKey);
  const thisWeekActions = buildThisWeekActions(bottlenecks, dimensions);
  const ninetyDayPlan = buildNinetyDayPlan(bottlenecks, stageKey, dimensions);
  const kpiPack = KPI_PACKS[stageKey] ?? KPI_PACKS.seed;
  const operatingCadence = OPERATING_CADENCE_TEMPLATE;
  const alignmentChecklist = buildAlignmentChecklist(bottlenecks);

  return {
    completedAt: new Date().toISOString(),
    stageKey,
    profile,
    totalQuestions,
    answeredQuestions,
    rawScore,
    maxScore,
    unweightedScore,
    overallScore,
    tier,
    dimensions,
    bottlenecks,
    strengths,
    allAboveTarget,
    stageBenchmark: stageBenchmark.headline,
    stageFocus: stageBenchmark.focus,
    failureModes: stageBenchmark.commonFailureModes,
    priorityActions,
    thisWeekActions,
    ninetyDayPlan,
    kpiPack,
    operatingCadence,
    alignmentChecklist,
  };
}

function resolveProfileLabel(value: string, list: Array<{ value: string; label: string }>): string {
  return list.find((item) => item.value === value)?.label ?? value;
}

export function buildAlignmentBriefMarkdown(
  result: DiagnosticResult,
  options: {
    stageOptions: Array<{ value: string; label: string }>;
    teamSizeOptions: Array<{ value: string; label: string }>;
    tractionOptions: Array<{ value: string; label: string }>;
  },
): string {
  const stage = resolveProfileLabel(result.profile.stage, options.stageOptions);
  const teamSize = resolveProfileLabel(result.profile.teamSize, options.teamSizeOptions);
  const traction = resolveProfileLabel(result.profile.traction, options.tractionOptions);

  const dimensionTable = result.dimensions
    .map((dimension) => `| ${dimension.label} | ${dimension.percentage}% | ${dimension.target}% |`)
    .join('\n');

  const actionList = result.priorityActions.map((action) => `- ${action}`).join('\n');
  const thisWeek = result.thisWeekActions
    .map(
      (item) =>
        `- **${item.title}** (${item.window})\n` +
        `  - Action: ${item.action}\n` +
        `  - Owner: ${item.owner}\n` +
        `  - Leading indicator: ${item.leadingIndicator}\n`,
    )
    .join('\n');

  const planList = result.ninetyDayPlan
    .map(
      (phase) =>
        `### ${phase.phase} (${phase.window})\n` +
        `**Objective:** ${phase.objective}\n\n` +
        phase.actions.map((action) => `- ${action}`).join('\n'),
    )
    .join('\n\n');

  const kpiList = result.kpiPack
    .map((kpi) => `- ${kpi.metric} | Target: ${kpi.target} | Cadence: ${kpi.cadence} | Owner: ${kpi.owner}`)
    .join('\n');

  const cadenceList = result.operatingCadence
    .map((item) => `- ${item.day}: ${item.ritual} -> ${item.outcome}`)
    .join('\n');

  const checklist = result.alignmentChecklist.map((item) => `- ${item}`).join('\n');

  return `# GTM Diagnostic Alignment Brief\n\n` +
    `Generated: ${new Date(result.completedAt).toLocaleString('en-US', { timeZone: 'UTC', hour12: false })} UTC\n\n` +
    `## Company Profile\n` +
    `- Stage: ${stage}\n` +
    `- Team Size: ${teamSize}\n` +
    `- Traction: ${traction}\n` +
    `\n` +
    `## Executive Summary\n` +
    `- Weighted GTM Score: **${result.overallScore}/100**\n` +
    `- Unweighted Score: **${result.unweightedScore}/100**\n` +
    `- Maturity Tier: **${result.tier.label}**\n` +
    `- Stage Benchmark: ${result.stageBenchmark}\n` +
    `- Focus: ${result.stageFocus}\n` +
    `- ${result.allAboveTarget ? 'Optimization Focus' : 'Primary Bottlenecks'}: ${result.bottlenecks.map((item) => item.label).join(', ')}\n` +
    `- Primary Strengths: ${result.strengths.map((item) => item.label).join(', ')}\n\n` +
    `## Dimension Breakdown\n` +
    `| Dimension | Score | Target |\n` +
    `| --- | --- | --- |\n` +
    `${dimensionTable}\n\n` +
    `## Priority Actions (Next 30 Days)\n` +
    `${actionList}\n\n` +
    `## This Week Action Plan\n` +
    `${thisWeek}\n` +
    `## KPI Scoreboard\n` +
    `${kpiList}\n\n` +
    `## Weekly Operating Cadence\n` +
    `${cadenceList}\n\n` +
    `## Alignment Checklist\n` +
    `${checklist}\n\n` +
    `## 90-Day Execution Plan\n\n` +
    `${planList}\n`;
}

export function getDimensionById(id: DiagnosticDimensionId): DiagnosticDimension {
  return resolveDimension(id);
}
