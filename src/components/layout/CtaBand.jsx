import SharedCtaBand from "@/components/shared/CtaBand";

/** The CMS has no label field for this button, so it's a fixed UI string. */
const BUTTON_LABEL = "Get a Quote";

/**
 * Final call-to-action band, rendered at the end of CMS pages.
 * Source: footer.cta.title (heading), footer.cta.url (button), footer.description.
 */
export default function CtaBand({ footer }) {
  const cta = footer?.cta;
  if (!cta?.url) return null;
  return (
    <SharedCtaBand
      heading={cta.title}
      body={footer.description}
      primary={{ label: BUTTON_LABEL, href: cta.url }}
      headingId="cta-band-title"
      flush
    />
  );
}
