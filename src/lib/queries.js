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
        "custom.hero": { populate: { heroImage: true } },
        "custom.features": {
          populate: { featuresCard: { populate: { icon: true, button: true } }, button: "*" },
        },
        "custom.our-work": { populate: { portfolioCard: { populate: { image: true } } } },
        "custom.performance": {
          populate: { image: true, stat: true, button: "*", bulletPoint: icons },
        },
        "custom.testimonials": { populate: { testimonialCards: icons } },
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
