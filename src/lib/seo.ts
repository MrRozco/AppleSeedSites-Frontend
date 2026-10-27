import type { Metadata } from "next";
import type { SharedSeo } from "@/types/strapi";

/** Next metadata from a shared.seo component, with static fallbacks when the CMS is empty or down. */
export function seoMetadata(
  seo: SharedSeo | null | undefined,
  fallback: { title: string; description?: string; path: string; noIndex?: boolean },
): Metadata {
  const title = seo?.metaTitle || fallback.title;
  const description = seo?.metaDescription || fallback.description;
  const noIndex = seo?.noIndex ?? fallback.noIndex ?? false;
  return {
    // Meta titles in Strapi already carry the brand, so skip the layout's title template.
    title: { absolute: title },
    description,
    alternates: { canonical: fallback.path },
    openGraph: { title, description, url: fallback.path },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
