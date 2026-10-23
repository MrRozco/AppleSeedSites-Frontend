/**
 * Every CMS-driven route and the Strapi single type it loads.
 * Some endpoint names differ from the URL (templates → template, testimonials → testimonial,
 * web-ops → web-op). Keep the paths: navbar and footer links in Strapi point at them.
 * `title` and `description` are only fallbacks for when Strapi can't be reached.
 */
export const SITE_URL = "https://appleseedsites.com";

export const ROUTES = {
  home: { path: "/", endpoint: "homepage", title: "AppleSeedSites", description: "Fast, mobile-first websites for small businesses.", priority: 1, changeFrequency: "weekly" },
  about: { path: "/about", endpoint: "about", title: "About Us", description: "Learn more about our business." },
  ai: { path: "/ai", endpoint: "ai", title: "AI Content", description: "AI images and video for your website." },
  contact: { path: "/contact", endpoint: "contact", title: "Contact", description: "Get in touch with AppleSeedSites.", priority: 0.9 },
  eCommerce: { path: "/e-commerce", endpoint: "e-commerce", title: "E-commerce Websites", description: "Online stores that are easy to run." },
  landingPage: { path: "/landing-page", endpoint: "landing-page", title: "Landing Pages", description: "Landing pages built to convert." },
  mediumBusiness: { path: "/medium-business", endpoint: "medium-business", title: "Medium Business Websites", description: "Websites for growing businesses." },
  smallBusiness: { path: "/small-business", endpoint: "small-business", title: "Small Business Websites", description: "Websites that grow your small business." },
  seo: { path: "/seo", endpoint: "seo", title: "Search Engine Optimization", description: "Rank for what local customers search." },
  templates: { path: "/templates", endpoint: "template", title: "Templates", description: "Website templates." },
  testimonials: { path: "/testimonials", endpoint: "testimonial", title: "Testimonials", description: "What our clients say." },
  webOps: { path: "/web-ops", endpoint: "web-op", title: "Website Analysis", description: "Website analysis and recommendations." },
  pricing: { path: "/pricing", endpoint: "pricing", title: "Pricing", description: "Explore our pricing plans and choose the best fit for your needs.", priority: 0.9 },
  privacyPolicy: { path: "/privacy-policy", endpoint: "privacy-policy", title: "Privacy Policy", description: "How we collect, use and protect your information.", priority: 0.3, changeFrequency: "yearly" },
  termsOfService: { path: "/terms-of-service", endpoint: "terms-of-service", title: "Terms of Service", description: "The terms for using our website and services.", priority: 0.3, changeFrequency: "yearly" },
};
