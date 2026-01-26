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
  title: "Mina Mankarious | Founder & CEO of Olunix",
  description: "Founder & CEO of Olunix - Marketing & Consulting. Final year Automotive Engineering Technology student at McMaster University. Toronto, Canada.",
  keywords: ["Mina Mankarious", "Olunix", "Marketing", "Consulting", "McMaster University", "Toronto", "Boardy", "Hope Bible Church"],
  authors: [{ name: "Mina Mankarious" }],
  creator: "Mina Mankarious",
  openGraph: {
    title: "Mina Mankarious | Founder & CEO of Olunix",
    description: "Founder & CEO of Olunix - Marketing & Consulting. Final year Automotive Engineering Technology student at McMaster University.",
    url: "https://minamankarious.com",
    siteName: "Mina Mankarious",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/headshot.png",
        width: 400,
        height: 400,
        alt: "Mina Mankarious",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Mina Mankarious | Founder & CEO of Olunix",
    description: "Founder & CEO of Olunix - Marketing & Consulting. McMaster University.",
    images: ["/headshot.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
