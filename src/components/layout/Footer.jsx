import { has } from "@/lib/utils";
import { pickIcon } from "@/lib/media";
import CmsImage, { CmsIcon } from "@/components/ui/CmsImage";
import { CmsButton } from "@/components/ui/Button";
import SmartLink from "@/components/ui/SmartLink";
import { iconForHref } from "@/components/ui/Icon";
import Wordmark from "./Wordmark";

/**
 * Footer single type.
 * Fields: logo, description, cta { title, url }, menuHeader, footerLink[] { title, url },
 * contactHeader, contactLink[] { url (optional), text, lightIcon, darkIcon }.
 */
export default function Footer({ data }) {
  const { logo, description, cta, menuHeader, footerLink, contactHeader, contactLink } = data || {};
  const links = (footerLink || []).filter((l) => l?.url && l?.title);
  // A contact item without a url renders as a plain text line (e.g. the service area).
  const contacts = (contactLink || []).filter((c) => has(c?.text));

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
            <nav aria-label={menuHeader || "Footer"}>
              {has(menuHeader) && <h2>{menuHeader}</h2>}
              <ul>
                {links.map((link, i) => (
                  <li key={link.id ?? i}>
                    <SmartLink href={link.url}>{link.title}</SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {contacts.length > 0 && (
            <div>
              {has(contactHeader) && <h2>{contactHeader}</h2>}
              <ul>
                {contacts.map((c, i) => (
                  <li key={c.id ?? i}>
                    {has(c.url) ? (
                      <SmartLink href={c.url}>
                        <CmsIcon media={pickIcon(c)} size={18} fallback={iconForHref(c.url)} />
                        <span>{c.text}</span>
                      </SmartLink>
                    ) : (
                      <span className="as-footer-note">
                        <CmsIcon media={pickIcon(c)} size={18} fallback="pin" />
                        <span>{c.text}</span>
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
