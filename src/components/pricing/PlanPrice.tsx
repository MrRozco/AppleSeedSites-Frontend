"use client";

import { formatPlanPrice, type PlanPricing } from "@/lib/format-price";
import { useBilling } from "./BillingContext";

/** The price block of a plan card. Follows the billing toggle when one is on the page. */
export default function PlanPrice({ plan }: { plan: PlanPricing }) {
  const { mode } = useBilling();
  const price = formatPlanPrice(plan, mode);
  const digits = price.amount.replace(/^\$/, "");

  return (
    <div className="as-amount">
      <span className="as-sr">{price.label}</span>
      <b aria-hidden="true">
        <sup>$</sup>
        {digits}
      </b>
      <span aria-hidden="true">{price.period}</span>
      <p className="as-setup" aria-hidden="true">
        {price.note}
      </p>
    </div>
  );
}
