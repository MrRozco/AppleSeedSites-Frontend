import { cx, firstButton, has, containsHtml } from "@/lib/utils";
import { Section, Eyebrow, Paragraphs, Points, headingId } from "@/components/ui/Section";
import { CmsButton } from "@/components/ui/Button";
import CmsImage from "@/components/ui/CmsImage";

/**
 * sections.performance
 * Fields: eyebrow, title, description, bullets[], stats[] { value, label }, image, button.
 * With an image the stat tiles overlap its bottom edge; without one they sit under the points.
 */
export default function Performance({ data }) {
  const { eyebrow, title, description, bullets, image } = data || {};
  const stats = (data?.stats || []).filter((s) => has(s?.value) || has(s?.label));
  const hasImage = Boolean(image?.url);
  const button = firstButton(data?.button);
  const id = headingId("performance", data);

  const statsList =
    stats.length > 0 ? (
      <ul className="as-stats" style={{ "--stat-cols": hasImage ? 2 : Math.min(stats.length, 4) }}>
        {stats.map((s, i) => (
          <li key={s.id ?? i} className="as-stat">
            <b>{s.value}</b>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <Section kind="as-performance" labelledBy={has(title) ? id : undefined}>
      <div className={cx("as-perf", hasImage ? "has-media" : "no-media")}>
        <div className="as-perf-copy as-reveal">
          <Eyebrow text={eyebrow} />
          {has(title) && (
            <h2 className="as-h2" id={id}>
              {title}
            </h2>
          )}
          {/* `description` is a text field, but editors may put HTML in it (the old site rendered it as HTML). */}
          {containsHtml(description) ? (
            <div className="as-lead as-lead-html" dangerouslySetInnerHTML={{ __html: description }} />
          ) : (
            <Paragraphs text={description} className="as-lead" />
          )}
          <Points points={bullets} />
          {!hasImage && statsList}
          <CmsButton button={button} />
        </div>
        {hasImage && (
          <div className="as-perf-media as-reveal" style={{ "--rd": "120ms" }}>
            <CmsImage media={image} sizes="(min-width: 1336px) 560px, (min-width: 1024px) 42vw, 100vw" />
            {statsList}
          </div>
        )}
      </div>
    </Section>
  );
}
