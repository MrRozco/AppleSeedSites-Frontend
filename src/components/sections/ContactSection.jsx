import { has, inlineHtml } from "@/lib/utils";
import { pickIcon } from "@/lib/media";
import { Section, Paragraphs, headingId } from "@/components/ui/Section";
import { CmsIcon } from "@/components/ui/CmsImage";
import Icon, { iconForHref } from "@/components/ui/Icon";
import SmartLink from "@/components/ui/SmartLink";
import EmbedHtml from "./EmbedHtml";

/** `embed` is a text field; older content may hold an oEmbed object instead of a string. */
function embedHtml(embed) {
  const html = typeof embed === "string" ? embed : embed?.oembed?.html || embed?.html || "";
  // Third-party iframes load lazily so they don't compete with the page's own resources.
  return html.trim().replace(/<iframe(?![^>]*\bloading=)/gi, '<iframe loading="lazy"');
}

/**
 * custom.contact-section
 * Fields: darkIcon, lightIcon, title, description, embed (provider HTML), subtitle,
 * link[] (first item is shown), supportingTitle, bulletPoint[].
 */
export default function ContactSection({ data }) {
  const { title, description, subtitle, supportingTitle, bulletPoint } = data || {};
  const html = embedHtml(data?.embed);
  const link = Array.isArray(data?.link) ? data.link[0] : data?.link;
  const points = (bulletPoint || []).filter((p) => has(p?.text));
  const id = headingId("contact", data);

  return (
    <Section kind="as-contactsec" labelledBy={has(title) ? id : undefined}>
      <div className="as-contact">
        <div className="as-card as-contact-main as-reveal">
          <header>
            <span className="as-icon-tile">
              <CmsIcon media={pickIcon(data)} size={24} fallback="calendar" />
            </span>
            <div>
              {has(title) && (
                <h2 className="as-h2" id={id} style={{ fontSize: "clamp(26px, 3vw, 34px)" }}>
                  {title}
                </h2>
              )}
              <Paragraphs text={description} />
            </div>
          </header>
          {html && <EmbedHtml html={html} />}
        </div>

        <div className="as-contact-side">
          {(has(subtitle) || link?.url) && (
            <div className="as-card as-reveal" style={{ "--rd": "80ms" }}>
              {has(subtitle) && <h3 className="as-h3">{subtitle}</h3>}
              {link?.url && (
                <SmartLink className="as-contactlink" href={link.url}>
                  <span className="as-icon-tile">
                    <CmsIcon media={pickIcon(link)} size={20} fallback={iconForHref(link.url)} />
                  </span>
                  <span>{link.text || link.url.replace(/^(mailto|tel):/i, "")}</span>
                </SmartLink>
              )}
            </div>
          )}
          {(has(supportingTitle) || points.length > 0) && (
            <div className="as-card as-reveal" style={{ "--rd": "160ms" }}>
              {has(supportingTitle) && <h3 className="as-h3">{supportingTitle}</h3>}
              {points.length > 0 && (
                <ul className="as-bullets">
                  {points.map((p, i) => (
                    <li key={p.id ?? i}>
                      <span className="as-check">
                        <Icon name="check" size={13} />
                      </span>
                      <span dangerouslySetInnerHTML={{ __html: inlineHtml(p.text) }} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
