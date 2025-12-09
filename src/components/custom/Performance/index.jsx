'use client';
import React, { useContext, useCallback } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeContext } from "@/lib/context/ThemeContext";


const Performance = ( data ) => {

    const {bulletPoint, button, description, eyebrow, heading, image, stat} = data.data;

    const { theme } = useContext(ThemeContext);

    const buildImageSrc = useCallback((url) => {
        if(!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
    }, [])

    return <section className={styles.performance}>
        <div className={styles.performance__container}>
            <div className={styles.performance__container__topContent}>
                <div className={styles.performance__container__topContent__headings}>
                    <p className={styles.performance__container__topContent__eyebrow}>{eyebrow}</p>
                    <h2 className={styles.performance__container__topContent__heading}>{heading}</h2>
                </div>
                <div>
                    <Stats stat={stat} styles={styles}/>
                </div>
            </div>
            <div className={styles.performance__container__bottom}>
                <div className={styles.performance__container__bottom__content}>
                    <div className={styles.performance__container__bottom__content__description}>
                        <div dangerouslySetInnerHTML={{ __html: description }} />
                        <BulletPoint bulletPoint={bulletPoint} theme={theme} buildImageSrc={buildImageSrc} styles={styles} />
                        {button && (
                            <Link href={button.url} className={styles.performance__container__bottom__content__description__button}>
                                {button.title}
                            </Link>
                        )}
                    </div>
                </div>
                <div className={styles.performance__container__bottom__image}>
                    {image && (
                        <Image
                            src={buildImageSrc(image.url)}
                            alt={image.alternativeText || 'Performance Image'}
                            fill
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                            priority
                        />
                    )}
                </div>
            </div>
        </div>
    </section>;
}


const BulletPoint = ({ bulletPoint, theme, buildImageSrc, styles }) => (
    <div className={styles.performance__container__bottom__content__description__bulletPoints}>
        <ul>
            {bulletPoint && bulletPoint.map((point, index) => (
                <li key={index} className={styles.performance__container__bottom__content__description__bulletPoints__item}>
                    {point.lightIcon && point.darkIcon && (
                        <Image
                            src={buildImageSrc(point.darkIcon.url) }
                            alt={point.text}
                            width={40}
                            height={40}
                        />
                    )}
                    <p dangerouslySetInnerHTML={{ __html: point.text }}  />
                </li>
            ))}
        </ul>
    </div>
)

const Stats = ({ stat, styles }) => (
    <div className={styles.performance__container__topContent__stats}>
        {stat && stat.map((item, index) => (
            <div key={index} className={styles.performance__container__topContent__stats__item}>
                <h3 className={styles.performance__container__topContent__stats__item__number}>{item.number}</h3>
                <p className={styles.performance__container__topContent__stats__item__text}>{item.text}</p>
            </div>
        ))}
    </div>
)

export default Performance;