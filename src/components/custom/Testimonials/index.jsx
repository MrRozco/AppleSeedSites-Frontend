
'use client';

import styles from './styles.module.scss';
import Link from "next/link";
import Image from "next/image";
import { ThemeContext } from "@/lib/context/ThemeContext";
import { useContext, useCallback } from "react";

const Testimonials = (content) => {

    const { eyebrow, title, description, testimonialCards, button} = content.data || {};

    const { theme } = useContext(ThemeContext);

    const buildImageSrc = useCallback((url) => {
        if(!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
    }, [])

    return (
        <section className={styles.features}>
            <div className={styles.features__header}>
                {eyebrow && <p className={styles.features__header__eyebrow}>{eyebrow}</p>}
                {title && <h2 className={styles.features__header__title}>{title}</h2>}
                {description && <p className={styles.features__header__body}>{description}</p>}
            </div>
            <div className={styles.features__grid}>
              {testimonialCards && testimonialCards.map((card, index) => (
                <div key={index} className={styles.features__grid__card}>
                    <div className={styles.features__grid__card__iconWrapper}>{card.lightIcon && card.darkIcon && <Image src={theme === 'dark' ? buildImageSrc(card.darkIcon.url) : buildImageSrc(card.lightIcon.url)} alt='quote mark' className={styles.features__grid__card__icon} width={50} height={50} />}</div>
                    {card.testimonial && <p className={styles.features__grid__card__body}>{card.testimonial}</p>}
                    {card.name && <p className={styles.features__grid__card__name}>{card.name}</p>}
                    {card.subname && <p className={styles.features__grid__card__subname}>{card.subname}</p>}
                </div>
              ))}  
            </div>
            {button && <div className={styles.features__button}>
                <Link href={button.url}>{button.title}</Link>
            </div>}
        </section>
    )
}

export default Testimonials