import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";

export default async function About() {

    let aboutPage = null;

    try {
        const query = {
            populate: {
                content: {
                    on: {
                        'custom.hero': {
                            populate: { heroImage: true }
                        },
                        'custom.about-section': {                      
                            populate: {
                                bulletPoint : {
                                    populate: { lightIcon: true, darkIcon: true}
                                },
                                image : true
                            }
                        }
                    }
                }
            }
        }

    aboutPage = await getSingleType('about', query);

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
