"use client";
import styles from './styles.module.scss';
import Link from 'next/link';
import { useContext, useCallback } from "react";
import { ThemeContext } from "@/lib/context/ThemeContext";
import Image from 'next/image';

const Pricing = (content) => {

    const {heading, description, card } = content.data || {};
    const { theme } = useContext(ThemeContext);

    const buildImageSrc = useCallback((url) => {
            if(!url) return '';
            return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
        }, [])

    return (
        <section className={styles.pricing}>
            <div className={styles.pricing__header}>
                {heading && <h2 className={styles.pricing__header__title}>{heading}</h2>}
                {description && <p className={styles.pricing__header__description}>{description}</p>}
            </div>
            <div className={styles.pricing__cardsContainer}>
                <PricingCards card={card} buildImageSrc={buildImageSrc} styles={styles} theme={theme} />
            </div>
        </section>
    )
}


const BulletPoint = ({ bulletPoint, theme, buildImageSrc, styles }) => (
    <>
        <ul className={styles.pricing__cardsContainer__card__bulletPoints}>
            {bulletPoint && bulletPoint.map((point, index) => {
                const icon = theme === 'dark' ? (point.darkIcon || point.lightIcon) : (point.lightIcon || point.darkIcon);
                return (
                    <li key={index} className={styles.pricing__cardsContainer__card__bulletPoints__item}>
                        {icon && (
                            <Image
                                src={buildImageSrc(icon.url)}
                                alt={point.text || ''}
                                width={20}
                                height={20}
                            />
                        )}
                        <p dangerouslySetInnerHTML={{ __html: point.text }}  />
                    </li>
                );
            })}
        </ul>
    </>
)

const PricingCards = ({card, buildImageSrc, styles, theme}) => (
    <>
        {card && card.map((pricingCard, index) => (
            <div key={index} className={styles.pricing__cardsContainer__card}>
                {pricingCard.title && <h3 className={styles.pricing__cardsContainer__card__title}>{pricingCard.title}</h3>}
                {pricingCard.description && <p className={styles.pricing__cardsContainer__card__description}>{pricingCard.description}</p>}
                <div className={styles.pricing__cardsContainer__card__priceSection}>
                    {pricingCard.price && <p className={styles.pricing__cardsContainer__card__priceSection__price}>${pricingCard.price}</p>}
                    {pricingCard.priceText && <p className={styles.pricing__cardsContainer__card__priceSection__priceText}>{pricingCard.priceText}</p>}   
                </div>
                <BulletPoint bulletPoint={pricingCard.bulletPoint} buildImageSrc={buildImageSrc} styles={styles} theme={theme} />
                {pricingCard.cta && pricingCard.cta.map((ctaItem, idx) => (
                    <Link key={idx} href={ctaItem.url} className={styles.pricing__cardsContainer__card__cta}>{ctaItem.title}</Link>
                ))}
            </div>
        ))}
    </>
)

export default Pricing