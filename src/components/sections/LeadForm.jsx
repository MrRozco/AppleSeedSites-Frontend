import { has } from "@/lib/utils";
import { Eyebrow, Paragraphs, headingId } from "@/components/ui/Section";
import LeadFormFields from "./LeadFormFields";

/**
 * custom.lead-form: free website plan form on the deep-blue band.
 * Fields: eyebrow, title, description, submitLabel, successTitle, successText.
 * The four inputs are fixed in code because they feed the lead API (app/api/lead/route.js),
 * which saves each submission as a Lead in Strapi.
 */
export default function LeadForm({ data, anchor }) {
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
            <LeadFormFields
              submitLabel={data?.submitLabel || "Get My Free Plan"}
              successTitle={data?.successTitle || "Thanks! Your free plan is on its way."}
              successText={data?.successText || "We'll reach out within 1 business day."}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
