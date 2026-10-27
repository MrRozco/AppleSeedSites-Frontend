import { cx, has } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import type { Plan } from "@/types/strapi";
import PlanPrice from "./PlanPrice";

export const planContactHref = (slug: string, from: string) =>
  `/contact?plan=${encodeURIComponent(slug)}&from=${encodeURIComponent(from)}`;

/**
 * One plan. `full` (pricing page): best-for line, all features, id={slug} for #anchors.
 * `compact` (homepage teaser): price plus the 3 teaser features.
 */
export default function PlanCard({
  plan,
  from,
  variant = "full",
}: {
  plan: Plan;
  /** Page slug sent to /contact as ?from=. */
  from: string;
  variant?: "full" | "compact";
}) {
  const compact = variant === "compact";
  const highlighted = Boolean(plan.isHighlighted);
  const features = ((compact ? plan.teaserFeatures?.slice(0, 3) : plan.features) || []).filter((f) => has(f?.text));
  const titleId = `plan-${plan.slug}${compact ? "-teaser" : ""}`;

  return (
    <article
      className={cx("as-card", "as-lift", "as-price", highlighted && "is-featured", compact && "is-compact")}
      id={compact ? undefined : plan.slug}
      aria-labelledby={titleId}
    >
      {has(plan.badge) && <span className="as-badge">{plan.badge}</span>}
      <div className="as-price-head">
        <h3 className="as-h3" id={titleId}>
          {plan.name}
        </h3>
        {!compact && has(plan.bestFor) && <p>{plan.bestFor}</p>}
      </div>
      <PlanPrice plan={plan} />
      {!compact && has(plan.includesPrevious) && <p className="as-points-intro">{plan.includesPrevious}</p>}
      {features.length > 0 && (
        <ul className="as-points">
          {features.map((f, i) => (
            <li key={f.id ?? i}>
              <span className="as-check" aria-hidden="true">
                <Icon name="check" size={13} />
              </span>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="as-price-ctas">
        <Button
          href={planContactHref(plan.slug, from)}
          variant={highlighted ? "primary" : "secondary"}
          block
          aria-describedby={titleId}
        >
          {plan.ctaLabel || `Choose ${plan.name}`}
        </Button>
      </div>
    </article>
  );
}
