import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FAQ_ITEMS } from '@/data/positioning-grader';
import { decodeResult } from '@/lib/positioning-grader';
import { getPersonaBySlug, getAllPersonaSlugs } from '@/data/positioning-grader-personas';
import PositioningGraderClient from '@/components/PositioningGraderClient';

type Props = {
  params: Promise<{ persona: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateStaticParams() {
  return getAllPersonaSlugs().map((slug) => ({ persona: slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { persona: slug } = await params;
  const persona = getPersonaBySlug(slug);
  if (!persona) return { title: 'Not Found' };

  const sp = await searchParams;
  const encoded = typeof sp.r === 'string' ? sp.r : undefined;
  const shared = encoded ? decodeResult(encoded) : null;

  const title = shared
    ? `${shared.n} scored ${shared.g} on positioning — Grade yours`
    : persona.seo.title;
  const description = shared
    ? `${shared.n} got a ${shared.g} (${shared.s}/100) on the positioning grader. See how your headline stacks up.`
    : persona.seo.description;

  const canonicalUrl = `https://minamankarious.com/positioning-grader/${persona.slug}`;

  const ogParams = shared
    ? `?type=positioning&grade=${encodeURIComponent(shared.g)}&score=${shared.s}&name=${encodeURIComponent(shared.n)}&tier=${encodeURIComponent(shared.t)}&d=${encodeURIComponent(shared.d)}`
    : '';
  const ogUrl = `https://minamankarious.com/api/og${ogParams}`;

  return {
    title,
    description,
    keywords: persona.seo.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: { 'en-US': canonicalUrl },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Mina Mankarious',
      type: 'website',
      images: [{ url: ogUrl, width: 1200, height: 630, alt: `${persona.displayName} Positioning Grader` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@olmnix',
      site: '@olmnix',
      images: [{ url: ogUrl, alt: `${persona.displayName} Positioning Grader` }],
    },
  };
}

export default async function PersonaPositioningGraderPage({ params, searchParams }: Props) {
  const { persona: slug } = await params;
  const persona = getPersonaBySlug(slug);
  if (!persona) notFound();

  const sp = await searchParams;
  const sharedParam = typeof sp.r === 'string' ? sp.r : null;

  const canonicalUrl = `https://minamankarious.com/positioning-grader/${persona.slug}`;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://minamankarious.com' },
      { '@type': 'ListItem', position: 2, name: 'Positioning Grader', item: 'https://minamankarious.com/positioning-grader' },
      { '@type': 'ListItem', position: 3, name: `For ${persona.displayName}`, item: canonicalUrl },
    ],
  };

  const webApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${persona.displayName} Positioning Grader`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: canonicalUrl,
    description: persona.seo.description,
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
      <PositioningGraderClient
        sharedParam={sharedParam}
        personaOverrides={{
          heading: persona.heroHeading,
          subheading: persona.heroSubheading,
          placeholders: persona.placeholders,
          backLink: {
            href: '/positioning-grader',
            text: 'Back to Positioning Grader',
          },
        }}
      />
    </>
  );
}
