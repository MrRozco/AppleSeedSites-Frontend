import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

export async function generateMetadata() {
  try {
    const homepage = await getSingleType('homepage', PAGE_CONTENT_QUERY);
    return {
      title: homepage?.title,
      description: homepage?.description,
      openGraph: {
        title: homepage?.title,
        description: homepage?.description,
      },
    };
  } catch (error) {
    return {
      title: 'Home',
      description: 'Welcome to our website.',
    };
  }
}

export default async function Home() {


  let homepage = null;
  try {
    homepage = await getSingleType('homepage', PAGE_CONTENT_QUERY);
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
