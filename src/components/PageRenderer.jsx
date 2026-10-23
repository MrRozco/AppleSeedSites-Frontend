import Hero from "./sections/Hero";
import Features from "./sections/Features";
import OurWork from "./sections/OurWork";
import Performance from "./sections/Performance";
import Pricing from "./sections/Pricing";
import Testimonials from "./sections/Testimonials";
import AboutSection from "./sections/AboutSection";
import BusinessSection from "./sections/BusinessSection";
import ContactSection from "./sections/ContactSection";

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
};

/**
 * Renders a page's `content` dynamic zone in order (server component).
 * Unknown component UIDs are skipped, so editors can add new types without breaking pages.
 * Pages without a hero (e.g. legal pages with no content yet) get a compact hero built
 * from the page title, so every page has exactly one H1.
 */
/** "Privacy Policy – AppleSeedSites" → "Privacy Policy" (SEO titles carry the brand; the H1 doesn't need it). */
const withoutBrand = (title = "") => title.replace(/\s*[-–—|:]\s*AppleSeed\s*Sites\s*$/i, "").trim() || title;

export default function PageRenderer({ page, compactHero = false }) {
  const content = Array.isArray(page?.content) ? page.content : [];
  const hasHero = content.some((c) => c?.__component === "custom.hero");
  const pageTitle = withoutBrand(page?.title);

  return (
    <>
      {!hasHero && <Hero compact data={{ header: pageTitle, text: page?.description }} />}
      {content.map((section, i) => {
        const Component = SECTIONS[section?.__component];
        if (!Component) return null;
        return (
          <Component
            key={`${section.__component}-${section.id ?? i}`}
            data={section}
            {...(section.__component === "custom.hero" ? { compact: compactHero, fallbackTitle: pageTitle } : {})}
          />
        );
      })}
    </>
  );
}
