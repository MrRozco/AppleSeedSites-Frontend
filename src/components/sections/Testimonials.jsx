import { gridCount, has } from "@/lib/utils";
import { pickIcon, isQuoteIcon } from "@/lib/media";
import { Section, SectionHead, headingId } from "@/components/ui/Section";
import CmsImage from "@/components/ui/CmsImage";
import { QuoteMark } from "@/components/ui/Icon";

/**
 * custom.testimonials
 * Fields: eyebrow, title, description, testimonialCards[] { lightIcon, darkIcon, testimonial, name, subname }.
 * The card icon is either a client logo upload or the design's quote mark. Quote-mark uploads
 * (file name contains "quote") use the design's own mark so every card matches.
 */
export default function Testimonials({ data }) {
  const { eyebrow, title, description, testimonialCards } = data || {};
  const cards = (testimonialCards || []).filter((c) => has(c?.testimonial));
  const id = headingId("testimonials", data);

  return (
    <Section kind="as-testimonials" labelledBy={has(title) ? id : undefined}>
      <SectionHead id={id} eyebrow={eyebrow} title={title} description={description} />
      {cards.length > 0 && (
        <ul className="as-grid is-quotes" data-count={gridCount(cards.length)}>
          {cards.map((c, i) => {
            const icon = pickIcon(c);
            const logo = icon && !isQuoteIcon(icon) ? icon : null;
            return (
              <li key={c.id ?? i} className="as-reveal" style={{ "--rd": `${i * 70}ms` }}>
                <figure className="as-card as-quote">
                  {logo ? (
                    <div className="as-quote-logo">
                      <CmsImage media={logo} alt={logo.alternativeText || (c.subname ? `${c.subname} logo` : "")} sizes="160px" />
                    </div>
                  ) : (
                    <div className="as-quote-mark">
                      <QuoteMark />
                    </div>
                  )}
                  <blockquote>
                    <p style={{ margin: 0 }}>{c.testimonial}</p>
                  </blockquote>
                  <figcaption>
                    {has(c.name) && <b>{c.name}</b>}
                    {has(c.subname) && <span>{c.subname}</span>}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
