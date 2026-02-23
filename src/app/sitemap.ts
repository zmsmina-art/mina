import { MetadataRoute } from "next";
import { getAllArticlesSorted } from "@/data/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticlesSorted();
  const siteLastModified = articles.length > 0
    ? new Date(articles[0].updatedAt)
    : new Date();

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `https://minamankarious.com/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://minamankarious.com",
      lastModified: siteLastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://minamankarious.com/about",
      lastModified: siteLastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://minamankarious.com/articles",
      lastModified: siteLastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://minamankarious.com/newsletter",
      lastModified: siteLastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...articleEntries,
    {
      url: "https://minamankarious.com/book",
      lastModified: siteLastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://minamankarious.com/privacy",
      lastModified: new Date("2026-02-19"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://minamankarious.com/fan-controller",
      lastModified: new Date("2026-02-10"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
