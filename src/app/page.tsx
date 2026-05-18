import type { Metadata } from 'next';
import { getArticleSummaries } from '@/data/articles';
import HomeHero from '@/components/home/HomeHero';
import AuthoritySection from '@/components/home/AuthoritySection';
import WorkSection from '@/components/home/WorkSection';
import EducationSection from '@/components/home/EducationSection';
import ServiceSection from '@/components/home/ServiceSection';

import WritingSection from '@/components/home/WritingSection';
import ContactSection from '@/components/home/ContactSection';
import ProofSection from '@/components/home/ProofSection';
import SectionChoreography from '@/components/home/SectionChoreography';

export const metadata: Metadata = {
  title: 'Mina Mankarious — Deal Partner PM at Boardy | Founder of Olunix, Toronto',
  description:
    'Mina Mankarious is the Deal Partner Program Manager at Boardy and Founder of Olunix, building Vantage — a positioning OS for technical founders. Based in Toronto, Canada.',
  alternates: {
    canonical: 'https://minamankarious.com',
  },
};

export default function Home() {
  const allArticles = getArticleSummaries();
  const displayedArticles = allArticles.slice(0, 3);

  return (
    <div className="relative z-[3]">

      <main id="main-content" className="page-enter marketing-main site-theme pt-16">
        <SectionChoreography />
        <HomeHero />
        <AuthoritySection />
        <ProofSection />
        <WritingSection displayedArticles={displayedArticles} totalArticles={allArticles.length} />
        <WorkSection />
        <EducationSection />
        <ServiceSection />
        <ContactSection />
      </main>
    </div>
  );
}
