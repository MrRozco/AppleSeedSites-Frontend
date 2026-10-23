import { notFound } from "next/navigation";
import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "./strapi";
import { PAGE_CONTENT_QUERY } from "./queries";

/**
 * Builds a CMS-driven route from an entry in lib/routes.js.
 * Every page: fetch its Strapi single type with PAGE_CONTENT_QUERY, take SEO from
 * `title` / `description`, render the `content` dynamic zone.
 *
 * Usage in app/<route>/page.jsx:
 *   const { generateMetadata, Page } = createCmsPage(ROUTES.about);
 *   export { generateMetadata };
 *   export default Page;
 */
export function createCmsPage(route, { compactHero = true } = {}) {
  const load = () => getSingleType(route.endpoint, PAGE_CONTENT_QUERY);

  async function generateMetadata() {
    let page = null;
    try {
      page = await load();
    } catch {
      // Fall through to the static fallback below.
    }
    const title = page?.title || route.title;
    const description = page?.description || route.description;
    return {
      title,
      description,
      alternates: { canonical: route.path },
      openGraph: { title, description, url: route.path },
    };
  }

  async function Page() {
    const page = await load();
    if (!page) notFound();
    return <PageRenderer page={page} compactHero={compactHero} />;
  }

  return { generateMetadata, Page };
}
