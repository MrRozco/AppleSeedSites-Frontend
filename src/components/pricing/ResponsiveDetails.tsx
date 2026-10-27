"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A <details> that starts collapsed (mobile, and without JavaScript) and opens itself on
 * desktop, where there's room for its content. The summary is hidden on desktop by CSS.
 */
export default function ResponsiveDetails({
  summary,
  className,
  children,
  query = "(min-width: 1024px)",
}: {
  summary: ReactNode;
  className?: string;
  children: ReactNode;
  query?: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => {
      if (mq.matches && ref.current) ref.current.open = true;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  return (
    <details ref={ref} className={className}>
      <summary>{summary}</summary>
      {children}
    </details>
  );
}
