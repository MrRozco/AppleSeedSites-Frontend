import { createCmsPage } from "@/lib/cms-page";
import { ROUTES } from "@/lib/routes";

const { generateMetadata, Page } = createCmsPage(ROUTES.eCommerce);

export { generateMetadata };
export default Page;
