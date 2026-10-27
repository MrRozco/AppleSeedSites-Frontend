"use client";

import { useRef, type KeyboardEvent } from "react";
import { cx } from "@/lib/utils";
import type { BillingMode } from "@/lib/format-price";
import { useBilling } from "./BillingContext";

/**
 * Two-option segmented control for billing ("Pay setup upfront" / "$0 down").
 * ARIA radio group: Tab focuses the selected option; arrow keys, Home and End move and select.
 */
export default function PricingToggle({
  upfrontLabel,
  zeroDownLabel,
}: {
  upfrontLabel?: string | null;
  zeroDownLabel?: string | null;
}) {
  const { mode, setMode } = useBilling();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const options: Array<{ value: BillingMode; label: string }> = [
    { value: "upfront", label: upfrontLabel || "Pay setup upfront" },
    { value: "zero-down", label: zeroDownLabel || "$0 down" },
  ];

  const select = (index: number) => {
    const i = (index + options.length) % options.length;
    setMode(options[i].value);
    refs.current[i]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const targets: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: options.length - 1,
    };
    if (event.key in targets) {
      event.preventDefault();
      select(targets[event.key]);
    }
  };

  return (
    <div className="as-billing" role="radiogroup" aria-label="How to pay the setup fee">
      {options.map((option, i) => {
        const checked = mode === option.value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            className={cx("as-billing-opt", checked && "is-on")}
            onClick={() => setMode(option.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
