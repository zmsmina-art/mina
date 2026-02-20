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
        backgroundColor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #D4AF37, #f0edf5)',
          display: 'flex',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flex: 1,
          padding: '60px 80px',
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
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)', display: 'flex' }}>
          {url}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 14,
            fontWeight: 500,
            color: '#D4AF37',
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
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
          {/* Author line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: '0.12em',
                color: '#D4AF37',
                textTransform: 'uppercase' as const,
                display: 'flex',
              }}
            >
              Mina Mankarious
            </div>
          </div>

          {/* Article title */}
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.15,
              maxWidth: 900,
              display: 'flex',
              letterSpacing: '-0.02em',
            }}
          >
            {title.length > 80 ? title.slice(0, 80) + '...' : title}
          </div>

          {excerpt && (
            <div
              style={{
                fontSize: 20,
                color: 'rgba(255,255,255,0.45)',
                marginTop: 24,
                lineHeight: 1.6,
                maxWidth: 750,
                display: 'flex',
              }}
            >
              {excerpt.length > 140
                ? excerpt.slice(0, 140) + '...'
                : excerpt}
            </div>
          )}
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
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: '0.12em',
              color: '#D4AF37',
              textTransform: 'uppercase' as const,
              display: 'flex',
              marginBottom: 24,
            }}
          >
            Newsletter
          </div>

          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.15,
              maxWidth: 800,
              display: 'flex',
              letterSpacing: '-0.02em',
            }}
          >
            Entrepreneurship, marketing, and building businesses worth talking about.
          </div>

          <div
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.4)',
              marginTop: 28,
              display: 'flex',
            }}
          >
            by Mina Mankarious
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
            fontSize: 80,
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            display: 'flex',
            marginBottom: 20,
          }}
        >
          mm.
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: '#ffffff',
            display: 'flex',
            marginBottom: 12,
          }}
        >
          Mina Mankarious
        </div>

        <div
          style={{
            fontSize: 20,
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
            color: 'rgba(255,255,255,0.4)',
            display: 'flex',
            maxWidth: 600,
            lineHeight: 1.5,
            marginTop: 12,
          }}
        >
          Helping AI startups with positioning, marketing systems, and practical growth strategy.
        </div>
      </BrandedShell>
    ),
    { width: 1200, height: 630 }
  );
}
