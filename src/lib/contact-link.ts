/**
 * Every link to /contact carries ?from={page-slug} so leads show where they came from.
 * CMS links (navbar, footer, section buttons) point at plain "/contact"; withFrom() adds the
 * slug of the page the link is on at render time. Links that already set ?from= are left alone.
 */

const SITE_HOSTS = /^(www\.)?appleseedsites\.com$/i;

/** "/" → "home", "/small-business" → "small-business", "/a/b" → "a-b". */
export const pageSlug = (path: string) => path.replace(/^\/+|\/+$/g, "").replace(/\//g, "-") || "home";

/** True for /contact, /contact?…, /contact#… and https://(www.)appleseedsites.com/contact… */
export function isContactHref(href: string | null | undefined): boolean {
  if (!href) return false;
  try {
    const url = new URL(href, "https://www.appleseedsites.com");
    const sameSite = href.startsWith("/") || SITE_HOSTS.test(url.hostname);
    return sameSite && /^\/contact\/?$/.test(url.pathname) && !href.startsWith("//");
  } catch {
    return false;
  }
}

/** Adds ?from={from} to a contact link that doesn't have one. Other links are returned unchanged. */
export function withFrom(href: string, from: string): string {
  if (!isContactHref(href) || !from) return href;
  const absolute = /^https?:/i.test(href);
  const url = new URL(href, "https://www.appleseedsites.com");
  if (url.searchParams.has("from")) return href;
  url.searchParams.set("from", from);
  return absolute ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
}
