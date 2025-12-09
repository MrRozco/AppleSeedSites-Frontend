import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";

export default async function Home() {


  let homepage = null;
  try {
    const query = {
      populate:{
        content: {
          on :{
            'custom.hero' : {
              populate: {heroImage: true}
            },
            'custom.features' : {
              populate: {
                featuresCard: {
                  populate: { icon: true, button: true}
                },
                button: '*'
              }
            },
            'custom.our-work' : {
              populate: {
                portfolioCard: {
                  populate: {image: true}
                }
              }
            },
            'custom.performance' : {
              populate: {
                image: true,
                stat: true,
                button: '*',
                bulletPoint: {
                  populate: { lightIcon: true, darkIcon: true }
                }
              }
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

    homepage = await getSingleType('homepage', query);
  } catch (error) {
    console.error('Error in Home:', error);
  }

  return (
    <div> 
      {homepage ? (
        <PageRenderer page={homepage} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
