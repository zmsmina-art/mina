import type { Metadata } from 'next';
import { decodeDiagnosticShare } from '@/lib/diagnostic';
import DiagnosticPageClient from '@/components/DiagnosticPageClient';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const encoded = typeof params.r === 'string' ? params.r : undefined;
  const shared = encoded ? decodeDiagnosticShare(encoded) : null;

  const baseTitle = 'AI Startup GTM Diagnostic';
  const baseDescription =
    'Run a 10-minute diagnostic for your AI startup go-to-market system. Get a scored assessment, bottleneck analysis, and a 90-day GTM alignment brief.';

  const title = shared
    ? `GTM score ${shared.s}/100 (${shared.t}) — Run your diagnostic`
    : baseTitle;
  const description = shared
    ? `A startup scored ${shared.s}/100 in the ${shared.st.replaceAll('_', ' ')} benchmark on this GTM diagnostic. Run yours and compare bottlenecks.`
    : baseDescription;
  const ogParams = shared
    ? `?type=diagnostic&score=${shared.s}&tier=${encodeURIComponent(shared.t)}&stage=${encodeURIComponent(shared.st)}&b=${encodeURIComponent(shared.b)}`
    : '';
  const ogUrl = `https://minamankarious.com/api/og${ogParams}`;

  return {
    title,
    description,
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
      title,
      description,
      url: 'https://minamankarious.com/diagnostic',
      siteName: 'Mina Mankarious',
      type: 'website',
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: 'AI Startup GTM Diagnostic by Mina Mankarious',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@olmnix',
      site: '@olmnix',
      images: [
        {
          url: ogUrl,
          alt: 'AI Startup GTM Diagnostic by Mina Mankarious',
        },
      ],
    },
  };
}

export default async function DiagnosticPage({ searchParams }: Props) {
  const params = await searchParams;
  const sharedParam = typeof params.r === 'string' ? params.r : null;

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
      <DiagnosticPageClient sharedParam={sharedParam} />
    </>
  );
}
