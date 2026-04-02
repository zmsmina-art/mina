import { auth, signIn } from '@/lib/auth-brief';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brief — Sign In',
  robots: { index: false, follow: false },
};

export default async function BriefLoginPage() {
  const session = await auth();
  if (session) redirect('/brief');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '4px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '360px',
          width: '100%',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#8A7233',
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '12px',
          }}
        >
          Dashboard
        </p>
        <h1
          style={{
            fontSize: '24px',
            color: '#E8E4DC',
            fontFamily: "'Playfair Display', Georgia, serif",
            marginBottom: '8px',
          }}
        >
          Daily Briefing
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(232,228,220,0.3)', marginBottom: '32px' }}>
          Sign in to continue.
        </p>
        <form
          action={async () => {
            'use server';
            await signIn('google', { redirectTo: '/brief' });
          }}
        >
          <button
            type="submit"
            style={{
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: '4px',
              padding: '12px 24px',
              color: '#C9A84C',
              fontSize: '13px',
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
