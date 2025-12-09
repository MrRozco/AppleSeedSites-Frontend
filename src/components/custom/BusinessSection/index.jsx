
'use client'
import Image from "next/image";
import Link from "next/link";
import { useContext, useCallback  } from "react";
import { ThemeContext } from "@/lib/context/ThemeContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import styles from './styles.module.scss';
import { EffectCards } from 'swiper/modules';


const BusinessSection = (data) => {

    const { title, body, tag, bulletPoint, sliderImages, imageRight, button } = data.data;
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
                        <Link href={button[0].url} className={styles.businessSection__content__body__button}>
                            {button[0].title}
                        </Link>
                    )}
                </div>
                <div className={styles.businessSection__content__slider}>
                    <CardsSlider sliderImages={sliderImages} buildImageSrc={buildImageSrc} styles={styles} />
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

const CardsSlider = ({sliderImages, buildImageSrc  }) => (


    <div>
        <Swiper
            effect="cards"
            grabCursor={true}
            modules={[EffectCards]}
        >
            {sliderImages && sliderImages.map((image, index) => (
                <SwiperSlide key={index}>
                    <Image
                        src={buildImageSrc(image.url)}
                        alt={image.alternativeText || `Slider Image ${index + 1}`}
                        fill
                        style={{ objectFit: "cover", borderRadius: '10px' }}
                />
            </SwiperSlide>
            ))}
        </Swiper>
    </div>
)



export default BusinessSection;