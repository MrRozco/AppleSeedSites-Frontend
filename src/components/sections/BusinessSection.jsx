import { toImage } from "@/lib/media";
import Split from "./Split";
import Carousel from "./Carousel";

/**
 * custom.business-section: the about layout with a crossfade carousel of `sliderImages`.
 * Fields: title, tag (section id for #anchor links), body (rich text), bulletPoint[],
 * sliderImages[], imageRight (default true), button[].
 */
export default function BusinessSection({ data }) {
  const images = (data?.sliderImages || [])
    .map((m, i) => toImage(m, `${data?.title || "Gallery"} image ${i + 1}`))
    .filter(Boolean);

  const media = images.length ? <Carousel images={images} label={data?.title} autoplay /> : null;

  return <Split kind="as-business" slug="business" data={data} media={media} anchor={data?.tag || undefined} />;
}
