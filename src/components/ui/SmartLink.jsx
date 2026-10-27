import Link from "next/link";
import { isExternal } from "@/lib/utils";
import { isContactHref } from "@/lib/contact-link";
import ContactLink from "./ContactLink";

/**
 * Internal paths use next/link (client-side navigation + prefetch).
 * External URLs, mailto: and tel: use a plain anchor.
 * Links to /contact go through ContactLink, which adds ?from={current page slug}.
 * Server-safe: no hooks, so it works in both server and client components.
 */
/** @param {{ href?: string, newTab?: boolean, children?: import("react").ReactNode, [key: string]: any }} props */
export default function SmartLink({ href = "#", newTab = false, children, ...props }) {
  if (isContactHref(href)) {
    return (
      <ContactLink href={href} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>
        {children}
      </ContactLink>
    );
  }
  if (isExternal(href) || href.startsWith("#")) {
    const tab = newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (
      <a href={href} {...tab} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>
      {children}
    </Link>
  );
}
