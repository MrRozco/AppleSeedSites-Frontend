import type { ReactNode } from "react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/contact";

/**
 * A tel: link. Clicks are reported as `phone_click` by <ClickTracker> (in the root layout),
 * which listens for every tel: link on the page, including ones from the CMS.
 * `location` is sent with the event so you can tell which phone link was used.
 */
export default function PhoneLink({
  location,
  className,
  children,
}: {
  location: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a href={PHONE_HREF} className={className} data-track-location={location}>
      {children ?? PHONE_DISPLAY}
    </a>
  );
}
