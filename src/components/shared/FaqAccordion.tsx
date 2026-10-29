import type { CSSProperties } from "react";
import Icon from "@/components/ui/Icon";

/** elements.faq-item with its rich-text answer already rendered to HTML. */
export interface FaqItem {
  id?: number | string;
  question: string;
  answerHtml?: string;
}

const stripTags = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const answerText = (item: FaqItem) => stripTags(item.answerHtml || "");

/** FAQPage structured data from the same items, so Google can show the answers in search. */
function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: answerText(q) },
    })),
  };
  return (
    <script
      type="application/ld+json"
      // Escape "<" so answer text can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\u003c") }}
    />
  );
}

/**
 * Native <details>/<summary> accordion: works without JavaScript and with the keyboard.
 * Also outputs FAQPage JSON-LD for the items.
 */
export default function FaqAccordion({ items, jsonLd = true }: { items: FaqItem[]; jsonLd?: boolean }) {
  const list = items.filter((q) => q?.question?.trim());
  if (!list.length) return null;
  return (
    <>
      <div className="as-faq-list">
        {list.map((q, i) => (
          <details key={q.id ?? i} className="as-faq-item as-reveal" style={{ "--rd": `${Math.min(i, 5) * 50}ms` } as CSSProperties}>
            <summary>
              <h3>{q.question}</h3>
              <span className="as-faq-ic" aria-hidden="true">
                <Icon name="plus" size={18} />
              </span>
            </summary>
            <div className="as-faq-a as-prose" dangerouslySetInnerHTML={{ __html: q.answerHtml || "" }} />
          </details>
        ))}
      </div>
      {jsonLd && <FaqJsonLd items={list} />}
    </>
  );
}
