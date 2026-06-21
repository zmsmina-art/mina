import { motionDelay } from '@/lib/utils';
import MmSignature from '@/components/MmSignature';
import NowChip from '@/components/home/NowChip';
import HeroMorph from '@/components/home/HeroMorph';
import HeroFlowField from '@/components/home/HeroFlowField';

const heroLinks: {
  label: string;
  href: string;
  variant: 'linkedin' | 'boardy' | 'olunix';
}[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mina-mankarious', variant: 'linkedin' },
  { label: 'Boardy', href: 'https://boardy.ai', variant: 'boardy' },
  { label: 'Olunix', href: 'https://olunix.com', variant: 'olunix' },
];

function HeroLogo({ variant }: { variant: 'linkedin' | 'boardy' | 'olunix' }) {
  if (variant === 'linkedin') {
    return (
      <svg className="hero-logo-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
        />
      </svg>
    );
  }
  if (variant === 'boardy') {
    /* eslint-disable-next-line @next/next/no-img-element */
    return <img className="hero-logo-img hero-logo-img--boardy" src="/boardy-logo.png" alt="" aria-hidden="true" />;
  }
  /* eslint-disable-next-line @next/next/no-img-element */
  return <img className="hero-logo-img hero-logo-img--olunix" src="/olunix.svg" alt="" aria-hidden="true" />;
}

export default function HomeHero() {
  return (
    <section id="hero" data-section-theme="hero" className="hero-stage page-gutter">
      <div className="hero-liquid" aria-hidden="true">
        <span className="hero-liquid-satin" />
        <span className="hero-liquid-core" />
      </div>
      <HeroFlowField />
      <div className="hero-deco" aria-hidden="true">
        <span className="hero-ring hero-ring--1" />
        <span className="hero-ring hero-ring--2" />
        <span className="hero-ring hero-ring--3" />
        <span className="hero-vlabel hero-vlabel--left">Est. Toronto — Canada</span>
        <span className="hero-vlabel hero-vlabel--right">Systems · Story · Execution</span>
        <span className="hero-plus hero-plus--a">+</span>
        <span className="hero-plus hero-plus--b">+</span>
        <span className="hero-plus hero-plus--c">+</span>
      </div>

      <div className="hero-frame">
        <span className="hero-corner hero-corner--tl" aria-hidden="true" />
        <span className="hero-corner hero-corner--tr" aria-hidden="true" />
        <span className="hero-corner hero-corner--bl" aria-hidden="true" />
        <span className="hero-corner hero-corner--br" aria-hidden="true" />
        <div className="hero-rule hero-rule--top">
          <span className="hero-meta" data-motion="fade" style={motionDelay(40)}>
            Founder &amp; Builder
          </span>
          <span className="hero-meta hero-meta--muted" data-motion="fade" style={motionDelay(90)}>
            Portfolio — 2026
          </span>
        </div>

        <div className="hero-center">
          <p className="hero-kicker" data-motion="rise" style={motionDelay(120)}>
            Deal Partner PM, Boardy &nbsp;&middot;&nbsp; Founder, Olunix
          </p>

          <div className="hero-mark" data-motion="rise" style={motionDelay(160)}>
            <div className="hero-mark-inner">
              <MmSignature />
            </div>
          </div>
          <HeroMorph />

          <h1 className="hero-name" data-motion="rise" style={motionDelay(340)}>
            Mina Mankarious
          </h1>

          <p className="hero-lead" data-motion="rise" style={motionDelay(440)}>
            Running the Deal Partner program at Boardy. Founder of Olunix, helping
            technical founders find commercial traction.
          </p>

          <div className="hero-actions" data-motion="rise" style={motionDelay(540)}>
            {heroLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`hero-logo-btn hero-logo-btn--${link.variant}`}
                aria-label={link.label}
              >
                <span className="hero-logo-glow" aria-hidden="true" />
                <span className="hero-logo-mark">
                  <HeroLogo variant={link.variant} />
                </span>
                <span className="hero-logo-label">{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="hero-ticker" aria-hidden="true">
          <div className="hero-ticker-track">
            {Array.from({ length: 2 }).map((_, g) => (
              <span className="hero-ticker-group" key={g}>
                <span>Positioning</span>
                <span className="hero-ticker-dot">/</span>
                <span>Founder-Led Growth</span>
                <span className="hero-ticker-dot">/</span>
                <span>Marketing Systems</span>
                <span className="hero-ticker-dot">/</span>
                <span>AI Startups</span>
                <span className="hero-ticker-dot">/</span>
                <span>Execution</span>
                <span className="hero-ticker-dot">/</span>
              </span>
            ))}
          </div>
        </div>

        <div className="hero-rule hero-rule--bottom">
          <NowChip />
          <a href="#experience" className="hero-scroll" aria-label="Scroll to experience">
            <span>Scroll</span>
            <span className="hero-scroll-line" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
