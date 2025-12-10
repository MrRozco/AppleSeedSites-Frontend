import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export async function generateMetadata() {
  const businessesPage = await getSingleType('business-page', PAGE_CONTENT_QUERY);
  return {
    title: businessesPage?.title,
    description: businessesPage?.description,
  };
}

export default async function Businesses() {

    let businessesPage = null;

    try {
    businessesPage = await getSingleType('business-page', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load businesses page data';
        console.error('Error in Businesses:', error);
    }

    return (
        <div>
            {businessesPage ? (
                <PageRenderer page={businessesPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
