"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One shared IntersectionObserver for every `.as-reveal` element on the page.
 * Content is visible without JS: only elements that start BELOW the fold are marked
 * `.is-pending`, then fade/slide in once (opacity + transform only).
 * Re-runs after each client-side navigation. Does nothing with prefers-reduced-motion.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          entry.target.classList.remove("is-pending");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    const fold = window.innerHeight * 0.92;
    const pending = [];
    document.querySelectorAll(".as-reveal:not(.is-in):not(.is-pending)").forEach((el) => {
      if (el.getBoundingClientRect().top > fold) {
        el.classList.add("is-pending");
        pending.push(el);
        io.observe(el);
      }
    });

    return () => {
      io.disconnect();
      // Never leave content hidden if the observer goes away (e.g. on navigation).
      pending.forEach((el) => el.classList.remove("is-pending"));
    };
  }, [pathname]);

  return null;
}
