import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export async function generateMetadata() {
  try {
    const webOpPage = await getSingleType('web-op', PAGE_CONTENT_QUERY);
    return {
      title: webOpPage?.title,
      description: webOpPage?.description,
    };
  } catch (error) {
    return {
      title: 'Web Ops',
      description: 'Web operations services.',
    };
  }
}

export default async function WebOps() {

    let webOpPage = null;

    try {
    webOpPage = await getSingleType('web-op', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load web ops page data';
        console.error('Error in WebOps:', error);
    }

    return (
        <div>
            {webOpPage ? (
                <PageRenderer page={webOpPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
