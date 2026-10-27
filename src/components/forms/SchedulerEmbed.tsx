"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/**
 * Lazy-loaded scheduler iframe (Cal.com or similar).
 *
 * call_booked: placeholder hook. Cal.com's embed posts a "bookingSuccessful" message to the
 * parent page; when one arrives from the scheduler's origin we fire `call_booked`. If you switch
 * to Cal.com's JS embed or another tool, adjust the check in onMessage.
 */
export default function SchedulerEmbed({ url, title = "Book a 15-minute call" }: { url: string; title?: string }) {
  useEffect(() => {
    let origin = "";
    try {
      origin = new URL(url).origin;
    } catch {
      return;
    }
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin) return;
      const data = event.data as { type?: string; method?: string } | string | null;
      const name = typeof data === "string" ? data : data?.type || data?.method || "";
      if (/booking.?successful|booked/i.test(name)) track("call_booked", { scheduler: origin });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [url]);

  return (
    <div className="as-embed is-scheduler">
      <iframe src={url} title={title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
    </div>
  );
}
