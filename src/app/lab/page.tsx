import type { Metadata } from 'next';
import LabLandingClient from '@/components/lab/LabLandingClient';

export const metadata: Metadata = {
  title: 'Positioning Lab — Build, Refine & Stress-Test Your Startup Positioning',
  description:
    'A persistent workspace where AI startup founders build, refine, and stress-test their positioning over time. Guided exercises, AI coaching, version history, and competitive benchmarking.',
  alternates: {
    canonical: 'https://minamankarious.com/lab',
    languages: {
      'en-US': 'https://minamankarious.com/lab',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Positioning Lab — Build, Refine & Stress-Test Your Startup Positioning',
    description:
      'A persistent workspace where AI startup founders build, refine, and stress-test their positioning. Guided exercises, AI coaching, and competitive benchmarking.',
    url: 'https://minamankarious.com/lab',
    siteName: 'Mina Mankarious',
    type: 'website',
    images: [
      {
        url: 'https://minamankarious.com/api/og?type=lab',
        width: 1200,
        height: 630,
        alt: 'Positioning Lab by Mina Mankarious',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Positioning Lab — Build & Stress-Test Your Startup Positioning',
    description:
      'A persistent workspace for AI startup founders. Guided exercises, AI coaching, and competitive benchmarking.',
    creator: '@olmnix',
    site: '@olmnix',
  },
};

export default function LabPage() {
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
        name: 'Positioning Lab',
        item: 'https://minamankarious.com/lab',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <LabLandingClient />
    </>
  );
}
