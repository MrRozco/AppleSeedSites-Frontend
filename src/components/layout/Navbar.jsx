"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/utils";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import SmartLink from "@/components/ui/SmartLink";
import Wordmark from "./Wordmark";

const HOVER_OPEN_MS = 80;
const HOVER_CLOSE_MS = 160;

function NavIcon({ icon }) {
  return (
    <span className="as-icon-tile">
      {icon ? <Image src={icon.src} alt="" width={26} height={26} /> : <Icon name="spark" size={18} />}
    </span>
  );
}

/**
 * Main navigation. `items` are normalised on the server (see lib/navigation.js):
 *   { type: "link", label, href }
 *   { type: "button", label, href, variant }
 *   { type: "dropdown", label, mode: "mega", sections: [{ heading, links: [{ name, description, href, icon }] }] }
 *   { type: "dropdown", label, mode: "compact", links: [{ title, href }] }
 * Desktop (≥1024px): links, mega/compact dropdowns (click, keyboard, hover-intent on fine pointers).
 * Below 1024px: hamburger → full-screen menu with accordions.
 */
export default function Navbar({ items = [] }) {
  const pathname = usePathname();
  const navRef = useRef(null);
  const triggerRefs = useRef({});
  const hoverTimer = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [openIdx, setOpenIdx] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAcc, setOpenAcc] = useState(() => new Set());
  const [hoverCapable, setHoverCapable] = useState(false);
  const baseId = useId();

  const menuItems = items.filter((i) => i.type !== "button");
  const ctas = items.filter((i) => i.type === "button");

  const closeAll = useCallback(() => {
    clearTimeout(hoverTimer.current);
    setOpenIdx(null);
    setMobileOpen(false);
  }, []);

  // Scroll state: passive listener, state only changes when the boolean flips.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hover-to-open only on devices with a fine pointer.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverCapable(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Close everything after navigating.
  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  // Click outside the navbar closes open panels; Esc closes and returns focus to the trigger.
  useEffect(() => {
    if (openIdx === null) return;
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenIdx(null);
    };
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpenIdx(null);
      triggerRefs.current[openIdx]?.focus();
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openIdx]);

  // Mobile menu: lock page scroll, Esc closes, and it closes when the viewport reaches desktop width.
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onWide = () => mq.matches && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [mobileOpen]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const hoverTo = (value, delay) => {
    if (!hoverCapable) return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenIdx(value), delay);
  };

  const onItemKeyDown = (e, i) => {
    if (e.key === "ArrowDown" && e.target === triggerRefs.current[i]) {
      e.preventDefault();
      setOpenIdx(i);
      // Focus the first link once the panel is visible.
      requestAnimationFrame(() => {
        document.getElementById(`${baseId}-dd-${i}`)?.querySelector("a")?.focus();
      });
    }
  };

  const onItemBlur = (e, i) => {
    if (openIdx === i && !e.currentTarget.contains(e.relatedTarget)) setOpenIdx(null);
  };

  const toggleAcc = (i) =>
    setOpenAcc((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const mobileId = `${baseId}-mobile`;

  return (
    <nav ref={navRef} className={cx("as-nav", scrolled && "is-scrolled")} aria-label="Main">
      <div className="as-container as-nav-in">
        <Link className="as-logo" href="/" aria-label="AppleSeed Sites home">
          <Wordmark />
        </Link>

        <ul className="as-menu">
          {menuItems.map((item, i) => {
            if (item.type === "link") {
              return (
                <li key={i}>
                  <SmartLink
                    className="as-navlink"
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </SmartLink>
                </li>
              );
            }
            const open = openIdx === i;
            const panelId = `${baseId}-dd-${i}`;
            const isMega = item.mode === "mega";
            const cols = isMega ? Math.min(Math.max(item.sections.length, 1), 4) : 0;
            return (
              <li
                key={i}
                className={isMega ? "has-mega" : undefined}
                onMouseEnter={() => hoverTo(i, HOVER_OPEN_MS)}
                onMouseLeave={() => hoverTo(null, HOVER_CLOSE_MS)}
                onKeyDown={(e) => onItemKeyDown(e, i)}
                onBlur={(e) => onItemBlur(e, i)}
              >
                <button
                  ref={(el) => (triggerRefs.current[i] = el)}
                  type="button"
                  className="as-navtrigger"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIdx(open ? null : i)}
                >
                  {item.label}
                  <Icon name="chevron" size={16} className="as-chev" />
                </button>
                {isMega ? (
                  <div className={cx("as-panel", "as-mega", open && "is-open")} id={panelId}>
                    <div className="as-container">
                      <div className="as-mega-in" data-cols={cols} style={{ "--cols": cols }}>
                        {item.sections.map((section, s) => (
                          <div className="as-mega-col" key={s}>
                            {section.heading && <h3>{section.heading}</h3>}
                            <ul>
                              {section.links.map((link, l) => (
                                <li key={l}>
                                  <SmartLink className="as-richlink" href={link.href} onClick={() => setOpenIdx(null)}>
                                    <NavIcon icon={link.icon} />
                                    <span>
                                      <b>{link.name}</b>
                                      {link.description && <span>{link.description}</span>}
                                    </span>
                                  </SmartLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={cx("as-panel", "as-drop", open && "is-open")} id={panelId}>
                    <ul>
                      {item.links.map((link, l) => (
                        <li key={l}>
                          <SmartLink href={link.href} onClick={() => setOpenIdx(null)}>
                            {link.title}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {ctas.length > 0 && (
          <div className="as-nav-ctas">
            {ctas.map((cta, i) => (
              <Button key={i} href={cta.href} variant={cta.variant} size="sm" arrow={false}>
                {cta.label}
              </Button>
            ))}
          </div>
        )}

        <button
          type="button"
          className="as-burger"
          aria-expanded={mobileOpen}
          aria-controls={mobileId}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <i />
        </button>
      </div>

      <div className={cx("as-mobile", mobileOpen && "is-open")} id={mobileId}>
        <ul className="as-mobile-list">
          {menuItems.map((item, i) => {
            if (item.type === "link") {
              return (
                <li key={i}>
                  <SmartLink
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </SmartLink>
                </li>
              );
            }
            const accId = `${baseId}-acc-${i}`;
            const open = openAcc.has(i);
            return (
              <li key={i}>
                <button
                  type="button"
                  className="as-acc-btn"
                  aria-expanded={open}
                  aria-controls={accId}
                  onClick={() => toggleAcc(i)}
                >
                  {item.label}
                  <Icon name="chevron" size={20} className="as-chev" />
                </button>
                <div className={cx("as-acc-panel", open && "is-open")} id={accId}>
                  <div>
                    {item.mode === "mega" ? (
                      item.sections.map((section, s) => (
                        <div key={s}>
                          {section.heading && <h3>{section.heading}</h3>}
                          <ul>
                            {section.links.map((link, l) => (
                              <li key={l}>
                                <SmartLink className="as-richlink" href={link.href} onClick={() => setMobileOpen(false)}>
                                  <NavIcon icon={link.icon} />
                                  <span>
                                    <b>{link.name}</b>
                                  </span>
                                </SmartLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <ul>
                        {item.links.map((link, l) => (
                          <li key={l}>
                            <SmartLink className="as-plain" href={link.href} onClick={() => setMobileOpen(false)}>
                              {link.title}
                            </SmartLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {ctas.length > 0 && (
          <div className="as-mobile-ctas">
            {ctas.map((cta, i) => (
              <Button key={i} href={cta.href} variant={cta.variant} size="lg" block arrow={false} onClick={() => setMobileOpen(false)}>
                {cta.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
