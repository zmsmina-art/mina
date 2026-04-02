'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { T, sectionLabel, glassCard, mono, heading } from '@/lib/brief-styles';

export default function SettingsPage() {
  const router = useRouter();
  const [syncState, setSyncState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  async function handleSync() {
    setSyncState('loading');
    setSyncMessage('');
    try {
      const res = await fetch('/api/brief/sync?force=1', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setSyncState('error');
        setSyncMessage(data.error ?? 'Sync failed');
        return;
      }
      const fetcherResults = data.fetchers ?? {};
      const succeeded = Object.values(fetcherResults).filter((v: unknown) => (v as Record<string, string>).status === 'ok').length;
      const failed = Object.values(fetcherResults).filter((v: unknown) => (v as Record<string, string>).status === 'failed').length;
      setSyncState('success');
      setSyncMessage(`${succeeded} sources synced${failed > 0 ? `, ${failed} failed` : ''}. Synthesis: ${data.synthesis?.status ?? 'unknown'}`);
      router.refresh();
    } catch (e) {
      setSyncState('error');
      setSyncMessage(String(e));
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={sectionLabel}>Configuration</div>
        <h2 style={heading}>Settings</h2>
      </div>

      {/* Data Sync */}
      <div style={{ ...glassCard, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ ...mono, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: T.textMuted, marginBottom: '4px' }}>Data</h3>
          <p style={{ fontSize: '13px', color: T.textSecondary, lineHeight: 1.5 }}>
            Pull latest data from all sources and regenerate the briefing.
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncState === 'loading'}
          style={{
            ...mono,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: syncState === 'loading' ? T.textMuted : T.gold,
            background: 'rgba(201,168,76,0.08)',
            border: `1px solid rgba(201,168,76,0.2)`,
            borderRadius: '4px',
            padding: '10px 20px',
            cursor: syncState === 'loading' ? 'wait' : 'pointer',
            opacity: syncState === 'loading' ? 0.6 : 1,
            transition: 'opacity 0.2s',
            textAlign: 'center',
          }}
        >
          {syncState === 'loading' ? 'Syncing...' : 'Sync All Data'}
        </button>
        {syncMessage && (
          <p
            style={{
              ...mono,
              fontSize: '11px',
              color: syncState === 'error' ? T.statusRed : T.statusGreen,
              lineHeight: 1.4,
            }}
          >
            {syncMessage}
          </p>
        )}
      </div>

      {/* Account */}
      <div style={{ ...glassCard, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ ...mono, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: T.textMuted, marginBottom: '4px' }}>Account</h3>
          <p style={{ fontSize: '14px', color: T.textSecondary }}>Mina Mankarious</p>
          <p style={{ ...mono, fontSize: '12px', color: T.textMuted, marginTop: '2px' }}>zmsmina@gmail.com</p>
        </div>

        <div style={{ width: '100%', height: '1px', background: T.borderDefault }} />

        <button
          onClick={() => signOut({ callbackUrl: '/brief/login' })}
          style={{
            ...mono,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: T.statusRed,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            padding: 0,
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
