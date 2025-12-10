import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export default async function About() {

    let aboutPage = null;

    try {
    aboutPage = await getSingleType('about', PAGE_CONTENT_QUERY);

    } catch (error) {
        error = 'Failed to load businesses page data';
        console.error('Error in Businesses:', error);
    }

    return (
        <div>
            {aboutPage ? (
                <PageRenderer page={aboutPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
