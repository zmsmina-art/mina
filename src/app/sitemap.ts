import { MetadataRoute } from "next";
import { getAllArticlesSorted } from "@/data/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticlesSorted();

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `https://minamankarious.com/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://minamankarious.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://minamankarious.com/articles",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articleEntries,
    {
      url: "https://minamankarious.com/fan-controller",
      lastModified: new Date("2026-02-10"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}

