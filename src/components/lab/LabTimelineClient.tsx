'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpDown,
  Calendar,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import type { PositioningSnapshot } from '@/lib/lab/types';

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return 'var(--accent-ruby-soft)';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const DIMENSION_LABELS: Record<string, string> = {
  clarity: 'Clarity',
  specificity: 'Specificity',
  differentiation: 'Differentiation',
  brevity: 'Brevity',
  value_clarity: 'Value Clarity',
};

type Props = {
  snapshots: PositioningSnapshot[];
  workspaceId: string;
};

function SnapshotNode({
  snapshot,
  delta,
  isLatest,
  isExpanded,
  onToggle,
}: {
  snapshot: PositioningSnapshot;
  delta: number | null;
  isLatest: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative pl-8">
      {/* Timeline dot */}
      <div
        className="absolute left-0 top-3 w-4 h-4 rounded-full border-2"
        style={{
          background: isLatest ? 'var(--accent-ruby)' : 'var(--bg-elev-2)',
          borderColor: isLatest ? 'var(--accent-ruby)' : 'var(--stroke-strong)',
        }}
      />

      <button
        onClick={onToggle}
        className="w-full text-left rounded-2xl p-5 transition-all"
        style={{
          background: isExpanded ? 'var(--bg-panel)' : 'var(--bg-elev-1)',
          border: `1px solid ${isExpanded ? 'rgba(122, 64, 242, 0.3)' : 'var(--stroke-soft)'}`,
          backdropFilter: isExpanded ? 'blur(12px)' : undefined,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--text-dim)' }} />
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                {formatDate(snapshot.createdAt)}
              </span>
              {isLatest && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(122, 64, 242, 0.15)', color: 'var(--accent-ruby)' }}
                >
                  Latest
                </span>
              )}
            </div>
            <p
              className="text-base font-semibold truncate"
              style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
            >
              {snapshot.headline || 'No headline'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className="text-2xl font-semibold tabular-nums"
              style={{
                fontFamily: 'var(--royal-display)',
                color: scoreColor(snapshot.scores.overall),
              }}
            >
              {snapshot.scores.overall}
            </span>
            {delta !== null && delta !== 0 && (
              <span
                className="flex items-center text-sm font-semibold"
                style={{ color: delta > 0 ? '#22c55e' : '#ef4444' }}
              >
                {delta > 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                )}
                {delta > 0 ? '+' : ''}
                {delta}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
            ) : (
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
            )}
          </div>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4"
            style={{ borderTop: '1px solid var(--stroke-soft)' }}
          >
            {/* Dimension bars */}
            <div className="space-y-2.5">
              {Object.entries(snapshot.scores)
                .filter(([k]) => k !== 'overall')
                .map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'var(--text-muted)' }}>
                        {DIMENSION_LABELS[key] ?? key}
                      </span>
                      <span style={{ color: scoreColor(value) }}>{value}</span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${value}%`, background: scoreColor(value) }}
                      />
                    </div>
                  </div>
                ))}
            </div>

            {/* Snapshot details */}
            {snapshot.targetAudience && (
              <div className="mt-4">
                <p className="text-xs mb-0.5" style={{ color: 'var(--text-dim)' }}>
                  Target audience
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {snapshot.targetAudience}
                </p>
              </div>
            )}
            {snapshot.grade && (
              <div className="mt-3 flex items-center gap-2">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{
                    background: `${scoreColor(snapshot.scores.overall)}20`,
                    color: scoreColor(snapshot.scores.overall),
                  }}
                >
                  Grade: {snapshot.grade}
                </span>
                {snapshot.percentile > 0 && (
                  <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                    Top {100 - snapshot.percentile}%
                  </span>
                )}
              </div>
            )}
          </motion.div>
        )}
      </button>
    </div>
  );
}

export default function LabTimelineClient({ snapshots, workspaceId }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    snapshots.length > 0 ? snapshots[snapshots.length - 1].id : null
  );

  const sortedSnapshots = useMemo(
    () => [...snapshots].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [snapshots]
  );

  // Compute deltas (compared to previous snapshot chronologically)
  const deltaMap = useMemo(() => {
    const chronological = [...snapshots].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const map = new Map<string, number | null>();
    chronological.forEach((snap, i) => {
      if (i === 0) {
        map.set(snap.id, null);
      } else {
        map.set(snap.id, snap.scores.overall - chronological[i - 1].scores.overall);
      }
    });
    return map;
  }, [snapshots]);

  return (
    <main className="site-theme marketing-main" id="main-content">
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto pt-28">
          <div className="flex items-center gap-3 mb-8">
            <Link
              href={`/lab/${workspaceId}`}
              className="flex items-center gap-1 text-sm transition-opacity hover:opacity-80"
              style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className="text-3xl font-semibold mb-2"
              style={{ fontFamily: 'var(--royal-display)', color: 'var(--text-primary)' }}
            >
              Evolution Timeline
            </h1>
            <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
              {snapshots.length === 0
                ? 'No snapshots yet. Complete a module to see your positioning evolve.'
                : `${snapshots.length} snapshot${snapshots.length === 1 ? '' : 's'} — tracking your positioning over time.`}
            </p>
          </motion.div>

          {/* Score evolution chart */}
          {snapshots.length >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-6 mb-8"
              style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--stroke-soft)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <h3
                className="text-sm tracking-[0.1em] uppercase mb-4"
                style={{ color: 'var(--text-dim)', fontFamily: 'var(--royal-ui)' }}
              >
                Score over time
              </h3>
              <ScoreChart snapshots={snapshots} />
            </motion.div>
          )}

          {/* Timeline */}
          {sortedSnapshots.length > 0 && (
            <div className="relative">
              {/* Vertical line */}
              <div
                className="absolute left-[7px] top-6 bottom-6 w-0.5"
                style={{ background: 'var(--stroke-soft)' }}
              />

              <div className="space-y-4">
                {sortedSnapshots.map((snapshot, i) => (
                  <SnapshotNode
                    key={snapshot.id}
                    snapshot={snapshot}
                    delta={deltaMap.get(snapshot.id) ?? null}
                    isLatest={i === 0}
                    isExpanded={expandedId === snapshot.id}
                    onToggle={() =>
                      setExpandedId((prev) => (prev === snapshot.id ? null : snapshot.id))
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {snapshots.length === 0 && (
            <div
              className="rounded-2xl p-12 text-center"
              style={{
                background: 'var(--bg-elev-1)',
                border: '1px solid var(--stroke-soft)',
              }}
            >
              <ArrowUpDown
                className="w-8 h-8 mx-auto mb-3"
                style={{ color: 'var(--text-dim)', opacity: 0.5 }}
              />
              <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                Your timeline will appear here as you build snapshots.
              </p>
              <Link
                href={`/lab/${workspaceId}`}
                className="inline-flex items-center gap-1 mt-4 text-sm"
                style={{ color: 'var(--accent-ruby-soft)' }}
              >
                Start a module <ChevronDown className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ScoreChart({ snapshots }: { snapshots: PositioningSnapshot[] }) {
  const chronological = useMemo(
    () => [...snapshots].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [snapshots]
  );

  const scores = chronological.map((s) => s.scores.overall);
  const max = Math.max(...scores, 100);
  const min = Math.min(...scores, 0);
  const range = max - min || 1;
  const w = 600;
  const h = 120;
  const padding = 8;

  const points = scores.map((s, i) => ({
    x: padding + (i / Math.max(scores.length - 1, 1)) * (w - padding * 2),
    y: padding + (1 - (s - min) / range) * (h - padding * 2),
    score: s,
    date: chronological[i].createdAt,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 120 }}>
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((val) => {
        const y = padding + (1 - (val - min) / range) * (h - padding * 2);
        return (
          <g key={val}>
            <line
              x1={padding}
              y1={y}
              x2={w - padding}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="4 4"
            />
            <text
              x={w - padding + 4}
              y={y + 3}
              fill="rgba(255,255,255,0.3)"
              fontSize="10"
            >
              {val}
            </text>
          </g>
        );
      })}

      {/* Line */}
      <path d={pathD} fill="none" stroke="#7a40f2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Area fill */}
      <path
        d={`${pathD} L ${points[points.length - 1].x} ${h - padding} L ${points[0].x} ${h - padding} Z`}
        fill="url(#labChartGradient)"
      />

      <defs>
        <linearGradient id="labChartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a40f2" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7a40f2" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Dots */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#7a40f2" />
          <circle cx={p.x} cy={p.y} r="2" fill="#fff" />
        </g>
      ))}
    </svg>
  );
}
