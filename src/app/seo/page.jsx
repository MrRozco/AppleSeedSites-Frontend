import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export async function generateMetadata() {
  try {
    const seoPage = await getSingleType('seo', PAGE_CONTENT_QUERY);
    return {
      title: seoPage?.title,
      description: seoPage?.description,
    };
  } catch (error) {
    return {
      title: 'SEO',
      description: 'SEO services.',
    };
  }
}

export default async function SEO() {

    let seoPage = null;

    try {
    seoPage = await getSingleType('seo', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load SEO page data';
        console.error('Error in SEO:', error);
    }

    return (
        <div>
            {seoPage ? (
                <PageRenderer page={seoPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
