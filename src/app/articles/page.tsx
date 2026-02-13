import { Metadata } from 'next';
import ArticlesPageClient from '@/components/ArticlesPageClient';
import { getAllArticlesSorted } from '@/data/articles';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Thoughts on entrepreneurship, marketing, consulting, and building businesses. Written by Mina Mankarious, Founder & CEO of Olunix.',
  alternates: {
    canonical: 'https://minamankarious.com/articles',
  },
  openGraph: {
    title: 'Articles | Mina Mankarious',
    description:
      'Thoughts on entrepreneurship, marketing, consulting, and building businesses.',
    url: 'https://minamankarious.com/articles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles | Mina Mankarious',
    description:
      'Thoughts on entrepreneurship, marketing, and building businesses.',
  },
};

export default function ArticlesPage() {
  const articles = getAllArticlesSorted();

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
      gender: 'Male',
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
        gender: 'Male',
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <ArticlesPageClient articles={articles} />
    </>
  );
}
