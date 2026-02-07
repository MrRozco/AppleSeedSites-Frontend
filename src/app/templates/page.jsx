import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export async function generateMetadata() {
  try {
    const templatePage = await getSingleType('template', PAGE_CONTENT_QUERY);
    return {
      title: templatePage?.title,
      description: templatePage?.description,
    };
  } catch (error) {
    return {
      title: 'Template',
      description: 'Our template services.',
    };
  }
}

export default async function Template() {

    let templatePage = null;

    try {
    templatePage = await getSingleType('template', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load template page data';
        console.error('Error in Template:', error);
    }

    return (
        <div>
            {templatePage ? (
                <PageRenderer page={templatePage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
