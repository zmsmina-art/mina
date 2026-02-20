import CardGlow from '@/components/ui/card-glow';
import { motionDelay } from '@/lib/utils';


export default function ContactSection() {
  return (
    <section id="contact" data-section-theme="contact" className="command-section page-gutter section-block pb-20 md:pb-28">
      <div className="mx-auto w-full max-w-7xl">
        <p className="command-label" data-motion="sweep-left">
          Contact
        </p>

        <article className="contact-panel relative mt-6 overflow-hidden" data-motion="crescendo" style={motionDelay(120)}>
          <CardGlow />
          <div className="relative z-[1]">
            <p className="text-xs lowercase tracking-[0.16em] text-[var(--text-dim)]">Founder Collaboration</p>
            <h2 className="home-heading-xl mt-4 max-w-3xl text-[clamp(2.1rem,7.8vw,3.4rem)] leading-[1.02] text-[var(--text-primary)]">
              Looking for a strategic growth partner for your AI startup?
            </h2>
            <p className="mt-5 max-w-2xl text-[var(--text-muted)]">
              Share context on your company, stage, and what you need solved. I focus on clarity, leverage, and execution quality.
            </p>
            <a
              href="mailto:mina@olunix.com?subject=Project%20Inquiry%20for%20Mina%20Mankarious"
              className="link-underline mt-8 inline-flex text-xl text-[var(--accent-brass)] transition-colors hover:text-[var(--accent-brass-soft)] sm:text-2xl md:text-3xl"
              data-motion="rise"
              style={motionDelay(230)}
            >
              mina@olunix.com
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
