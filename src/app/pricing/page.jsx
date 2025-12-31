import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  try {
    const pricingPage = await getSingleType('pricing', PAGE_CONTENT_QUERY);
    return {
      title: pricingPage?.title,
      description: pricingPage?.description,
    };
  } catch (error) {
    return {
      title: 'Pricing',
      description: 'Explore our pricing plans and choose the best fit for your needs.',
    };
  }
}

export default async function Pricing() {

    let pricingPage = null;

    try {
    pricingPage = await getSingleType('pricing', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load pricing page data';
        console.error('Error in pricing:', error);
    }

    return (
        <div>
            {pricingPage ? (
                <PageRenderer page={pricingPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
