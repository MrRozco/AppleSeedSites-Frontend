"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/**
 * One delegated click listener for the whole site: every tel: link fires `phone_click`,
 * whether it's a <PhoneLink>, a CMS button or a footer contact link.
 */
export default function ClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (!link) return;
      track("phone_click", {
        location: link.dataset.trackLocation || window.location.pathname,
        number: link.getAttribute("href")?.slice(4),
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
