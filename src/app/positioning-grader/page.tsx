import type { Metadata } from 'next';
import { FAQ_ITEMS } from '@/data/positioning-grader';
import { decodeResult } from '@/lib/positioning-grader';
import PositioningGraderClient from '@/components/PositioningGraderClient';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const encoded = typeof params.r === 'string' ? params.r : undefined;
  const shared = encoded ? decodeResult(encoded) : null;

  const baseTitle = 'Grade Your AI Startup Positioning — Free Tool | Mina Mankarious';
  const baseDescription =
    'Paste your startup headline and get an instant positioning score across clarity, specificity, differentiation, brevity, and value clarity. Free, no signup required.';

  const title = shared
    ? `${shared.n} scored ${shared.g} on positioning — Grade yours`
    : baseTitle;
  const description = shared
    ? `${shared.n} got a ${shared.g} (${shared.s}/100) on the AI startup positioning grader. See how your headline stacks up.`
    : baseDescription;

  const ogParams = shared
    ? `?type=positioning&grade=${encodeURIComponent(shared.g)}&score=${shared.s}&name=${encodeURIComponent(shared.n)}&tier=${encodeURIComponent(shared.t)}&d=${encodeURIComponent(shared.d)}`
    : '';
  const ogUrl = `https://minamankarious.com/api/og${ogParams}`;

  return {
    title,
    description,
    keywords: [
      'AI startup positioning',
      'startup positioning tool',
      'startup positioning grader',
      'grade your startup positioning',
      'AI startup headline grader',
      'positioning assessment',
      'startup messaging',
    ],
    alternates: {
      canonical: 'https://minamankarious.com/positioning-grader',
      languages: { 'en-US': 'https://minamankarious.com/positioning-grader' },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: 'https://minamankarious.com/positioning-grader',
      siteName: 'Mina Mankarious',
      type: 'website',
      images: [{ url: ogUrl, width: 1200, height: 630, alt: 'AI Startup Positioning Grader' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@olmnix',
      site: '@olmnix',
      images: [{ url: ogUrl, alt: 'AI Startup Positioning Grader' }],
    },
  };
}

export default async function PositioningGraderPage({ searchParams }: Props) {
  const params = await searchParams;
  const sharedParam = typeof params.r === 'string' ? params.r : null;
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://minamankarious.com' },
      { '@type': 'ListItem', position: 2, name: 'Positioning Grader', item: 'https://minamankarious.com/positioning-grader' },
    ],
  };

  const webApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI Startup Positioning Grader',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://minamankarious.com/positioning-grader',
    description:
      'Free tool that scores your AI startup headline across clarity, specificity, differentiation, brevity, and value clarity.',
    creator: { '@id': 'https://minamankarious.com/#person' },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PositioningGraderClient sharedParam={sharedParam} />
    </>
  );
}
