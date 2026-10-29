import { cx, firstButton, has, formatPrice, inlineHtml } from "@/lib/utils";
import { pickIcon } from "@/lib/media";
import { Section, SectionHead, headingId } from "@/components/ui/Section";
import { CmsButton } from "@/components/ui/Button";
import { CmsIcon } from "@/components/ui/CmsImage";

/**
 * custom.pricing
 * Fields: eyebrow, heading, description,
 * card[] { title, description, price, priceText, setupFee, pointsIntro, bulletPoint[], cta[] },
 * button (single, shown below the cards).
 * The CMS has no "featured" flag: the card at index floor(n / 2) (n ≥ 2) is "Most Popular".
 */
export default function Pricing({ data, anchor }) {
  const { eyebrow, heading, description, card } = data || {};
  const button = firstButton(data?.button);
  const cards = (card || []).filter(Boolean);
  const n = cards.length;
  const featured = n >= 2 ? Math.floor(n / 2) : -1;
  const id = headingId("pricing", data);

  return (
    <Section kind="as-pricing" labelledBy={has(heading) ? id : undefined} id={anchor}>
      <SectionHead id={id} eyebrow={eyebrow} title={heading} description={description} />
      {n > 0 && (
        <ul className="as-prices" data-count={n > 6 ? "many" : String(n)}>
          {cards.map((c, i) => {
            const isFeatured = i === featured;
            const hasPrice = c.price != null && c.price !== "";
            const points = (c.bulletPoint || []).filter((p) => has(p?.text));
            const ctas = (c.cta || []).filter((b) => b?.url && b?.title);
            const hasSetup = c.setupFee != null && c.setupFee !== "";
            const setup = hasSetup ? (
              <p className="as-setup">
                + <b>${Number(c.setupFee).toLocaleString("en-US")}</b> one-time setup
              </p>
            ) : null;
            return (
              <li key={c.id ?? i} className="as-reveal" style={{ "--rd": `${i * 80}ms` }}>
                <article className={cx("as-card", "as-lift", "as-price", isFeatured && "is-featured")}>
                  {isFeatured && <span className="as-badge">Most Popular</span>}
                  <div className="as-price-head">
                    {has(c.title) && <h3 className="as-h3">{c.title}</h3>}
                    {has(c.description) && <p>{c.description}</p>}
                  </div>
                  {hasPrice ? (
                    <div className="as-amount">
                      <b>
                        <sup>$</sup>
                        {formatPrice(c.price)}
                      </b>
                      {has(c.priceText) && <span>{c.priceText}</span>}
                      {setup}
                    </div>
                  ) : has(c.priceText) ? (
                    <div className="as-amount is-text">
                      <b>{c.priceText}</b>
                      {setup}
                    </div>
                  ) : setup ? (
                    <div className="as-amount">{setup}</div>
                  ) : null}
                  {has(c.pointsIntro) && <p className="as-points-intro">{c.pointsIntro}</p>}
                  {points.length > 0 && (
                    <ul className="as-points">
                      {points.map((p, j) => (
                        <li key={p.id ?? j}>
                          <span className="as-check">
                            <CmsIcon media={pickIcon(p)} size={13} fallback="check" />
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: inlineHtml(p.text) }} />
                        </li>
                      ))}
                    </ul>
                  )}
                  {ctas.length > 0 && (
                    <div className="as-price-ctas">
                      {ctas.map((b, j) => (
                        <CmsButton
                          key={b.id ?? j}
                          button={b}
                          variant={j === 0 ? (isFeatured ? "primary" : "secondary") : "ghost"}
                          block={j === 0}
                        />
                      ))}
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      )}
      {button && (
        <div className="as-section-foot">
          <CmsButton button={button} variant="ghost" arrow />
        </div>
      )}
    </Section>
  );
}
