/**
 * Analytics events. Sends to Google Analytics (window.gtag) and/or Plausible (window.plausible)
 * when either is on the page, and does nothing otherwise. Never throws.
 */
type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", event: string, params?: Record<string, unknown>) => void;
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

export type TrackEvent = "lead_form_submit" | "phone_click" | "call_booked";

export function track(event: TrackEvent, props: Props = {}): void {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined && v !== null && v !== ""));
  try {
    window.gtag?.("event", event, clean);
  } catch {
    // Analytics must never break the page.
  }
  try {
    window.plausible?.(event, { props: clean });
  } catch {
    // Analytics must never break the page.
  }
}
