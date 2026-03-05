'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Beaker,
  ChevronRight,
  Clock,
  FlaskConical,
  Lock,
  CheckCircle2,
  Play,
} from 'lucide-react';
import {
  LAB_MODULES,
  type Workspace,
  type LabModuleId,
} from '@/lib/lab/types';
import LabCoachPanel from './LabCoachPanel';

type SafeWorkspace = Omit<Workspace, 'token' | 'email'>;

type Props = {
  workspace: SafeWorkspace;
  workspaceId: string;
};

function getModuleStatus(
  moduleId: LabModuleId,
  modules: SafeWorkspace['modules']
): 'completed' | 'available' | 'locked' {
  if (modules[moduleId]) return 'completed';
  const mod = LAB_MODULES.find((m) => m.id === moduleId);
  if (mod && mod.phase <= 2) return 'available';
  return 'locked';
}

function ScoreDisplay({ score, grade }: { score: number; grade: string }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (score === 0) return;
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  const color =
    score >= 80
      ? '#22c55e'
      : score >= 60
        ? '#7a40f2'
        : score >= 40
          ? '#f59e0b'
          : '#ef4444';

  return (
    <div className="flex items-end gap-3">
      <span
        className="text-6xl sm:text-7xl font-semibold tabular-nums leading-none"
        style={{ fontFamily: 'var(--royal-display)', color }}
      >
        {displayed}
      </span>
      <div className="pb-1">
        <span
          className="text-2xl font-semibold"
          style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-dim)' }}
        >
          /100
        </span>
        <div
          className="text-sm font-semibold mt-1 px-2 py-0.5 rounded-md text-center"
          style={{
            background: `${color}20`,
            color,
            fontFamily: 'var(--royal-ui)',
          }}
        >
          {grade}
        </div>
      </div>
    </div>
  );
}

function ModuleCard({
  number,
  title,
  subtitle,
  description,
  path,
  status,
  workspaceId,
}: {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  path: string;
  status: 'completed' | 'available' | 'locked';
  workspaceId: string;
}) {
  const isClickable = status !== 'locked';

  const cardClass = `group relative rounded-2xl p-5 transition-all ${
    isClickable ? 'cursor-pointer' : 'cursor-default opacity-50'
  }`;

  const cardStyle = {
    background: 'var(--bg-panel)' as const,
    border: `1px solid ${
      status === 'completed'
        ? 'rgba(34, 197, 94, 0.3)'
        : status === 'available'
          ? 'var(--stroke-soft)'
          : 'rgba(255,255,255,0.08)'
    }`,
    backdropFilter: 'blur(12px)' as const,
  };

  const content = (
    <>
      <div className="flex items-start justify-between mb-3">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold"
          style={{
            background:
              status === 'completed'
                ? 'rgba(34, 197, 94, 0.15)'
                : status === 'available'
                  ? 'rgba(122, 64, 242, 0.15)'
                  : 'rgba(255,255,255,0.06)',
            color:
              status === 'completed'
                ? '#22c55e'
                : status === 'available'
                  ? 'var(--accent-ruby)'
                  : 'var(--text-dim)',
            fontFamily: 'var(--royal-ui)',
          }}
        >
          {status === 'completed' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : status === 'locked' ? (
            <Lock className="w-3.5 h-3.5" />
          ) : (
            number
          )}
        </span>

        {status === 'available' && (
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent-ruby-soft)' }}>
            <Play className="w-3 h-3" />
            Start
          </span>
        )}
        {status === 'completed' && (
          <span className="flex items-center gap-1 text-xs" style={{ color: '#22c55e' }}>
            Done
          </span>
        )}
      </div>

      <h3
        className="text-base font-semibold mb-0.5"
        style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      <p className="text-xs mb-2" style={{ color: 'var(--accent-ruby-soft)' }}>
        {subtitle}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {description}
      </p>

      {isClickable && (
        <ChevronRight
          className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: 'var(--text-dim)' }}
        />
      )}
    </>
  );

  if (isClickable) {
    return (
      <Link href={`/lab/${workspaceId}/${path}`} className={cardClass} style={cardStyle}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClass} style={cardStyle}>
      {content}
    </div>
  );
}

function ScoreSparkline({ snapshots }: { snapshots: SafeWorkspace['snapshots'] }) {
  if (snapshots.length < 2) return null;

  const scores = snapshots.map((s) => s.scores.overall);
  const max = Math.max(...scores, 100);
  const min = Math.min(...scores, 0);
  const range = max - min || 1;
  const w = 200;
  const h = 40;
  const points = scores
    .map((s, i) => {
      const x = (i / (scores.length - 1)) * w;
      const y = h - ((s - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mt-2">
      <polyline
        points={points}
        fill="none"
        stroke="var(--accent-ruby)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {scores.map((s, i) => (
        <circle
          key={i}
          cx={(i / (scores.length - 1)) * w}
          cy={h - ((s - min) / range) * h}
          r="3"
          fill="var(--accent-ruby)"
        />
      ))}
    </svg>
  );
}

export default function LabDashboardClient({ workspace, workspaceId }: Props) {
  const completedCount = useMemo(
    () => LAB_MODULES.filter((m) => workspace.modules[m.id]).length,
    [workspace.modules]
  );

  const hasSnapshot = workspace.currentSnapshot !== null;

  return (
    <main className="site-theme marketing-main" id="main-content">
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto pt-28">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(122, 64, 242, 0.15)' }}
              >
                <Beaker className="w-5 h-5" style={{ color: 'var(--accent-ruby)' }} />
              </div>
              <div>
                <h1
                  className="text-2xl font-semibold"
                  style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
                >
                  {workspace.startupName || 'Your Workspace'}
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                  {completedCount}/{LAB_MODULES.length} modules completed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/lab/${workspaceId}/timeline`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all hover:opacity-80"
                style={{
                  background: 'var(--bg-elev-2)',
                  border: '1px solid var(--stroke-soft)',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--royal-ui)',
                }}
              >
                <Clock className="w-3.5 h-3.5" />
                Timeline
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Panel (left) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'var(--bg-panel)',
                  border: '1px solid var(--stroke-soft)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <h2
                  className="text-sm tracking-[0.1em] uppercase mb-4"
                  style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
                >
                  Current Score
                </h2>

                {hasSnapshot ? (
                  <>
                    <ScoreDisplay
                      score={workspace.currentSnapshot!.scores.overall}
                      grade={workspace.currentSnapshot!.grade}
                    />
                    <ScoreSparkline snapshots={workspace.snapshots} />

                    {/* Dimension bars */}
                    <div className="mt-6 space-y-3">
                      {Object.entries(workspace.currentSnapshot!.scores)
                        .filter(([k]) => k !== 'overall')
                        .map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between text-xs mb-1">
                              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--royal-ui)' }}>
                                {key.replace('_', ' ')}
                              </span>
                              <span style={{ color: 'var(--text-dim)' }}>{value}</span>
                            </div>
                            <div
                              className="h-1.5 rounded-full overflow-hidden"
                              style={{ background: 'rgba(255,255,255,0.08)' }}
                            >
                              <motion.div
                                className="h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${value}%` }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                style={{ background: 'var(--accent-ruby)' }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <FlaskConical
                      className="w-8 h-8 mx-auto mb-3"
                      style={{ color: 'var(--text-dim)', opacity: 0.5 }}
                    />
                    <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                      Complete a module to get your first score.
                    </p>
                  </div>
                )}

                {/* Quick stats */}
                <div
                  className="grid grid-cols-2 gap-3 mt-6 pt-5"
                  style={{ borderTop: '1px solid var(--stroke-soft)' }}
                >
                  <div>
                    <p className="text-2xl font-semibold" style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}>
                      {workspace.snapshots.length}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Snapshots</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold" style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}>
                      {completedCount}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Modules done</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Module Grid (right) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <h2
                className="text-sm tracking-[0.1em] uppercase mb-4"
                style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
              >
                Modules
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LAB_MODULES.map((mod) => (
                  <ModuleCard
                    key={mod.id}
                    number={mod.number}
                    title={mod.title}
                    subtitle={mod.subtitle}
                    description={mod.description}
                    path={mod.path}
                    status={getModuleStatus(mod.id, workspace.modules)}
                    workspaceId={workspaceId}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* AI Coach floating panel */}
      <LabCoachPanel
        workspaceId={workspaceId}
        initialHistory={workspace.coachHistory}
      />
    </main>
  );
}
