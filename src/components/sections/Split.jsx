import { cx, firstButton, has, richHtml } from "@/lib/utils";
import { Section, Points, headingId } from "@/components/ui/Section";
import { CmsButton } from "@/components/ui/Button";

/**
 * Shared two-column layout for custom.about-section and custom.business-section.
 * No media → a centred reading column for long-form text (privacy, terms).
 * `imageRight` false/empty puts the media first on desktop.
 */
export default function Split({ kind, slug, data, media, anchor }) {
  const { title, body, bulletPoint, imageRight } = data || {};
  const html = richHtml(body);
  const button = firstButton(data?.button);
  const id = headingId(slug, data);
  const textOnly = !media;

  return (
    <Section kind={kind} labelledBy={has(title) ? id : undefined} id={anchor}>
      <div className={cx("as-split", textOnly && "is-text", !textOnly && !imageRight && "is-media-left")}>
        <div className="as-split-copy as-reveal">
          {has(title) && (
            <h2 className="as-h2" id={id}>
              {title}
            </h2>
          )}
          {html && <div className="as-prose" dangerouslySetInnerHTML={{ __html: html }} />}
          <Points points={bulletPoint} />
          <CmsButton button={button} />
        </div>
        {media && (
          <div className="as-split-media as-reveal" style={{ "--rd": "120ms" }}>
            {media}
          </div>
        )}
      </div>
    </Section>
  );
}
