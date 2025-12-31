'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useCallback } from 'react';
import { ThemeContext } from '@/lib/context/ThemeContext';
import styles from './styles.module.scss';

const ContactSection = ({ data }) => {
    const { darkIcon, lightIcon, title, description, embed, subtitle, link, supportingTitle, bulletPoint } = data;
    const { theme } = useContext(ThemeContext);

    const buildImageSrc = useCallback((url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
    }, []);

    const getIcon = useCallback((light, dark) => {
        if (theme === 'light' && light?.url) return light.url;
        if (dark?.url) return dark.url;
        return null;
    }, [theme]);

    const mainIconSrc = getIcon(lightIcon, darkIcon);

    return (
        <section className={styles.contactSection}>
            <LeftCard 
                title={title} 
                description={description} 
                embed={embed} 
                iconSrc={mainIconSrc} 
                buildImageSrc={buildImageSrc} 
            />

            <div className={styles.contactSection__right}>
                <LinkCard 
                    subtitle={subtitle} 
                    link={link} 
                    getIcon={getIcon} 
                    buildImageSrc={buildImageSrc} 
                />

                <InfoCard 
                    title={supportingTitle} 
                    points={bulletPoint} 
                    getIcon={getIcon} 
                    buildImageSrc={buildImageSrc} 
                />
            </div>
        </section>
    );
};

const LeftCard = ({ title, description, embed, iconSrc, buildImageSrc }) => {
    const embedHtml = (typeof embed === 'string') ? embed : (embed?.oembed?.html || embed?.html);

    return (
        <div className={styles.contactSection__left}>
            <div className={styles.contactSection__left__header}>
                {iconSrc && (
                    <Image 
                        src={buildImageSrc(iconSrc)} 
                        alt="" 
                        width={40} 
                        height={40} 
                        className={styles.contactSection__left__header__icon}
                    />
                )}
                <h2 className={styles.contactSection__left__header__title}>{title}</h2>
            </div>
            <div className={styles.contactSection__left__description}>
                {description}
            </div>
            {embedHtml && (
                <div 
                    className={styles.contactSection__left__embed}
                    dangerouslySetInnerHTML={{ __html: embedHtml }}
                />
            )}
        </div>
    );
};

const LinkCard = ({ subtitle, link, getIcon, buildImageSrc }) => {
    const linkItem = Array.isArray(link) ? link[0] : link;
    const iconSrc = linkItem ? getIcon(linkItem.lightIcon, linkItem.darkIcon) : null;

    return (
        <div className={styles.contactSection__card}>
            <h3 className={styles.contactSection__right__subtitle}>{subtitle}</h3>        
            {linkItem && (
                <Link href={linkItem.url || '#'} className={styles.contactSection__right__link}>
                    {iconSrc && (
                        <Image 
                            src={buildImageSrc(iconSrc)} 
                            alt="" 
                            width={24} 
                            height={24} 
                        />
                    )}
                    <span>{linkItem.text}</span>
                </Link>
            )}
        </div>
    );
};

const InfoCard = ({ title, points, getIcon, buildImageSrc }) => (
    <div className={styles.contactSection__card}>
        <h4 className={styles.contactSection__right__supportingTitle}>{title}</h4>

        <div className={styles.contactSection__right__bulletPoints}>
            <ul>
                {points?.map((point, index) => {
                    const pointIcon = getIcon(point.lightIcon, point.darkIcon);
                    return (
                        <li key={index} className={styles.contactSection__right__bulletPoints__item}>
                            {pointIcon && (
                                <Image 
                                    src={buildImageSrc(pointIcon)} 
                                    alt="" 
                                    width={20} 
                                    height={20} 
                                />
                            )}
                            <span>{point.text}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    </div>
);

export default ContactSection;