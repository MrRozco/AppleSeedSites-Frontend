import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export async function generateMetadata() {
  try {
    const eCommercePage = await getSingleType('e-commerce', PAGE_CONTENT_QUERY);
    return {
      title: eCommercePage?.title,
      description: eCommercePage?.description,
    };
  } catch (error) {
    return {
      title: 'E-Commerce',
      description: 'Our e-commerce services.',
    };
  }
}

export default async function ECommerce() {

    let eCommercePage = null;

    try {
    eCommercePage = await getSingleType('e-commerce', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load e-commerce page data';
        console.error('Error in ECommerce:', error);
    }

    return (
        <div>
            {eCommercePage ? (
                <PageRenderer page={eCommercePage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
