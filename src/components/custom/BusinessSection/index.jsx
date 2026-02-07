
'use client'
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import styles from './styles.module.scss';


const BusinessSection = (data) => {

    const { title, body, tag, bulletPoint, sliderImages, imageRight, button } = data?.data || {};

    const buildImageSrc = useCallback((url) => {
        if(!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/${url.replace(/^\/+/, '')}`;
    }, [])

    // Don't render if no data is provided
    if (!data?.data) return null;

    return (
        <section id={tag || ''} className={styles.businessSection}>
            {title && <h2 className={styles.businessSection__title}>{title}</h2>}
            <div className={`${styles.businessSection__content} ${imageRight ? '' : styles.businessSection__content__reverse }`}>
                <div className={styles.businessSection__content__body}>
                    {body && <div dangerouslySetInnerHTML={{ __html: body }} className={styles.businessSection__content__body__text} />}
                    <BulletPoint bulletPoint={bulletPoint} buildImageSrc={buildImageSrc} styles={styles} />
                    {button && button.length > 0 && button[0]?.url && (
                        <Link href={button[0].url} className={styles.businessSection__content__body__button}>
                            {button[0].title || 'Learn More'}
                        </Link>
                    )}
                </div>
                {sliderImages && sliderImages.length > 0 && (
                    <div className={styles.businessSection__content__slider}>
                        <CardsSlider sliderImages={sliderImages} buildImageSrc={buildImageSrc} styles={styles} />
                    </div>
                )}
            </div>
            
        </section>
    );
}

const BulletPoint = ({ bulletPoint, buildImageSrc, styles }) => {
    if (!bulletPoint || bulletPoint.length === 0) return null;
    
    return (
        <div className={styles.businessSection__content__body__bulletPoints}>
            <ul>
                {bulletPoint.map((point, index) => (
                    <li key={index} className={styles.businessSection__content__body__bulletPoints__item}>
                        {point?.darkIcon?.url && (
                            <div className={styles.businessSection__content__body__bulletPoints__iconWrapper}>
                                <Image
                                    src={buildImageSrc(point.darkIcon.url)}
                                    alt={point.text || `Bullet point ${index + 1}`}
                                    width={40}
                                    height={40}
                                />
                            </div>
                        )}
                        {point?.text && <p dangerouslySetInnerHTML={{ __html: point.text }}  />}
                    </li>
                ))}
            </ul>
        </div>
    )
}

const CardsSlider = ({sliderImages, buildImageSrc, styles }) => {
    if (!sliderImages || sliderImages.length === 0) return null;
    
    return (
        <div className={styles.businessSection__sliderWrapper}>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                pagination={{ clickable: true }}
                loop={true}
                className={styles.businessSection__swiper}
            >
                {sliderImages.map((image, index) => {
                    if (!image?.url) return null;
                    
                    return (
                        <SwiperSlide key={index} className={styles.businessSection__swiperSlide}>
                            <div className={styles.businessSection__imageCard}>
                                <Image
                                    src={buildImageSrc(image.url)}
                                    alt={image.alternativeText || `Slider Image ${index + 1}`}
                                    width={image.width || 800}
                                    height={image.height || 600}
                                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                                />
                            </div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    )
}



export default BusinessSection;