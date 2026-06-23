import CardGlow from '@/components/ui/card-glow';
import { motionDelay } from '@/lib/utils';
import SectionHeading from '@/components/home/SectionHeading';


const services = [
  {
    title: 'Positioning & Messaging',
    desc: 'Clarify category, ICP, and value narrative so buyers understand your advantage quickly.',
  },
  {
    title: 'Founder-Led Growth',
    desc: 'Build a trust engine around founder voice, strategic content, and high-signal relationships.',
  },
  {
    title: 'Marketing Systems',
    desc: 'Design execution cadence, ownership, and channel priorities tied to pipeline outcomes.',
  },
];

export default function ServiceSection() {
  return (
    <section id="work-with-me" data-section-theme="services" className="command-section page-gutter section-block">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading index="06" label="Services" />
        <h2
          className="home-heading-xl mt-4 max-w-3xl text-[clamp(2rem,7vw,2.9rem)] leading-[1.05] text-[var(--text-primary)]"
          data-motion="rise"
          style={motionDelay(100)}
        >
          Structured <em className="script-accent" data-text="strategy">strategy</em> for technical founders who need commercial traction.
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--text-muted)]" data-motion="rise" style={motionDelay(170)}>
          If you&apos;re building a technical product and need stronger market movement, I work directly at the strategy and execution layer.
        </p>

        <div className="service-grid mt-10">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="service-card-v2 relative overflow-hidden"
              data-motion="h-sweep"
              style={motionDelay(240 + index * 90)}
            >
              <CardGlow />
              <div className="relative z-[1]">
                <p className="service-index">0{index + 1}</p>
                <h3 className="service-title text-xl text-[var(--text-primary)]">{service.title}</h3>
                <p className="service-desc text-sm leading-relaxed text-[var(--text-muted)]">{service.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div
          className="mt-9 border-t border-[var(--stroke-soft)] pt-6"
          data-motion="rise"
          style={motionDelay(520)}
        >
          <p className="max-w-2xl text-sm text-[var(--text-muted)]">
            Most of this work happens through Olunix, usually with early-stage to growth-stage AI startups and founder teams that value disciplined execution.
          </p>
        </div>
      </div>
    </section>
  );
}
