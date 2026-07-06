import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/data-reader";

export default function robots(): MetadataRoute.Robots {
  const siteConfig = getSiteConfig();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
