/**
 * Loaders for pricing and lead-form content. Explicit populate (Strapi 5 populates nothing by
 * default), 300s ISR, and cache tags the /api/revalidate webhook can refresh.
 * Wrapped in React cache() so generateMetadata() and the page share one request.
 */
import { cache } from "react";
import { strapiFetch, TAGS } from "./strapi";
import type { AddOn, ContactPage, Plan, PricingPage, ThankYouPage } from "@/types/strapi";

const seo = { populate: { shareImage: true } };

export const getPricingPage = cache(() =>
  strapiFetch<PricingPage>("pricing-page", {
    populate: {
      hero: true,
      planFinder: { populate: { matches: true } },
      comparison: { populate: { features: true } },
      addOns: { populate: { cta: true } },
      costComparison: { populate: { rows: true } },
      guarantee: true,
      faq: { populate: { items: true, button: true } },
      closingCta: true,
      seo,
    },
    tags: [TAGS.pricing],
  }),
);

export const getPlans = cache(async () => {
  const plans = await strapiFetch<Plan[]>("plans", {
    populate: { features: true, teaserFeatures: true, comparisonValues: true },
    query: { sort: ["sortOrder:asc", "monthlyPrice:asc"], pagination: { pageSize: 20 } },
    tags: [TAGS.pricing],
  });
  return plans ?? [];
});

export const getAddOns = cache(async () => {
  const addOns = await strapiFetch<AddOn[]>("add-ons", {
    populate: { link: true },
    query: { sort: ["sortOrder:asc", "name:asc"], pagination: { pageSize: 50 } },
    tags: [TAGS.pricing],
  });
  return addOns ?? [];
});

/** The lead-form single type: /contact copy plus the field labels for every lead form. */
export const getLeadForm = cache(() =>
  strapiFetch<ContactPage>("lead-form", {
    populate: { hero: true, form: true, nextSteps: { populate: { steps: true, button: true } }, seo },
    tags: [TAGS.leadForm],
  }),
);

export const getThankYouPage = cache(() =>
  strapiFetch<ThankYouPage>("thank-you-page", {
    populate: { hero: true, prepare: { populate: { items: true } }, links: true, seo },
    tags: [TAGS.thankYou],
  }),
);

/** Same as the loaders above but never throws: for optional sections on other pages. */
export async function safe<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch {
    return fallback;
  }
}
