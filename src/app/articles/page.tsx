import { Metadata } from 'next';
import ArticlesPageClient from '@/components/ArticlesPageClient';
import { getAllArticlesSorted } from '@/data/articles';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Thoughts on entrepreneurship, marketing, consulting, and building businesses. Written by Mina Mankarious, Founder & CEO of Olunix.',
  keywords: [
    'Mina Mankarious articles',
    'AI startup marketing articles',
    'founder-led growth insights',
    'startup marketing strategy',
  ],
  alternates: {
    canonical: 'https://minamankarious.com/articles',
  },
  openGraph: {
    title: 'Articles | Mina Mankarious',
    description:
      'Thoughts on entrepreneurship, marketing, consulting, and building businesses.',
    url: 'https://minamankarious.com/articles',
    siteName: 'Mina Mankarious',
    type: 'website',
    images: [
      {
        url: 'https://minamankarious.com/og.png',
        width: 1200,
        height: 630,
        alt: 'Mina Mankarious articles and insights',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles | Mina Mankarious',
    description:
      'Thoughts on entrepreneurship, marketing, and building businesses.',
    site: '@minamnkarious',
    creator: '@minamnkarious',
    images: [
      {
        url: 'https://minamankarious.com/og.png',
        alt: 'Mina Mankarious articles and insights',
      },
    ],
  },
};

export default function ArticlesPage() {
  const articles = getAllArticlesSorted();

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
    name: 'Articles | Mina Mankarious',
    description:
      'Thoughts on entrepreneurship, marketing, consulting, and building businesses.',
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
