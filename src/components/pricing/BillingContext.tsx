"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { BillingMode } from "@/lib/format-price";

interface BillingState {
  mode: BillingMode;
  setMode: (mode: BillingMode) => void;
}

/** Without a provider (e.g. the homepage teaser) every card shows upfront pricing. */
const BillingContext = createContext<BillingState>({ mode: "upfront", setMode: () => {} });

export const useBilling = () => useContext(BillingContext);

const PARAM = "billing";
const ZERO_DOWN = "zero-down";

/**
 * Shares the billing choice between the toggle and every plan card, and mirrors it in the URL
 * (?billing=zero-down) so the choice survives reloads and shared links.
 * The URL is read after hydration instead of with useSearchParams, so the page stays static (ISR).
 */
export function BillingProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<BillingMode>("upfront");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get(PARAM) === ZERO_DOWN) setModeState("zero-down");
  }, []);

  const setMode = useCallback((next: BillingMode) => {
    setModeState(next);
    const url = new URL(window.location.href);
    if (next === "zero-down") url.searchParams.set(PARAM, ZERO_DOWN);
    else url.searchParams.delete(PARAM);
    window.history.replaceState(window.history.state, "", url);
  }, []);

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);
  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}
