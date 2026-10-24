import { cx, has } from "@/lib/utils";
import CmsImage, { CmsIcon } from "@/components/ui/CmsImage";
import { CmsButton } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Icon";
import { Eyebrow, Paragraphs } from "@/components/ui/Section";

/** custom.hero `trust`: small proof points under the buttons. `stars` draws a 5-star rating. */
function TrustRow({ items }) {
  const list = (items || []).filter((t) => has(t?.text));
  if (!list.length) return null;
  return (
    <ul className="as-trust">
      {list.map((t, i) => (
        <li key={t.id ?? i}>
          {t.stars ? (
            <>
              <Stars />
              <span className="as-sr">Rated 5 out of 5 stars</span>
            </>
          ) : t.icon?.url ? (
            <span className="as-trust-ic">
              <CmsIcon media={t.icon} size={16} fallback={null} />
            </span>
          ) : null}
          <span>{t.text}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * custom.hero → the page's only H1.
 * Fields: eyebrow, header, text, heroImage, button[] (CTA slot: first primary, rest secondary),
 * trust[] { stars, icon, text }.
 * `compact` (inner pages) uses the smaller H1 and ignores the image, as in the design.
 */
export default function Hero({ data, compact = false, fallbackTitle }) {
  const { eyebrow, header, text, heroImage, trust } = data || {};
  const media = !compact && heroImage?.url ? heroImage : null;
  const buttons = (data?.button || []).filter((b) => b?.url && b?.title);

  return (
    <header className={cx("as-hero", media && "has-media", compact && "is-compact")}>
      <div className="as-hero-bg" aria-hidden="true" />
      <div className="as-container as-hero-in">
        <div className="as-hero-copy">
          <Eyebrow text={eyebrow} />
          <h1 className={cx("as-h1", compact && "is-compact")}>{has(header) ? header : fallbackTitle}</h1>
          <Paragraphs text={text} className="as-lead" />
          {buttons.length > 0 && (
            <div className="as-btn-row">
              {buttons.map((b, i) => (
                <CmsButton key={b.id ?? i} button={b} variant={i === 0 ? "primary" : "secondary"} size="lg" />
              ))}
            </div>
          )}
          <TrustRow items={trust} />
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
