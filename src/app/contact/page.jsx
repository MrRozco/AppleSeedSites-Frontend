import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export default async function Contact() {

    let contactPage = null;

    try {
    contactPage = await getSingleType('contact', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load businesses page data';
        console.error('Error in Businesses:', error);
    }

    return (
        <div>
            {contactPage ? (
                <PageRenderer page={contactPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
