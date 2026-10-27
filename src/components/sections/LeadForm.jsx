import { has } from "@/lib/utils";
import { Eyebrow, Paragraphs, headingId } from "@/components/ui/Section";
import LeadForm from "@/components/forms/LeadForm";
import ReviewForm from "@/components/forms/ReviewForm";

/**
 * custom.lead-form: lead form on the deep-blue band, placed on CMS pages.
 * Section copy (eyebrow, title, description, submitLabel) comes from the section; field labels
 * come from the lead-form single type (`leadForm`). Submissions go to /api/lead → /thank-you.
 * `kind="review"` renders the free site review form (website + email) instead.
 */
export default function LeadFormSection({ data, anchor, leadForm, kind = "lead" }) {
  const { eyebrow, title, description } = data || {};
  const id = headingId("lead-form", data);

  return (
    <section className="as-section as-leadsec" aria-labelledby={has(title) ? id : undefined} id={anchor}>
      <div className="as-container">
        <div className="as-ctaband as-lead-band as-reveal">
          <div className="as-lead-copy">
            <Eyebrow text={eyebrow} />
            {has(title) && (
              <h2 className="as-h2" id={id}>
                {title}
              </h2>
            )}
            <Paragraphs text={description} className="as-lead" />
          </div>
          <div className="as-leadform-card">
            {kind === "review" ? (
              <ReviewForm content={leadForm} />
            ) : (
              <LeadForm content={leadForm} variant="compact" submitLabel={data?.submitLabel} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
