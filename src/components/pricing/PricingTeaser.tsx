import { firstButton, has } from "@/lib/utils";
import Icon from "@/components/ui/Icon";
import SmartLink from "@/components/ui/SmartLink";
import { CmsButton } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/Section";
import type { ElementsLink, Plan } from "@/types/strapi";
import PlanGrid from "./PlanGrid";

/**
 * Homepage pricing section: title, description, the plans as compact cards, and a button below them.
 * Copy comes from the homepage's sections.pricing section (eyebrow, title, description, button).
 * Without a button in Strapi it falls back to a link to /pricing.
 */
export default function PricingTeaser({
  eyebrow,
  title,
  description,
  plans,
  button,
  anchor,
  from = "home",
}: {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  plans: Plan[];
  button?: ElementsLink | null;
  anchor?: string;
  from?: string;
}) {
  if (!plans.length) return null;
  const cta = firstButton(button);
  return (
    <section className="as-section as-pricing" id={anchor} aria-labelledby={has(title) ? "pricing-teaser-title" : undefined}>
      <div className="as-container">
        <SectionHead id="pricing-teaser-title" eyebrow={eyebrow} title={title} description={description} />
        <PlanGrid plans={plans} from={from} variant="compact" />
        <div className="as-section-foot">
          {cta ? (
            <CmsButton button={cta} variant="ghost" arrow />
          ) : (
            <SmartLink className="as-btn as-btn-ghost" href="/pricing">
              Compare all plans and add-ons
              <Icon name="arrow" size={18} className="as-arrow" />
            </SmartLink>
          )}
        </div>
      </div>
    </section>
  );
}
