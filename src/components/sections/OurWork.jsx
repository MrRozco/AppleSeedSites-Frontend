import { firstButton, gridCount, has } from "@/lib/utils";
import { Section, SectionHead, Paragraphs, headingId } from "@/components/ui/Section";
import CmsImage from "@/components/ui/CmsImage";
import Icon from "@/components/ui/Icon";
import { CmsButton } from "@/components/ui/Button";

/**
 * sections.our-work: each card is ONE external link to the client's site.
 * Fields: eyebrow, title, description,
 * projects[] { title, tag ("Industry · City, State"), description, result (one outcome), image, url, buttonLabel },
 * button (shown below the cards).
 */
export default function OurWork({ data, anchor }) {
  const { eyebrow, title, description, projects } = data || {};
  const cards = (projects || []).filter((c) => has(c?.url) || has(c?.title));
  const button = firstButton(data?.button);
  const id = headingId("our-work", data);

  return (
    <Section kind="as-ourwork" labelledBy={has(title) ? id : undefined} id={anchor}>
      <SectionHead id={id} eyebrow={eyebrow} title={title} description={description} />
      {cards.length > 0 && (
        <ul className="as-grid" data-count={gridCount(cards.length)}>
          {cards.map((card, i) => (
            <li key={card.id ?? i} className="as-reveal" style={{ "--rd": `${i * 70}ms` }}>
              <a className="as-card as-lift as-work" href={card.url || "#"} target="_blank" rel="noopener noreferrer">
                <div className="as-work-media">
                  {card.image?.url ? (
                    <CmsImage
                      media={card.image}
                      alt={card.image.alternativeText || (card.title ? `${card.title} website screenshot` : "")}
                      sizes="(min-width: 1336px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw"
                    />
                  ) : (
                    <span className="as-media-empty">Screenshot coming soon</span>
                  )}
                </div>
                <div className="as-work-body">
                  {has(card.tag) && <p className="as-work-tag">{card.tag}</p>}
                  {has(card.title) && <h3 className="as-h3">{card.title}</h3>}
                  <Paragraphs text={card.description} />
                  {has(card.result) && (
                    <p className="as-work-result">
                      <Icon name="trend" size={16} />
                      <span>{card.result}</span>
                    </p>
                  )}
                </div>
                <span className="as-work-go">
                  {card.buttonLabel || "Visit site"}
                  <Icon name="ext" size={16} />
                  <span className="as-sr"> (opens in a new tab)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {button && (
        <div className="as-section-foot">
          <CmsButton button={button} variant="primary" size="lg" />
        </div>
      )}
    </Section>
  );
}
