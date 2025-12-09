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
                            layout="responsive"
                            objectFit="cover"
                            priority
                        />
                    </div>
                )}
            </div>
            <svg
                className={styles.hero__background}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                width="100%"
                height="320"
                preserveAspectRatio="none"
            ><path
                d="M0,192L80,213.3C160,235,320,277,480,245.3C640,213,800,107,960,80C1120,53,1280,107,1360,133.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                />
            </svg>
        </section>
    )
}

export default Hero;