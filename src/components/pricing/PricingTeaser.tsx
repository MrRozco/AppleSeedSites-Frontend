import { has } from "@/lib/utils";
import Icon from "@/components/ui/Icon";
import SmartLink from "@/components/ui/SmartLink";
import { SectionHead } from "@/components/ui/Section";
import type { Plan } from "@/types/strapi";
import PlanGrid from "./PlanGrid";

/**
 * Homepage pricing section: heading, subheading, the plans as compact cards, and a link to /pricing.
 * Copy comes from the homepage's existing custom.pricing section (eyebrow, heading, description).
 */
export default function PricingTeaser({
  eyebrow,
  heading,
  subheading,
  plans,
  anchor,
  from = "home",
}: {
  eyebrow?: string | null;
  heading?: string | null;
  subheading?: string | null;
  plans: Plan[];
  anchor?: string;
  from?: string;
}) {
  if (!plans.length) return null;
  return (
    <section className="as-section as-pricing" id={anchor} aria-labelledby={has(heading) ? "pricing-teaser-title" : undefined}>
      <div className="as-container">
        <SectionHead id="pricing-teaser-title" eyebrow={eyebrow} title={heading} description={subheading} />
        <PlanGrid plans={plans} from={from} variant="compact" />
        <div className="as-section-foot">
          <SmartLink className="as-btn as-btn-ghost" href="/pricing">
            Compare all plans and add-ons
            <Icon name="arrow" size={18} className="as-arrow" />
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
