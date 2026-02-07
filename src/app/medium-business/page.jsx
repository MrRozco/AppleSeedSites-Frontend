import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export async function generateMetadata() {
  try {
    const mediumBusinessPage = await getSingleType('medium-business', PAGE_CONTENT_QUERY);
    return {
      title: mediumBusinessPage?.title,
      description: mediumBusinessPage?.description,
    };
  } catch (error) {
    return {
      title: 'Medium Business',
      description: 'Our medium business services.',
    };
  }
}

export default async function MediumBusiness() {

    let mediumBusinessPage = null;

    try {
    mediumBusinessPage = await getSingleType('medium-business', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load medium business page data';
        console.error('Error in MediumBusiness:', error);
    }

    return (
        <div>
            {mediumBusinessPage ? (
                <PageRenderer page={mediumBusinessPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
