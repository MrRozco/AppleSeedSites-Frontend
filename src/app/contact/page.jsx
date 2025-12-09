import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";

export default async function Contact() {

    let contactPage = null;

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
                                image : true,
                                button: '*'
                            }
                        }
                    }
                }
            }
        }

    contactPage = await getSingleType('contact', query);

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
