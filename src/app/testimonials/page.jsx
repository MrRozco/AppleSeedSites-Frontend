import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";

export default async function Testimonial() {

    let testimonialPage = null;

    try {
        const query = {
            populate: {
                content: {
                    on: {
                        'custom.hero': {
                            populate: { heroImage: true }
                        },
                        'custom.testimonials' : {
                            populate: {
                                testimonialCards: { 
                                populate: { lightIcon: true, darkIcon: true }
                                }
                            }
                        }
                    }
                }
            }
        }

    testimonialPage = await getSingleType('testimonial', query);

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
