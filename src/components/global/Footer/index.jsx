'use client'
import styles from './styles.module.scss'
import Link from 'next/link';
import Image from 'next/image';
import { useCallback } from 'react';

const Footer = ( content ) => {

    const buildImageSrc = useCallback((url) => {
        if(!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
    }, [])

    const { logo, description, cta, footerLink, contactLink, menuHeader, contactHeader } = content.data || {};


    return (
        <footer className={styles.footer}>
            <div className={styles.footer__content}>
                <div className={styles.footer__contentWrapper}>
                
                    {/* Brand Section */}
                    <div className={styles.footer__brand}>
                    <div className={styles.footer__logo}>
                        {logo?.url ? (
                            <Image
                                src={buildImageSrc(logo.url)}
                                alt="AppleSeed Sites Logo"  
                                width={180}
                                height={150}
                            />
                        ) : null}
                    </div>
                
                    {cta && (
                        <div className={styles.footer__cta}>
                            <p className={styles.footer__description}>{description}</p>
                            <Link href={cta.url} className={styles.footer__ctaButton}> 
                                {cta.title}
                            </Link>
                        </div>
                    )}
                </div>  

                {/* Menu Links Section */}
                <nav className={styles.footer__nav}>
                    {menuHeader && <h4 className={styles.footer__heading}>{menuHeader}</h4>}
                    <div className={styles.footer__navList}>
                        {footerLink && footerLink.map((link) => (
                            <Link className={styles.footer__navLink} key={link.id} href={link.url}>
                                {link.title}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Contact Section */}
                <div className={styles.footer__contact}>
                    {contactHeader && <h4 className={styles.footer__heading}>{contactHeader}</h4>}
                    <div className={styles.footer__contactList}>
                        {contactLink && contactLink.map((contact) => (
                            <div key={contact.id} className={styles.footer__contactItem}>
                                {contact.darkIcon && (
                                    <Image
                                        src={buildImageSrc(contact.darkIcon.url)}
                                        alt=""
                                        width={24}
                                        height={24}
                                        className={styles.footer__contactIcon}
                                    />
                                )}
                                <Link className={styles.footer__contactLink} href={contact.url}>
                                    {contact.text}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
            </div>

            <div className={styles.footer__bottom}>
                <div className={styles.footer__bottomWrapper}>
                    <span className={styles.footer__copyright}>Copyright © 2025 AppleSeedSites All rights reserved.</span>
                    <button 
                        className={styles.footer__backToTop} 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        Back to Top
                    </button>
                </div>
            </div>
        </footer>
    )
}

export default Footer