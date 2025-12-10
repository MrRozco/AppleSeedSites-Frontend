import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export async function generateMetadata() {
  try {
    const testimonialPage = await getSingleType('testimonial', PAGE_CONTENT_QUERY);
    return {
      title: testimonialPage?.title,
      description: testimonialPage?.description,
    };
  } catch (error) {
    return {
      title: 'Testimonials',
      description: 'See what our clients say.',
    };
  }
}

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
