/**
 * The one lead schema, shared by the form (instant inline feedback) and /api/lead (the real check).
 *
 * Visible fields get friendly error messages. Hidden attribution fields (plan, template, intent,
 * sourcePage, utm*) are never shown to people, so instead of failing they're trimmed and cut to
 * their max length.
 */
import { z } from "zod";
import { LEAD_NEEDS, type LeadNeed } from "@/types/strapi";

export const MAX = {
  name: 120,
  contact: 200,
  businessName: 160,
  website: 300,
  message: 3000,
  plan: 80,
  template: 80,
  intent: 80,
  sourcePage: 200,
  utm: 120,
} as const;

export const MESSAGES = {
  name: "Enter your name.",
  contact: "Enter a valid email address or US phone number.",
  businessName: "Enter your business name.",
  website: "Enter a valid website address, like example.com.",
  need: "Choose what you need.",
  tooLong: (max: number) => `Please keep this under ${max} characters.`,
} as const;

const EMAIL = z.string().email();

/** US phone: 10 digits (optionally +1 / 1 first), NANP area code and exchange can't start with 0 or 1. */
export function isUsPhone(value: string): boolean {
  if (!/^[\d\s().+-]+$/.test(value)) return false;
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits);
}

export function isEmailOrUsPhone(value: string): boolean {
  return EMAIL.safeParse(value).success || isUsPhone(value);
}

/** "example.com" → "https://example.com". Returns null when it isn't a usable http(s) address. */
export function normalizeWebsite(value: string): string | null {
  const raw = value.trim();
  if (!raw || /\s/.test(raw)) return null;
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw.replace(/^\/+/, "")}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!/^[^.]+(\.[^.]+)+$/.test(url.hostname)) return null;
    return withProtocol;
  } catch {
    return null;
  }
}

/** Empty strings and missing values become undefined, everything else is a trimmed string. */
const blankToUndefined = (v: unknown) => {
  if (v === null || v === undefined) return undefined;
  const s = String(v).trim();
  return s === "" ? undefined : s;
};

const requiredText = (max: number, message: string) =>
  z.preprocess(
    (v) => (v == null ? "" : String(v).trim()),
    z.string().min(1, message).max(max, MESSAGES.tooLong(max)),
  );

const optionalText = (max: number) =>
  z.preprocess(blankToUndefined, z.string().max(max, MESSAGES.tooLong(max)).optional());

/** Hidden fields: never an error, just trimmed and capped. */
const hidden = (max: number) =>
  z.preprocess((v) => {
    const s = blankToUndefined(v);
    return s === undefined ? undefined : s.slice(0, max);
  }, z.string().optional());

const websiteUrl = z
  .string()
  .max(MAX.website, MESSAGES.tooLong(MAX.website))
  .transform((v, ctx) => {
    const url = normalizeWebsite(v);
    if (!url) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: MESSAGES.website });
      return z.NEVER;
    }
    return url;
  });

const contact = z.preprocess(
  (v) => (v == null ? "" : String(v).trim()),
  z.string().max(MAX.contact, MESSAGES.tooLong(MAX.contact)).refine(isEmailOrUsPhone, MESSAGES.contact),
);

const attribution = {
  message: optionalText(MAX.message),
  plan: hidden(MAX.plan),
  template: hidden(MAX.template),
  intent: hidden(MAX.intent),
  sourcePage: hidden(MAX.sourcePage),
  utmSource: hidden(MAX.utm),
  utmMedium: hidden(MAX.utm),
  utmCampaign: hidden(MAX.utm),
};

/** The standard form: name, contact and business name are required, website is optional. */
export const leadSchema = z.object({
  name: requiredText(MAX.name, MESSAGES.name),
  contact,
  businessName: requiredText(MAX.businessName, MESSAGES.businessName),
  website: z.preprocess(blankToUndefined, websiteUrl.optional()),
  need: z.preprocess(blankToUndefined, z.enum(LEAD_NEEDS, { message: MESSAGES.need }).optional()),
  ...attribution,
});

/** The free site review form (/web-ops) only asks for a website and an email or phone. */
export const reviewLeadSchema = z.object({
  name: optionalText(MAX.name),
  contact,
  businessName: optionalText(MAX.businessName),
  website: z.preprocess((v) => blankToUndefined(v) ?? "", websiteUrl),
  need: z.literal("site-review"),
  ...attribution,
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema> | z.output<typeof reviewLeadSchema>;
export type LeadField = keyof LeadData;
export type LeadFieldErrors = Partial<Record<LeadField, string>>;

/** First message per field from a failed parse. */
export function toFieldErrors(error: z.ZodError): LeadFieldErrors {
  const errors: LeadFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as LeadField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

export type LeadParseResult = { ok: true; data: LeadData } | { ok: false; errors: LeadFieldErrors };

/** Validates with the review schema when need is "site-review", otherwise the standard one. */
export function parseLead(input: unknown): LeadParseResult {
  const isReview = (input as { need?: unknown } | null)?.need === "site-review";
  const result = isReview ? reviewLeadSchema.safeParse(input) : leadSchema.safeParse(input);
  return result.success ? { ok: true, data: result.data } : { ok: false, errors: toFieldErrors(result.error) };
}

/** ?intent= values used in links across the site → the "What do you need?" option they preselect. */
export const INTENT_TO_NEED: Record<string, LeadNeed> = {
  store: "online-store",
  review: "site-review",
  landing: "landing-page",
  seo: "local-seo",
  audit: "site-audit",
  preview: "preview",
};

export function intentToNeed(intent: string | null | undefined): LeadNeed | undefined {
  if (!intent) return undefined;
  const key = intent.trim().toLowerCase();
  if (INTENT_TO_NEED[key]) return INTENT_TO_NEED[key];
  return (LEAD_NEEDS as readonly string[]).includes(key) ? (key as LeadNeed) : undefined;
}

/** Labels for needs that can be preselected by ?intent= but may not be in the CMS option list. */
export const NEED_FALLBACK_LABELS: Record<LeadNeed, string> = {
  "new-website": "New website",
  "fix-site": "Fix my current site",
  "online-store": "Online store",
  "landing-page": "Landing page",
  "local-seo": "Local SEO",
  "site-review": "Free site review",
  "site-audit": "Full website audit",
  preview: "Free homepage preview",
  "not-sure": "Not sure yet",
};

/**
 * Validated form data → the Strapi `lead` create payload.
 * The review form doesn't ask for a name or business, which Strapi requires, so those get a
 * clear stand-in derived from the website.
 */
export function toStrapiLead(lead: LeadData) {
  const host = lead.website ? new URL(lead.website).hostname.replace(/^www\./, "") : "";
  return {
    name: lead.name || "(site review request)",
    contact: lead.contact,
    business: lead.businessName || host || "(not given)",
    website: lead.website ?? null,
    need: lead.need ?? null,
    message: lead.message ?? null,
    plan: lead.plan ?? null,
    template: lead.template ?? null,
    intent: lead.intent ?? null,
    sourcePage: lead.sourcePage ?? null,
    utmSource: lead.utmSource ?? null,
    utmMedium: lead.utmMedium ?? null,
    utmCampaign: lead.utmCampaign ?? null,
  };
}
