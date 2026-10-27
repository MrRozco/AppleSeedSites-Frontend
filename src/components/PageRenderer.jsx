import Hero from "./sections/Hero";
import Features from "./sections/Features";
import OurWork from "./sections/OurWork";
import Performance from "./sections/Performance";
import Pricing from "./sections/Pricing";
import Testimonials from "./sections/Testimonials";
import AboutSection from "./sections/AboutSection";
import BusinessSection from "./sections/BusinessSection";
import ContactSection from "./sections/ContactSection";
import Steps from "./sections/Steps";
import Faq from "./sections/Faq";
import LeadForm from "./sections/LeadForm";
import CtaBand from "./layout/CtaBand";
import PricingTeaser from "./pricing/PricingTeaser";

/** Strapi dynamic-zone component UID → section component. */
const SECTIONS = {
  "custom.hero": Hero,
  "custom.features": Features,
  "custom.our-work": OurWork,
  "custom.performance": Performance,
  "custom.pricing": Pricing,
  "custom.testimonials": Testimonials,
  "custom.about-section": AboutSection,
  "custom.business-section": BusinessSection,
  "custom.contact-section": ContactSection,
  "custom.steps": Steps,
  "custom.faq": Faq,
  "custom.lead-form": LeadForm,
};

/**
 * In-page anchors for buttons in Strapi (e.g. hero "See Pricing" → #pricing,
 * "Get My Free Website Plan" → #get-plan). Only the first section of each type gets one.
 */
const ANCHORS = {
  "custom.our-work": "work",
  "custom.steps": "steps",
  "custom.pricing": "pricing",
  "custom.faq": "faq",
  "custom.lead-form": "get-plan",
};

/** "Privacy Policy – AppleSeedSites" → "Privacy Policy" (SEO titles carry the brand; the H1 doesn't need it). */
const withoutBrand = (title = "") => title.replace(/\s*[-–—|:]\s*AppleSeed\s*Sites\s*$/i, "").trim() || title;

/**
 * Renders a page's `content` dynamic zone in order (server component).
 * - Unknown component UIDs are skipped, so editors can add new types without breaking pages.
 * - Pages without a hero (e.g. legal pages with no content yet) get a compact hero built from
 *   the page title, so every page has exactly one H1.
 * - The final CTA band (footer.cta) closes every page, except pages that have a lead form:
 *   there the form takes the band's place.
 * - `plans` (homepage): custom.pricing renders as the PricingTeaser with plans from Strapi,
 *   keeping the section's eyebrow/heading/description.
 * - `leadForm`: lead-form single type (field labels) for custom.lead-form sections.
 *   `leadFormKind="review"` turns them into the free site review form; `extraLeadForm` appends
 *   one when the page has none.
 */
export default function PageRenderer({
  page,
  footer,
  compactHero = false,
  plans = null,
  leadForm = null,
  leadFormKind = "lead",
  extraLeadForm = null,
}) {
  const base = Array.isArray(page?.content) ? page.content : [];
  const content =
    extraLeadForm && !base.some((c) => c?.__component === "custom.lead-form")
      ? [...base, { __component: "custom.lead-form", id: "extra", ...extraLeadForm }]
      : base;
  const hasHero = content.some((c) => c?.__component === "custom.hero");
  const hasLeadForm = content.some((c) => c?.__component === "custom.lead-form");
  const pageTitle = withoutBrand(page?.title);
  const usedAnchors = new Set();

  return (
    <>
      {!hasHero && <Hero compact data={{ header: pageTitle, text: page?.description }} />}
      {content.map((section, i) => {
        const type = section?.__component;
        const Component = SECTIONS[type];
        if (!Component) return null;

        const props = { data: section };
        if (type === "custom.hero") Object.assign(props, { compact: compactHero, fallbackTitle: pageTitle });
        if (type === "custom.lead-form") Object.assign(props, { leadForm, kind: leadFormKind });
        const anchor = ANCHORS[type];
        if (anchor && !usedAnchors.has(anchor)) {
          usedAnchors.add(anchor);
          props.anchor = anchor;
        }
        const key = `${type}-${section.id ?? i}`;
        if (type === "custom.pricing" && plans?.length) {
          return (
            <PricingTeaser
              key={key}
              eyebrow={section.eyebrow}
              heading={section.heading}
              subheading={section.description}
              plans={plans}
              anchor={props.anchor}
            />
          );
        }
        return <Component key={key} {...props} />;
      })}
      {!hasLeadForm && <CtaBand footer={footer} />}
    </>
  );
}
