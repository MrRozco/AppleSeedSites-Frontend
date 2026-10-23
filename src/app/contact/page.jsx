import { createCmsPage } from "@/lib/cms-page";
import { ROUTES } from "@/lib/routes";

const { generateMetadata, Page } = createCmsPage(ROUTES.contact);

export { generateMetadata };
export default Page;
