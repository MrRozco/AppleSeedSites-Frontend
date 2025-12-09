import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";

export default async function Ai() {

    let aiPage = null;

    try {
        const query = {
            populate: {
                content: {
                    on: {
                        'custom.hero': {
                            populate: { heroImage: true }
                        },
                        'custom.business-section': {                      
                            populate: {
                                bulletPoint : {
                                    populate: { lightIcon: true, darkIcon: true}
                                },
                                sliderImages : true,
                                button: '*'
                            }
                        }
                    }
                }
            }
        }

    aiPage = await getSingleType('ai', query);

    } catch (error) {
        error = 'Failed to load businesses page data';
        console.error('Error in Businesses:', error);
    }

    return (
        <div>
            {aiPage ? (
                <PageRenderer page={aiPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
