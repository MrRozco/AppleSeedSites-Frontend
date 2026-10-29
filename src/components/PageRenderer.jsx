import Hero from "./sections/Hero";
import Features from "./sections/Features";
import OurWork from "./sections/OurWork";
import Performance from "./sections/Performance";
import Pricing from "./sections/Pricing";
import Testimonials from "./sections/Testimonials";
import TextImage from "./sections/TextImage";
import TextGallery from "./sections/TextGallery";
import Steps from "./sections/Steps";
import Faq from "./sections/Faq";
import LeadForm from "./sections/LeadForm";
import CtaBand from "./layout/CtaBand";
import PricingTeaser from "./pricing/PricingTeaser";

/** Strapi dynamic-zone component UID → section component. */
const SECTIONS = {
  "sections.hero": Hero,
  "sections.features": Features,
  "sections.text-image": TextImage,
  "sections.text-gallery": TextGallery,
  "sections.our-work": OurWork,
  "sections.performance": Performance,
  "sections.testimonials": Testimonials,
  "sections.pricing": Pricing,
  "sections.steps": Steps,
  "sections.faq": Faq,
  "sections.lead-form": LeadForm,
};

/**
 * In-page anchors for buttons in Strapi (e.g. hero "See Pricing" → #pricing,
 * "Get My Free Website Plan" → #get-plan). Only the first section of each type gets one.
 */
const ANCHORS = {
  "sections.our-work": "work",
  "sections.steps": "steps",
  "sections.pricing": "pricing",
  "sections.faq": "faq",
  "sections.lead-form": "get-plan",
};

/** "Privacy Policy – AppleSeedSites" → "Privacy Policy" (SEO titles carry the brand; the H1 doesn't need it). */
const withoutBrand = (title = "") => title.replace(/\s*[-–—|:]\s*AppleSeed\s*Sites\s*$/i, "").trim() || title;

/**
 * Renders a page's `content` dynamic zone in order (server component).
 * - Unknown component UIDs are skipped, so editors can add new types without breaking pages.
 * - Pages without a hero (e.g. legal pages with no content yet) get a compact hero built from
 *   the page's SEO title and description, so every page has exactly one H1.
 * - The final CTA band (footer.cta) closes every page, except pages that have a lead form:
 *   there the form takes the band's place.
 * - `plans` (homepage): sections.pricing renders as the PricingTeaser with plans from Strapi,
 *   keeping the section's eyebrow, title, description and button.
 * - `leadForm`: the lead-form single type; its `form` labels go to sections.lead-form.
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
    extraLeadForm && !base.some((c) => c?.__component === "sections.lead-form")
      ? [...base, { __component: "sections.lead-form", id: "extra", ...extraLeadForm }]
      : base;
  const hasHero = content.some((c) => c?.__component === "sections.hero");
  const hasLeadForm = content.some((c) => c?.__component === "sections.lead-form");
  const pageTitle = withoutBrand(page?.seo?.metaTitle || "");
  const usedAnchors = new Set();

  return (
    <>
      {!hasHero && <Hero compact data={{ title: pageTitle, description: page?.seo?.metaDescription }} />}
      {content.map((section, i) => {
        const type = section?.__component;
        const Component = SECTIONS[type];
        if (!Component) return null;

        const props = { data: section };
        if (type === "sections.hero") Object.assign(props, { compact: compactHero, fallbackTitle: pageTitle });
        if (type === "sections.lead-form") Object.assign(props, { fields: leadForm?.form, kind: leadFormKind });
        const anchor = ANCHORS[type];
        if (anchor && !usedAnchors.has(anchor)) {
          usedAnchors.add(anchor);
          props.anchor = anchor;
        }
        const key = `${type}-${section.id ?? i}`;
        if (type === "sections.pricing" && plans?.length) {
          return (
            <PricingTeaser
              key={key}
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
              button={section.button}
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
