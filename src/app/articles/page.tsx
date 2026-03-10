import { Metadata } from 'next';
import ArticlesPageClient from '@/components/ArticlesPageClient';
import { getArticleSummaries } from '@/data/articles';

export const metadata: Metadata = {
  title: 'Articles — Mina Mankarious on AI Startups, Marketing & Growth',
  description:
    'Essays and insights on AI startup marketing, entrepreneurship, and growth strategy. Written by Mina Mankarious, Founder & CEO of Olunix.',
  alternates: {
    canonical: 'https://minamankarious.com/articles',
  },
  openGraph: {
    title: 'Articles — Mina Mankarious on AI Startups, Marketing & Growth',
    description:
      'Essays and insights on AI startup marketing, entrepreneurship, and growth strategy by Mina Mankarious.',
    url: 'https://minamankarious.com/articles',
    siteName: 'Mina Mankarious',
    type: 'website',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        width: 1200,
        height: 630,
        alt: 'Mina Mankarious articles and insights',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles — Mina Mankarious on AI Startups, Marketing & Growth',
    description:
      'Essays and insights on AI startup marketing, entrepreneurship, and growth strategy by Mina Mankarious.',
    site: '@olmnix',
    creator: '@olmnix',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        alt: 'Mina Mankarious articles and insights',
      },
    ],
  },
};

export default function ArticlesPage() {
  const articles = getArticleSummaries();

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
        name: 'Articles',
        item: 'https://minamankarious.com/articles',
      },
    ],
  };

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://minamankarious.com/articles/#blog',
    name: 'Articles by Mina Mankarious',
    description:
      'Essays and insights on AI startup marketing, entrepreneurship, and growth strategy by Mina Mankarious, Founder & CEO of Olunix.',
    url: 'https://minamankarious.com/articles',
    publisher: {
      '@type': 'Person',
      '@id': 'https://minamankarious.com/#person',
      name: 'Mina Mankarious',
    },
    isPartOf: {
      '@id': 'https://minamankarious.com/#website',
    },
    blogPost: articles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.excerpt,
      url: `https://minamankarious.com/articles/${article.slug}`,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Person',
        '@id': 'https://minamankarious.com/#person',
        name: 'Mina Mankarious',
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <ArticlesPageClient articles={articles} />
    </>
  );
}
