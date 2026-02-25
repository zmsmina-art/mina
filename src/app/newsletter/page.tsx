import { Metadata } from 'next';
import NewsletterPageClient from '@/components/NewsletterPageClient';

export const metadata: Metadata = {
  title: 'Newsletter — Mina Mankarious on Entrepreneurship, Marketing & Growth',
  description:
    'Subscribe to Mina Mankarious\u2019s newsletter for essays on AI startup growth, marketing strategy, and entrepreneurship. Frameworks from Olunix, lessons from building, and early access to new writing.',
  alternates: {
    canonical: 'https://minamankarious.com/newsletter',
    languages: {
      'en-US': 'https://minamankarious.com/newsletter',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Newsletter | Mina Mankarious',
    description:
      'Essays on entrepreneurship, marketing strategy, and building businesses worth talking about.',
    url: 'https://minamankarious.com/newsletter',
    siteName: 'Mina Mankarious',
    type: 'website',
    images: [
      {
        url: 'https://minamankarious.com/api/og?type=newsletter',
        width: 1200,
        height: 630,
        alt: 'Mina Mankarious Newsletter — Entrepreneurship, Marketing & Growth',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter | Mina Mankarious',
    description:
      'Essays on entrepreneurship, marketing strategy, and building businesses worth talking about.',
    site: '@minamnkarious',
    creator: '@minamnkarious',
    images: [
      {
        url: 'https://minamankarious.com/api/og?type=newsletter',
        alt: 'Mina Mankarious Newsletter — Entrepreneurship, Marketing & Growth',
      },
    ],
  },
};

export default function NewsletterPage() {
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://minamankarious.com/newsletter#webpage',
    url: 'https://minamankarious.com/newsletter',
    name: 'Newsletter | Mina Mankarious',
    description:
      'Subscribe to essays on entrepreneurship, marketing strategy, and building businesses worth talking about.',
    inLanguage: 'en-US',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://minamankarious.com/api/og?type=newsletter',
      width: 1200,
      height: 630,
    },
    dateModified: '2026-02-19',
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
        name: 'Newsletter',
        item: 'https://minamankarious.com/newsletter',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <NewsletterPageClient />
    </>
  );
}
