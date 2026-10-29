import { has } from "@/lib/utils";
import { pickIcon } from "@/lib/media";
import CmsImage, { CmsIcon } from "@/components/ui/CmsImage";
import { CmsButton } from "@/components/ui/Button";
import SmartLink from "@/components/ui/SmartLink";
import { iconForHref } from "@/components/ui/Icon";
import Wordmark from "./Wordmark";

/**
 * Footer single type.
 * Fields: logo, description, cta { label, url }, linksTitle, links[] { label, url },
 * contactTitle, contactLinks[] { label, url (optional), icon }.
 */
export default function Footer({ data }) {
  const { logo, description, cta, linksTitle, contactTitle } = data || {};
  const links = (data?.links || []).filter((l) => l?.url && l?.label);
  // A contact item without a url renders as a plain text line (e.g. the service area).
  const contacts = (data?.contactLinks || []).filter((c) => has(c?.label));

  return (
    <footer className="as-footer">
      <div className="as-container">
        <div className="as-footer-grid">
          <div className="as-footer-brand">
            <SmartLink className="as-logo as-footer-logo" href="/" aria-label="AppleSeed Sites home">
              {logo?.url ? <CmsImage media={logo} alt="AppleSeed Sites" sizes="120px" /> : <Wordmark />}
            </SmartLink>
            {has(description) && <p>{description}</p>}
            <CmsButton button={cta} variant="secondary" arrow />
          </div>

          {links.length > 0 && (
            <nav aria-label={linksTitle || "Footer"}>
              {has(linksTitle) && <h2>{linksTitle}</h2>}
              <ul>
                {links.map((link, i) => (
                  <li key={link.id ?? i}>
                    <SmartLink href={link.url}>{link.label}</SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {contacts.length > 0 && (
            <div>
              {has(contactTitle) && <h2>{contactTitle}</h2>}
              <ul>
                {contacts.map((c, i) => (
                  <li key={c.id ?? i}>
                    {has(c.url) ? (
                      <SmartLink href={c.url}>
                        <CmsIcon media={pickIcon(c)} size={18} fallback={iconForHref(c.url)} />
                        <span>{c.label}</span>
                      </SmartLink>
                    ) : (
                      <span className="as-footer-note">
                        <CmsIcon media={pickIcon(c)} size={18} fallback="pin" />
                        <span>{c.label}</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="as-footer-legal">
          <span>© {new Date().getFullYear()} AppleSeed Sites. All rights reserved.</span>
          <span>Built in Maryland.</span>
        </div>
      </div>
    </footer>
  );
}
