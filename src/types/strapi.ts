/**
 * Types for the Strapi 5 content used by pricing and the lead-form system.
 * Strapi 5 REST responses are flat: fields sit directly on the object next to id/documentId.
 * Optional fields come back as null when empty.
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

/* ---------- Rich text (Blocks) ---------- */

export interface BlockText {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}
export interface BlockLink {
  type: "link";
  url: string;
  children: BlockInline[];
}
export type BlockInline = BlockText | BlockLink;

export type BlockNode =
  | { type: "paragraph"; children: BlockInline[] }
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: BlockInline[] }
  | { type: "list"; format: "ordered" | "unordered"; children: BlockListItem[] }
  | { type: "quote"; children: BlockInline[] }
  | { type: "code"; children: BlockInline[] }
  | { type: "image"; image: { url: string; alternativeText?: string | null; width?: number; height?: number } };
export interface BlockListItem {
  type: "list-item";
  children: BlockInline[];
}
export type Blocks = BlockNode[];

/* ---------- shared.* components ---------- */

export interface SharedFeature extends StrapiComponent {
  text: string;
}
export interface SharedFaq extends StrapiComponent {
  question: string;
  answer: Blocks;
}
export interface SharedLink extends StrapiComponent {
  label: string | null;
  href: string | null;
}
export interface SharedCta extends StrapiComponent {
  heading: string | null;
  body: string | null;
  primaryLabel: string | null;
  primaryHref: string | null;
  secondaryLabel: string | null;
  secondaryHref: string | null;
}
export interface SharedGuarantee extends StrapiComponent {
  heading: string | null;
  body: string | null;
}
export interface SharedSeo extends StrapiComponent {
  metaTitle: string | null;
  metaDescription: string | null;
  noIndex: boolean | null;
}
export interface SharedNextStep extends StrapiComponent {
  title: string | null;
  text: string | null;
}
export interface LayoutButton extends StrapiComponent {
  title: string | null;
  url: string | null;
}

/* ---------- pricing.* components ---------- */

export interface PricingComparisonFeature extends StrapiComponent {
  key: string;
  label: string;
}
export interface PricingComparisonValue extends StrapiComponent {
  featureKey: string;
  value: string;
}
export interface PricingPlanMatch extends StrapiComponent {
  situation: string | null;
  planSlug: string | null;
  linkLabel: string | null;
  linkHref: string | null;
}
export interface PricingCostRow extends StrapiComponent {
  option: string | null;
  price: string | null;
  outcome: string | null;
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
  features?: SharedFeature[];
  teaserFeatures?: SharedFeature[];
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
  link?: SharedLink | null;
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
  eyebrow: string | null;
  heading: string | null;
  subheading: string | null;
  toggleUpfrontLabel: string | null;
  toggleZeroDownLabel: string | null;
  belowCardsNote: string | null;
  whichPlanHeading: string | null;
  whichPlan?: PricingPlanMatch[];
  comparisonFeatures?: PricingComparisonFeature[];
  addOnsHeading: string | null;
  ecommerce?: SharedCta | null;
  costComparisonHeading: string | null;
  costComparison?: PricingCostRow[];
  guarantee?: SharedGuarantee | null;
  faqHeading: string | null;
  faqs?: SharedFaq[];
  closingCta?: SharedCta | null;
  seo?: SharedSeo | null;
}

export interface NeedOption {
  value: LeadNeed;
  label: string;
}

export interface LeadFormContent extends StrapiDocument {
  eyebrow: string | null;
  heading: string | null;
  subheading: string | null;
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
  nextStepsHeading: string | null;
  nextSteps?: SharedNextStep[];
  seo?: SharedSeo | null;
}

export interface ThankYouPage extends StrapiDocument {
  heading: string | null;
  body: string | null;
  schedulerUrl: string | null;
  prepareHeading: string | null;
  prepareList?: SharedFeature[];
  links?: SharedLink[];
  seo?: SharedSeo | null;
}
