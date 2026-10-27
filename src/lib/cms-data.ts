/**
 * Loaders for pricing and lead-form content. Explicit populate (Strapi 5 populates nothing by
 * default), 300s ISR, and cache tags the /api/revalidate webhook can refresh.
 * Wrapped in React cache() so generateMetadata() and the page share one request.
 */
import { cache } from "react";
import { strapiFetch, TAGS } from "./strapi";
import type { AddOn, LeadFormContent, Plan, PricingPage, ThankYouPage } from "@/types/strapi";

export const getPricingPage = cache(() =>
  strapiFetch<PricingPage>("pricing-page", {
    populate: {
      whichPlan: true,
      comparisonFeatures: true,
      ecommerce: true,
      costComparison: true,
      guarantee: true,
      faqs: true,
      closingCta: true,
      seo: true,
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

export const getLeadForm = cache(() =>
  strapiFetch<LeadFormContent>("lead-form", {
    populate: { nextSteps: true, seo: true },
    tags: [TAGS.leadForm],
  }),
);

export const getThankYouPage = cache(() =>
  strapiFetch<ThankYouPage>("thank-you-page", {
    populate: { prepareList: true, links: true, seo: true },
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
