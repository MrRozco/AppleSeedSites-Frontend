'use client';
import styles from './styles.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useMemo, useCallback } from "react";
import { usePathname } from 'next/navigation';

const Navbar = (content) => {
  const { lightLogo, darkLogo, NavbarItems } = content?.content || {};
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const pathname = usePathname();



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
      // Close mobile menu
      if (mobileOpen && !e.target.closest(`.${styles.nav__mobileMenu}`) && !e.target.closest(`.${styles.nav__hamburger}`)) {
        setMobileOpen(false);
      }
      // Close dropdown menu
      if (openDropdown !== null && !e.target.closest(`.${styles.nav__navLink}[data-dropdown-id="${openDropdown}"]`)) {
        setOpenDropdown(null);
      }
    };
    if (mobileOpen || openDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileOpen, openDropdown]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <section className={`${styles.navBg} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`} role="navigation" aria-label="Main navigation">
        <div className={styles.nav__logo}>
          <Link href="/">
            {darkLogo?.url ? (
              <Image
                src={buildImageSrc(darkLogo.url)}
                alt="AppleSeed Sites Logo"
                width={170}
                height={140}
                style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxHeight: '140px', maxWidth: '200px' }}
                priority
              />
            ) : null}
          </Link>
        </div>

        <ul className={styles.nav__navLinks} role="menubar">
          {navItems.map((item, i) => (
            <NavItem 
              key={`nav-${item.id || 'item'}-${i}`} 
              item={item} 
              index={i}
              buildImageSrc={buildImageSrc} 
              styles={styles}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              pathname={pathname}
            />
          ))}
        </ul>

        <div className={styles.nav__cta}>
          {ctaItems.map((item, i) => (
            <Link
              key={`cta-${item.id || 'item'}-${i}`}
              className={styles.nav__navButton}
              href={item.url}
            >
              {item.text}
            </Link>
          ))}
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


const NavItem = ({ item, index, buildImageSrc, styles, openDropdown, setOpenDropdown, pathname }) => {
  if (item.__component === 'menu.dropdown') {
    const isOpen = openDropdown === index;

    const handleToggleDropdown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpenDropdown(isOpen ? null : index);
    };

    const handleLinkClick = () => {
      setOpenDropdown(null);
    };

    return (
      <li className={styles.nav__navLink} role="menuitem" data-dropdown-id={index}>
        <button 
          className={styles.nav__navDropdown} 
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={handleToggleDropdown}
          type="button"
        >
          {item.title}
        </button>
        {isOpen && (
          <div className={styles.nav__navDropdownWrapper}>
            <div className={styles.nav__navDropdownContent}>
              {item.sections?.map((section, j) => (
                <div key={`section-${section.id || 'sect'}-${j}`} className={styles.nav__navDropdownSection}>
                  <div className={styles.nav__navDropdownHeading}>{section.heading}</div>
                  {section.links?.map((link, k) => (
                    <Link
                      key={`link-${link.id || 'lnk'}-${k}`}
                      href={link.url}
                      className={styles.nav__navDropdownLink}
                      onClick={handleLinkClick}
                    >
                      <div className={styles.nav__navDropdownLinkTop}>
                        {link.darkIcon?.url && (
                          <Image
                            src={buildImageSrc(link.darkIcon.url)}
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
        )}
      </li>
    );
  }

  const isActive = pathname === item.url;

  return (
    <li className={styles.nav__navLink} role="menuitem">
      <Link className={`${styles.nav__navItem} ${isActive ? styles.active : ''}`} href={item.url}>
        {item.title}
      </Link>
    </li>
  );
};


const MobileMenu = ({ NavbarItems, buildImageSrc, styles, closeMobile }) => {
  return (
    <div className={styles.nav__mobileMenu}>
    <ul role="menu" aria-label="Mobile navigation">
      {NavbarItems?.map((item, i) => (
        <li key={`mobile-${item.id || 'item'}-${i}`} role="menuitem">
          {item.__component === 'menu.dropdown' ? (
            <details>
              <summary className={styles.nav__navDropdown}>{item.title}</summary>
              <ul>
                {item.sections?.map((section, j) => (
                  <li key={`mobile-section-${section.id || 'sect'}-${j}`}>
                    <div className={styles.nav__navDropdownHeading}>{section.heading}</div>
                    <ul>
                      {section.links?.map((link, k) => (
                        <li key={`mobile-link-${link.id || 'lnk'}-${k}`}>
                          <Link href={link.url} onClick={closeMobile}>
                            <div className={styles.nav__navDropdownLinkTop}>
                              {link.darkIcon?.url && (
                                <Image
                                  src={buildImageSrc(link.darkIcon.url)}
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
};

export default Navbar;