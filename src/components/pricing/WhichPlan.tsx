import { has } from "@/lib/utils";
import SmartLink from "@/components/ui/SmartLink";
import Icon from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/Section";
import type { Plan, PricingPlanMatch } from "@/types/strapi";

/** "Which plan is right for me?": situation → recommended plan (#anchor) → related page link. */
export default function WhichPlan({
  heading,
  rows,
  plans,
}: {
  heading?: string | null;
  rows: PricingPlanMatch[];
  plans: Plan[];
}) {
  const list = rows.filter((r) => has(r?.situation));
  if (!list.length) return null;
  const nameOf = new Map(plans.map((p) => [p.slug, p.name]));

  return (
    <section className="as-section as-which-sec" aria-labelledby={has(heading) ? "which-plan-title" : undefined}>
      <div className="as-container">
        <SectionHead id="which-plan-title" title={heading} />
        <ul className="as-which">
          {list.map((row, i) => {
            const planName = row.planSlug ? nameOf.get(row.planSlug) : undefined;
            return (
              <li key={row.id ?? i} className="as-card as-which-row as-reveal">
                <p className="as-which-situation">{row.situation}</p>
                {planName ? (
                  <a className="as-which-plan" href={`#${row.planSlug}`}>
                    <Icon name="arrow" size={16} />
                    <span>{planName}</span>
                  </a>
                ) : (
                  <span className="as-which-plan is-none" aria-hidden="true" />
                )}
                {has(row.linkUrl) && has(row.linkLabel) && (
                  <SmartLink className="as-which-link" href={row.linkUrl as string}>
                    {row.linkLabel}
                  </SmartLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
