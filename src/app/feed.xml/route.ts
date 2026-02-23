import { getAllArticlesSorted } from '@/data/articles';

export async function GET() {
  const articles = getAllArticlesSorted();
  const siteUrl = 'https://minamankarious.com';

  const rssItems = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/articles/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/articles/${article.slug}</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      ${article.tags.map((tag) => `<category>${tag}</category>`).join('\n      ')}
      <author>mina@olunix.com (Mina Mankarious)</author>
      <dc:creator>Mina Mankarious</dc:creator>
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Mina Mankarious - Founder &amp; CEO of Olunix</title>
    <link>${siteUrl}</link>
    <description>Thoughts on entrepreneurship, marketing, consulting, and building businesses by Mina Mankarious, founder and CEO of Olunix in Toronto.</description>
    <language>en-us</language>
    <dc:creator>Mina Mankarious</dc:creator>
    <lastBuildDate>${new Date(articles[0]?.updatedAt || new Date()).toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <managingEditor>mina@olunix.com (Mina Mankarious)</managingEditor>
    <webMaster>mina@olunix.com (Mina Mankarious)</webMaster>
    <image>
      <url>${siteUrl}/api/og</url>
      <title>Mina Mankarious</title>
      <link>${siteUrl}</link>
    </image>${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
