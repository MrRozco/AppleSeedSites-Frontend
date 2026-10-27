import type { CSSProperties } from "react";
import { cx } from "@/lib/utils";
import type { Plan } from "@/types/strapi";
import PlanCard from "./PlanCard";

/** Plans side by side on desktop; stacked on mobile with the highlighted plan first. */
export default function PlanGrid({
  plans,
  from,
  variant = "full",
}: {
  plans: Plan[];
  from: string;
  variant?: "full" | "compact";
}) {
  if (!plans.length) return null;
  return (
    <ul className="as-prices as-plan-grid" data-count={plans.length > 6 ? "many" : String(plans.length)}>
      {plans.map((plan, i) => (
        <li
          key={plan.documentId}
          className={cx("as-reveal", plan.isHighlighted && "is-highlighted")}
          style={{ "--rd": `${i * 80}ms` } as CSSProperties}
        >
          <PlanCard plan={plan} from={from} variant={variant} />
        </li>
      ))}
    </ul>
  );
}
