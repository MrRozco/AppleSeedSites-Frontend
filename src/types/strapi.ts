/**
 * Types for the Strapi 5 content the typed parts of the site read (pricing, contact, thank-you,
 * SEO). Strapi 5 REST responses are flat: fields sit directly on the object next to id/documentId.
 * Optional fields come back as null when empty.
 *
 * Component folders in Strapi: sections.* (page blocks), elements.* (items inside them),
 * navigation.*, pricing.*, forms.*, shared.*.
 */

export interface StrapiDocument {
  id: number;
  documentId: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

interface StrapiComponent {
  id: number;
}

export interface StrapiMedia {
  id: number;
  url: string;
  name?: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
}

/* ---------- elements.* ---------- */

export interface ElementsLink extends StrapiComponent {
  label: string | null;
  url: string | null;
}
export interface ElementsListItem extends StrapiComponent {
  text: string;
}
export interface ElementsStep extends StrapiComponent {
  title: string | null;
  body: string | null;
}
export interface ElementsFaqItem extends StrapiComponent {
  question: string | null;
  /** Rich text (Markdown). */
  answer: string | null;
}

/* ---------- sections.* used outside the page renderer ---------- */

export interface SectionsSteps extends StrapiComponent {
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  steps?: ElementsStep[];
  button?: ElementsLink | null;
}
export interface SectionsFaq extends StrapiComponent {
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  items?: ElementsFaqItem[];
  button?: ElementsLink | null;
}

/* ---------- shared.* ---------- */

export interface SharedSeo extends StrapiComponent {
  metaTitle: string | null;
  metaDescription: string | null;
  shareImage?: StrapiMedia | null;
  noIndex: boolean | null;
}
export interface SharedPageIntro extends StrapiComponent {
  eyebrow: string | null;
  title: string | null;
  description: string | null;
}
export interface SharedCta extends StrapiComponent {
  title: string | null;
  description: string | null;
  primaryLabel: string | null;
  primaryUrl: string | null;
  secondaryLabel: string | null;
  secondaryUrl: string | null;
}
export interface SharedGuarantee extends StrapiComponent {
  title: string | null;
  description: string | null;
}
export interface SharedChecklist extends StrapiComponent {
  title: string | null;
  items?: ElementsListItem[];
}

/* ---------- pricing.* ---------- */

export interface PricingHero extends StrapiComponent {
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  upfrontLabel: string | null;
  zeroDownLabel: string | null;
  belowCardsNote: string | null;
}
export interface PricingPlanMatch extends StrapiComponent {
  situation: string | null;
  planSlug: string | null;
  linkLabel: string | null;
  linkUrl: string | null;
}
export interface PricingPlanFinder extends StrapiComponent {
  title: string | null;
  matches?: PricingPlanMatch[];
}
export interface PricingComparisonFeature extends StrapiComponent {
  key: string;
  label: string;
}
export interface PricingComparison extends StrapiComponent {
  title: string | null;
  features?: PricingComparisonFeature[];
}
export interface PricingComparisonValue extends StrapiComponent {
  featureKey: string;
  value: string;
}
export interface PricingAddOns extends StrapiComponent {
  title: string | null;
  cta?: SharedCta | null;
}
export interface PricingCostRow extends StrapiComponent {
  option: string | null;
  price: string | null;
  outcome: string | null;
}
export interface PricingCostComparison extends StrapiComponent {
  title: string | null;
  rows?: PricingCostRow[];
}

/* ---------- forms.* ---------- */

export interface NeedOption {
  value: LeadNeed;
  label: string;
}

/** forms.lead-form-fields: labels for every lead form on the site. */
export interface LeadFormFields extends StrapiComponent {
  nameLabel: string | null;
  contactLabel: string | null;
  contactPlaceholder: string | null;
  businessLabel: string | null;
  websiteLabel: string | null;
  websitePlaceholder: string | null;
  needLabel: string | null;
  needOptions: NeedOption[] | null;
  messageLabel: string | null;
  submitLabel: string | null;
  underButtonText: string | null;
  privacyText: string | null;
}

/* ---------- Collection types ---------- */

export interface Plan extends StrapiDocument {
  name: string;
  slug: string;
  bestFor: string | null;
  monthlyPrice: number;
  setupFee: number;
  zeroDownMonthly: number;
  zeroDownMonths: number | null;
  includesPrevious: string | null;
  features?: ElementsListItem[];
  teaserFeatures?: ElementsListItem[];
  badge: string | null;
  isHighlighted: boolean | null;
  ctaLabel: string | null;
  comparisonValues?: PricingComparisonValue[];
  sortOrder: number | null;
}

export type AddOnPriceSuffix = "one-time" | "per-month" | "each";

export interface AddOn extends StrapiDocument {
  name: string;
  price: number | null;
  priceSuffix: AddOnPriceSuffix | null;
  priceNote: string | null;
  description: string | null;
  link?: ElementsLink | null;
  sortOrder: number | null;
}

export const LEAD_NEEDS = [
  "new-website",
  "fix-site",
  "online-store",
  "landing-page",
  "local-seo",
  "site-review",
  "site-audit",
  "preview",
  "not-sure",
] as const;
export type LeadNeed = (typeof LEAD_NEEDS)[number];

export const LEAD_STATUSES = ["new", "contacted", "proposal-sent", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** A lead as stored in Strapi. Never read publicly; listed for the write payload and the admin. */
export interface Lead extends StrapiDocument {
  name: string;
  contact: string;
  /** "Business name". Kept as `business` so existing production leads keep their data. */
  business: string;
  website: string | null;
  need: LeadNeed | null;
  message: string | null;
  plan: string | null;
  template: string | null;
  intent: string | null;
  sourcePage: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  /** Legacy fields from the first lead form. */
  hasWebsite: "yes" | "no" | null;
  page: string | null;
  status: LeadStatus;
  notes: string | null;
}

/* ---------- Single types ---------- */

export interface PricingPage extends StrapiDocument {
  hero?: PricingHero | null;
  planFinder?: PricingPlanFinder | null;
  comparison?: PricingComparison | null;
  addOns?: PricingAddOns | null;
  costComparison?: PricingCostComparison | null;
  guarantee?: SharedGuarantee | null;
  faq?: SectionsFaq | null;
  closingCta?: SharedCta | null;
  seo?: SharedSeo | null;
}

/** The lead-form single type: the /contact page plus the labels for every lead form. */
export interface ContactPage extends StrapiDocument {
  hero?: SharedPageIntro | null;
  form?: LeadFormFields | null;
  nextSteps?: SectionsSteps | null;
  seo?: SharedSeo | null;
}

export interface ThankYouPage extends StrapiDocument {
  hero?: SharedPageIntro | null;
  schedulerUrl: string | null;
  prepare?: SharedChecklist | null;
  links?: ElementsLink[];
  seo?: SharedSeo | null;
}
