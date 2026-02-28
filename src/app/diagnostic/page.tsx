import type { Metadata } from 'next';
import DiagnosticPageClient from '@/components/DiagnosticPageClient';

export const metadata: Metadata = {
  title: 'AI Startup GTM Diagnostic — Mina Mankarious',
  description:
    'Run a 10-minute diagnostic for your AI startup go-to-market system. Get a scored assessment, bottleneck analysis, and a 90-day GTM alignment brief.',
  alternates: {
    canonical: 'https://minamankarious.com/diagnostic',
    languages: {
      'en-US': 'https://minamankarious.com/diagnostic',
    },
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'AI Startup GTM Diagnostic | Mina Mankarious',
    description:
      'Diagnose your GTM system across positioning, ICP, demand, proof, funnel conversion, and operating cadence.',
    url: 'https://minamankarious.com/diagnostic',
    siteName: 'Mina Mankarious',
    type: 'website',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        width: 1200,
        height: 630,
        alt: 'AI Startup GTM Diagnostic by Mina Mankarious',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Startup GTM Diagnostic | Mina Mankarious',
    description:
      'Score your startup GTM system and get a practical 90-day action brief.',
    creator: '@olmnix',
    site: '@olmnix',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        alt: 'AI Startup GTM Diagnostic by Mina Mankarious',
      },
    ],
  },
};

export default function DiagnosticPage() {
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
        name: 'GTM Diagnostic',
        item: 'https://minamankarious.com/diagnostic',
      },
    ],
  };

  const webApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI Startup GTM Diagnostic',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://minamankarious.com/diagnostic',
    description:
      'Interactive diagnostic that scores AI startup GTM maturity and generates a 90-day alignment brief.',
    creator: {
      '@id': 'https://minamankarious.com/#person',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
      />
      <DiagnosticPageClient />
    </>
  );
}
