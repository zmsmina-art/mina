import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: [
      "https://minamankarious.com/sitemap.xml",
      "https://minamankarious.com/sitemap-images.xml",
    ],
  };
}
