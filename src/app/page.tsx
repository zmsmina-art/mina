import type { Metadata } from 'next';
import { getArticleSummaries } from '@/data/articles';
import HomeHero from '@/components/home/HomeHero';
import AuthoritySection from '@/components/home/AuthoritySection';
import WorkSection from '@/components/home/WorkSection';
import EducationSection from '@/components/home/EducationSection';
import ServiceSection from '@/components/home/ServiceSection';

import WritingSection from '@/components/home/WritingSection';
import ContactSection from '@/components/home/ContactSection';

export const metadata: Metadata = {
  title: 'Mina Mankarious — Founder & CEO of Olunix | AI Startup Growth, Toronto',
  description:
    'Mina Mankarious is the Founder and CEO of Olunix, a Toronto-based firm helping AI startups with positioning, growth systems, and founder-led marketing. Explore his work, writing, and case studies.',
  alternates: {
    canonical: 'https://minamankarious.com',
  },
};

export default function Home() {
  const allArticles = getArticleSummaries();
  const displayedArticles = allArticles.slice(0, 3);

  const homeBreadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://minamankarious.com',
      },
    ],
  };

  return (
    <div className="relative z-[3]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeBreadcrumbJsonLd) }}
      />

      <main id="main-content" className="page-enter marketing-main site-theme pt-20">
        <HomeHero />
        <AuthoritySection />
        <WorkSection />
        <EducationSection />
        <ServiceSection />
        <WritingSection displayedArticles={displayedArticles} totalArticles={allArticles.length} />
        <ContactSection />
      </main>
    </div>
  );
}
