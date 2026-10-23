import Link from "next/link";
import { isExternal } from "@/lib/utils";

/**
 * Internal paths use next/link (client-side navigation + prefetch).
 * External URLs, mailto: and tel: use a plain anchor.
 * Server-safe: no hooks, so it works in both server and client components.
 */
export default function SmartLink({ href = "#", newTab = false, children, ...props }) {
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
