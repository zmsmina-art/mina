import type { Metadata } from 'next';
import BookingPageClient from '@/components/BookingPageClient';

export const metadata: Metadata = {
  title: 'Book a Call with Mina Mankarious — AI Startup Strategy',
  description:
    'Schedule a 30-minute strategy call with Mina Mankarious, Founder & CEO of Olunix. Discuss positioning, marketing, or growth for your AI startup.',
  alternates: {
    canonical: 'https://minamankarious.com/book',
  },
  openGraph: {
    title: 'Book a Call with Mina Mankarious — AI Startup Strategy',
    description:
      'Schedule a 30-minute strategy call with Mina Mankarious, Founder & CEO of Olunix. Discuss positioning, marketing, or growth for your AI startup.',
    url: 'https://minamankarious.com/book',
    siteName: 'Mina Mankarious',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        width: 1200,
        height: 630,
        alt: 'Book a Call with Mina Mankarious',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Call with Mina Mankarious — AI Startup Strategy',
    description:
      'Schedule a 30-minute strategy call with Mina Mankarious, Founder & CEO of Olunix. Discuss positioning, marketing, or growth for your AI startup.',
    images: [
      {
        url: 'https://minamankarious.com/api/og',
        alt: 'Book a Call with Mina Mankarious',
      },
    ],
  },
};

export default function BookPage() {
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
        name: 'Book a Call',
        item: 'https://minamankarious.com/book',
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How long is the strategy call?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The initial strategy call with Mina Mankarious is 30 minutes. It covers your current positioning, growth challenges, and potential next steps for your AI startup.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the strategy call free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, the initial 30-minute strategy call is complimentary. It is designed to help you understand how Olunix can help your AI startup grow.',
        },
      },
      {
        '@type': 'Question',
        name: 'What should I prepare before the call?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Come with a clear picture of your current product, target market, and the growth challenges you are facing. The more context you share, the more actionable the conversation will be.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BookingPageClient />
    </>
  );
}
