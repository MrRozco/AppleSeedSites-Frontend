import { cx } from "@/lib/utils";
import Icon from "./Icon";
import SmartLink from "./SmartLink";

/**
 * The design's only call-to-action element (`.as-btn`).
 * variant: primary | secondary | ghost. size: sm | md | lg. Primary buttons carry an arrow.
 */
/** @param {{ href?: string | null, children?: import("react").ReactNode, variant?: "primary" | "secondary" | "ghost", size?: "sm" | "md" | "lg", block?: boolean, arrow?: boolean, className?: string, [key: string]: any }} props */
export default function Button({ href, children, variant = "primary", size, block = false, arrow, className, ...props }) {
  if (!href || !children) return null;
  const showArrow = arrow ?? variant === "primary";
  return (
    <SmartLink
      href={href}
      className={cx("as-btn", `as-btn-${variant}`, size && `as-btn-${size}`, block && "as-btn-block", className)}
      {...props}
    >
      {children}
      {showArrow && <Icon name="arrow" size={18} className="as-arrow" />}
    </SmartLink>
  );
}

/** Render a Strapi `elements.link` ({ label, url }). Off-site URLs open in a new tab. */
export function CmsButton({ button, ...props }) {
  if (!button?.url || !button?.label) return null;
  return (
    <Button href={button.url} newTab={/^https?:\/\//i.test(button.url)} {...props}>
      {button.label}
    </Button>
  );
}
