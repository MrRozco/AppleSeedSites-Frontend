"use client";

import { useEffect, useRef } from "react";

/**
 * Renders the third-party embed HTML from Strapi (Google Calendar, Calendly, Tally, HubSpot…).
 * Markup is server-rendered. `<script>` tags inserted through innerHTML never run, so they
 * are re-created once after mount; widgets that need their loader script then work too.
 * The frame reserves its height (--embed-h) so nothing shifts while the widget loads.
 */
export default function EmbedHtml({ html, height = 600 }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll("script").forEach((old) => {
      const script = document.createElement("script");
      for (const { name, value } of old.attributes) script.setAttribute(name, value);
      script.text = old.text;
      old.replaceWith(script);
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="as-embed"
      style={{ "--embed-h": `${height}px` }}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  );
}
