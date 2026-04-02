'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const T = {
  elevated: 'rgba(255,255,255,0.025)',
  borderDefault: 'rgba(255,255,255,0.05)',
  gold: '#C9A84C',
  textSecondary: 'rgba(232,228,220,0.55)',
};

export default function BriefAutoSync({ stale }: { stale: boolean }) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!stale || syncing) return;

    let cancelled = false;

    async function sync() {
      setSyncing(true);
      try {
        const res = await fetch('/api/brief/sync', { method: 'POST' });
        if (res.ok && !cancelled) {
          router.refresh();
        }
      } catch {
        // Silent fail — user can manually sync from settings
      } finally {
        if (!cancelled) setSyncing(false);
      }
    }

    sync();

    return () => { cancelled = true; };
  }, [stale]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!syncing) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 50,
        background: T.elevated,
        border: `1px solid ${T.borderDefault}`,
        borderRadius: '4px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: T.gold,
          animation: 'briefPulse 1.5s ease-in-out infinite',
        }}
      />
      <span
        style={{
          fontSize: '12px',
          fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
          color: T.textSecondary,
        }}
      >
        Syncing data...
      </span>
      <style>{`
        @keyframes briefPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
