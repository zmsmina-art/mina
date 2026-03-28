import Image from 'next/image';
import { MapPin } from 'lucide-react';
import CardGlow from '@/components/ui/card-glow';
import { motionDelay } from '@/lib/utils';
import HeroBookingTrigger from '@/components/home/HeroBookingTrigger';
import HeroTimeline from '@/components/home/HeroTimeline';

const heroStats = [
  { label: 'Current Firm', value: 'Olunix' },
  { label: 'Primary Lens', value: 'Systems + Story' },
  { label: 'Client Stage', value: 'Seed to Growth' },
];


export default function HomeHero() {
  return (
    <section id="hero" data-section-theme="hero" className="section-hero page-gutter command-section">
      <HeroTimeline />
      <div className="command-grid" aria-hidden="true" />

      <div className="mx-auto grid min-h-[calc(100vh-160px)] w-full max-w-7xl grid-cols-1 gap-10 py-10 md:grid-cols-12 md:items-center md:gap-8 md:py-12 lg:gap-12">
        <div className="relative z-[2] md:col-span-7 lg:col-span-8">
          <p className="command-kicker" data-motion="rise" style={motionDelay(70)}>
            Founder &amp; Builder
          </p>

          <h1 className="hero-wordmark-stack mt-5">
            <span className="hero-line hero-wordmark-row hero-wordmark-row--top" data-motion="wordmark" style={motionDelay(130)}>
              <span className="masthead">mina</span>
            </span>
            <span className="hero-line hero-wordmark-row hero-wordmark-row--bottom" data-motion="wordmark" style={motionDelay(220)}>
              <span className="masthead">mankarious</span>
            </span>
          </h1>

          <p className="hero-role mt-6 text-xs lowercase tracking-[0.2em] text-[var(--text-muted)] md:mt-8 md:text-sm" data-motion="rise" style={motionDelay(320)}>
            Founder &amp; CEO, Olunix
          </p>

          <p className="hero-lead mt-4 max-w-3xl text-lg leading-relaxed text-[var(--text-primary)] md:text-2xl" data-motion="rise" style={motionDelay(420)}>
            Helping AI startups turn technical products into clear market narratives, founder-led demand, and operating systems that compound.
          </p>

          <div className="mt-7 flex w-full max-w-sm flex-wrap items-center gap-3 sm:max-w-none" data-motion="rise" style={motionDelay(510)}>
            <HeroBookingTrigger />

            <a
              href="https://www.linkedin.com/in/mina-mankarious"
              target="_blank"
              rel="noopener noreferrer"
              className="ghost-btn w-full justify-center sm:w-auto"
            >
              LinkedIn
            </a>
            <a
              href="https://olunix.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ghost-btn w-full justify-center sm:w-auto"
            >
              <Image
                src="/olunix.svg"
                alt="Olunix logo"
                width={14}
                height={14}
                className="h-[14px] w-[14px] object-contain"
              />
              Olunix
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3" data-motion="rise" style={motionDelay(610)}>
            {heroStats.map((item) => (
              <article key={item.label} className="stat-card relative overflow-hidden">
                <CardGlow spread={14} proximity={42} borderWidth={1.1} />
                <div className="relative z-[1]">
                  <p className="stat-value">{item.value}</p>
                  <p className="stat-label">{item.label}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="command-aside md:col-span-5 lg:col-span-4" data-motion="sweep-right" style={motionDelay(360)}>
          <div className="command-aside-frame">
            <Image
              src="/headshot.webp"
              alt="Mina Mankarious"
              width={320}
              height={420}
              className="block h-auto w-full object-cover object-top"
              sizes="(max-width: 768px) 100vw, 320px"
              priority
            />
          </div>

          <div className="mt-5 space-y-4">
            <p className="text-site-kicker lowercase tracking-[0.18em] text-[var(--text-dim)]">Quick bio</p>
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">
              Engineering-trained operator translating technical depth into positioning clarity and market traction for AI startups.
            </p>
            <div className="space-y-2 border-t border-[var(--stroke-soft)] pt-4 text-xs text-[var(--text-muted)]">
              <p className="flex items-center justify-between gap-4">
                <span>Role</span>
                <span className="text-[var(--text-primary)]">Founder / CEO</span>
              </p>
              <p className="flex items-center justify-between gap-4">
                <span>Coverage</span>
                <span className="text-[var(--text-primary)]">North America & Europe</span>
              </p>
              <p className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} />
                  Location
                </span>
                <span className="text-[var(--text-primary)]">Toronto, Canada</span>
              </p>
            </div>
          </div>
        </aside>
      </div>

    </section>
  );
}
