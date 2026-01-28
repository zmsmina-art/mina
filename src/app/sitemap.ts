import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://minamankarious.com";
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [
        `${baseUrl}/headshot.png`,
        `${baseUrl}/headshot.jpg`,
        `${baseUrl}/og-image.jpg`,
        `${baseUrl}/olunix-logo.png`,
        `${baseUrl}/boardy-logo.png`,
        `${baseUrl}/habits-together-logo.png`,
        `${baseUrl}/hope-logo.webp`,
        `${baseUrl}/toyota-logo.png`,
        `${baseUrl}/mcmaster-logo.png`,
        `${baseUrl}/zms-logo.svg`,
      ],
    },
  ];
}
