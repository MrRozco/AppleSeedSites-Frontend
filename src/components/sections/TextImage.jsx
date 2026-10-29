import CmsImage from "@/components/ui/CmsImage";
import Split from "./Split";

/**
 * sections.text-image
 * Fields: title, body (rich text), bullets[], image, imageRight, button.
 * Without an image it renders as a centred reading column (privacy policy, terms).
 */
export default function TextImage({ data }) {
  const image = data?.image?.url ? data.image : null;
  const media = image ? (
    <CmsImage media={image} alt={image.alternativeText || ""} sizes="(min-width: 1336px) 560px, (min-width: 1024px) 42vw, 100vw" />
  ) : null;
  return <Split kind="as-about" slug="text-image" data={data} media={media} />;
}
