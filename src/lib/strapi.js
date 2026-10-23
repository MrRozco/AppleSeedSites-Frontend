import { cache } from "react";
import qs from "qs";

export const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337").replace(/\/+$/, "");

/** Content refreshes from Strapi at most once a minute (ISR). */
export const REVALIDATE_SECONDS = 60;

const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";

export async function fetchAPI(endpoint, query = {}, options = {}) {
  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  const url = `${STRAPI_URL}/api/${endpoint}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...options.headers },
    next: { revalidate: REVALIDATE_SECONDS },
    ...options,
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Strapi request failed for "${endpoint}": ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch a Strapi single type. Returns the flat Strapi 5 `data` object, or null when the
 * type is missing or unpublished.
 *
 * Errors: during `next build` they are logged and swallowed so an unreachable CMS can't
 * break a deploy. At runtime they are re-thrown on purpose: when an ISR revalidation
 * fails, Next keeps serving the last good version of the page instead of caching a
 * broken one.
 *
 * Wrapped in React `cache()` so generateMetadata() and the page share one request.
 */
export const getSingleType = cache(async (type, query = {}) => {
  try {
    const json = await fetchAPI(type, query);
    return json?.data ?? null;
  } catch (error) {
    console.error(`[strapi] ${type}:`, error.message);
    if (IS_BUILD) return null;
    throw error;
  }
});
