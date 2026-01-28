const baseUrl = "https://minamankarious.com";

const images = [
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
  const url = `${baseUrl}/`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${url}</loc>
${images
  .map(
    (p) =>
      `    <image:image><image:loc>${baseUrl}${p}</image:loc></image:image>`
  )
  .join("\n")}
  </url>
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
