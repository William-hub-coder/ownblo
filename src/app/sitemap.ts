import type { MetadataRoute } from "next";
import { getSiteConfig, getArticles, getProjects, getAlbums } from "@/lib/data-reader";
import { locales } from "@/lib/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.url;
  const { articleList } = getArticles();
  const { projectList } = getProjects();
  const { albumList } = getAlbums();

  const staticPages = [
    { path: "", priority: 1, changeFreq: "monthly" as const },
    { path: "/projects", priority: 0.8, changeFreq: "monthly" as const },
    { path: "/blog", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/photography", priority: 0.7, changeFreq: "monthly" as const },
    { path: "/about", priority: 0.6, changeFreq: "monthly" as const },
    { path: "/bookmarks", priority: 0.5, changeFreq: "monthly" as const },
    { path: "/contact", priority: 0.5, changeFreq: "monthly" as const },
    { path: "/stats", priority: 0.3, changeFreq: "monthly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Static pages
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    }

    // Blog articles
    for (const article of articleList) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    }

    // Projects
    for (const project of projectList) {
      entries.push({
        url: `${baseUrl}/${locale}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }

    // Photography albums
    for (const album of albumList) {
      entries.push({
        url: `${baseUrl}/${locale}/photography/${album.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    }
  }

  return entries;
}
