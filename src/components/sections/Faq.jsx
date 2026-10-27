import { firstButton, has, richHtml } from "@/lib/utils";
import { Section, Eyebrow, Paragraphs, headingId } from "@/components/ui/Section";
import { CmsButton } from "@/components/ui/Button";
import FaqAccordion from "@/components/shared/FaqAccordion";

/**
 * custom.faq: native <details>/<summary> accordion plus FAQPage structured data.
 * Fields: eyebrow, title, description, faqItem[] { question, answer (rich text) }, button (single).
 */
export default function Faq({ data, anchor }) {
  const { eyebrow, title, description } = data || {};
  const items = (data?.faqItem || [])
    .filter((q) => has(q?.question))
    .map((q) => ({ id: q.id, question: q.question, answerHtml: richHtml(q.answer) }));
  const button = firstButton(data?.button);
  const id = headingId("faq", data);

  return (
    <Section kind="as-faq-sec" labelledBy={has(title) ? id : undefined} id={anchor}>
      <div className="as-faq">
        <div className="as-faq-head as-reveal">
          <Eyebrow text={eyebrow} />
          {has(title) && (
            <h2 className="as-h2" id={id}>
              {title}
            </h2>
          )}
          <Paragraphs text={description} className="as-lead" />
          <CmsButton button={button} variant="secondary" arrow />
        </div>
        <FaqAccordion items={items} />
      </div>
    </Section>
  );
}
