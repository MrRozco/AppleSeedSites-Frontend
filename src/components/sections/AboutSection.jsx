import CmsImage from "@/components/ui/CmsImage";
import Split from "./Split";

/**
 * custom.about-section
 * Fields: title, body (rich text), bulletPoint[], image (single), imageRight, button (single).
 */
export default function AboutSection({ data }) {
  const image = data?.image?.url ? data.image : null;
  const media = image ? (
    <CmsImage media={image} alt={image.alternativeText || ""} sizes="(min-width: 1336px) 560px, (min-width: 1024px) 42vw, 100vw" />
  ) : null;
  return <Split kind="as-about" slug="about" data={data} media={media} />;
}
