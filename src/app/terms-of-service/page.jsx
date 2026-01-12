import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export async function generateMetadata() {
  try {
    const TermsOfServicePage = await getSingleType('terms-of-service', PAGE_CONTENT_QUERY);
    return {
      title: TermsOfServicePage?.title,
      description: TermsOfServicePage?.description,
    };
  } catch (error) {
    return {
      title: 'Terms of Service',
      description: 'Read our terms of service.',
    };
  }
}

export default async function TermsOfService() {

    let termsOfServicePage = null;

    try {
    termsOfServicePage = await getSingleType('terms-of-service', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load terms of service page data';
        console.error('Error in Terms of Service:', error);
    }

    return (
        <div>
            {termsOfServicePage ? (
                <PageRenderer page={termsOfServicePage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
