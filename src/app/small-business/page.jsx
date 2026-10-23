import { createCmsPage } from "@/lib/cms-page";
import { ROUTES } from "@/lib/routes";

const { generateMetadata, Page } = createCmsPage(ROUTES.smallBusiness);

export { generateMetadata };
export default Page;
