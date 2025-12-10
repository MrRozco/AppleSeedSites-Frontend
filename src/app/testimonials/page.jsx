import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export default async function Testimonial() {

    let testimonialPage = null;

    try {
    testimonialPage = await getSingleType('testimonial', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load businesses page data';
        console.error('Error in Businesses:', error);
    }

    return (
        <div>
            {testimonialPage ? (
                <PageRenderer page={testimonialPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
