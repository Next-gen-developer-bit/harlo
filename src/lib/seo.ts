import type { Metadata } from "next";
import { siteUrl, siteName } from "./site";

/**
 * Shared metadata builder — every indexable page should go through this so
 * canonical, Open Graph and Twitter metadata are always self-referencing and
 * never accidentally inherit the homepage's. Pass the page's own path (e.g.
 * "/pricing", "" for the homepage).
 */
export function buildMetadata({
  title,
  description,
  path,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const canonicalPath = path === "" ? "/" : path;
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
