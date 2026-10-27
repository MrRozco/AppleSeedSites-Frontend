"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { pageSlug, withFrom } from "@/lib/contact-link";

/**
 * A link to /contact that adds ?from={slug of the current page} when the link doesn't set one.
 * Used by SmartLink for every contact link, including ones from the CMS.
 */
export default function ContactLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname() || "/";
  // Next's internal routes (e.g. /_not-found while prerendering the 404 page) get a readable slug.
  const from = pathname.startsWith("/_") ? "not-found" : pageSlug(pathname);
  return <Link href={withFrom(href, from)} {...props} />;
}
