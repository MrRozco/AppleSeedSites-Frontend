'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import Image from 'next/image';

const Performance = ({ data }) => {
    const {bulletPoint, button, description, eyebrow, heading, image, stat} = data || {};
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const buildImageSrc = useCallback((url) => {
        if(!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className={`${styles.performance} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.performance__container}>
                {/* Left Column: Content */}
                <div className={styles.performance__left}>
                    {eyebrow && <p className={styles.performance__eyebrow}>{eyebrow}</p>}
                    {heading && <h2 className={styles.performance__heading}>{heading}</h2>}
                    {description && (
                        <div className={styles.performance__description} dangerouslySetInnerHTML={{ __html: description }} />
                    )}
                    {bulletPoint && bulletPoint.length > 0 && (
                        <ul className={styles.performance__bulletPoints}>
                            {bulletPoint.map((point, index) => (
                                <li key={index} className={styles.performance__bulletPoint}>
                                    {point.darkIcon && (
                                        <div className={styles.performance__bulletPoint__icon}>
                                            <Image
                                                src={buildImageSrc(point.darkIcon.url)}
                                                alt={point.text}
                                                width={32}
                                                height={32}
                                            />
                                        </div>
                                    )}
                                    <p dangerouslySetInnerHTML={{ __html: point.text }} />
                                </li>
                            ))}
                        </ul>
                    )}
                    {button && (
                        <Link href={button.url} className={styles.performance__button}>
                            {button.title}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.performance__arrow}>
                                <path d="M1 8h14M8 1l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                    )}
                </div>

                {/* Right Column: Stats & Image */}
                <div className={styles.performance__right}>
                    {stat && stat.length > 0 && (
                        <div className={styles.performance__stats}>
                            {stat.map((item, index) => (
                                <div key={index} className={styles.performance__stat}>
                                    <h3 className={styles.performance__stat__number}>{item.number}</h3>
                                    <p className={styles.performance__stat__text}>{item.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {image && (
                        <div className={styles.performance__imageWrapper}>
                            <Image
                                src={buildImageSrc(image.url)}
                                alt={image.alternativeText || 'Performance Image'}
                                width={image.width || 800}
                                height={image.height || 600}
                                style={{ width: '100%', height: 'auto' }}
                                className={styles.performance__image}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Performance;