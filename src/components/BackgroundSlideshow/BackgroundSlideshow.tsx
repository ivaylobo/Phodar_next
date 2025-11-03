'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './BackgroundSlideshow.module.css';

export type BackgroundSlide = {
  src: string;
  alt?: string;
};

type BackgroundSlideshowProps = {
  images: BackgroundSlide[];
  durationSeconds?: number;
  transitionSeconds?: number;
  overlay?: boolean;
  className?: string;
};

export default function BackgroundSlideshow({
  images,
  durationSeconds = 5,
  transitionSeconds = 1,
  overlay = false,
  className,
}: BackgroundSlideshowProps) {
  const slides = useMemo(
    () => images.filter((image) => typeof image?.src === 'string' && image.src.trim().length > 0),
    [images],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const intervalMs = Math.max(durationSeconds, 0.1) * 1000;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [slides, durationSeconds]);

  if (slides.length === 0) {
    return null;
  }

  const transitionMs = Math.max(transitionSeconds, 0) * 1000;
  const activeSlideIndex = slides.length > 0 ? activeIndex % slides.length : 0;

  const wrapperClassName = [
    styles.wrapper,
    overlay ? styles.hasOverlay : '',
    className ? className : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClassName} aria-hidden={true}>
      {slides.map((slide, index) => (
        <div
          key={`${slide.src}-${index}`}
          className={[styles.slide, index === activeSlideIndex ? styles.slideActive : '']
            .filter(Boolean)
            .join(' ')}
          style={{
            backgroundImage: `url(${slide.src})`,
            transitionDuration: `${transitionMs}ms`,
          }}
        />
      ))}
      {overlay ? <div className={styles.overlay} /> : null}
    </div>
  );
}
