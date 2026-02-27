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
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': 'https://minamankarious.com/about#profilepage',
        url: 'https://minamankarious.com/about',
        name: 'About Mina Mankarious',
        description: 'Professional profile of Mina Mankarious, Founder & CEO of Olunix.',
        mainEntity: {
          '@id': 'https://minamankarious.com/#person',
        },
        dateCreated: '2024-09-01T00:00:00Z',
        dateModified: '2026-02-27T00:00:00Z',
        isPartOf: {
          '@id': 'https://minamankarious.com/#website',
        },
      },
      {
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
        dateModified: '2026-02-27',
        mainEntity: {
          '@id': 'https://minamankarious.com/#person',
        },
        isPartOf: {
          '@id': 'https://minamankarious.com/#website',
        },
      },
      {
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
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Who is Mina Mankarious?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Mina Mankarious is a Canadian entrepreneur and the Founder & CEO of Olunix, a marketing and consulting firm based in Toronto that helps AI startups with positioning, growth systems, and founder-led marketing.',
            },
          },
          {
            '@type': 'Question',
            name: 'What does Olunix do?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Olunix helps AI startups turn technical products into clear market narratives, build founder-led demand engines, and create marketing operating systems that compound. Services include positioning strategy, content systems, and growth consulting.',
            },
          },
          {
            '@type': 'Question',
            name: 'What industries does Mina Mankarious work with?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Mina primarily works with AI and technology startups at the seed to growth stage, helping them build marketing systems that scale. His background in engineering brings a systems-thinking approach to startup growth.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where is Mina Mankarious based?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Mina is based in Toronto, Ontario, Canada. Olunix serves clients across North America and Europe.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <AboutPageContent />
    </>
  );
}
