import styles from './styles.module.scss';
import Image from 'next/image';

const Hero = (content) => {

    const { eyebrow, header, text, heroImage } = content.data;

    const buildImageSrc = (url) => {
        if(!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
    }

    return (
        <section className={styles.hero}>

            <div className={styles.hero__container} >
                <div className={styles.hero__content}>
                    {eyebrow && <p className={styles.hero__eyebrow}>{eyebrow}</p>}  
                    {header && <h1 className={styles.hero__heading}>{header}</h1>}
                    {text && <p className={styles.hero__text}>{text}</p>}
                </div>
                {heroImage && (
                    <div className={styles.hero__image}>
                        <Image 
                            src={buildImageSrc(heroImage.url)} 
                            alt={heroImage.alt || 'Hero Image'}
                            width={heroImage.width || 600}
                            height={heroImage.height || 400}
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>
                )}
            </div>
            <div className={styles.hero__bg} />
        </section>
    )
}

export default Hero;