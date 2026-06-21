import { motionDelay } from '@/lib/utils';
import MmSignature from '@/components/MmSignature';
import NowChip from '@/components/home/NowChip';
import HeroMorph from '@/components/home/HeroMorph';

const heroLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mina-mankarious' },
  { label: 'Boardy', href: 'https://boardy.ai' },
  { label: 'Olunix', href: 'https://olunix.com' },
];

export default function HomeHero() {
  return (
    <section id="hero" data-section-theme="hero" className="hero-stage page-gutter">
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
                className="ghost-btn"
              >
                {link.label}
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
