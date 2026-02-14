import { Metadata } from 'next';
import AboutPageClient from '@/components/AboutPageClient';

export const metadata: Metadata = {
  title: 'About Mina Mankarious | Founder & CEO of Olunix, Toronto',
  description:
    'Mina Mankarious is a Canadian entrepreneur, founder and CEO of Olunix, a marketing and consulting firm in Toronto. He helps AI startups with strategic marketing and growth.',
  keywords: [
    'About Mina Mankarious',
    'Mina Mankarious biography',
    'Olunix founder',
    'Toronto entrepreneur',
    'AI startup marketing',
  ],
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
    title: 'About Mina Mankarious | Founder & CEO of Olunix',
    description:
      'Mina Mankarious is a Canadian entrepreneur, founder and CEO of Olunix. He helps AI startups with strategic marketing and growth.',
    url: 'https://minamankarious.com/about',
    siteName: 'Mina Mankarious',
    type: 'profile',
    images: [
      {
        url: 'https://minamankarious.com/og.png',
        width: 1200,
        height: 630,
        alt: 'Mina Mankarious - Founder & CEO of Olunix | Toronto Entrepreneur',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Mina Mankarious | Founder & CEO of Olunix',
    description:
      'Canadian entrepreneur, founder and CEO of Olunix. He helps AI startups with strategic marketing and growth.',
    site: '@minamnkarious',
    images: [
      {
        url: 'https://minamankarious.com/og.png',
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
    name: 'About Mina Mankarious | Founder & CEO of Olunix',
    description:
      'Mina Mankarious is a Canadian entrepreneur, founder and CEO of Olunix, a marketing and consulting firm based in Toronto, Ontario.',
    inLanguage: 'en-US',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://minamankarious.com/og.png',
      width: 1200,
      height: 630,
    },
    dateModified: '2026-02-14',
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
      <AboutPageClient />
    </>
  );
}
