import { Metadata } from 'next';
import WorkPageClient from '@/components/WorkPageClient';
import { getHeroCaseStudy, getSupportingCaseStudies, getAllCaseStudies } from '@/data/case-studies';

export const metadata: Metadata = {
  title: 'Work | Case Studies by Mina Mankarious & Olunix',
  description:
    'Explore real case studies from Olunix: branding, growth marketing, and content strategy for AI startups and B2B firms. See the process and the results.',
  alternates: {
    canonical: 'https://minamankarious.com/work',
    languages: {
      'en-US': 'https://minamankarious.com/work',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Work | Case Studies by Mina Mankarious & Olunix',
    description:
      'Real case studies from Olunix: branding, growth marketing, and content strategy. See the process and the results.',
    url: 'https://minamankarious.com/work',
    siteName: 'Mina Mankarious',
    type: 'website',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        width: 1200,
        height: 630,
        alt: 'Work - Case Studies by Mina Mankarious & Olunix',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work | Case Studies by Mina Mankarious & Olunix',
    description:
      'Real case studies from Olunix: branding, growth marketing, and content strategy.',
    site: '@minamnkarious',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        alt: 'Work - Case Studies by Mina Mankarious & Olunix',
      },
    ],
    creator: '@minamnkarious',
  },
};

export default function WorkPage() {
  const hero = getHeroCaseStudy();
  const supporting = getSupportingCaseStudies();
  const allStudies = getAllCaseStudies();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://minamankarious.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Work',
        item: 'https://minamankarious.com/work',
      },
    ],
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://minamankarious.com/work#collectionpage',
    url: 'https://minamankarious.com/work',
    name: 'Case Studies by Mina Mankarious & Olunix',
    description:
      'Interactive case studies showcasing branding, growth marketing, and content strategy work for AI startups and B2B firms.',
    inLanguage: 'en-US',
    isPartOf: {
      '@id': 'https://minamankarious.com/#website',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allStudies.length,
      itemListElement: allStudies.map((study, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: study.title,
        description: study.result,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <WorkPageClient hero={hero} supporting={supporting} />
    </>
  );
}
