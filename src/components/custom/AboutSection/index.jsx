'use client'
import Image from "next/image";
import Link from "next/link";
import { useContext, useCallback  } from "react";
import { ThemeContext } from "@/lib/context/ThemeContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import styles from './styles.module.scss';


const AboutSection = (data) => {

    const { title, body, tag, bulletPoint, image, imageRight, button } = data.data;
    const { theme } = useContext(ThemeContext);


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
                    <BulletPoint bulletPoint={bulletPoint} theme={theme} buildImageSrc={buildImageSrc} styles={styles} />
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

const BulletPoint = ({ bulletPoint, theme, buildImageSrc, styles }) => (
    <div className={styles.businessSection__content__body__bulletPoints}>
        <ul>
            {bulletPoint && bulletPoint.map((point, index) => (
                <li key={index} className={styles.businessSection__content__body__bulletPoints__item}>
                    {point.lightIcon && point.darkIcon && (
                        <Image
                            src={theme === 'dark' ? buildImageSrc(point.darkIcon.url) : buildImageSrc(point.lightIcon.url)}
                            alt={point.text}
                            width={20}
                            height={20}
                        />
                    )}
                    <p dangerouslySetInnerHTML={{ __html: point.text }}  />
                </li>
            ))}
        </ul>
    </div>
)

const SideImage = ({image, buildImageSrc  }) => (


    <div >
        <Image src={buildImageSrc(image.url)} alt={image.alternativeText || 'About Image'} fill style={{ objectFit: "cover", borderRadius: '10px' }} />
    </div>
)



export default AboutSection;