import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";

export default async function Businesses() {

    let businessesPage = null;

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

    businessesPage = await getSingleType('business-page', query);

    } catch (error) {
        error = 'Failed to load businesses page data';
        console.error('Error in Businesses:', error);
    }

    return (
        <div>
            {businessesPage ? (
                <PageRenderer page={businessesPage} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );

}
