import { cx, has } from "@/lib/utils";
import CmsImage from "@/components/ui/CmsImage";
import { Eyebrow, Paragraphs } from "@/components/ui/Section";

/**
 * custom.hero → the page's only H1.
 * Fields: eyebrow, header, text, heroImage.
 * `compact` (inner pages) uses the smaller H1 and ignores the image, as in the design.
 */
export default function Hero({ data, compact = false, fallbackTitle }) {
  const { eyebrow, header, text, heroImage } = data || {};
  const media = !compact && heroImage?.url ? heroImage : null;

  return (
    <header className={cx("as-hero", media && "has-media", compact && "is-compact")}>
      <div className="as-hero-bg" aria-hidden="true" />
      <div className="as-container as-hero-in">
        <div className="as-hero-copy">
          <Eyebrow text={eyebrow} />
          <h1 className={cx("as-h1", compact && "is-compact")}>{has(header) ? header : fallbackTitle}</h1>
          <Paragraphs text={text} className="as-lead" />
        </div>
        {media && (
          <div className="as-hero-media">
            {/* LCP element: loads eagerly with high priority. Keeps the upload's own aspect ratio. */}
            <CmsImage
              media={media}
              priority
              sizes="(min-width: 1336px) 600px, (min-width: 1024px) 46vw, 100vw"
              style={media.width && media.height ? { aspectRatio: `${media.width} / ${media.height}` } : undefined}
            />
          </div>
        )}
      </div>
    </header>
  );
}
