import { getAllArticlesSorted } from "@/data/articles";

const baseUrl = "https://minamankarious.com";

const homepageImages = [
  "/headshot.png",
  "/headshot.jpg",
  "/og-image.jpg",
  "/olunix-logo.png",
  "/boardy-logo.png",
  "/habits-together-logo.png",
  "/hope-logo.webp",
  "/toyota-logo.png",
  "/mcmaster-logo.png",
  "/zms-logo.svg",
];

export async function GET() {
  const articles = getAllArticlesSorted();

  const homepageEntry = `  <url>
    <loc>${baseUrl}/</loc>
${homepageImages
  .map(
    (p) =>
      `    <image:image><image:loc>${baseUrl}${p}</image:loc></image:image>`
  )
  .join("\n")}
  </url>`;

  const aboutEntry = `  <url>
    <loc>${baseUrl}/about</loc>
    <image:image><image:loc>${baseUrl}/headshot.png</image:loc><image:caption>Mina Mankarious - Male Founder and CEO of Olunix, Toronto entrepreneur</image:caption></image:image>
    <image:image><image:loc>${baseUrl}/mina-mankarious-headshot.png</image:loc><image:caption>Mina Mankarious - Male Entrepreneur and CEO</image:caption></image:image>
  </url>`;

  // Map article slugs to their inline images for the image sitemap
  const articleImages: Record<string, string[]> = {
    "hi-im-mina": [
      "/mina-mankarious-headshot.png",
      "/mcmaster-university-crest.png",
    ],
  };

  const articleEntries = articles
    .map(
      (article) => `  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <image:image><image:loc>${baseUrl}/api/og?title=${encodeURIComponent(article.title)}&amp;excerpt=${encodeURIComponent(article.excerpt)}</image:loc></image:image>
${(articleImages[article.slug] || [])
  .map(
    (p) =>
      `    <image:image><image:loc>${baseUrl}${p}</image:loc></image:image>`
  )
  .join("\n")}
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${homepageEntry}
${aboutEntry}
${articleEntries}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
