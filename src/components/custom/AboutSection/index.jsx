'use client'
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import styles from './styles.module.scss';


const AboutSection = (data) => {

    const { title, body, tag, bulletPoint, image, imageRight, button } = data.data;

    const buildImageSrc = useCallback((url) => {
        if(!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
    }, [])

    return (
        <section id={tag} className={styles.businessSection}>
            <h2 className={styles.businessSection__title}>{title}</h2>
            <div className={`${styles.businessSection__content} ${imageRight ? '' : styles.businessSection__content__reverse }`}>
                <div className={styles.businessSection__content__body}>
                    <div dangerouslySetInnerHTML={{ __html: body }} className={styles.businessSection__content__body__text} />
                    <BulletPoint bulletPoint={bulletPoint} buildImageSrc={buildImageSrc} styles={styles} />
                    {button && (
                        <Link href={button.url} className={styles.businessSection__content__body__button}>
                            {button.title}
                        </Link>
                    )}
                </div>
                <div className={styles.businessSection__content__image}>
                    <SideImage image={image} buildImageSrc={buildImageSrc} styles={styles} />
                </div>
            </div>
            
        </section>
    );
}

const BulletPoint = ({ bulletPoint, buildImageSrc, styles }) => (
    <div className={styles.businessSection__content__body__bulletPoints}>
        <ul>
            {bulletPoint && bulletPoint.map((point, index) => (
                <li key={index} className={styles.businessSection__content__body__bulletPoints__item}>
                    {point.darkIcon && (
                        <div className={styles.businessSection__content__body__bulletPoints__iconWrapper}>
                            <Image
                                src={buildImageSrc(point.darkIcon.url)}
                                alt={point.text}
                                width={40}
                                height={40}
                            />
                        </div>
                    )}
                    <p dangerouslySetInnerHTML={{ __html: point.text }}  />
                </li>
            ))}
        </ul>
    </div>
)

const SideImage = ({image, buildImageSrc, styles }) => (
    <div className={styles.businessSection__imageCard}>
        <Image 
            src={buildImageSrc(image.url)} 
            alt={image.alternativeText || 'About Image'} 
            fill 
            style={{ objectFit: "contain" }} 
        />
    </div>
)



export default AboutSection;