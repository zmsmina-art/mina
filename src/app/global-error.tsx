'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#050505', fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <h1 style={{ color: '#f5f5f5', fontSize: '1.5rem', margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '0.875rem', marginTop: '0.75rem' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.25rem',
              fontSize: '0.875rem',
              color: '#f5f5f5',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.5)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
