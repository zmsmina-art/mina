'use client';

import { Flame } from 'lucide-react';
import { T, sectionLabel, glassCard, mono, heading } from '@/lib/brief-styles';
import type { FitnessSplit, FitnessLog } from '@/lib/school-events';

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const pct = total === 0 ? 0 : completed / total;
  const r = 36, stroke = 6, circ = 2 * Math.PI * r;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke={T.borderDefault} strokeWidth={stroke} />
      <circle cx="44" cy="44" r={r} fill="none" stroke={T.gold} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" transform="rotate(-90 44 44)" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      <text x="44" y="48" textAnchor="middle" fill={T.textPrimary} fontSize="16" fontWeight="600"
        fontFamily="var(--font-jetbrains-mono), monospace">{completed}/{total}</text>
    </svg>
  );
}

export default function FitnessClient({ splits, weekLogs, streak }: { splits: FitnessSplit[]; weekLogs: FitnessLog[]; streak: number }) {
  const completedSplitIds = new Set(weekLogs.map((l) => l.splitId));
  const completed = completedSplitIds.size;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={sectionLabel}>Field Readiness</div>
        <h2 style={heading}>Physical Programme</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <ProgressRing completed={completed} total={splits.length} />
        <div>
          <p style={{ fontSize: '14px', color: T.textSecondary }}>
            {completed} of {splits.length} protocols completed this week
          </p>
          {streak > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <Flame size={16} style={{ color: T.gold }} />
              <span style={{ ...mono, fontSize: '14px', color: T.gold, fontWeight: 500 }}>{streak}-week streak</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {splits.map((split) => {
          const done = completedSplitIds.has(split.id);
          return (
            <div key={split.id} style={{ ...glassCard, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: done ? T.textMuted : T.textPrimary, textDecoration: done ? 'line-through' : 'none' }}>
                {split.name}
              </span>
              <span style={{ ...mono, fontSize: '11px', color: done ? T.statusGreen : T.textMuted }}>
                {done ? 'COMPLETE' : 'PENDING'}
              </span>
            </div>
          );
        })}
        {splits.length === 0 && (
          <div style={glassCard}>
            <p style={{ fontSize: '14px', color: T.textMuted, fontStyle: 'italic' }}>
              No training protocols configured, sir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
