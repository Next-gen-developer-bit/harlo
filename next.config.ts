import type { NextConfig } from "next";

const platformSlugs = ["instagram", "facebook", "linkedin", "tiktok", "youtube", "threads", "pinterest", "x"];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Domain migration: poscally.com and www.poscally.com are still
      // attached to this Vercel project and still resolve. harlosocial.com
      // is now the live, verified production domain, so every request to
      // the old domain is redirected to the equivalent harlosocial.com path
      // (not just the homepage) so bookmarks and backlinks keep working.
      {
        source: "/:path*",
        has: [{ type: "host", value: "poscally.com" }],
        destination: "https://harlosocial.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.poscally.com" }],
        destination: "https://harlosocial.com/:path*",
        permanent: true,
      },
      {
        source: "/features/social-calendar",
        destination: "/social-media-calendar",
        permanent: true,
      },
      {
        source: "/features/scheduling",
        destination: "/social-media-scheduler",
        permanent: true,
      },
      // Legacy ICP landing pages consolidated into the standard 3-group
      // audience taxonomy (Growing Businesses & Marketing Teams / Freelance
      // Social Media Managers & Marketing Consultants / Marketing & Social
      // Media Agencies) — redirected to their closest equivalent /for/ page
      // rather than left as separate overlapping positioning pages.
      { source: "/creators", destination: "/for/growing-businesses", permanent: true },
      { source: "/social-media-managers", destination: "/for/freelance-marketers", permanent: true },
      // Legacy short-link path from the old brand, kept working for any
      // existing external bookmarks/backlinks — it's a redirect source only
      // and never renders anywhere, so it carries no visible old branding.
      { source: "/poscally-links", destination: "/features", permanent: true },
      // /about was removed from navigation and is no longer a marketing
      // page (see the site-wide consistency pass) — redirected rather than
      // left as an orphaned, unlinked page for any existing bookmarks/backlinks.
      { source: "/about", destination: "/", permanent: true },
      { source: "/privacy", destination: "/legal/privacy", permanent: true },
      { source: "/terms", destination: "/legal/terms", permanent: true },
      { source: "/cookies", destination: "/legal/cookies", permanent: true },
      { source: "/data-deletion", destination: "/legal/data-deletion", permanent: true },
      { source: "/partners/terms", destination: "/legal/partner-terms", permanent: true },
      ...platformSlugs.map((slug) => ({
        source: `/platforms/${slug}`,
        destination: `/${slug}-scheduler`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
