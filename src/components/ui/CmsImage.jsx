import Image from "next/image";
import { buildImageSrc } from "@/lib/media";
import Icon from "./Icon";

/**
 * A Strapi media object through next/image (AVIF/WebP, responsive sizes, lazy by default).
 * Width/height come from Strapi so the browser reserves the box; CSS sets the final shape.
 * SVG uploads are served as-is (next/image skips optimizing SVG).
 */
export default function CmsImage({ media, alt, width, height, sizes, priority = false, className, style }) {
  if (!media?.url) return null;
  return (
    <Image
      src={buildImageSrc(media.url)}
      alt={alt ?? media.alternativeText ?? ""}
      width={width || media.width || 800}
      height={height || media.height || 600}
      sizes={sizes}
      priority={priority}
      className={className}
      style={style}
    />
  );
}

/** A CMS icon upload at a fixed size, or the design's stand-in SVG when none was uploaded. */
export function CmsIcon({ media, size = 24, fallback = "spark" }) {
  if (media?.url) {
    return <CmsImage media={media} alt="" width={size} height={size} />;
  }
  return fallback ? <Icon name={fallback} size={size} /> : null;
}
