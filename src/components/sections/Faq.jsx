import { firstButton, has, richHtml } from "@/lib/utils";
import { Section, Eyebrow, Paragraphs, headingId } from "@/components/ui/Section";
import { CmsButton } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

const stripTags = (html) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** FAQPage structured data from the same items, so Google can show the answers in search. */
function FaqJsonLd({ items }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: stripTags(richHtml(q.answer)) },
    })),
  };
  return (
    <script
      type="application/ld+json"
      // Escape "<" so answer text can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * custom.faq: native <details>/<summary>, so it works without JavaScript and with the keyboard.
 * Fields: eyebrow, title, description, faqItem[] { question, answer (rich text) }, button (single).
 */
export default function Faq({ data, anchor }) {
  const { eyebrow, title, description } = data || {};
  const items = (data?.faqItem || []).filter((q) => has(q?.question));
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
        <div className="as-faq-list">
          {items.map((q, i) => (
            <details key={q.id ?? i} className="as-faq-item as-reveal" style={{ "--rd": `${Math.min(i, 5) * 50}ms` }}>
              <summary>
                <h3>{q.question}</h3>
                <span className="as-faq-ic" aria-hidden="true">
                  <Icon name="plus" size={18} />
                </span>
              </summary>
              <div className="as-faq-a as-prose" dangerouslySetInnerHTML={{ __html: richHtml(q.answer) }} />
            </details>
          ))}
        </div>
      </div>
      {items.length > 0 && <FaqJsonLd items={items} />}
    </Section>
  );
}
