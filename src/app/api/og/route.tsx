import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/* ------------------------------------------------------------------ */
/*  Font loading — fetched once at edge cold-start, then cached        */
/* ------------------------------------------------------------------ */

const cormorantRegular = fetch(
  new URL('https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86GnM.ttf')
).then((res) => res.arrayBuffer());

const cormorantSemiBold = fetch(
  new URL('https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_iE9GnM.ttf')
).then((res) => res.arrayBuffer());

const cormorantItalic = fetch(
  new URL('https://fonts.gstatic.com/s/cormorantgaramond/v21/co3smX5slCNuHLi8bLeY9MK7whWMhyjYrGFEsdtdc62E6zd58jDOjw.ttf')
).then((res) => res.arrayBuffer());

const dmSansBlack = fetch(
  new URL('https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAC5thTg.ttf')
).then((res) => res.arrayBuffer());

/* ------------------------------------------------------------------ */
/*  Dark atmospheric shell (default + newsletter)                      */
/* ------------------------------------------------------------------ */

function DarkShell({
  children,
  footerLeft,
  footerRight,
}: {
  children: React.ReactNode;
  footerLeft: string;
  footerRight: string;
}) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: '#050505',
      }}
    >
      {/* Deep atmospheric gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          background:
            'radial-gradient(ellipse 130% 80% at 10% 15%, rgba(255,255,255,0.09), transparent 60%), ' +
            'radial-gradient(ellipse 120% 70% at 92% 10%, rgba(122,64,242,0.18), transparent 55%), ' +
            'radial-gradient(ellipse 100% 100% at 50% 110%, rgba(12,12,12,0.8), transparent 70%), ' +
            'linear-gradient(162deg, #050505 0%, #0a0a0a 40%, #110a1a 100%)',
        }}
      />

      {/* Purple glow bloom — top right */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-40px',
          width: '500px',
          height: '400px',
          display: 'flex',
          background: 'radial-gradient(ellipse at center, rgba(176,137,255,0.12), transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* White glow bloom — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-20px',
          width: '400px',
          height: '350px',
          display: 'flex',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05), transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Top luminous accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          display: 'flex',
          background:
            'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.6) 30%, rgba(176,137,255,0.5) 60%, transparent 95%)',
        }}
      />

      {/* Decorative vertical line — left */}
      <div
        style={{
          position: 'absolute',
          top: '48px',
          left: '72px',
          width: '1px',
          height: '100px',
          display: 'flex',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(176,137,255,0.2), transparent)',
        }}
      />

      {/* Decorative corner — bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: '72px',
          right: '72px',
          width: '60px',
          height: '60px',
          display: 'flex',
          borderRight: '1px solid rgba(255,255,255,0.12)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          padding: '64px 96px 48px',
          position: 'relative',
        }}
      >
        {children}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '22px 96px 28px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '96px',
            right: '96px',
            height: '1px',
            display: 'flex',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.06))',
          }}
        />
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)', display: 'flex', letterSpacing: '0.02em' }}>
          {footerLeft}
        </div>
        <div style={{ display: 'flex', fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
          {footerRight}
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

  const [cormorantRegularData, cormorantSemiBoldData, cormorantItalicData, dmSansBlackData] =
    await Promise.all([cormorantRegular, cormorantSemiBold, cormorantItalic, dmSansBlack]);

  const darkFonts = [
    { name: 'Cormorant', data: cormorantSemiBoldData, weight: 600 as const },
    { name: 'Cormorant', data: cormorantRegularData, weight: 400 as const },
  ];

  const articleFonts = [
    { name: 'DMSans', data: dmSansBlackData, weight: 900 as const, style: 'normal' as const },
    { name: 'CormorantItalic', data: cormorantItalicData, weight: 400 as const, style: 'italic' as const },
    { name: 'Cormorant', data: cormorantRegularData, weight: 400 as const },
  ];

  /* ---- Article OG — light editorial style ---- */
  if (title) {
    const displayTitle = (title.length > 68 ? title.slice(0, 68) + '\u2026' : title).toLowerCase();
    const displayExcerpt = excerpt
      ? excerpt.length > 100
        ? excerpt.slice(0, 100) + '\u2026'
        : excerpt
      : null;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #e4e0dc 0%, #d8d0e0 50%, #c8b8db 100%)',
          }}
        >
          {/* Decorative large "mm" watermark — right side */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '-30px',
              display: 'flex',
              transform: 'translateY(-50%)',
              fontSize: 420,
              fontFamily: 'CormorantItalic',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'rgba(160,130,190,0.18)',
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
            }}
          >
            mm
          </div>

          {/* Content area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              padding: '72px 88px',
              position: 'relative',
            }}
          >
            {/* "mm. journal" kicker */}
            <div
              style={{
                fontSize: 24,
                fontFamily: 'CormorantItalic',
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#3a3a3a',
                display: 'flex',
                marginBottom: 24,
                letterSpacing: '0.02em',
              }}
            >
              mm. journal
            </div>

            {/* Title — bold black sans-serif */}
            <div
              style={{
                fontSize: 64,
                fontFamily: 'DMSans',
                fontWeight: 900,
                color: '#111111',
                lineHeight: 1.05,
                maxWidth: 820,
                display: 'flex',
                letterSpacing: '-0.02em',
              }}
            >
              {displayTitle}
            </div>

            {/* Excerpt — italic serif */}
            {displayExcerpt && (
              <div
                style={{
                  fontSize: 22,
                  fontFamily: 'CormorantItalic',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: '#4a4a4a',
                  marginTop: 28,
                  lineHeight: 1.45,
                  maxWidth: 680,
                  display: 'flex',
                }}
              >
                {displayExcerpt}
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 88px 28px',
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontFamily: 'CormorantItalic',
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#6a6a6a',
                display: 'flex',
                letterSpacing: '0.02em',
              }}
            >
              Mina Mankarious
            </div>
            <div
              style={{
                fontSize: 14,
                fontFamily: 'Cormorant',
                fontWeight: 400,
                color: '#8a8a8a',
                display: 'flex',
                letterSpacing: '0.04em',
              }}
            >
              minamankarious.com
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts: articleFonts }
    );
  }

  /* ---- Newsletter OG ---- */
  if (type === 'newsletter') {
    return new ImageResponse(
      (
        <DarkShell footerLeft="minamankarious.com/newsletter" footerRight="SUBSCRIBE">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                display: 'flex',
                background: 'rgba(176,137,255,0.7)',
                transform: 'rotate(45deg)',
              }}
            />
            <div
              style={{
                fontSize: 16,
                fontFamily: 'Cormorant',
                fontWeight: 400,
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.55)',
                display: 'flex',
              }}
            >
              Newsletter
            </div>
          </div>

          <div
            style={{
              fontSize: 52,
              fontFamily: 'Cormorant',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.12,
              maxWidth: 820,
              display: 'flex',
              letterSpacing: '0.005em',
            }}
          >
            Entrepreneurship, marketing, and building businesses worth talking about.
          </div>

          <div
            style={{
              fontSize: 19,
              fontFamily: 'Cormorant',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.35)',
              marginTop: 32,
              display: 'flex',
            }}
          >
            by Mina Mankarious
          </div>
        </DarkShell>
      ),
      { width: 1200, height: 630, fonts: darkFonts }
    );
  }

  /* ---- Default / Profile OG ---- */
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#060606',
        }}
      >
        {/* Background atmosphere */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              'radial-gradient(ellipse 90% 80% at 30% 50%, rgba(255,255,255,0.04), transparent 70%), ' +
              'radial-gradient(ellipse 60% 90% at 85% 30%, rgba(176,137,255,0.08), transparent 60%)',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            display: 'flex',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(176,137,255,0.6) 20%, rgba(255,255,255,0.5) 50%, rgba(176,137,255,0.4) 80%, transparent 100%)',
          }}
        />

        {/* Left column — text content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            padding: '72px 0 72px 80px',
            position: 'relative',
          }}
        >
          {/* Kicker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 28,
                height: '1px',
                display: 'flex',
                background: 'rgba(176,137,255,0.6)',
              }}
            />
            <div
              style={{
                fontSize: 14,
                fontFamily: 'Cormorant',
                fontWeight: 400,
                letterSpacing: '0.18em',
                color: 'rgba(176,137,255,0.7)',
                display: 'flex',
                textTransform: 'uppercase',
              }}
            >
              Founder & CEO
            </div>
          </div>

          {/* Name — two lines */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontFamily: 'Cormorant',
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.0,
                letterSpacing: '-0.01em',
                display: 'flex',
              }}
            >
              Mina
            </div>
            <div
              style={{
                fontSize: 72,
                fontFamily: 'Cormorant',
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.0,
                letterSpacing: '-0.01em',
                display: 'flex',
              }}
            >
              Mankarious
            </div>
          </div>

          {/* Separator */}
          <div
            style={{
              width: 48,
              height: '1px',
              display: 'flex',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(176,137,255,0.3))',
              marginTop: 28,
              marginBottom: 24,
            }}
          />

          {/* Description */}
          <div
            style={{
              fontSize: 20,
              fontFamily: 'Cormorant',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.5,
              maxWidth: 440,
              display: 'flex',
            }}
          >
            Helping AI startups with positioning, growth systems, and founder-led marketing.
          </div>

          {/* Bottom meta */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: 36,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontFamily: 'Cormorant',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.25)',
                display: 'flex',
                letterSpacing: '0.06em',
              }}
            >
              minamankarious.com
            </div>
            <div
              style={{
                width: 3,
                height: 3,
                display: 'flex',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
              }}
            />
            <div
              style={{
                fontSize: 14,
                fontFamily: 'Cormorant',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.25)',
                display: 'flex',
                letterSpacing: '0.06em',
              }}
            >
              Toronto, Canada
            </div>
          </div>
        </div>

        {/* Right column — headshot */}
        <div
          style={{
            display: 'flex',
            width: '420px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Gradient overlay on photo edge */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '120px',
              display: 'flex',
              background: 'linear-gradient(90deg, #060606, transparent)',
              zIndex: 2,
            }}
          />
          {/* Bottom fade */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '160px',
              display: 'flex',
              background: 'linear-gradient(0deg, #060606, transparent)',
              zIndex: 2,
            }}
          />
          {/* Top fade */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '80px',
              display: 'flex',
              background: 'linear-gradient(180deg, #060606 0%, transparent 100%)',
              zIndex: 2,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://minamankarious.com/headshot.jpg"
            alt=""
            width={420}
            height={630}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: darkFonts }
  );
}
