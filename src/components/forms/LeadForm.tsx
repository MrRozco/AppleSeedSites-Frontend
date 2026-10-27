"use client";

import { Suspense, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cx } from "@/lib/utils";
import { track } from "@/lib/track";
import { pageSlug } from "@/lib/contact-link";
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY } from "@/lib/contact";
import {
  MAX,
  NEED_FALLBACK_LABELS,
  intentToNeed,
  parseLead,
  type LeadField,
  type LeadFieldErrors,
} from "@/lib/lead-schema";
import Icon from "@/components/ui/Icon";
import SmartLink from "@/components/ui/SmartLink";
import PhoneLink from "@/components/shared/PhoneLink";
import { LEAD_NEEDS, type LeadFormContent, type LeadNeed, type NeedOption } from "@/types/strapi";

export type LeadFormVariant = "full" | "compact";
/** "review" is the free site review form: website + email only, need = site-review. */
export type LeadFormKind = "lead" | "review";

export interface LeadFormProps {
  /** Labels and copy from the Strapi lead-form single type. Every label has a fallback. */
  content?: Partial<LeadFormContent> | null;
  /** full: every field. compact: name, email/phone, business, need. */
  variant?: LeadFormVariant;
  kind?: LeadFormKind;
  /** Preselected "What do you need?" when the URL has no ?intent=. */
  defaultNeed?: LeadNeed;
  submitLabel?: string | null;
  /** Override labels for the review form. */
  labels?: Partial<Record<"website" | "contact", string>>;
}

interface Attribution {
  plan: string;
  template: string;
  intent: string;
  from: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

const EMPTY_ATTRIBUTION: Attribution = {
  plan: "",
  template: "",
  intent: "",
  from: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
};

const DEFAULT_NEED_OPTIONS: NeedOption[] = (
  ["new-website", "fix-site", "online-store", "landing-page", "local-seo", "site-review", "not-sure"] as LeadNeed[]
).map((value) => ({ value, label: NEED_FALLBACK_LABELS[value] }));

/** "elevate" → "Elevate", "barber-shop" → "Barber Shop". */
const titleCase = (s: string) =>
  s
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

function needOptionsFrom(content: Partial<LeadFormContent> | null | undefined, preselected?: LeadNeed): NeedOption[] {
  const fromCms = Array.isArray(content?.needOptions)
    ? content.needOptions.filter(
        (o): o is NeedOption => Boolean(o?.label) && (LEAD_NEEDS as readonly string[]).includes(o?.value),
      )
    : [];
  const options = fromCms.length ? fromCms : DEFAULT_NEED_OPTIONS;
  // ?intent=audit or ?intent=preview may preselect a need the CMS list doesn't offer.
  if (preselected && !options.some((o) => o.value === preselected)) {
    return [...options, { value: preselected, label: NEED_FALLBACK_LABELS[preselected] }];
  }
  return options;
}

/** Reads attribution params from the URL. Rendered inside <Suspense> (useSearchParams). */
function LeadFormWithParams(props: LeadFormProps) {
  const params = useSearchParams();
  const get = (key: string) => (params.get(key) || "").trim();
  const attribution: Attribution = {
    plan: get("plan"),
    template: get("template"),
    intent: get("intent"),
    from: get("from"),
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
  };
  return <LeadFormInner {...props} attribution={attribution} />;
}

function LeadFormInner({
  content,
  variant = "full",
  kind = "lead",
  defaultNeed,
  submitLabel,
  labels,
  attribution,
}: LeadFormProps & { attribution: Attribution }) {
  const uid = useId();
  const router = useRouter();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef<number>(0);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "failed">("idle");
  const [failMessage, setFailMessage] = useState("");

  const isReview = kind === "review";
  const preselected = isReview ? "site-review" : intentToNeed(attribution.intent) || defaultNeed;
  const needOptions = needOptionsFrom(content, preselected);
  const [need, setNeed] = useState<string>(preselected || "");

  // Follow the URL when it arrives after hydration (the Suspense fallback renders without params).
  useEffect(() => {
    if (preselected) setNeed(preselected);
  }, [preselected]);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const show = {
    name: !isReview,
    business: !isReview,
    website: isReview || variant === "full",
    need: !isReview,
    message: !isReview && variant === "full",
  };

  const fieldId = (name: string) => `${uid}-${name}`;
  const errId = (name: string) => `${uid}-${name}-err`;

  function sourcePage(): string {
    if (attribution.from) return attribution.from;
    if (pathname && pathname !== "/contact") return pageSlug(pathname);
    // On /contact without ?from=, fall back to the page the visitor came from on this site.
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.origin === window.location.origin && ref.pathname !== "/contact") return pageSlug(ref.pathname);
    } catch {
      // Ignore malformed referrers.
    }
    return "contact";
  }

  function collect() {
    const form = formRef.current;
    const value = (name: string) => {
      const el = form?.elements.namedItem(name) as HTMLInputElement | null;
      return el?.value ?? "";
    };
    return {
      name: value("name"),
      contact: value("contact"),
      businessName: value("businessName"),
      website: value("website"),
      need: isReview ? "site-review" : need,
      message: value("message"),
      plan: attribution.plan,
      template: attribution.template,
      intent: attribution.intent,
      sourcePage: sourcePage(),
      utmSource: attribution.utmSource,
      utmMedium: attribution.utmMedium,
      utmCampaign: attribution.utmCampaign,
    };
  }

  /** Once a field has been flagged, re-check it as the visitor fixes it. */
  function recheck(field: LeadField) {
    if (!errors[field]) return;
    const result = parseLead(collect());
    const message = result.ok ? undefined : result.errors[field];
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = collect();
    const result = parseLead(data);
    if (!result.ok) {
      setErrors(result.errors);
      const first = (["name", "contact", "businessName", "website", "need", "message"] as LeadField[]).find(
        (f) => result.errors[f],
      );
      if (first) (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const honeypot = (formRef.current?.elements.namedItem("company_url") as HTMLInputElement | null)?.value || "";
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, company_url: honeypot, ts: startedAt.current, ts_submit: Date.now() }),
      });
      const json = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        errors?: LeadFieldErrors;
        error?: string;
      };
      if (response.status === 422 && json.errors) {
        setErrors(json.errors);
        setStatus("idle");
        return;
      }
      if (!response.ok || !json.ok) {
        setFailMessage(response.status === 429 ? "You've sent a few requests already." : "");
        throw new Error(json.error || `Request failed (${response.status})`);
      }
      track("lead_form_submit", { need: data.need, plan: data.plan, from: data.sourcePage });
      router.push("/thank-you");
    } catch {
      setStatus("failed");
    }
  }

  const sending = status === "sending";
  const picked = [
    attribution.plan && `${titleCase(attribution.plan)} plan`,
    attribution.template && `${titleCase(attribution.template)} template`,
  ].filter(Boolean);

  const describedBy = (name: LeadField) => (errors[name] ? errId(name) : undefined);
  const fieldError = (name: LeadField) => (
    <p className="as-field-err" id={errId(name)} hidden={!errors[name]}>
      <Icon name="alert" size={14} />
      <span>{errors[name]}</span>
    </p>
  );

  return (
    <form ref={formRef} className="as-leadform" action="/api/lead" method="post" noValidate onSubmit={onSubmit}>
      {picked.length > 0 && (
        <p className="as-picked">
          <Icon name="check" size={16} />
          <span>You picked: {picked.join(" + ")}</span>
        </p>
      )}

      {show.name && (
        <div className={cx("as-field", errors.name && "is-invalid")}>
          <label htmlFor={fieldId("name")}>{content?.nameLabel || "Name"}</label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={MAX.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            onChange={() => recheck("name")}
          />
          {fieldError("name")}
        </div>
      )}

      {show.website && isReview && (
        <WebsiteField
          id={fieldId("website")}
          label={labels?.website || "Your website"}
          placeholder="example.com"
          required
          error={errors.website}
          errId={errId("website")}
          onChange={() => recheck("website")}
        />
      )}

      <div className={cx("as-field", errors.contact && "is-invalid")}>
        <label htmlFor={fieldId("contact")}>{labels?.contact || content?.contactLabel || "Email or phone"}</label>
        <input
          id={fieldId("contact")}
          name="contact"
          type={isReview ? "email" : "text"}
          inputMode={isReview ? "email" : undefined}
          autoComplete={isReview ? "email" : "email tel"}
          placeholder={isReview ? undefined : content?.contactPlaceholder || undefined}
          required
          maxLength={MAX.contact}
          aria-invalid={errors.contact ? true : undefined}
          aria-describedby={describedBy("contact")}
          onChange={() => recheck("contact")}
        />
        {fieldError("contact")}
      </div>

      {show.business && (
        <div className={cx("as-field", errors.businessName && "is-invalid")}>
          <label htmlFor={fieldId("businessName")}>{content?.businessLabel || "Business name"}</label>
          <input
            id={fieldId("businessName")}
            name="businessName"
            type="text"
            autoComplete="organization"
            required
            maxLength={MAX.businessName}
            aria-invalid={errors.businessName ? true : undefined}
            aria-describedby={describedBy("businessName")}
            onChange={() => recheck("businessName")}
          />
          {fieldError("businessName")}
        </div>
      )}

      {show.website && !isReview && (
        <WebsiteField
          id={fieldId("website")}
          label={content?.websiteLabel || "Current website"}
          placeholder={content?.websitePlaceholder || "Leave blank if you don't have one"}
          error={errors.website}
          errId={errId("website")}
          onChange={() => recheck("website")}
        />
      )}

      {show.need && (
        <div className={cx("as-field", errors.need && "is-invalid")}>
          <label htmlFor={fieldId("need")}>{content?.needLabel || "What do you need?"}</label>
          <select
            id={fieldId("need")}
            name="need"
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            aria-invalid={errors.need ? true : undefined}
            aria-describedby={describedBy("need")}
          >
            <option value="">Choose one (optional)</option>
            {needOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {fieldError("need")}
        </div>
      )}

      {show.message && (
        <div className={cx("as-field", errors.message && "is-invalid")}>
          <label htmlFor={fieldId("message")}>
            {content?.messageLabel || "Anything else I should know?"} <span className="as-optional">(optional)</span>
          </label>
          <textarea
            id={fieldId("message")}
            name="message"
            rows={4}
            maxLength={MAX.message}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("message")}
            onChange={() => recheck("message")}
          />
          {fieldError("message")}
        </div>
      )}

      {/* Attribution from the URL, sent with the lead. */}
      {isReview && <input type="hidden" name="need" value="site-review" />}
      <input type="hidden" name="plan" value={attribution.plan} />
      <input type="hidden" name="template" value={attribution.template} />
      <input type="hidden" name="intent" value={attribution.intent} />
      <input type="hidden" name="from" value={attribution.from} />
      <input type="hidden" name="utm_source" value={attribution.utmSource} />
      <input type="hidden" name="utm_medium" value={attribution.utmMedium} />
      <input type="hidden" name="utm_campaign" value={attribution.utmCampaign} />

      {/* Honeypot: hidden from people and assistive tech; bots that fill it are ignored. */}
      <div className="as-sr" aria-hidden="true">
        <label htmlFor={fieldId("company_url")}>Company URL</label>
        <input id={fieldId("company_url")} name="company_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "failed" && (
        <div className="as-form-error" role="alert">
          <strong>Sorry, that didn&apos;t go through.</strong>
          <span>
            {failMessage ? `${failMessage} ` : "Please try again, or "}
            call <PhoneLink location="lead-form-error">{PHONE_DISPLAY}</PhoneLink> or email{" "}
            <a href={EMAIL_HREF}>{EMAIL}</a>.
          </span>
        </div>
      )}

      <button
        type="submit"
        className="as-btn as-btn-primary as-btn-lg as-btn-block"
        disabled={sending}
        aria-disabled={sending || undefined}
      >
        {sending ? (
          <>
            <span className="as-spinner" aria-hidden="true" />
            <span>Sending…</span>
          </>
        ) : (
          <>
            {submitLabel || content?.submitLabel || "Get My Free Website Plan"}
            <Icon name="arrow" size={18} className="as-arrow" />
          </>
        )}
      </button>
      <p className="as-sr" role="status">
        {sending ? "Sending your request" : ""}
      </p>

      {content?.underButtonText && <p className="as-form-note">{content.underButtonText}</p>}
      {content?.privacyText && <PrivacyText text={content.privacyText} />}
    </form>
  );
}

function WebsiteField({
  id,
  label,
  placeholder,
  required = false,
  error,
  errId,
  onChange,
}: {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  errId: string;
  onChange: () => void;
}) {
  return (
    <div className={cx("as-field", error && "is-invalid")}>
      <label htmlFor={id}>
        {label} {!required && <span className="as-optional">(optional)</span>}
      </label>
      <input
        id={id}
        name="website"
        type="text"
        inputMode="url"
        autoComplete="url"
        placeholder={placeholder}
        required={required}
        maxLength={MAX.website}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        onChange={onChange}
      />
      <p className="as-field-err" id={errId} hidden={!error}>
        <Icon name="alert" size={14} />
        <span>{error}</span>
      </p>
    </div>
  );
}

/** "…our Privacy Policy." → links "Privacy Policy" to /privacy-policy. */
function PrivacyText({ text }: { text: string }) {
  const match = text.match(/^(.*?)(Privacy Policy)(.*)$/);
  if (!match) return <p className="as-form-privacy">{text}</p>;
  return (
    <p className="as-form-privacy">
      {match[1]}
      <SmartLink href="/privacy-policy">{match[2]}</SmartLink>
      {match[3]}
    </p>
  );
}

/**
 * Lead form (client). Fields and labels from the Strapi lead-form single type; plan, template,
 * intent, from and utm_* come from the URL. Submits to /api/lead and goes to /thank-you.
 * The URL is read inside <Suspense>, so pages using the form can still be statically rendered.
 */
export default function LeadForm(props: LeadFormProps) {
  return (
    <Suspense fallback={<LeadFormInner {...props} attribution={EMPTY_ATTRIBUTION} />}>
      <LeadFormWithParams {...props} />
    </Suspense>
  );
}
