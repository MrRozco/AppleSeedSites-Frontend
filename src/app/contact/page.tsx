import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { has } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { seoMetadata } from "@/lib/seo";
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY } from "@/lib/contact";
import { getLeadForm, getThankYouPage, safe } from "@/lib/cms-data";
import { Eyebrow, Paragraphs } from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import PhoneLink from "@/components/shared/PhoneLink";
import LeadForm from "@/components/forms/LeadForm";

export async function generateMetadata(): Promise<Metadata> {
  const content = await safe(getLeadForm, null);
  return seoMetadata(content?.seo, {
    title: "Get a Free Website Plan | AppleSeed Sites",
    description: ROUTES.contact.description,
    path: ROUTES.contact.path,
  });
}

/** A real scheduler link, not the seed's https://cal.com/PLACEHOLDER. */
const usableScheduler = (url?: string | null) => (url && !/PLACEHOLDER/i.test(url) ? url : null);

/**
 * /contact: the lead-form single type (hero, form labels, "What happens next" steps) plus direct
 * contact options. The form still renders with built-in labels if Strapi is unreachable.
 */
export default async function ContactPage() {
  const [content, thanks] = await Promise.all([safe(getLeadForm, null), safe(getThankYouPage, null)]);
  const scheduler = usableScheduler(thanks?.schedulerUrl);
  const hero = content?.hero;
  const nextSteps = content?.nextSteps;
  const steps = (nextSteps?.steps || []).filter((s) => has(s?.title));

  return (
    <>
      <section className="as-section as-contact-page" aria-labelledby="contact-title">
        <div className="as-hero-bg" aria-hidden="true" />
        <div className="as-container as-contact-grid">
          <div className="as-contact-copy">
            <Eyebrow text={hero?.eyebrow || "Free, no obligation"} />
            <h1 className="as-h1 is-compact" id="contact-title">
              {hero?.title || "Get your free website plan."}
            </h1>
            <Paragraphs text={hero?.description} className="as-lead" />
          </div>

          <div className="as-contact-form">
            <div className="as-leadform-card">
              <LeadForm fields={content?.form} variant="full" />
            </div>
          </div>

          <div className="as-contact-talk">
            <h2 className="as-h3">Prefer to talk?</h2>
            <ul className="as-talk-cards">
              <li className="as-card">
                <PhoneLink location="contact-page" className="as-contactlink">
                  <span className="as-icon-tile" aria-hidden="true">
                    <Icon name="phone" />
                  </span>
                  <span>
                    Call {PHONE_DISPLAY}
                    <small>Talk it through on the phone</small>
                  </span>
                </PhoneLink>
              </li>
              <li className="as-card">
                <a className="as-contactlink" href={EMAIL_HREF}>
                  <span className="as-icon-tile" aria-hidden="true">
                    <Icon name="mail" />
                  </span>
                  <span>
                    Email {EMAIL}
                    <small>Send details, links or photos</small>
                  </span>
                </a>
              </li>
              {scheduler && (
                <li className="as-card">
                  <a className="as-contactlink" href={scheduler} target="_blank" rel="noopener noreferrer">
                    <span className="as-icon-tile" aria-hidden="true">
                      <Icon name="calendar" />
                    </span>
                    <span>
                      Book a 15-minute call
                      <small>Pick a time that works for you (opens in a new tab)</small>
                    </span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {steps.length > 0 && (
        <section className="as-section as-steps-sec" aria-labelledby="next-steps-title">
          <div className="as-container">
            <div className="as-head is-single as-reveal">
              <div className="as-head-title">
                <h2 className="as-h2" id="next-steps-title">
                  {nextSteps?.title || "What happens next"}
                </h2>
              </div>
            </div>
            <ol className="as-steps is-row" style={{ "--n": steps.length } as CSSProperties}>
              {steps.map((s, i) => (
                <li key={s.id ?? i} className="as-step as-reveal" style={{ "--rd": `${i * 90}ms` } as CSSProperties}>
                  <span className="as-step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div className="as-step-body">
                    <h3 className="as-h3">
                      <span className="as-sr">Step {i + 1}: </span>
                      {s.title}
                    </h3>
                    <Paragraphs text={s.body} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </>
  );
}
