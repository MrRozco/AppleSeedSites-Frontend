"use client";
import styles from './styles.module.scss';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from "react";
import Image from 'next/image';

const Pricing = (content) => {
    const [visibleCards, setVisibleCards] = useState(new Set());
    const cardRefs = useRef([]);

    const {heading, description, card } = content.data || {};

    const buildImageSrc = useCallback((url) => {
            if(!url) return '';
            return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
        }, [])
    
    useEffect(() => {
        const observers = [];
        
        cardRefs.current.forEach((card, index) => {
            if (!card) return;
            
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setVisibleCards(prev => new Set([...prev, index]));
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            );
            
            observer.observe(card);
            observers.push(observer);
        });
        
        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, [card]);

    return (
        <section className={styles.pricing}>
            <div className={styles.pricing__header}>
                {heading && <h2 className={styles.pricing__header__title}>{heading}</h2>}
                {description && <p className={styles.pricing__header__description}>{description}</p>}
            </div>
            <div className={styles.pricing__cardsContainer}>
                <PricingCards card={card} buildImageSrc={buildImageSrc} styles={styles} cardRefs={cardRefs} visibleCards={visibleCards} />
            </div>
        </section>
    )
}


const BulletPoint = ({ bulletPoint, buildImageSrc, styles }) => (
    <>
        <ul className={styles.pricing__cardsContainer__card__bulletPoints}>
            {bulletPoint && bulletPoint.map((point, index) => {
                const icon = point.darkIcon;
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

const PricingCards = ({card, buildImageSrc, styles, cardRefs, visibleCards}) => (
    <>
        {card && card.map((pricingCard, index) => (
            <div 
                key={index} 
                ref={el => cardRefs.current[index] = el}
                className={`${styles.pricing__cardsContainer__card} ${visibleCards.has(index) ? styles.visible : ''}`}
            >
                {pricingCard.title && <h3 className={styles.pricing__cardsContainer__card__title}>{pricingCard.title}</h3>}
                {pricingCard.description && <p className={styles.pricing__cardsContainer__card__description}>{pricingCard.description}</p>}
                <div className={styles.pricing__cardsContainer__card__priceSection}>
                    {pricingCard.price && <p className={styles.pricing__cardsContainer__card__priceSection__price}>${pricingCard.price}</p>}
                    {pricingCard.priceText && <p className={styles.pricing__cardsContainer__card__priceSection__priceText}>{pricingCard.priceText}</p>}   
                </div>
                <BulletPoint bulletPoint={pricingCard.bulletPoint} buildImageSrc={buildImageSrc} styles={styles} />
                {pricingCard.cta && pricingCard.cta.map((ctaItem, idx) => (
                    <Link key={idx} href={ctaItem.url} className={styles.pricing__cardsContainer__card__cta}>{ctaItem.title}</Link>
                ))}
            </div>
        ))}
    </>
)

export default Pricing