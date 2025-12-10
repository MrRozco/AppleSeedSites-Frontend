import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export async function generateMetadata() {
  const aiPage = await getSingleType('ai', PAGE_CONTENT_QUERY);
  return {
    title: aiPage?.title,
    description: aiPage?.description,
  };
}

export default async function Ai() {

    let aiPage = null;

    try {
    aiPage = await getSingleType('ai', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load businesses page data';
        console.error('Error in Businesses:', error);
    }

    return (
        <div>
            {aiPage ? (
                <PageRenderer page={aiPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
