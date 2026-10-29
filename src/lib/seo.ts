import type { Metadata } from "next";
import type { SharedSeo } from "@/types/strapi";
import { buildImageSrc } from "./media";

/**
 * Next metadata from a shared.seo component (every page type has one), with static fallbacks
 * for when the CMS is empty or down.
 */
export function seoMetadata(
  seo: SharedSeo | null | undefined,
  fallback: { title: string; description?: string; path: string; noIndex?: boolean },
): Metadata {
  const title = seo?.metaTitle || fallback.title;
  const description = seo?.metaDescription || fallback.description;
  const noIndex = seo?.noIndex ?? fallback.noIndex ?? false;
  const image = seo?.shareImage?.url
    ? [{ url: buildImageSrc(seo.shareImage.url), width: seo.shareImage.width, height: seo.shareImage.height }]
    : undefined;
  return {
    // Meta titles in Strapi already carry the brand, so skip the layout's title template.
    title: { absolute: title },
    description,
    alternates: { canonical: fallback.path },
    openGraph: { title, description, url: fallback.path, ...(image ? { images: image } : {}) },
    ...(image ? { twitter: { card: "summary_large_image", images: image.map((i) => i.url) } } : {}),
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
