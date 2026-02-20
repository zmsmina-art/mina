import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/* ------------------------------------------------------------------ */
/*  Shared background / chrome used by both branded templates          */
/* ------------------------------------------------------------------ */

function BrandedShell({
  children,
  label,
  url,
}: {
  children: React.ReactNode;
  label: string;
  url: string;
}) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#080510',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow effects */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '-80px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-60px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          display: 'flex',
        }}
      />

      {/* Top gradient line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background:
            'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.5) 40%, rgba(122,64,242,0.4) 60%, transparent 90%)',
          display: 'flex',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          padding: '60px 80px',
          textAlign: 'center',
        }}
      >
        {children}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 80px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ fontSize: 16, color: '#8578a0', display: 'flex' }}>
          {url}
        </div>
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '8px 20px',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            color: '#f0edf5',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get('title');
  const excerpt = searchParams.get('excerpt');
  const type = searchParams.get('type');

  // Article-specific OG image
  if (title) {
    return new ImageResponse(
      (
        <BrandedShell label="Read" url="minamankarious.com">
          {/* mm. mark — smaller for article cards */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'rgba(240, 237, 245, 0.4)',
              display: 'flex',
              marginBottom: 24,
            }}
          >
            mm.
          </div>

          {/* Article title */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#f0edf5',
              lineHeight: 1.2,
              maxWidth: 900,
              display: 'flex',
              textAlign: 'center',
            }}
          >
            {title.length > 80 ? title.slice(0, 80) + '...' : title}
          </div>

          {excerpt && (
            <div
              style={{
                fontSize: 22,
                color: '#8578a0',
                marginTop: 20,
                lineHeight: 1.5,
                maxWidth: 700,
                display: 'flex',
                textAlign: 'center',
              }}
            >
              {excerpt.length > 120
                ? excerpt.slice(0, 120) + '...'
                : excerpt}
            </div>
          )}

          {/* Author line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 32,
            }}
          >
            <div
              style={{
                fontSize: 14,
                letterSpacing: '0.1em',
                color: '#D4AF37',
                display: 'flex',
              }}
            >
              Mina Mankarious
            </div>
          </div>
        </BrandedShell>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Newsletter page
  if (type === 'newsletter') {
    return new ImageResponse(
      (
        <BrandedShell label="Subscribe" url="minamankarious.com/newsletter">
          <div
            style={{
              fontSize: 120,
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: '#f0edf5',
              display: 'flex',
              marginBottom: 8,
            }}
          >
            mm.
          </div>

          <div
            style={{
              width: 80,
              height: 1,
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(124,58,237,0.3), transparent)',
              marginBottom: 32,
              display: 'flex',
            }}
          />

          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: '#f0edf5',
              lineHeight: 1.3,
              maxWidth: 700,
              display: 'flex',
              textAlign: 'center',
            }}
          >
            Entrepreneurship, marketing, and building businesses worth talking
            about.
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 40,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '0.2em',
                color: '#D4AF37',
                textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              Newsletter
            </div>
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.3)',
                display: 'flex',
              }}
            />
            <div
              style={{
                fontSize: 14,
                letterSpacing: '0.1em',
                color: '#8578a0',
                display: 'flex',
              }}
            >
              by Mina Mankarious
            </div>
          </div>
        </BrandedShell>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Default: branded mm. OG image for all pages
  return new ImageResponse(
    (
      <BrandedShell label="Visit" url="minamankarious.com">
        <div
          style={{
            fontSize: 120,
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: '#f0edf5',
            display: 'flex',
            marginBottom: 8,
          }}
        >
          mm.
        </div>

        <div
          style={{
            width: 80,
            height: 1,
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(124,58,237,0.3), transparent)',
            marginBottom: 32,
            display: 'flex',
          }}
        />

        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: '#f0edf5',
            display: 'flex',
            marginBottom: 12,
          }}
        >
          Mina Mankarious
        </div>

        <div
          style={{
            fontSize: 22,
            color: '#D4AF37',
            display: 'flex',
            marginBottom: 8,
          }}
        >
          Founder & CEO of Olunix
        </div>

        <div
          style={{
            fontSize: 18,
            color: '#8578a0',
            display: 'flex',
            maxWidth: 600,
            textAlign: 'center',
            lineHeight: 1.5,
            marginTop: 16,
          }}
        >
          Helping AI startups with positioning, marketing systems, and practical
          growth strategy.
        </div>
      </BrandedShell>
    ),
    { width: 1200, height: 630 }
  );
}
