import type { Metadata } from "next";
import { has } from "@/lib/utils";
import { seoMetadata } from "@/lib/seo";
import { getThankYouPage, safe } from "@/lib/cms-data";
import { Paragraphs } from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import SmartLink from "@/components/ui/SmartLink";
import SchedulerEmbed from "@/components/forms/SchedulerEmbed";

export async function generateMetadata(): Promise<Metadata> {
  const page = await safe(getThankYouPage, null);
  return {
    ...seoMetadata(page?.seo, { title: "Thanks | AppleSeed Sites", path: "/thank-you", noIndex: true }),
    // Never indexed, whatever the CMS says.
    robots: { index: false, follow: true },
  };
}

/** Where LeadForm lands after a successful submission. */
export default async function ThankYouPage() {
  const page = await safe(getThankYouPage, null);
  const prepare = (page?.prepareList || []).filter((p) => has(p?.text));
  const links = (page?.links || []).filter((l) => has(l?.href) && has(l?.label));

  return (
    <>
      <header className="as-hero is-compact">
        <div className="as-hero-bg" aria-hidden="true" />
        <div className="as-container as-hero-in">
          <div className="as-hero-copy">
            <h1 className="as-h1 is-compact">{page?.heading || "Got it. I'll be in touch within 1 business day."}</h1>
            <Paragraphs text={page?.body} className="as-lead" />
          </div>
        </div>
      </header>

      <section className="as-section" aria-label="Book a call and next steps" style={{ paddingTop: 0 }}>
        <div className="as-container as-thanks">
          {page?.schedulerUrl ? <SchedulerEmbed url={page.schedulerUrl} /> : null}
          <div className="as-thanks-side">
            {prepare.length > 0 && (
              <div className="as-card">
                <h2 className="as-h4">{page?.prepareHeading || "What to have ready for our call"}</h2>
                <ul className="as-bullets">
                  {prepare.map((p, i) => (
                    <li key={p.id ?? i}>
                      <span className="as-check" aria-hidden="true">
                        <Icon name="check" size={13} />
                      </span>
                      <span>{p.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {links.length > 0 && (
              <nav aria-label="While you wait">
                <ul className="as-thanks-links">
                  {links.map((l, i) => (
                    <li key={l.id ?? i}>
                      <SmartLink href={l.href as string}>{l.label}</SmartLink>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
