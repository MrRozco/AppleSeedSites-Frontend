import { describe, expect, it } from "vitest";
import { formatAddOnPrice, formatMoney, formatPlanPrice } from "./format-price";

describe("formatMoney", () => {
  it("formats whole dollars with thousands separators", () => {
    expect(formatMoney(99)).toBe("$99");
    expect(formatMoney(1297)).toBe("$1,297");
    expect(formatMoney(12000)).toBe("$12,000");
  });

  it("keeps cents for non-integers", () => {
    expect(formatMoney(19.5)).toBe("$19.50");
  });

  it("accepts numeric strings and zero", () => {
    expect(formatMoney("797")).toBe("$797");
    expect(formatMoney(0)).toBe("$0");
  });

  it("returns an empty string for missing or invalid values", () => {
    expect(formatMoney(null)).toBe("");
    expect(formatMoney(undefined)).toBe("");
    expect(formatMoney("")).toBe("");
    expect(formatMoney("abc")).toBe("");
  });
});

describe("formatAddOnPrice", () => {
  it("formats each suffix", () => {
    expect(formatAddOnPrice(249, "per-month")).toBe("$249/mo");
    expect(formatAddOnPrice(497, "one-time")).toBe("$497 one-time");
    expect(formatAddOnPrice(100, "each")).toBe("$100 each");
  });

  it("omits the suffix when none is set", () => {
    expect(formatAddOnPrice(497, null)).toBe("$497");
  });

  it("returns an empty string without a price", () => {
    expect(formatAddOnPrice(null, "each")).toBe("");
  });
});

describe("formatPlanPrice", () => {
  const spark = { monthlyPrice: 99, setupFee: 797, zeroDownMonthly: 166, zeroDownMonths: 12 };

  it("shows monthly price plus setup when paying upfront", () => {
    expect(formatPlanPrice(spark, "upfront")).toEqual({
      amount: "$99",
      period: "/month",
      note: "+ $797 one-time setup",
      label: "$99/month + $797 one-time setup",
    });
  });

  it("shows the $0-down monthly price and the regular price after", () => {
    expect(formatPlanPrice(spark, "zero-down")).toEqual({
      amount: "$166",
      period: "/mo for 12 months",
      note: "then $99",
      label: "$166/mo for 12 months, then $99",
    });
  });

  it("formats large setup fees", () => {
    expect(formatPlanPrice({ monthlyPrice: 199, setupFee: 1297, zeroDownMonthly: 308 }, "upfront").note).toBe(
      "+ $1,297 one-time setup",
    );
  });

  it("defaults the $0-down term to 12 months", () => {
    expect(formatPlanPrice({ ...spark, zeroDownMonths: null }, "zero-down").period).toBe("/mo for 12 months");
    expect(formatPlanPrice({ ...spark, zeroDownMonths: 24 }, "zero-down").period).toBe("/mo for 24 months");
  });
});
