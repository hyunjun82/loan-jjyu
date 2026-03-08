import { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { spokeArticles } from "@/data/articles";

const BASE_URL = "https://loan.jjyu.co.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  ];

  // Hub pages
  for (const cat of categories) {
    entries.push({
      url: `${BASE_URL}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Spoke pages
  for (const [catSlug, spokes] of Object.entries(spokeArticles)) {
    for (const spokeSlug of Object.keys(spokes)) {
      entries.push({
        url: `${BASE_URL}/${catSlug}/${spokeSlug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
