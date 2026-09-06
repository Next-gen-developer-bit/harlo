import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { platformSlugs } from "@/lib/platform-content";

const staticRoutes = [
  "",
  "/features",
  "/features/queue-scheduling",
  "/features/analytics",
  "/features/workspaces",
  "/features/content-library",
  "/features/drafts",
  "/features/team-collaboration",
  "/features/ai-caption-assistant",
  "/social-media-scheduler",
  "/social-media-calendar",
  "/campaigns",
  "/for/growing-businesses",
  "/for/freelance-marketers",
  "/for/agencies",
  "/feedback",
  "/platforms",
  "/pricing",
  "/demo",
  "/resources",
  "/mobile",
  "/contact",
  "/partners",
  "/legal",
  "/legal/privacy",
  "/legal/terms",
  "/legal/gdpr",
  "/legal/cookies",
  "/legal/data-deletion",
  "/legal/partner-terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const platformRoutes = platformSlugs.map((slug) => `/${slug}-scheduler`);

  return [...staticRoutes, ...platformRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.endsWith("-scheduler") || route.startsWith("/social-media") || route.startsWith("/for/") ? 0.9 : 0.7,
  }));
}
