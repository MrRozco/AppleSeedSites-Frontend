import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export default async function webOpsPage() {

    let webOpsPage = null;

    try {
    webOpsPage = await getSingleType('web-ops', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load web ops page data';
        console.error('Error in WebOps:', error);
    }

    return (
        <div>
            {webOpsPage ? (
                <PageRenderer page={webOpsPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
