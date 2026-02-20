import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get('title');
  const excerpt = searchParams.get('excerpt');
  const type = searchParams.get('type');

  // Newsletter-specific branded OG image
  if (type === 'newsletter') {
    return new ImageResponse(
      (
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
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
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
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
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
              background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.5) 40%, rgba(122,64,242,0.4) 60%, transparent 90%)',
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
            {/* mm. brand mark */}
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

            {/* Divider */}
            <div
              style={{
                width: 80,
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(124,58,237,0.3), transparent)',
                marginBottom: 32,
                display: 'flex',
              }}
            />

            {/* Tagline */}
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
              Entrepreneurship, marketing, and building businesses worth talking about.
            </div>

            {/* Newsletter label */}
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
              minamankarious.com/newsletter
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
              Subscribe
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // If title is provided, render an article-specific OG image
  if (title) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#080510',
            padding: '60px 80px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: '#f0edf5',
                lineHeight: 1.2,
                display: 'flex',
              }}
            >
              {title}
            </div>
            {excerpt && (
              <div
                style={{
                  fontSize: 24,
                  color: '#8578a0',
                  marginTop: 24,
                  lineHeight: 1.5,
                  display: 'flex',
                  maxWidth: '900px',
                }}
              >
                {excerpt.length > 140 ? excerpt.slice(0, 140) + '...' : excerpt}
              </div>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                M
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#f0edf5', display: 'flex' }}>
                  Mina Mankarious
                </div>
                <div style={{ fontSize: 16, color: '#D4AF37', display: 'flex' }}>
                  minamankarious.com
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // Default: generic portfolio OG image
  const headshotUrl = 'https://minamankarious.com/headshot.png';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#080510',
          padding: '60px 80px',
        }}
      >
        {/* Left side - Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: '600px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#f0edf5',
              marginBottom: 16,
              display: 'flex',
            }}
          >
            Mina{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                marginLeft: 16,
              }}
            >
              Mankarious
            </span>
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#D4AF37',
              marginBottom: 12,
              display: 'flex',
            }}
          >
            Founder & CEO of Olunix
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#8578a0',
              display: 'flex',
            }}
          >
            Marketing & Consulting
          </div>
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: '#D4AF37',
                color: '#080510',
                padding: '12px 24px',
                borderRadius: 8,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Let&apos;s Connect
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 18,
                color: '#8578a0',
              }}
            >
              minamankarious.com
            </div>
          </div>
        </div>

        {/* Right side - Headshot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
{/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={headshotUrl}
            alt="Mina Mankarious"
            width={380}
            height={380}
            style={{
              borderRadius: '50%',
              border: '4px solid rgba(124, 58, 237, 0.3)',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
