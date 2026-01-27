
'use client';

import styles from './styles.module.scss';
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const Testimonials = (content) => {
    const [visibleCards, setVisibleCards] = useState(new Set());
    const cardRefs = useRef([]);

    const { eyebrow, title, description, testimonialCards, button} = content.data || {};

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
    }, [testimonialCards]);

    return (
        <section className={styles.features}>
            <div className={styles.features__header}>
                {eyebrow && <p className={styles.features__header__eyebrow}>{eyebrow}</p>}
                {title && <h2 className={styles.features__header__title}>{title}</h2>}
                {description && <p className={styles.features__header__body}>{description}</p>}
            </div>
            <div className={styles.features__grid}>
              {testimonialCards && testimonialCards.map((card, index) => (
                <div 
                    key={index} 
                    ref={el => cardRefs.current[index] = el}
                    className={`${styles.features__grid__card} ${visibleCards.has(index) ? styles.visible : ''}`}
                >
                    <div className={styles.features__grid__card__iconWrapper}>{card.darkIcon && <Image src={buildImageSrc(card.darkIcon.url)} alt='quote mark' className={styles.features__grid__card__icon} width={50} height={50} />}</div>
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