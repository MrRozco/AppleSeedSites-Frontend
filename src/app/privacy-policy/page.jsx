import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export async function generateMetadata() {
  try {
    const privacyPolicyPage = await getSingleType('privacy-policy', PAGE_CONTENT_QUERY);
    return {
      title: privacyPolicyPage?.title,
      description: privacyPolicyPage?.description,
    };
  } catch (error) {
    return {
      title: 'Privacy Policy',
      description: 'Read our privacy policy.',
    };
  }
}

export default async function PrivacyPolicy() {

    let privacyPolicyPage = null;

    try {
    privacyPolicyPage = await getSingleType('privacy-policy', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load privacy policy page data';
        console.error('Error in Privacy Policy:', error);
    }

    return (
        <div>
            {privacyPolicyPage ? (
                <PageRenderer page={privacyPolicyPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
