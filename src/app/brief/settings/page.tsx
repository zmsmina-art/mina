'use client';

import { signOut } from 'next-auth/react';
import { T, sectionLabel, glassCard, mono, heading } from '@/lib/brief-styles';

export default function SettingsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={sectionLabel}>Configuration</div>
        <h2 style={heading}>Settings</h2>
      </div>

      <div style={{ ...glassCard, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ ...mono, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: T.textMuted, marginBottom: '4px' }}>Operative</h3>
          <p style={{ fontSize: '14px', color: T.textSecondary }}>Mr. Mankarious</p>
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
          Terminate Session
        </button>
      </div>
    </div>
  );
}
