import { cache } from "react";
import qs from "qs";

/**
 * Public Strapi base URL, used for public (read-only) REST reads and media.
 * NEXT_PUBLIC_STRAPI_API_URL is the existing name; NEXT_PUBLIC_STRAPI_URL is accepted as an alias.
 */
export const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337"
).replace(/\/+$/, "");

/** CMS-driven pages refresh from Strapi at most once a minute (ISR). */
export const REVALIDATE_SECONDS = 60;

/** Cache tags. Every Strapi read carries "strapi"; the revalidate webhook can purge by tag. */
export const TAGS = {
  all: "strapi",
  pricing: "pricing",
  leadForm: "lead-form",
  thankYou: "thank-you",
} as const;

const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";

type Query = Record<string, unknown>;

export async function fetchAPI(endpoint: string, query: Query = {}, options: RequestInit = {}) {
  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  const url = `${STRAPI_URL}/api/${endpoint}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...options.headers },
    next: { revalidate: REVALIDATE_SECONDS, tags: [TAGS.all] },
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
export const getSingleType = cache(async (type: string, query: Query = {}) => {
  try {
    const json = await fetchAPI(type, query);
    return json?.data ?? null;
  } catch (error) {
    console.error(`[strapi] ${type}:`, (error as Error).message);
    if (IS_BUILD) return null;
    throw error;
  }
});

export interface StrapiFetchOptions {
  /** Strapi 5 `populate` (explicit; Strapi populates nothing by default). */
  populate?: unknown;
  /** Any other REST params: filters, sort, fields, pagination, status… */
  query?: Query;
  /** ISR seconds. Defaults to 300. */
  revalidate?: number | false;
  /** Cache tags, so the /api/revalidate webhook can refresh this data on publish. */
  tags?: string[];
}

export interface StrapiResponse<T> {
  data: T;
  meta?: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } };
}

/**
 * Typed public read from the Strapi 5 REST API (flattened responses: no `data.attributes`).
 * Returns the response's `data`, or null for 404 (missing or unpublished).
 *
 * Same error policy as getSingleType: swallowed (null) during `next build`, re-thrown at
 * runtime so a failed ISR refresh keeps the last good page.
 */
export async function strapiFetch<T>(path: string, options: StrapiFetchOptions = {}): Promise<T | null> {
  const { populate, query = {}, revalidate = 300, tags = [] } = options;
  const params = populate === undefined ? query : { ...query, populate };
  const queryString = qs.stringify(params, { encodeValuesOnly: true });
  const endpoint = path.replace(/^\/+/, "").replace(/^api\//, "");
  const url = `${STRAPI_URL}/api/${endpoint}${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate, tags: [TAGS.all, ...tags] },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const json = (await response.json()) as StrapiResponse<T>;
    return json.data ?? null;
  } catch (error) {
    console.error(`[strapi] ${endpoint}:`, (error as Error).message);
    if (IS_BUILD) return null;
    throw error;
  }
}
