import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticlesSorted } from '@/data/articles';
import ArticlePageClient from '@/components/ArticlePageClient';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const articles = getAllArticlesSorted();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `https://minamankarious.com/articles/${article.slug}`,
    },
    openGraph: {
      title: `${article.title} | Mina Mankarious`,
      description: article.excerpt,
      url: `https://minamankarious.com/articles/${article.slug}`,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: ['Mina Mankarious'],
      tags: article.tags,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(article.title)}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      creator: '@minamnkarious',
      images: [`/api/og?title=${encodeURIComponent(article.title)}`],
    },
  };
}

export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      '@type': 'Person',
      '@id': 'https://minamankarious.com/#person',
      name: 'Mina Mankarious',
      url: 'https://minamankarious.com',
    },
    publisher: {
      '@type': 'Person',
      '@id': 'https://minamankarious.com/#person',
      name: 'Mina Mankarious',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://minamankarious.com/articles/${article.slug}`,
    },
    url: `https://minamankarious.com/articles/${article.slug}`,
    keywords: article.tags.join(', '),
    wordCount: article.content.split(/\s+/).length,
    isPartOf: {
      '@id': 'https://minamankarious.com/#website',
    },
  };

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
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `https://minamankarious.com/articles/${article.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticlePageClient article={article} />
    </>
  );
}
