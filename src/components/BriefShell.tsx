'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Calendar,
  Shield,
  Dumbbell,
  Lightbulb,
  Mic,
  Settings,
} from 'lucide-react';

const T = {
  bg: '#0A0A0C',
  gold: '#C9A84C',
  goldDim: '#8A7233',
  textPrimary: '#E8E4DC',
  textSecondary: 'rgba(232,228,220,0.55)',
  textMuted: 'rgba(232,228,220,0.30)',
  borderDefault: 'rgba(255,255,255,0.05)',
};

const NAV_ITEMS = [
  { href: '/brief', label: 'Daily Briefing', icon: FileText, mobileLabel: 'Briefing' },
  { href: '/brief/schedule', label: 'Schedule', icon: Calendar, mobileLabel: 'Schedule' },
  { href: '/brief/health', label: 'Health', icon: Shield, mobileLabel: 'Health' },
  { href: '/brief/fitness', label: 'Fitness', icon: Dumbbell, mobileLabel: 'Fitness' },
  { href: '/brief/ideas', label: 'Ideas', icon: Lightbulb, mobileLabel: 'Ideas' },
  { href: '/brief/ovix', label: 'Ovix', icon: Mic, mobileLabel: 'Ovix' },
  { href: '/brief/settings', label: 'Settings', icon: Settings, mobileLabel: 'Settings' },
];

const mono: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
};

export default function BriefShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show shell on login page
  if (pathname === '/brief/login') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: T.bg,
          color: T.textPrimary,
          fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.bg,
        color: T.textPrimary,
        fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
        WebkitFontSmoothing: 'antialiased',
        display: 'flex',
      }}
    >
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: '224px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          borderRight: `1px solid ${T.borderDefault}`,
          background: T.bg,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
        className="brief-sidebar"
      >
        <div style={{ padding: '24px 24px 16px' }}>
          <div
            style={{
              ...mono,
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: T.goldDim,
              marginBottom: '4px',
            }}
          >
            Dashboard
          </div>
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 500,
              fontFamily: "var(--font-playfair-display), 'Playfair Display', Georgia, serif",
              color: T.textPrimary,
              letterSpacing: '-0.01em',
            }}
          >
            Command Centre
          </h1>
          <div
            style={{
              width: '32px',
              height: '1px',
              background: T.goldDim,
              marginTop: '12px',
            }}
          />
        </div>

        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/brief'
                ? pathname === '/brief'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                  color: isActive ? T.gold : T.textSecondary,
                  borderLeft: isActive ? `2px solid ${T.gold}` : '2px solid transparent',
                }}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            padding: '16px',
            borderTop: `1px solid ${T.borderDefault}`,
          }}
        >
          <p
            style={{
              ...mono,
              fontSize: '10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: T.textMuted,
            }}
          >
            Mina Mankarious
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, minWidth: 0, paddingBottom: '80px' }}>
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: '24px 16px 0',
          }}
          className="brief-main-content"
        >
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav
        className="brief-mobile-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'rgba(6,6,8,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: `1px solid ${T.borderDefault}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
          }}
        >
          {NAV_ITEMS.filter((t) => t.mobileLabel !== 'Settings').map((tab) => {
            const isActive =
              tab.href === '/brief'
                ? pathname === '/brief'
                : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  textDecoration: 'none',
                  color: isActive ? T.gold : T.textMuted,
                  transition: 'color 0.2s',
                }}
              >
                <tab.icon size={20} />
                {tab.mobileLabel}
              </Link>
            );
          })}
        </div>
      </nav>

      <style>{`
        @media (max-width: 1023px) {
          .brief-sidebar { display: none !important; }
        }
        @media (min-width: 1024px) {
          .brief-mobile-nav { display: none !important; }
          .brief-main-content { padding: 32px 32px 0 !important; }
        }
        @media (max-width: 640px) {
          .brief-imminent-row { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}
