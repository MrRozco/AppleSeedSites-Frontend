import { has } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Paragraphs } from "@/components/ui/Section";

/** The CMS has no label field for this button, so it's a fixed UI string. */
const BUTTON_LABEL = "Get a Quote";

/**
 * Final call-to-action band, rendered by the layout above the footer on every page.
 * Source: footer.cta.title (heading), footer.cta.url (button), footer.description.
 */
export default function CtaBand({ footer }) {
  const cta = footer?.cta;
  if (!cta?.url || !has(cta?.title)) return null;

  return (
    <section className="as-section as-ctasection" aria-labelledby="cta-band-title" style={{ paddingTop: 0 }}>
      <div className="as-container">
        <div className="as-ctaband as-reveal">
          <div style={{ display: "grid", gap: "var(--space-4)", minWidth: 0 }}>
            <h2 className="as-h2" id="cta-band-title">
              {cta.title}
            </h2>
            <Paragraphs text={footer.description} className="as-lead" />
          </div>
          <div>
            <Button href={cta.url} size="lg">
              {BUTTON_LABEL}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
