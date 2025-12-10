import PageRenderer from "@/components/PageRenderer";
import { getSingleType } from "@/lib/api/strapi";
import { PAGE_CONTENT_QUERY } from "@/lib/api/queries";

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
