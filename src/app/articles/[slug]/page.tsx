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
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      creator: '@minamankrious',
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticlePageClient article={article} />
    </>
  );
}
