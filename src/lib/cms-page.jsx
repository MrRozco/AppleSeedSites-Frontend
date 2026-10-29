import { notFound } from "next/navigation";
import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "./strapi";
import { seoMetadata } from "./seo";
import { PAGE_CONTENT_QUERY, FOOTER_QUERY } from "./queries";
import { getLeadForm, getPlans, safe } from "./cms-data";

/**
 * Builds a CMS-driven route from an entry in lib/routes.js.
 * Every page: fetch its Strapi single type with PAGE_CONTENT_QUERY, take SEO from its
 * `seo` component, render the `content` dynamic zone.
 *
 * Options:
 *   compactHero    smaller hero without image (inner pages)
 *   pricingTeaser  render sections.pricing as the plan teaser (homepage)
 *   leadFormKind   "review" turns lead-form sections into the free site review form
 *   extraLeadForm  section copy for a lead form appended when the page has none
 *
 * Usage in app/<route>/page.jsx:
 *   const { generateMetadata, Page } = createCmsPage(ROUTES.about);
 *   export { generateMetadata };
 *   export default Page;
 */
export function createCmsPage(
  route,
  { compactHero = true, pricingTeaser = false, leadFormKind = "lead", extraLeadForm = null } = {},
) {
  const load = () => getSingleType(route.endpoint, PAGE_CONTENT_QUERY);

  async function generateMetadata() {
    let page = null;
    try {
      page = await load();
    } catch {
      // Fall through to the static fallback below.
    }
    return seoMetadata(page?.seo, { title: route.title, description: route.description, path: route.path });
  }

  async function Page() {
    const page = await load();
    if (!page) notFound();

    const content = Array.isArray(page.content) ? page.content : [];
    const hasPricing = content.some((c) => c?.__component === "sections.pricing");
    const hasLeadForm = Boolean(extraLeadForm) || content.some((c) => c?.__component === "sections.lead-form");

    // Same cached request as the layout's footer (React cache + fetch dedupe), used for the CTA band.
    // The other loads are optional: the page still renders without them.
    const [footer, plans, leadForm] = await Promise.all([
      safe(() => getSingleType("footer", FOOTER_QUERY), null),
      pricingTeaser && hasPricing ? safe(getPlans, []) : null,
      hasLeadForm ? safe(getLeadForm, null) : null,
    ]);

    return (
      <PageRenderer
        page={page}
        footer={footer}
        compactHero={compactHero}
        plans={plans}
        leadForm={leadForm}
        leadFormKind={leadFormKind}
        extraLeadForm={extraLeadForm}
      />
    );
  }

  return { generateMetadata, Page };
}
