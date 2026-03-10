import { getAllArticlesSorted } from "@/data/articles";

const baseUrl = "https://minamankarious.com";

const homepageImages: { path: string; caption: string }[] = [
  { path: "/headshot.webp", caption: "Mina Mankarious - Founder and CEO of Olunix" },
  { path: "/olunix.svg", caption: "Olunix logo - marketing consulting agency in Toronto" },
  { path: "/boardy-logo.png", caption: "Boardy AI logo - AI networking platform" },
  { path: "/habits-together-logo.png", caption: "Habits Together logo - collaborative habit tracking app" },
  { path: "/hope-logo.webp", caption: "Hope logo" },
  { path: "/toyota-logo.png", caption: "Toyota logo - automotive engineering experience" },
  { path: "/mcmaster-logo.png", caption: "McMaster University logo - engineering education" },
];

export async function GET() {
  const articles = getAllArticlesSorted();

  const homepageEntry = `  <url>
    <loc>${baseUrl}/</loc>
${homepageImages
  .map(
    (img) =>
      `    <image:image><image:loc>${baseUrl}${img.path}</image:loc><image:caption>${img.caption}</image:caption></image:image>`
  )
  .join("\n")}
  </url>`;

  const aboutEntry = `  <url>
    <loc>${baseUrl}/about</loc>
    <image:image><image:loc>${baseUrl}/headshot.webp</image:loc><image:caption>Mina Mankarious - Founder and CEO of Olunix, Toronto entrepreneur</image:caption></image:image>
    <image:image><image:loc>${baseUrl}/mina-mankarious-headshot.webp</image:loc><image:caption>Mina Mankarious - Entrepreneur and CEO</image:caption></image:image>
  </url>`;

  // Map article slugs to their inline images for the image sitemap
  const articleImages: Record<string, { path: string; caption: string }[]> = {
    "hi-im-mina": [
      { path: "/mina-mankarious-headshot.webp", caption: "Mina Mankarious headshot - founder introduction" },
      { path: "/mcmaster-university-crest.png", caption: "McMaster University crest - engineering education" },
    ],
  };

  const articleEntries = articles
    .map(
      (article) => `  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <image:image><image:loc>${baseUrl}/api/og?title=${encodeURIComponent(article.title)}&amp;excerpt=${encodeURIComponent(article.excerpt)}</image:loc><image:caption>${article.title} - article by Mina Mankarious</image:caption></image:image>
${(articleImages[article.slug] || [])
  .map(
    (img) =>
      `    <image:image><image:loc>${baseUrl}${img.path}</image:loc><image:caption>${img.caption}</image:caption></image:image>`
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
