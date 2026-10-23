import { cx } from "@/lib/utils";
import Icon from "./Icon";
import SmartLink from "./SmartLink";

/**
 * The design's only call-to-action element (`.as-btn`).
 * variant: primary | secondary | ghost. size: sm | md | lg. Primary buttons carry an arrow.
 */
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

/** Render a Strapi `layout.button` / `menu.menu-link` ({ title, url }). */
export function CmsButton({ button, ...props }) {
  if (!button?.url || !button?.title) return null;
  return (
    <Button href={button.url} {...props}>
      {button.title}
    </Button>
  );
}
