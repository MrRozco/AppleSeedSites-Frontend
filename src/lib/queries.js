/*
 * Strapi 5 populate queries. Strapi does not populate media, relations or nested
 * components by default, so every field a component reads must be listed here.
 * Field names are case-sensitive and must match the Strapi schemas exactly.
 */

const icon = { populate: { icon: true } };

export const PAGE_CONTENT_QUERY = {
  populate: {
    seo: { populate: { shareImage: true } },
    content: {
      on: {
        "sections.hero": {
          populate: { image: true, buttons: true, trustItems: icon },
        },
        "sections.features": {
          populate: { cards: { populate: { icon: true, buttons: true } }, button: true },
        },
        "sections.text-image": { populate: { bullets: icon, image: true, button: true } },
        "sections.text-gallery": { populate: { bullets: icon, images: true, buttons: true } },
        "sections.our-work": { populate: { projects: { populate: { image: true } }, button: true } },
        "sections.performance": { populate: { bullets: icon, stats: true, image: true, button: true } },
        "sections.testimonials": { populate: { testimonials: icon, button: true } },
        "sections.pricing": {
          populate: { cards: { populate: { bullets: icon, buttons: true } }, button: true },
        },
        "sections.steps": { populate: { steps: true, button: true } },
        "sections.faq": { populate: { items: true, button: true } },
        // Only plain fields; listed so the section is always returned in the dynamic zone.
        "sections.lead-form": { populate: "*" },
      },
    },
  },
};

export const NAVBAR_QUERY = {
  populate: {
    items: {
      on: {
        "navigation.link": { populate: "*" },
        "navigation.button": { populate: "*" },
        "navigation.dropdown": {
          populate: { links: true, sections: { populate: { links: icon } } },
        },
      },
    },
  },
};

export const FOOTER_QUERY = {
  populate: { logo: true, cta: true, links: true, contactLinks: icon },
};
