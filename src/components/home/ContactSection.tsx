import SectionHeading from '@/components/home/SectionHeading';

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mina-mankarious' },
  { label: 'X', href: 'https://x.com/minamankarious' },
  { label: 'GitHub', href: 'https://github.com/zmsmina-art' },
  { label: 'Olunix', href: 'https://olunix.com' },
];

export default function ContactSection() {
  return (
    <section id="contact" data-section-theme="contact" className="command-section page-gutter section-block pb-20 md:pb-28">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading index="07" label="Contact" />

        <div className="contact-closer mt-8">
          <h2
            className="home-heading-xl max-w-3xl text-[clamp(2.1rem,7vw,3.2rem)] leading-[1.04] text-[var(--text-primary)]"
            data-motion="rise"
          >
            Let&apos;s connect.
          </h2>
          <p className="mt-5 max-w-xl text-[var(--text-muted)]" data-motion="rise">
            Always happy to talk shop — positioning, growth, building, or anything in
            between. The fastest way to reach me is email.
          </p>

          <a
            href="mailto:mina@olunix.com"
            className="contact-email mt-7 inline-block"
            data-motion="rise"
          >
            mina@olunix.com
          </a>

          <ul className="contact-socials mt-9" data-motion="rise">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="contact-social-link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
