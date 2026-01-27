"use client";

import styles from './styles.module.scss';
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const OurWork = ({ data }) => {
    const [visibleCards, setVisibleCards] = useState(new Set());
    const cardRefs = useRef([]);

    const buildImageSrc = useCallback((url) => {
        if(!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/*/, '')}`;
    }, [])

    const { eyebrow, title, description, portfolioCard } = data || {};
    
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
    }, [portfolioCard]);

    return (        
        <section className={styles.ourWork}>
            <div className={styles.ourWork__header}>
                {eyebrow && <p className={styles.ourWork__header__eyebrow}>{eyebrow}</p>}
                {title && <h2 className={styles.ourWork__header__title}>{title}</h2>}
                {description && <p className={styles.ourWork__header__description}>{description}</p>}
            </div>
            <div className={styles.ourWork__cards}>
                {portfolioCard && portfolioCard.map((item, index) => (
                    <Link 
                        key={item.id} 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        ref={el => cardRefs.current[index] = el}
                        className={`${styles.ourWork__cards__card} ${visibleCards.has(index) ? styles.visible : ''}`}
                    >
                        <div className={styles.ourWork__cards__card__imageWrapper}>
                            <Image 
                                src={buildImageSrc(item.image.url)} 
                                alt={item.title} 
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: 'contain' }}
                                className={styles.ourWork__cards__card__image}
                            />
                            <div className={styles.ourWork__cards__card__overlay} />
                        </div>
                        <div className={styles.ourWork__cards__card__content}>
                            <h4 className={styles.ourWork__cards__card__title}>{item.title}</h4>
                            <p className={styles.ourWork__cards__card__description}>{item.description}</p>
                            <div className={styles.ourWork__cards__card__button}>
                                {item.buttonText}
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.ourWork__cards__card__arrow}>
                                    <path d="M1 8h14M8 1l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default OurWork