import { Metadata } from 'next';
import AboutPageContent from '@/components/AboutPageContent';

export const metadata: Metadata = {
  title: 'About Mina Mankarious — Entrepreneur, Founder & CEO of Olunix',
  description:
    'Mina Mankarious is a Canadian entrepreneur and Founder & CEO of Olunix. McMaster engineering student turned startup operator, helping AI companies grow from Toronto.',
  alternates: {
    canonical: 'https://minamankarious.com/about',
    languages: {
      'en-US': 'https://minamankarious.com/about',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'About Mina Mankarious — Entrepreneur, Founder & CEO of Olunix',
    description:
      'Mina Mankarious is a Canadian entrepreneur and Founder & CEO of Olunix. McMaster engineering student turned startup operator, helping AI companies grow from Toronto.',
    url: 'https://minamankarious.com/about',
    siteName: 'Mina Mankarious',
    type: 'profile',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        width: 1200,
        height: 630,
        alt: 'Mina Mankarious - Founder & CEO of Olunix | Toronto Entrepreneur',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Mina Mankarious — Entrepreneur, Founder & CEO of Olunix',
    description:
      'Canadian entrepreneur and Founder & CEO of Olunix. McMaster engineering student turned startup operator, helping AI companies grow from Toronto.',
    site: '@minamnkarious',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        alt: 'Mina Mankarious - Founder & CEO of Olunix | Toronto Entrepreneur',
      },
    ],
    creator: '@minamnkarious',
  },
};

export default function AboutPage() {
  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': 'https://minamankarious.com/about#aboutpage',
    url: 'https://minamankarious.com/about',
    name: 'About Mina Mankarious — Entrepreneur, Founder & CEO of Olunix',
    description:
      'Mina Mankarious is a Canadian entrepreneur and Founder & CEO of Olunix, a marketing and consulting firm based in Toronto, Ontario.',
    inLanguage: 'en-US',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://minamankarious.com/api/og',
      width: 1200,
      height: 630,
    },
    dateModified: '2026-02-25',
    mainEntity: {
      '@id': 'https://minamankarious.com/#person',
    },
    isPartOf: {
      '@id': 'https://minamankarious.com/#website',
    },
  };

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
        name: 'About',
        item: 'https://minamankarious.com/about',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AboutPageContent />
    </>
  );
}
