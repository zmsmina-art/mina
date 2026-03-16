'use client';

import { useState, useEffect, useCallback } from 'react';
import { T, sectionLabel, glassCard, mono, heading } from '@/lib/brief-styles';
import { PHASES, QUICK_REFERENCE } from '@/lib/fan-controller-data';
import type { Phase, Register, PinMapping } from '@/lib/fan-controller-data';

const STORAGE_KEY = 'hcs12-fan-controller-progress';

interface ProgressState {
  completedPhases: string[];
  expandedPhases: string[];
  lastUpdated: string;
}

const defaultProgress: ProgressState = {
  completedPhases: [],
  expandedPhases: [],
  lastUpdated: new Date().toISOString(),
};

// ── Styles ──────────────────────────────────────────

const badge = (complete: boolean): React.CSSProperties => ({
  ...mono,
  fontSize: '10px',
  padding: '2px 10px',
  borderRadius: '9999px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  background: complete ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)',
  color: complete ? '#4ade80' : T.textMuted,
});

const codeBlock: React.CSSProperties = {
  ...mono,
  fontSize: '12px',
  lineHeight: 1.6,
  background: T.surface,
  borderLeft: `3px solid ${T.gold}`,
  borderRadius: '4px',
  padding: '16px',
  overflowX: 'auto',
  whiteSpace: 'pre',
  color: T.textPrimary,
  margin: 0,
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '12px',
};

const thStyle: React.CSSProperties = {
  ...mono,
  textAlign: 'left',
  padding: '8px 10px',
  borderBottom: `1px solid ${T.borderDefault}`,
  color: T.goldDim,
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontWeight: 500,
};

const tdStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderBottom: `1px solid ${T.borderDefault}`,
  color: T.textSecondary,
  fontSize: '12px',
};

const subHeading: React.CSSProperties = {
  ...mono,
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: T.goldDim,
  marginBottom: '8px',
  marginTop: '16px',
};

// ── Components ──────────────────────────────────────

function ProgressHeader({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div style={{ ...glassCard, marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ ...mono, fontSize: '13px', color: T.textPrimary }}>
          {completed}/{total} phases complete
        </span>
        <span style={{ ...mono, fontSize: '12px', color: T.goldDim }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: T.gold,
            borderRadius: '3px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  );
}

function RegisterTable({ registers }: { registers: Register[] }) {
  if (registers.length === 0) return null;
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={subHeading}>Registers</div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Register</th>
            <th style={thStyle}>Address</th>
            <th style={thStyle}>Value</th>
            <th style={thStyle}>Purpose</th>
          </tr>
        </thead>
        <tbody>
          {registers.map((r) => (
            <tr key={r.name}>
              <td style={{ ...tdStyle, ...mono, color: T.gold }}>{r.name}</td>
              <td style={{ ...tdStyle, ...mono }}>{r.address}</td>
              <td style={{ ...tdStyle, ...mono }}>{r.value}</td>
              <td style={tdStyle}>{r.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeSection({ code }: { code: string }) {
  if (!code.trim()) return null;
  return (
    <div>
      <div style={subHeading}>Code</div>
      <pre style={codeBlock}>{code}</pre>
    </div>
  );
}

function WiringSection({ wiring }: { wiring: string[] }) {
  return (
    <div>
      <div style={subHeading}>Wiring</div>
      <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {wiring.map((w, i) => (
          <li key={i} style={{ fontSize: '13px', color: T.textSecondary, lineHeight: 1.5 }}>{w}</li>
        ))}
      </ul>
    </div>
  );
}

function TestSection({ steps }: { steps: string[] }) {
  return (
    <div>
      <div style={subHeading}>Test Procedure</div>
      <ol style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {steps.map((s, i) => {
          // Section headers start with ──
          if (s.startsWith('──')) {
            return (
              <li key={i} style={{ listStyle: 'none', marginLeft: '-18px', marginTop: '8px', ...mono, fontSize: '11px', color: T.goldDim }}>
                {s}
              </li>
            );
          }
          return (
            <li key={i} style={{ fontSize: '13px', color: T.textSecondary, lineHeight: 1.5 }}>{s}</li>
          );
        })}
      </ol>
    </div>
  );
}

function PhaseCard({
  phase,
  expanded,
  completed,
  onToggleExpand,
  onToggleComplete,
}: {
  phase: Phase;
  expanded: boolean;
  completed: boolean;
  onToggleExpand: () => void;
  onToggleComplete: () => void;
}) {
  return (
    <div style={glassCard}>
      {/* Header — clickable to expand */}
      <div
        onClick={onToggleExpand}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
      >
        <span style={{ ...mono, fontSize: '13px', color: T.gold, flexShrink: 0 }}>
          {expanded ? '▾' : '▸'} Phase {phase.number}
        </span>
        <span style={{ fontSize: '14px', color: T.textPrimary, fontWeight: 500, flex: 1 }}>
          {phase.title}
        </span>
        <span style={badge(completed)}>{completed ? 'complete' : 'pending'}</span>
      </div>

      {/* Module label */}
      <div style={{ ...mono, fontSize: '11px', color: T.textMuted, marginTop: '6px', marginLeft: '28px' }}>
        {phase.module}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Objectives */}
          <div>
            <div style={subHeading}>Objectives</div>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {phase.objectives.map((o, i) => (
                <li key={i} style={{ fontSize: '13px', color: T.textSecondary, lineHeight: 1.5 }}>{o}</li>
              ))}
            </ul>
          </div>

          <RegisterTable registers={phase.registers} />
          <CodeSection code={phase.code} />
          <WiringSection wiring={phase.wiring} />
          <TestSection steps={phase.testSteps} />

          {/* Completion toggle */}
          <div style={{ borderTop: `1px solid ${T.borderDefault}`, paddingTop: '12px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
              style={{
                ...mono,
                fontSize: '12px',
                padding: '8px 20px',
                borderRadius: '4px',
                border: `1px solid ${completed ? 'rgba(74,222,128,0.3)' : T.borderGold}`,
                background: completed ? 'rgba(74,222,128,0.1)' : 'transparent',
                color: completed ? '#4ade80' : T.gold,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {completed ? '✓ Marked Complete' : 'Mark Complete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickReferencePanel() {
  const [open, setOpen] = useState(false);
  const qr = QUICK_REFERENCE;

  return (
    <div style={{ ...glassCard, marginBottom: '20px' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
      >
        <span style={{ ...mono, fontSize: '13px', color: T.gold }}>{open ? '▾' : '▸'}</span>
        <span style={{ fontSize: '14px', color: T.textPrimary, fontWeight: 500 }}>Quick Reference</span>
        <span style={{ ...mono, fontSize: '11px', color: T.textMuted }}>Pin Map · Registers · Memory</span>
      </div>

      {open && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Pin Map */}
          <div style={{ overflowX: 'auto' }}>
            <div style={subHeading}>Pin Map</div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Pin</th>
                  <th style={thStyle}>Function</th>
                  <th style={thStyle}>Dir</th>
                  <th style={thStyle}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {qr.pinMap.map((p: PinMapping) => (
                  <tr key={p.pin}>
                    <td style={{ ...tdStyle, ...mono, color: T.gold }}>{p.pin}</td>
                    <td style={tdStyle}>{p.function}</td>
                    <td style={{ ...tdStyle, ...mono }}>{p.direction}</td>
                    <td style={tdStyle}>{p.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Registers */}
          <div style={{ overflowX: 'auto' }}>
            <div style={subHeading}>Key Registers</div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Register</th>
                  <th style={thStyle}>Address</th>
                  <th style={thStyle}>Description</th>
                </tr>
              </thead>
              <tbody>
                {qr.keyRegisters.map((r) => (
                  <tr key={r.name}>
                    <td style={{ ...tdStyle, ...mono, color: T.gold }}>{r.name}</td>
                    <td style={{ ...tdStyle, ...mono }}>{r.address}</td>
                    <td style={tdStyle}>{r.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Memory Map */}
          <div style={{ overflowX: 'auto' }}>
            <div style={subHeading}>Memory Map</div>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Region</th>
                  <th style={thStyle}>Range</th>
                  <th style={thStyle}>Usage</th>
                </tr>
              </thead>
              <tbody>
                {qr.memoryMap.map((m) => (
                  <tr key={m.region}>
                    <td style={{ ...tdStyle, ...mono, color: T.gold }}>{m.region}</td>
                    <td style={{ ...tdStyle, ...mono }}>{m.range}</td>
                    <td style={tdStyle}>{m.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Client Component ───────────────────────────

export default function FanControllerClient() {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage
  const persist = useCallback((next: ProgressState) => {
    const updated = { ...next, lastUpdated: new Date().toISOString() };
    setProgress(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, []);

  const toggleExpand = useCallback(
    (id: string) => {
      const expanded = progress.expandedPhases.includes(id)
        ? progress.expandedPhases.filter((p) => p !== id)
        : [...progress.expandedPhases, id];
      persist({ ...progress, expandedPhases: expanded });
    },
    [progress, persist],
  );

  const toggleComplete = useCallback(
    (id: string) => {
      const completed = progress.completedPhases.includes(id)
        ? progress.completedPhases.filter((p) => p !== id)
        : [...progress.completedPhases, id];
      persist({ ...progress, completedPhases: completed });
    },
    [progress, persist],
  );

  if (!hydrated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <div style={sectionLabel}>Field Operations</div>
          <h2 style={heading}>HCS12 Build Guide</h2>
        </div>
        <div style={{ ...glassCard, textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: T.textMuted, ...mono }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={sectionLabel}>Field Operations</div>
        <h2 style={heading}>HCS12 Build Guide</h2>
        <p style={{ fontSize: '13px', color: T.textSecondary, marginTop: '6px', lineHeight: 1.5 }}>
          AUTOTECH 4EC3 — Engine cooling fan controller · EVALH1 + Roboteurs I/O
        </p>
      </div>

      {/* Progress */}
      <ProgressHeader completed={progress.completedPhases.length} total={PHASES.length} />

      {/* Quick Reference */}
      <QuickReferencePanel />

      {/* Phase Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {PHASES.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            expanded={progress.expandedPhases.includes(phase.id)}
            completed={progress.completedPhases.includes(phase.id)}
            onToggleExpand={() => toggleExpand(phase.id)}
            onToggleComplete={() => toggleComplete(phase.id)}
          />
        ))}
      </div>

      {/* Simulator Link */}
      <div style={{ ...glassCard, textAlign: 'center' }}>
        <a
          href="/fan-controller/"
          style={{
            ...mono,
            fontSize: '13px',
            color: T.gold,
            textDecoration: 'none',
            borderBottom: `1px solid ${T.borderGold}`,
            paddingBottom: '2px',
          }}
        >
          Open Web Simulator →
        </a>
        <p style={{ fontSize: '12px', color: T.textMuted, marginTop: '8px' }}>
          Interactive browser-based simulator for algorithm testing
        </p>
      </div>
    </div>
  );
}
