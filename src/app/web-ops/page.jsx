import { createCmsPage } from "@/lib/cms-page";
import { ROUTES } from "@/lib/routes";

const { generateMetadata, Page } = createCmsPage(ROUTES.webOps, {
  leadFormKind: "review",
  // Used only when the web-ops page in Strapi has no lead-form section of its own.
  extraLeadForm: {
    eyebrow: "Free site review",
    title: "Find out what your website is costing you.",
    description: "Send me your website. Within 1 business day, I'll reply with what's slowing it down and what to fix first.",
  },
});

export { generateMetadata };
export default Page;
