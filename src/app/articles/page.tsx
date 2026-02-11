import { Metadata } from 'next';
import ArticlesPageClient from '@/components/ArticlesPageClient';
import { getAllArticlesSorted } from '@/data/articles';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Insights on entrepreneurship, marketing strategy, consulting, and building businesses from scratch. Written by Mina Mankarious, Founder & CEO of Olunix in Toronto.',
  alternates: {
    canonical: 'https://minamankarious.com/articles',
  },
  openGraph: {
    title: 'Articles | Mina Mankarious',
    description:
      'Insights on entrepreneurship, marketing strategy, consulting, and building businesses from scratch. By Mina Mankarious, Founder & CEO of Olunix.',
    url: 'https://minamankarious.com/articles',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Mina Mankarious - Articles on marketing, consulting, and entrepreneurship',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles | Mina Mankarious',
    description:
      'Insights on entrepreneurship, marketing strategy, consulting, and building businesses from scratch. By Mina Mankarious.',
    creator: '@minamnkarious',
    images: ['/og.png'],
  },
};

export default function ArticlesPage() {
  const articles = getAllArticlesSorted();
  return <ArticlesPageClient articles={articles} />;
}
