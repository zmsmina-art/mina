import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
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
          {title ? (
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: '#f0f0f5',
                marginBottom: 24,
                display: 'flex',
                lineClamp: 3,
              }}
            >
              {title}
            </div>
          ) : (
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
          )}
          <div
            style={{
              fontSize: title ? 24 : 32,
              color: '#8b5cf6',
              marginBottom: 12,
              display: 'flex',
            }}
          >
            {title ? 'Mina Mankarious' : 'Founder & CEO of Olunix'}
          </div>
          <div
            style={{
              fontSize: title ? 20 : 24,
              color: '#6a6a7a',
              display: 'flex',
            }}
          >
            {title ? 'minamankarious.com' : 'Marketing & Consulting'}
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
