import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://minamankarious.com"),
  alternates: {
    canonical: "https://minamankarious.com",
    languages: {
      "en-US": "https://minamankarious.com",
    },
    types: {
      "application/rss+xml": "https://minamankarious.com/feed.xml",
    },
  },
  manifest: "/manifest.json",
  title: {
    default: "Mina Mankarious | Male Founder & CEO of Olunix, Toronto",
    template: "%s | Mina Mankarious",
  },
  applicationName: "Mina Mankarious Portfolio",
  description: "Mina Mankarious is a male entrepreneur, Founder & CEO of Olunix, a marketing and consulting firm in Toronto. Final year Automotive Engineering student at McMaster University. He helps AI startups with strategic marketing and growth.",
  keywords: [
    "Mina Mankarious",
    "Mina Mankarious male founder",
    "Mina Mankarious Olunix CEO",
    "Olunix",
    "Marketing Consultant",
    "Business Consulting",
    "McMaster University",
    "Toronto Entrepreneur",
    "Toronto male founder",
    "Boardy",
    "Automotive Engineering",
    "Startup Founder",
    "CEO",
    "male entrepreneur Toronto",
  ],
  authors: [{ name: "Mina Mankarious", url: "https://minamankarious.com" }],
  creator: "Mina Mankarious",
  publisher: "Mina Mankarious",
  category: "Business",
  classification: "Portfolio",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Mina Mankarious | Male Founder & CEO of Olunix, Toronto",
    description: "Mina Mankarious is a male entrepreneur, Founder & CEO of Olunix - Marketing & Consulting. McMaster University student. He helps AI startups grow.",
    url: "https://minamankarious.com",
    siteName: "Mina Mankarious",
    locale: "en_US",
    type: "profile",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Mina Mankarious - Male Founder & CEO of Olunix | Marketing & Consulting | Toronto",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mina Mankarious | Male Founder & CEO of Olunix",
    description: "Male entrepreneur, Founder & CEO of Olunix - Marketing & Consulting. He helps AI startups grow.",
    images: [
      {
        url: "/og.png",
        alt: "Mina Mankarious - Male Founder & CEO of Olunix | Toronto Entrepreneur",
      },
    ],
    creator: "@minamankrious",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "rZIuYERXXV18304PIGZJZUQ1C9Re4szYlDOskfurCxY",
  },
  other: {
    "msapplication-TileColor": "#8b5cf6",
    "theme-color": "#050507",
    "profile:first_name": "Mina",
    "profile:last_name": "Mankarious",
    "profile:gender": "male",
    "profile:username": "minamankarious",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Main Person schema for Google People Card
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://minamankarious.com/#person",
    name: "Mina Mankarious",
    givenName: "Mina",
    familyName: "Mankarious",
    gender: "Male",
    honorificPrefix: "Mr.",
    additionalType: "https://www.wikidata.org/wiki/Q138001904",
    alternateName: ["Mina M.", "Mina Mankarious"],
    url: "https://minamankarious.com",
    mainEntityOfPage: "https://minamankarious.com",
    image: [
      {
        "@type": "ImageObject",
        "@id": "https://minamankarious.com/#primaryimage",
        url: "https://minamankarious.com/headshot.jpg",
        contentUrl: "https://minamankarious.com/headshot.jpg",
        width: 799,
        height: 799,
        caption: "Mina Mankarious - Male Founder & CEO of Olunix | Toronto Entrepreneur",
      },
      {
        "@type": "ImageObject",
        url: "https://minamankarious.com/mina-mankarious-headshot.png",
        contentUrl: "https://minamankarious.com/mina-mankarious-headshot.png",
        caption: "Mina Mankarious - Male Entrepreneur and CEO, Toronto",
      },
      {
        "@type": "ImageObject",
        url: "https://minamankarious.com/og.png",
        contentUrl: "https://minamankarious.com/og.png",
        width: 1200,
        height: 630,
        caption: "Mina Mankarious - Founder & CEO of Olunix",
      },
    ],
    jobTitle: "Founder & CEO",
    description: "Mina Mankarious is a male entrepreneur, Founder and CEO of Olunix, a marketing and consulting firm based in Toronto, Canada. He is a final year Automotive Engineering Technology student at McMaster University with expertise in business development, marketing strategy, and entrepreneurship.",
    worksFor: {
      "@type": "Organization",
      "@id": "https://olunix.com/#organization",
      name: "Olunix",
      legalName: "Olunix",
      url: "https://olunix.com",
      description: "Marketing & Consulting Firm helping AI startups with strategic growth",
      foundingDate: "2024-09",
      founder: {
        "@id": "https://minamankarious.com/#person",
      },
      logo: {
        "@type": "ImageObject",
        url: "https://minamankarious.com/olunix-logo.png",
        caption: "Olunix - Marketing & Consulting",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Toronto",
        addressRegion: "Ontario",
        addressCountry: "CA",
      },
      areaServed: {
        "@type": "Country",
        name: "Canada",
      },
      sameAs: [
        "https://olunix.com",
      ],
    },
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "McMaster University",
        url: "https://www.mcmaster.ca",
        address: {
          "@type": "PostalAddress",
          streetAddress: "1280 Main Street West",
          addressLocality: "Hamilton",
          addressRegion: "Ontario",
          postalCode: "L8S 4L8",
          addressCountry: "CA",
        },
      },
    ],
    memberOf: [
      {
        "@type": "Organization",
        name: "Boardy",
        description: "Professional networking platform",
      },
    ],
    birthPlace: {
      "@type": "Place",
      name: "Egypt",
      address: {
        "@type": "PostalAddress",
        addressCountry: "EG",
      },
    },
    nationality: {
      "@type": "Country",
      name: "Canada",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "Ontario",
      addressCountry: "CA",
    },
    email: "mina@olunix.com",
    knowsAbout: [
      "Marketing Strategy",
      "UI/UX Design",
      "Business Consulting",
      "Automotive Engineering",
      "Entrepreneurship",
      "Sales",
      "Business Development",
      "Customer Relations",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Entrepreneur",
      occupationLocation: {
        "@type": "City",
        name: "Toronto",
      },
      description: "Founder and CEO of marketing and consulting firm",
    },
    knowsLanguage: [
      {
        "@type": "Language",
        name: "English",
        alternateName: "en",
      },
      {
        "@type": "Language",
        name: "Arabic",
        alternateName: "ar",
      },
    ],
    sameAs: [
      "https://www.linkedin.com/in/mina-mankarious",
      "https://x.com/minamnkarious",
      "https://olunix.com",
      "https://www.wikidata.org/wiki/Q138001904",
      "https://github.com/minamankarious",
      "https://www.youtube.com/@minamankarious",
      "https://www.crunchbase.com/person/mina-mankarious",
      "https://www.boardy.ai",
    ],
    potentialAction: {
      "@type": "ViewAction",
      target: "https://minamankarious.com/about",
      name: "View Profile",
    },
  };

  // WebSite schema for site identity
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://minamankarious.com/#website",
    url: "https://minamankarious.com",
    name: "Mina Mankarious",
    alternateName: "Mina Mankarious Portfolio",
    description: "Official website of Mina Mankarious - Male Founder & CEO of Olunix",
    publisher: {
      "@id": "https://minamankarious.com/#person",
    },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://minamankarious.com/articles?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  // ProfilePage schema for the main page
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": "https://minamankarious.com/#profilepage",
    url: "https://minamankarious.com",
    name: "Mina Mankarious - Portfolio",
    description: "Professional portfolio and about page for Mina Mankarious",
    mainEntity: {
      "@id": "https://minamankarious.com/#person",
    },
    dateCreated: "2024-09-01T00:00:00Z",
    dateModified: "2026-02-13T00:00:00Z",
    isPartOf: {
      "@id": "https://minamankarious.com/#website",
    },
  };

  // Combined schema graph
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [personSchema, websiteSchema, profilePageSchema],
  };

  return (
    <html lang="en">
      <head>
        <link rel="me" href="https://www.linkedin.com/in/mina-mankarious" />
        <link rel="me" href="https://x.com/minamnkarious" />
        <link rel="me" href="https://github.com/minamankarious" />
        <link rel="me" href="https://www.youtube.com/@minamankarious" />
        <link rel="me" href="https://www.crunchbase.com/person/mina-mankarious" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
