/**
 * Every price string on the site comes from here, so wording stays consistent.
 * Prices in Strapi are whole dollars.
 */
import type { AddOnPriceSuffix } from "@/types/strapi";

export type BillingMode = "upfront" | "zero-down";

/** 1297 → "$1,297". Non-integers keep cents: 19.5 → "$19.50". Invalid input → "". */
export function formatMoney(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "";
  const n = Number(amount);
  if (!Number.isFinite(n)) return "";
  const cents = !Number.isInteger(n);
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  })}`;
}

const SUFFIX: Record<AddOnPriceSuffix, string> = {
  "per-month": "/mo",
  "one-time": " one-time",
  each: " each",
};

/** Add-on prices: "$249/mo", "$497 one-time", "$100 each". No suffix → "$497". */
export function formatAddOnPrice(price: number | null | undefined, suffix?: AddOnPriceSuffix | null): string {
  const money = formatMoney(price);
  if (!money) return "";
  return suffix ? `${money}${SUFFIX[suffix] ?? ""}` : money;
}

export interface PlanPricing {
  monthlyPrice: number;
  setupFee: number;
  zeroDownMonthly: number;
  zeroDownMonths?: number | null;
}

export interface PlanPriceDisplay {
  /** The big number, e.g. "$99". */
  amount: string;
  /** Right after the amount, e.g. "/month" or "/mo for 12 months". */
  period: string;
  /** The line under it, e.g. "+ $797 one-time setup" or "then $99/mo". */
  note: string;
  /** The whole thing as one sentence, for screen readers and plain text. */
  label: string;
}

/**
 * Plan card price in either billing mode.
 *   upfront:   "$99/month" + "+ $797 one-time setup"
 *   zero-down: "$166/mo for 12 months, then $99"
 */
export function formatPlanPrice(plan: PlanPricing, mode: BillingMode): PlanPriceDisplay {
  const monthly = formatMoney(plan.monthlyPrice);
  if (mode === "zero-down") {
    const months = plan.zeroDownMonths && plan.zeroDownMonths > 0 ? plan.zeroDownMonths : 12;
    const amount = formatMoney(plan.zeroDownMonthly);
    const period = `/mo for ${months} months`;
    const note = `then ${monthly}`;
    return { amount, period, note, label: `${amount}${period}, ${note}` };
  }
  const amount = monthly;
  const period = "/month";
  const note = `+ ${formatMoney(plan.setupFee)} one-time setup`;
  return { amount, period, note, label: `${amount}${period} ${note}` };
}
