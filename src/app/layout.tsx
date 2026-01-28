import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://minamankarious.com"),
  alternates: {
    canonical: "https://minamankarious.com",
    languages: {
      "en-US": "https://minamankarious.com",
    },
  },
  manifest: "/manifest.json",
  title: {
    default: "Mina Mankarious | Olunix Founder & CEO, Toronto",
    template: "%s | Mina Mankarious",
  },
  applicationName: "Mina Mankarious Portfolio",
  description: "Mina Mankarious is the Founder & CEO of Olunix, a marketing and consulting firm in Toronto. Final year Automotive Engineering student at McMaster University. Connect for business opportunities.",
  keywords: [
    "Mina Mankarious",
    "Olunix",
    "Marketing Consultant",
    "Business Consulting",
    "McMaster University",
    "Toronto Entrepreneur",
    "Boardy",
    "Automotive Engineering",
    "Startup Founder",
    "CEO",
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
    title: "Mina Mankarious | Olunix Founder & CEO, Toronto",
    description: "Founder & CEO of Olunix - Marketing & Consulting. McMaster University student. Let's connect!",
    url: "https://minamankarious.com",
    siteName: "Mina Mankarious",
    locale: "en_US",
    type: "profile",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Mina Mankarious - Founder & CEO of Olunix | Marketing & Consulting",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mina Mankarious | Olunix Founder & CEO",
    description: "Founder & CEO of Olunix - Marketing & Consulting. Let's connect!",
    images: [
      {
        url: "/og.png",
        alt: "Mina Mankarious - Founder & CEO of Olunix",
      },
    ],
    creator: "@minamankarious",
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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "192x192", type: "image/png" },
    ],
  },
  verification: {
    google: "google-site-verification-code",
  },
  other: {
    "msapplication-TileColor": "#8b5cf6",
    "theme-color": "#050507",
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
    alternateName: ["Mina M.", "Mina Mankarious"],
    url: "https://minamankarious.com",
    mainEntityOfPage: "https://minamankarious.com",
    image: {
      "@type": "ImageObject",
      "@id": "https://minamankarious.com/#primaryimage",
      url: "https://minamankarious.com/headshot.jpg",
      contentUrl: "https://minamankarious.com/headshot.jpg",
      width: 799,
      height: 799,
      caption: "Mina Mankarious - Founder & CEO of Olunix",
    },
    jobTitle: "Founder & CEO",
    description: "Mina Mankarious is the Founder and CEO of Olunix, a marketing and consulting firm based in Toronto, Canada. He is a final year Automotive Engineering Technology student at McMaster University with expertise in business development, marketing strategy, and entrepreneurship.",
    worksFor: {
      "@type": "Organization",
      "@id": "https://olunix.com/#organization",
      name: "Olunix",
      legalName: "Olunix",
      url: "https://olunix.com",
      description: "Marketing & Consulting Firm",
      foundingDate: "2024-09",
      founder: {
        "@id": "https://minamankarious.com/#person",
      },
    },
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "McMaster University",
        url: "https://www.mcmaster.ca",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Hamilton",
          addressRegion: "Ontario",
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
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "Ontario",
      addressCountry: "CA",
    },
    nationality: {
      "@type": "Country",
      name: "Canada",
    },
    email: "mina@olunix.com",
    knowsAbout: [
      "Marketing Strategy",
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
    sameAs: [
      "https://linkedin.com/in/mina-mankarious",
      "https://olunix.com",
      "https://www.linkedin.com/in/mina-mankarious",
    ],
  };

  // WebSite schema for site identity
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://minamankarious.com/#website",
    url: "https://minamankarious.com",
    name: "Mina Mankarious",
    description: "Official website of Mina Mankarious - Founder & CEO of Olunix",
    publisher: {
      "@id": "https://minamankarious.com/#person",
    },
    inLanguage: "en-US",
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
    dateCreated: "2024-09-01",
    dateModified: new Date().toISOString().split('T')[0],
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
      <body className={`${geistSans.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
