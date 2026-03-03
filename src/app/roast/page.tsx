import type { Metadata } from 'next';
import RoastPageClient from '@/components/RoastPageClient';
import { decodeRoast } from '@/lib/roast';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const encoded = typeof params.r === 'string' ? params.r : undefined;
  const shared = encoded ? decodeRoast(encoded) : null;

  const baseTitle = 'Roast My Startup — Get Roasted, Then Fix Positioning';
  const baseDescription =
    'Paste your startup URL to get a funny positioning roast, a shareable scorecard, and a practical improvement plan.';

  const title = shared
    ? `${shared.d} scored ${shared.s}/100 (${shared.v}) — Roast your startup`
    : baseTitle;
  const description = shared
    ? `${shared.d} got roasted with a ${shared.s}/100 score and "${shared.v}" verdict. Run your own roast and post the receipts.`
    : baseDescription;

  const ogParams = shared
    ? `?type=roast&score=${shared.s}&grade=${encodeURIComponent(shared.g)}&verdict=${encodeURIComponent(shared.v)}&domain=${encodeURIComponent(shared.d)}&roast=${encodeURIComponent(shared.r)}`
    : '?type=roast';
  const ogUrl = `https://minamankarious.com/api/og${ogParams}`;

  return {
    title,
    description,
    alternates: {
      canonical: 'https://minamankarious.com/roast',
      languages: {
        'en-US': 'https://minamankarious.com/roast',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: 'https://minamankarious.com/roast',
      siteName: 'Mina Mankarious',
      type: 'website',
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: 'Roast My Startup scorecard',
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
          alt: 'Roast My Startup scorecard',
        },
      ],
    },
  };
}

export default async function RoastPage({ searchParams }: Props) {
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
        name: 'Roast My Startup',
        item: 'https://minamankarious.com/roast',
      },
    ],
  };

  const webApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Roast My Startup',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://minamankarious.com/roast',
    description:
      'Free startup positioning roast tool that analyzes your homepage messaging and returns a shareable scorecard.',
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
      <RoastPageClient sharedParam={sharedParam} />
    </>
  );
}
