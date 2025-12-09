import styles from './styles.module.scss';
import Link from "next/link";
import Image from "next/image";
import { useCallback } from "react";

const OurWork = (content) => {

    const buildImageSrc = useCallback((url) => {
        if(!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
    }, [])

    const { eyebrow, title, description, portfolioCard } = content.data || {};

    return (        
        <section className={styles.ourWork}>
            <div className={styles.ourWork__header}>
                <div>
                    <p className={styles.ourWork__header__eyebrow}>{eyebrow}</p>
                    <h3>{title}</h3>
                </div>
                <p className={styles.ourWork__header__description}>{description}</p>
            </div>
            <div className={styles.ourWork__cards}>
                {portfolioCard && portfolioCard.map(item => renderPortfolioCard(item, buildImageSrc))}
            </div>
        </section>
    )
}

const renderPortfolioCard = (item, buildImageSrc) => (
        <Link key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className={styles.ourWork__cards__card}>
            <div className={styles.ourWork__cards__card__imageWrapper}>
                <Image 
                    src={buildImageSrc(item.image.url)} 
                    alt={item.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'contain' }}
                />
            </div>
            <h4>{item.title}</h4>
            <p className={styles.ourWork__cards__card__description}>{item.description}</p>
            <div className={styles.ourWork__cards__card__button}>
                {item.buttonText}
            </div>
        </Link>
    )

export default OurWork