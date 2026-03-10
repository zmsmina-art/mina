import { getAllArticlesSorted } from '@/data/articles';

function markdownToHtml(md: string): string {
  return md
    // code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // headings
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // horizontal rules
    .replace(/^---$/gm, '<hr />')
    // unordered lists
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    // paragraphs (double newlines)
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(h[1-4]|pre|hr|li|ul|ol)/.test(trimmed)) return trimmed;
      // wrap consecutive <li> in <ul>
      if (trimmed.startsWith('<li>')) return `<ul>${trimmed}</ul>`;
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .filter(Boolean)
    .join('\n');
}

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
      <content:encoded><![CDATA[${markdownToHtml(article.content)}]]></content:encoded>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      ${article.tags.map((tag) => `<category>${tag}</category>`).join('\n      ')}
      <author>mina@olunix.com (Mina Mankarious)</author>
      <dc:creator>Mina Mankarious</dc:creator>
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
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
