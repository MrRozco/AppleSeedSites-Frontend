'use client';
import styles from './styles.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useEffect, useState, useMemo, useCallback } from "react";
import { useContext } from "react";
import { ThemeContext } from "@/lib/context/ThemeContext";

const Navbar = (content) => {
  console.log ('Navbar content prop:', content);
  const { lightLogo, darkLogo, NavbarItems } = content?.content || {};
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  console.log ('NavbarItems:', NavbarItems);


  const navItems = useMemo(() => NavbarItems?.filter(item => item.__component !== 'menu.menu-button') || [], [NavbarItems]);
  const ctaItems = useMemo(() => NavbarItems?.filter(item => item.__component === 'menu.menu-button') || [], [NavbarItems]);


  const buildImageSrc = useCallback((url) => {
        if(!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
    }, [])


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileOpen && !e.target.closest(`.${styles.nav__mobileMenu}`) && !e.target.closest(`.${styles.nav__hamburger}`)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileOpen]);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <section className={styles.navBg}>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`} role="navigation" aria-label="Main navigation">
        <div className={styles.nav__logo}>
          <Link href="/">
            {lightLogo?.url ? (
              <Image
                src={buildImageSrc((theme === 'light' || lightLogo?.url) ? lightLogo.url : darkLogo.url)}
                alt="Logo"
                width={120}
                height={120}
                priority
              />
            ) : null}
          </Link>
        </div>

        <ul className={styles.nav__navLinks} role="menubar">
          {navItems.map((item, i) => (
            <NavItem key={item.id || i} item={item} theme={theme} buildImageSrc={buildImageSrc} styles={styles} />
          ))}
        </ul>

        <div className={styles.nav__cta}>
          {ctaItems.map((item, i) => (
            <Link
              key={item.id || i}
              className={styles.nav__navButton}
              href={item.url}
            >
              {item.text}
            </Link>
          ))}
          <ThemeToggle />
          <button
            className={`${styles.nav__hamburger} ${mobileOpen ? styles.open : ''}`}
            onClick={toggleMobile}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
          {mobileOpen && (
            <MobileMenu
              NavbarItems={NavbarItems}
              theme={theme}
              buildImageSrc={buildImageSrc}
              styles={styles}
              closeMobile={closeMobile}
            />
          )}
        </div>
      </nav>
    </section>
  );
};


const NavItem = ({ item, theme, buildImageSrc, styles }) => {
  if (item.__component === 'menu.dropdown') {

    const handleDesktopLinkClick = (e) => {
    const details = e.currentTarget.closest('details');
    if (details) details.open = false;
  };


    return (
      <li className={styles.nav__navLink} role="menuitem">
        <details>
          <summary className={styles.nav__navDropdown} aria-haspopup="true">
            {item.title}
          </summary>
          <div className={styles.nav__navDropdownWrapper}>
            <div className={styles.nav__navDropdownContent}>
              {item.sections?.map((section, j) => (
                <div key={section.id || j} className={styles.nav__navDropdownSection}>
                  <div className={styles.nav__navDropdownHeading}>{section.heading}</div>
                  {section.links?.map((link, k) => (
                    <Link
                      key={link.id || k}
                      href={link.url}
                      className={styles.nav__navDropdownLink}
                      onClick={handleDesktopLinkClick}
                    >
                      <div className={styles.nav__navDropdownLinkTop}>
                        {link.LightIcon?.url && link.darkIcon?.url && (
                          <Image
                            src={buildImageSrc(theme === 'light' ? link.LightIcon.url : link.darkIcon.url)}
                            alt={link.name}
                            width={35}
                            height={35}
                            className={styles.nav__navDropdownLinkIcon}
                          />
                        )}
                        <span className={styles.nav__navDropdownLinkName}>{link.name}</span>
                      </div>
                      <span className={styles.nav__navDropdownLinkDescription}>{link.description}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </details>
      </li>
    );
  }

  return (
    <li className={styles.nav__navLink} role="menuitem">
      <Link className={styles.nav__navItem} href={item.url}>
        {item.title}
      </Link>
    </li>
  );
};


const MobileMenu = ({ NavbarItems, theme, buildImageSrc, styles, closeMobile }) => (
  <div className={styles.nav__mobileMenu}>
    <ul role="menu" aria-label="Mobile navigation">
      {NavbarItems?.map((item, i) => (
        <li key={item.id || i} role="menuitem">
          {item.__component === 'menu.dropdown' ? (
            <details>
              <summary className={styles.nav__navDropdown}>{item.title}</summary>
              <ul>
                {item.sections?.map((section, j) => (
                  <li key={section.id || j}>
                    <div className={styles.nav__navDropdownHeading}>{section.heading}</div>
                    <ul>
                      {section.links?.map((link, k) => (
                        <li key={link.id || k}>
                          <Link href={link.url} onClick={closeMobile}>
                            <div className={styles.nav__navDropdownLinkTop}>
                              {link.LightIcon?.url && link.darkIcon?.url && (
                                <Image
                                  src={buildImageSrc(theme === 'light' ? link.LightIcon.url : link.darkIcon.url)}
                                  alt={link.name}
                                  width={35}
                                  height={35}
                                  className={styles.nav__navDropdownLinkIcon}
                                />
                              )}
                              <span className={styles.nav__navDropdownLinkName}>{link.name}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </details>
          ) : item.__component === 'menu.menu-button' ? (
            <Link
              className={styles.nav__navButton}
              href={item.url}
              onClick={closeMobile}
            >
              {item.text}
            </Link>
          ) : (
            <Link className={styles.nav__navItem} href={item.url} onClick={closeMobile}>
              {item.title}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default Navbar;