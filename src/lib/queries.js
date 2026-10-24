/*
 * Strapi 5 populate queries. Strapi does not populate media, relations or nested
 * components by default, so every field a component reads must be listed here.
 * Field names are case-sensitive and must match the Strapi schemas exactly
 * (note `LightIcon` with a capital L on mega-menu links).
 */

const icons = { populate: { lightIcon: true, darkIcon: true } };

export const PAGE_CONTENT_QUERY = {
  populate: {
    content: {
      on: {
        "custom.hero": {
          populate: { heroImage: true, button: true, trust: { populate: { icon: true } } },
        },
        "custom.features": {
          populate: { featuresCard: { populate: { icon: true, button: true } }, button: "*" },
        },
        "custom.our-work": { populate: { portfolioCard: { populate: { image: true } } } },
        "custom.performance": {
          populate: { image: true, stat: true, button: "*", bulletPoint: icons },
        },
        "custom.testimonials": { populate: { testimonialCards: icons, button: true } },
        "custom.about-section": { populate: { bulletPoint: icons, image: true, button: "*" } },
        "custom.business-section": {
          populate: { bulletPoint: icons, sliderImages: true, button: "*" },
        },
        "custom.pricing": {
          populate: { card: { populate: { bulletPoint: icons, cta: true } } },
        },
        "custom.contact-section": {
          populate: { darkIcon: true, lightIcon: true, bulletPoint: icons, link: icons },
        },
        "custom.steps": { populate: { step: true, button: true } },
        "custom.faq": { populate: { faqItem: true, button: true } },
        // Only plain fields; listed so the section is always returned in the dynamic zone.
        "custom.lead-form": { populate: "*" },
      },
    },
  },
};

export const NAVBAR_QUERY = {
  populate: [
    "darkLogo",
    "lightLogo",
    "NavbarItems",
    "NavbarItems.menuLink",
    "NavbarItems.sections",
    "NavbarItems.sections.links",
    "NavbarItems.sections.links.LightIcon",
    "NavbarItems.sections.links.darkIcon",
  ],
};

export const FOOTER_QUERY = {
  populate: ["logo", "cta", "footerLink", "contactLink", "contactLink.lightIcon", "contactLink.darkIcon"],
};
