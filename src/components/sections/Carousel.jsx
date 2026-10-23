"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { cx } from "@/lib/utils";
import Icon from "@/components/ui/Icon";

const AUTOPLAY_MS = 5000;

/**
 * Crossfade carousel (opacity + transform only). Replaces Swiper.
 * Autoplay pauses on hover and keyboard focus, stops when the tab is hidden or the
 * carousel is off-screen, and never runs with prefers-reduced-motion.
 */
export default function Carousel({ images, label, autoplay = false }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const rootRef = useRef(null);
  const slidesId = useId();
  const count = images.length;

  const go = useCallback((n) => setIndex(((n % count) + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!autoplay || count < 2 || !rootRef.current) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [autoplay, count]);

  const running = autoplay && count > 1 && !reduced && !paused && visible;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [running, count]);

  return (
    <div
      ref={rootRef}
      className="as-carousel"
      aria-roledescription="carousel"
      aria-label={`${label || "Gallery"} images`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div className="as-slides" id={slidesId} aria-live={autoplay && !reduced ? "off" : "polite"}>
        {images.map((img, i) => (
          <div
            key={img.src + i}
            className={cx("as-slide", i === index && "is-active")}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(min-width: 1336px) 560px, (min-width: 1024px) 42vw, 100vw"
            />
          </div>
        ))}
      </div>
      {count > 1 && (
        <div className="as-car-bar">
          <div className="as-dots">
            {images.map((img, i) => (
              <button
                key={img.src + i}
                type="button"
                className="as-dot"
                aria-controls={slidesId}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <div className="as-car-arrows">
            <button type="button" className="as-round" aria-label="Previous image" aria-controls={slidesId} onClick={() => go(index - 1)}>
              <Icon name="left" size={18} />
            </button>
            <button type="button" className="as-round" aria-label="Next image" aria-controls={slidesId} onClick={() => go(index + 1)}>
              <Icon name="right" size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
