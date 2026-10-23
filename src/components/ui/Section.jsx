import { cx, has, paragraphs, inlineHtml } from "@/lib/utils";
import { pickIcon } from "@/lib/media";
import { CmsIcon } from "./CmsImage";

/** Stable heading id for aria-labelledby, from the Strapi component id. */
export const headingId = (kind, data) => `${kind}-${data?.id ?? "x"}`;

export function Section({ kind, labelledBy, id, children }) {
  return (
    <section className={cx("as-section", kind)} aria-labelledby={labelledBy} id={id || undefined}>
      <div className="as-container">{children}</div>
    </section>
  );
}

export function Eyebrow({ text }) {
  return has(text) ? <p className="as-eyebrow">{text}</p> : null;
}

/** Plain-text field split on blank lines into <p> elements. */
export function Paragraphs({ text, className }) {
  return paragraphs(text).map((p, i) => (
    <p key={i} className={className}>
      {p}
    </p>
  ));
}

/** Section head: eyebrow + H2 on the left, description on the right (desktop). */
export function SectionHead({ id, eyebrow, title, description }) {
  const hasCopy = paragraphs(description).length > 0;
  if (!has(title) && !has(eyebrow) && !hasCopy) return null;
  return (
    <div className={cx("as-head", !hasCopy && "is-single", "as-reveal")}>
      <div className="as-head-title">
        <Eyebrow text={eyebrow} />
        {has(title) && (
          <h2 className="as-h2" id={id}>
            {title}
          </h2>
        )}
      </div>
      {hasCopy && (
        <div className="as-head-copy">
          <Paragraphs text={description} className="as-lead" />
        </div>
      )}
    </div>
  );
}

/** `custom.bullet-point[]`: icon tile + rich text. */
export function Points({ points }) {
  const list = (points || []).filter((p) => has(p?.text));
  if (!list.length) return null;
  return (
    <ul className="as-points">
      {list.map((p, i) => (
        <li key={p.id ?? i}>
          <span className="as-icon-tile">
            <CmsIcon media={pickIcon(p)} size={18} fallback="check" />
          </span>
          <div dangerouslySetInnerHTML={{ __html: inlineHtml(p.text) }} />
        </li>
      ))}
    </ul>
  );
}
