import { toImage } from "@/lib/media";
import Split from "./Split";
import Carousel from "./Carousel";

/**
 * sections.text-gallery: the text + image layout with a crossfade carousel of `images`.
 * Fields: anchorId (section id for #anchor links), title, body (rich text), bullets[],
 * images[], imageRight (default true), buttons[].
 */
export default function TextGallery({ data }) {
  const images = (data?.images || [])
    .map((m, i) => toImage(m, `${data?.title || "Gallery"} image ${i + 1}`))
    .filter(Boolean);

  const media = images.length ? <Carousel images={images} label={data?.title} autoplay /> : null;

  return <Split kind="as-business" slug="text-gallery" data={data} media={media} anchor={data?.anchorId || undefined} />;
}
