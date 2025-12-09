'use client'
import styles from './styles.module.scss'
import Link from 'next/link';
import Image from 'next/image';
import { useContext, useCallback } from 'react';
import { ThemeContext } from '@/lib/context/ThemeContext';

const Footer = ( content ) => {

    const { theme } = useContext(ThemeContext);

    const buildImageSrc = useCallback((url) => {
        if(!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
    }, [])

    const { logo, description, cta, footerLink, contactLink, menuHeader, contactHeader } = content.data || {};


    return (
        <footer className={styles.footer}>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 260" className={styles.footer__wave}>
                <path d="M0,128L80,128C160,128,320,128,480,144C640,160,800,192,960,213.3C1120,235,1280,245,1360,250.7L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>

            <div className={styles.footer__content}>
                
                {/* Brand Section */}
                <div className={styles.footer__brand}>
                    <div className={styles.footer__logo}>
                        {logo?.url ? (
                            <Image
                                src={buildImageSrc(logo.url)}
                                alt="Logo"  
                                width={250}
                                height={250}
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
                                {contact.lightIcon && contact.darkIcon && (
                                    <Image
                                        src={theme === 'dark' ? buildImageSrc(contact.darkIcon.url) : buildImageSrc(contact.lightIcon.url)}
                                        alt={'Contact Icon'}
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
        </footer>
    )
}

export default Footer