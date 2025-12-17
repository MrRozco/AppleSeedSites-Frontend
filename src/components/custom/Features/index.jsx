
'use client';

import styles from './styles.module.scss';
import Link from "next/link";
import Image from "next/image";
import { ThemeContext } from "@/lib/context/ThemeContext";
import { useCallback } from "react";

const Features = (content) => {

    const { eyebrow, title, body, featuresCard, button} = content.data || {};

    const buildImageSrc = useCallback((url) => {
        if(!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
    }, [])

    return (
        <section className={styles.features}>
            <div className={styles.features__header}>
                {eyebrow && <p className={styles.features__header__eyebrow}>{eyebrow}</p>}
                {title && <h2 className={styles.features__header__title}>{title}</h2>}
                {body && <p className={styles.features__header__body}>{body}</p>}
            </div>
            <div className={styles.features__grid}>
              {featuresCard && featuresCard.map((card, index) => (
                <div key={index} className={styles.features__grid__card}>
                    <div className={styles.features__grid__card__iconWrapper}>{card.icon && <Image src={buildImageSrc(card.icon.url)} className={styles.features__grid__card__icon} alt={card.title} width={50} height={50} />}</div>
                    {card.title && <h3 className={styles.features__grid__card__title}>{card.title}</h3>}
                    {card.body && <p className={styles.features__grid__card__body}>{card.body}</p>}
                    {card.button && card.button.length > 0 && <Link href={card.button[0].url} className={styles.features__grid__card__button}>{card.button[0].title}</Link>}
                </div>
              ))}  
            </div>
            {button && <div className={styles.features__button}>
                <Link href={button.url}>{button.title}</Link>
            </div>}
        </section>
    )
}

export default Features