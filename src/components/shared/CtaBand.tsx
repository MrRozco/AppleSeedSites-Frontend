import { has } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Paragraphs } from "@/components/ui/Section";

export interface CtaLink {
  label?: string | null;
  href?: string | null;
}

interface CtaBandProps {
  heading?: string | null;
  body?: string | null;
  primary?: CtaLink | null;
  secondary?: CtaLink | null;
  /** Section id, for in-page anchors (e.g. "ecommerce"). */
  id?: string;
  /** Unique id for the heading (aria-labelledby). Defaults to `${id}-title`. */
  headingId?: string;
  /** Remove the top padding when the band directly follows another section. */
  flush?: boolean;
}

const usable = (link?: CtaLink | null): link is { label: string; href: string } =>
  Boolean(link && has(link.label) && has(link.href));

/** Deep-blue call-to-action band (`.as-ctaband`): heading, body, up to two buttons. */
export default function CtaBand({ heading, body, primary, secondary, id, headingId, flush = false }: CtaBandProps) {
  if (!has(heading)) return null;
  const titleId = headingId || `${id || "cta"}-title`;

  return (
    <section
      className="as-section as-ctasection"
      aria-labelledby={titleId}
      id={id}
      style={flush ? { paddingTop: 0 } : undefined}
    >
      <div className="as-container">
        <div className="as-ctaband as-reveal">
          <div style={{ display: "grid", gap: "var(--space-4)", minWidth: 0 }}>
            <h2 className="as-h2" id={titleId}>
              {heading}
            </h2>
            <Paragraphs text={body} className="as-lead" />
          </div>
          {(usable(primary) || usable(secondary)) && (
            <div className="as-cta-actions">
              {usable(primary) && (
                <Button href={primary.href} size="lg">
                  {primary.label}
                </Button>
              )}
              {usable(secondary) && (
                <Button href={secondary.href} variant="secondary" size="lg">
                  {secondary.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
