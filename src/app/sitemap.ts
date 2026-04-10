import { MetadataRoute } from "next";
import { getAllArticlesSorted, getAllTags, slugifyTag } from "@/data/articles";
import { getAllPersonas } from "@/data/positioning-grader-personas";

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
      url: "https://minamankarious.com/work",
      lastModified: siteLastModified,
      changeFrequency: "monthly",
      priority: 0.85,
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
    ...getAllTags().map((tag) => ({
      url: `https://minamankarious.com/articles/tag/${slugifyTag(tag)}`,
      lastModified: siteLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    {
      url: "https://minamankarious.com/positioning-grader",
      lastModified: new Date("2026-02-28"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://minamankarious.com/roast",
      lastModified: new Date("2026-03-02"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...getAllPersonas().map((persona) => ({
      url: `https://minamankarious.com/positioning-grader/${persona.slug}`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: "https://minamankarious.com/book",
      lastModified: siteLastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://minamankarious.com/privacy",
      lastModified: siteLastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
