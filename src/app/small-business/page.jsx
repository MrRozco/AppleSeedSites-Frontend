import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export async function generateMetadata() {
  try {
    const smallBusinessPage = await getSingleType('small-business', PAGE_CONTENT_QUERY);
    return {
      title: smallBusinessPage?.title,
      description: smallBusinessPage?.description,
    };
  } catch (error) {
    return {
      title: 'Small Business',
      description: 'Our small business services.',
    };
  }
}

export default async function SmallBusiness() {

    let smallBusinessPage = null;

    try {
    smallBusinessPage = await getSingleType('small-business', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load small business page data';
        console.error('Error in SmallBusiness:', error);
    }

    return (
        <div>
            {smallBusinessPage ? (
                <PageRenderer page={smallBusinessPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
