import { Quote } from 'lucide-react';
import CardGlow from '@/components/ui/card-glow';
import { motionDelay } from '@/lib/utils';

const testimonials = [
  {
    metric: 'Full Rebuild',
    quote:
      'Mina rebuilt our entire website and continues to provide after-care support. His attention to detail and commitment to delivering a polished product exceeded expectations.',
    name: 'Founder & CEO',
    company: 'Reefers Technologies',
  },
  {
    metric: '5M+ views',
    quote:
      'Mina developed a TikTok growth strategy that generated over five million views. He understood our brand voice and translated it into content that actually resonated with the audience.',
    name: 'Founder',
    company: 'Xpomo',
  },
  {
    metric: 'Qualified Leads',
    quote:
      'From Google Ads to network connections, Mina brought in qualified leads and helped us build the right pipeline. He goes beyond the deliverable and genuinely invests in your growth.',
    name: 'Founder & Owner',
    company: 'Wize Consulting',
  },
];

export default function SocialProofSection() {
  return (
    <section
      id="proof"
      data-section-theme="proof"
      className="command-section page-gutter section-block"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="command-label" data-motion="sweep-left">
          Proof of Work
        </p>
        <h2
          className="home-heading-xl mt-4 max-w-3xl text-[clamp(2rem,7vw,2.9rem)] leading-[1.05] text-[var(--text-primary)]"
          data-motion="rise"
          style={motionDelay(100)}
        >
          Results from founders who chose to work differently.
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <article
              key={t.company}
              className="testimonial-card relative overflow-hidden rounded-2xl border border-[var(--stroke-soft)] p-6"
              data-motion="rise"
              style={motionDelay(240 + index * 90)}
            >
              <CardGlow />
              <div className="relative z-[1]">
                {t.metric && (
                  <span className="mb-4 inline-block rounded-full border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.08)] px-3 py-1 text-xs tracking-[0.06em] text-[var(--accent-gold-soft)]">
                    {t.metric}
                  </span>
                )}
                <div className="mb-3 text-[var(--text-dim)]">
                  <Quote size={18} />
                </div>
                <blockquote className="text-sm leading-relaxed text-[var(--text-muted)]">
                  <p>{t.quote}</p>
                  <footer className="mt-5 border-t border-[var(--stroke-soft)] pt-4">
                    <p className="text-sm text-[var(--text-primary)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-dim)]">{t.company}</p>
                  </footer>
                </blockquote>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
