import { firstButton, gridCount, has } from "@/lib/utils";
import { Section, SectionHead, Paragraphs, headingId } from "@/components/ui/Section";
import { CmsButton } from "@/components/ui/Button";
import { CmsIcon } from "@/components/ui/CmsImage";

/**
 * sections.features
 * Fields: eyebrow, title, description, cards[] { icon, title, description, buttons[] }, button.
 */
export default function Features({ data }) {
  const { eyebrow, title, description } = data || {};
  const cards = (data?.cards || []).filter((c) => has(c?.title) || has(c?.description));
  const sectionButton = firstButton(data?.button);
  const id = headingId("features", data);

  return (
    <Section kind="as-features" labelledBy={has(title) ? id : undefined}>
      <SectionHead id={id} eyebrow={eyebrow} title={title} description={description} />
      {cards.length > 0 && (
        <ul className="as-grid" data-count={gridCount(cards.length)}>
          {cards.map((card, i) => (
            <li key={card.id ?? i} className="as-reveal" style={{ "--rd": `${i * 70}ms` }}>
              <article className="as-card as-lift as-feature">
                <span className="as-icon-tile">
                  <CmsIcon media={card.icon} size={24} />
                </span>
                {has(card.title) && <h3 className="as-h3">{card.title}</h3>}
                <Paragraphs text={card.description} />
                <CmsButton button={firstButton(card.buttons)} variant="ghost" arrow />
              </article>
            </li>
          ))}
        </ul>
      )}
      {sectionButton && (
        <div className="as-section-foot">
          <CmsButton button={sectionButton} variant="secondary" arrow />
        </div>
      )}
    </Section>
  );
}
