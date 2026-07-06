import { getSiteConfig, getArticles } from "@/lib/data-reader";

export async function GET() {
  const siteConfig = getSiteConfig();
  const { articleList } = getArticles();

  const items = articleList
    .filter((a) => a.published)
    .map((article) => {
      const pubDate = new Date(article.published_at).toUTCString();
      const escapedExcerpt = article.excerpt
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

      return `    <item>
      <title>${article.title}</title>
      <link>${siteConfig.url}/en/blog/${article.slug}</link>
      <description>${escapedExcerpt}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${siteConfig.url}/blog/${article.slug}</guid>
      ${article.tags?.map((t: string) => `      <category>${t}</category>`).join("\n") || ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.title}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/api/rss" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
