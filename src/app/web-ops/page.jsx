import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";

export default async function webOpsPage() {

    let webOpsPage = null;

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

    webOpsPage = await getSingleType('web-ops', query);

    } catch (error) {
        error = 'Failed to load web ops page data';
        console.error('Error in WebOps:', error);
    }

    return (
        <div>
            {webOpsPage ? (
                <PageRenderer page={webOpsPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
