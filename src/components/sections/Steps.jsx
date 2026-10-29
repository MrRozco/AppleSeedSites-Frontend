import { cx, firstButton, has } from "@/lib/utils";
import { Section, SectionHead, Paragraphs, headingId } from "@/components/ui/Section";
import { CmsButton } from "@/components/ui/Button";

/**
 * sections.steps: numbered process. Numbers come from the order, so editors never type them.
 * Fields: eyebrow, title, description, steps[] { title, body }, button.
 * ≥1024px with 2–4 steps: one row; otherwise a vertical timeline.
 */
export default function Steps({ data, anchor }) {
  const { eyebrow, title, description } = data || {};
  const steps = (data?.steps || []).filter((s) => has(s?.title));
  const button = firstButton(data?.button);
  const id = headingId("steps", data);
  const n = steps.length;

  return (
    <Section kind="as-steps-sec" labelledBy={has(title) ? id : undefined} id={anchor}>
      <SectionHead id={id} eyebrow={eyebrow} title={title} description={description} />
      {n > 0 && (
        <ol className={cx("as-steps", n >= 2 && n <= 4 && "is-row")} style={{ "--n": n }}>
          {steps.map((s, i) => (
            <li key={s.id ?? i} className="as-step as-reveal" style={{ "--rd": `${i * 90}ms` }}>
              <span className="as-step-num" aria-hidden="true">
                {i + 1}
              </span>
              <div className="as-step-body">
                <h3 className="as-h3">
                  <span className="as-sr">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <Paragraphs text={s.body} />
              </div>
            </li>
          ))}
        </ol>
      )}
      {button && (
        <div className="as-section-foot">
          <CmsButton button={button} variant="primary" size="lg" />
        </div>
      )}
    </Section>
  );
}
