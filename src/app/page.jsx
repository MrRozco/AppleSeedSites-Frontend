import { createCmsPage } from "@/lib/cms-page";
import { ROUTES } from "@/lib/routes";

const { generateMetadata, Page } = createCmsPage(ROUTES.home, { compactHero: false, pricingTeaser: true });

export { generateMetadata };
export default Page;
