import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const tagToCTA: Record<string, { heading: string; text: string; href: string; label: string }> = {
  positioning: {
    heading: 'Think your positioning could be sharper?',
    text: 'Run your headline and one-liner through the free Positioning Grader. Takes 30 seconds.',
    href: '/positioning-grader',
    label: 'Grade my positioning',
  },
  marketing: {
    heading: 'Need a strategic growth partner?',
    text: 'If you are building an AI product and need help with positioning, narrative, or go-to-market, let\'s talk.',
    href: 'mailto:mina@olunix.com?subject=Growth%20Inquiry',
    label: 'Get in touch',
  },
  growth: {
    heading: 'Need a strategic growth partner?',
    text: 'If you are building an AI product and need help with positioning, narrative, or go-to-market, let\'s talk.',
    href: 'mailto:mina@olunix.com?subject=Growth%20Inquiry',
    label: 'Get in touch',
  },
  startups: {
    heading: 'Building something and need traction?',
    text: 'Run a quick diagnostic on your go-to-market readiness. Free, takes 10 minutes.',
    href: '/diagnostic',
    label: 'Take the GTM diagnostic',
  },
};

const defaultCTA = {
  heading: 'Want to work through this together?',
  text: 'I help AI startups with positioning, growth systems, and founder-led marketing.',
  href: 'mailto:mina@olunix.com?subject=Collaboration%20Inquiry',
  label: 'Get in touch',
};

export default function ArticleEndCTA({ tags }: { tags: string[] }) {
  const lowerTags = tags.map((t) => t.toLowerCase());
  const matched = lowerTags.find((t) => tagToCTA[t]);
  const cta = matched ? tagToCTA[matched] : defaultCTA;

  return (
    <div className="article-end-cta">
      <h3>{cta.heading}</h3>
      <p>{cta.text}</p>
      <div className="article-end-cta-actions">
        <Link href={cta.href} className="accent-btn">
          {cta.label}
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
