import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export async function generateMetadata() {
  try {
    const landingPage = await getSingleType('landing-page', PAGE_CONTENT_QUERY);
    return {
      title: landingPage?.title,
      description: landingPage?.description,
    };
  } catch (error) {
    return {
      title: 'Landing Page',
      description: 'Landing page services.',
    };
  }
}

export default async function LandingPage() {

    let landingPage = null;

    try {
    landingPage = await getSingleType('landing-page', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load landing page data';
        console.error('Error in LandingPage:', error);
    }

    return (
        <div>
            {landingPage ? (
                <PageRenderer page={landingPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
