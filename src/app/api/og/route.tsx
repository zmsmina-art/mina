import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get('title');
  const excerpt = searchParams.get('excerpt');

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
            backgroundColor: '#050507',
            padding: '60px 80px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: '#f0f0f5',
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
                  color: '#6a6a7a',
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
                  backgroundColor: '#8b5cf6',
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
                <div style={{ fontSize: 20, fontWeight: 600, color: '#f0f0f5', display: 'flex' }}>
                  Mina Mankarious
                </div>
                <div style={{ fontSize: 16, color: '#8b5cf6', display: 'flex' }}>
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
          backgroundColor: '#050507',
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
              color: '#f0f0f5',
              marginBottom: 16,
              display: 'flex',
            }}
          >
            Mina{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
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
              color: '#8b5cf6',
              marginBottom: 12,
              display: 'flex',
            }}
          >
            Founder & CEO of Olunix
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#6a6a7a',
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
                backgroundColor: '#8b5cf6',
                color: '#fff',
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
                color: '#6a6a7a',
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
              border: '4px solid rgba(139, 92, 246, 0.3)',
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
