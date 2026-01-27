import styles from './styles.module.scss';

const Hero = (content) => {
    const { eyebrow, header, text } = content.data;

    return (
        <section className={styles.hero}>
            {/* Grid overlay */}
            <div className={styles.hero__grid} aria-hidden="true"></div>
            
            {/* Main content - no wrapper */}
            <div className={styles.hero__container}>
                {eyebrow && <p className={styles.hero__eyebrow}>{eyebrow}</p>}  
                {header && (
                    <h1 className={styles.hero__heading}>
                        {header}
                        {/* Floating accent dots directly under heading */}
                        <div className={styles.hero__accent} aria-hidden="true">
                            <span className={styles.hero__dot}></span>
                            <span className={styles.hero__dot}></span>
                            <span className={styles.hero__dot}></span>
                        </div>
                    </h1>
                )}
                {text && <p className={styles.hero__text}>{text}</p>}
            </div>
        </section>
    )
}

export default Hero;