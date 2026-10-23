import { STRAPI_URL } from "./strapi";

/** Absolute URL for a Strapi media url (Strapi Cloud returns absolute URLs, local Strapi relative ones). */
export function buildImageSrc(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${STRAPI_URL}/${url.replace(/^\/+/, "")}`;
}

/** The site is dark-only, so the dark variant wins and the light one is the fallback. */
export function pickIcon(item) {
  if (!item) return null;
  const media = item.darkIcon || item.lightIcon || item.LightIcon || item.icon || null;
  return media?.url ? media : null;
}

/** Compact, serializable image props (safe to pass to client components). */
export function toImage(media, fallbackAlt = "") {
  if (!media?.url) return null;
  return {
    src: buildImageSrc(media.url),
    alt: media.alternativeText || fallbackAlt,
    width: media.width || 800,
    height: media.height || 600,
  };
}

/** Testimonial cards: an uploaded quote-mark icon is replaced by the design's own quote mark. */
export function isQuoteIcon(media) {
  return Boolean(media && /quote/i.test(`${media.name || ""} ${media.url || ""}`));
}
