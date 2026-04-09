"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "@/app/[locale]/portfolio/[slug]/page.module.css";
import lbStyles from "./GalleryLightbox.module.css";

interface GalleryLightboxProps {
    images: string[];
    title: string;
}

export default function GalleryLightbox({ images, title }: GalleryLightboxProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const close = useCallback(() => setActiveIndex(null), []);
    const prev = useCallback(() => setActiveIndex(i => (i! > 0 ? i! - 1 : images.length - 1)), [images.length]);
    const next = useCallback(() => setActiveIndex(i => (i! < images.length - 1 ? i! + 1 : 0)), [images.length]);

    useEffect(() => {
        if (activeIndex === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [activeIndex, close, prev, next]);

    return (
        <>
            {/* Grid */}
            <div className={styles.galleryGrid}>
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`${styles.galleryItem} ${lbStyles.galleryBtn}`}
                        aria-label={`Open image ${idx + 1}`}
                    >
                        <Image
                            src={img}
                            alt={`${title} - screenshot ${idx + 1}`}
                            fill
                            className={styles.galleryImage}
                            loading={idx === 0 ? "eager" : "lazy"}
                        />
                        <div className={lbStyles.zoomOverlay}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                            </svg>
                        </div>
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {activeIndex !== null && (
                <div className={lbStyles.overlay} onClick={close}>
                    {/* Counter */}
                    <div className={lbStyles.counter}>{activeIndex + 1} / {images.length}</div>

                    {/* Close */}
                    <button className={lbStyles.close} onClick={close} aria-label="Close">✕</button>

                    {/* Prev */}
                    {images.length > 1 && (
                        <button className={`${lbStyles.arrow} ${lbStyles.arrowLeft}`} onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous">‹</button>
                    )}

                    {/* Image */}
                    <div className={lbStyles.imageWrap} onClick={e => e.stopPropagation()}>
                        <Image
                            src={images[activeIndex]}
                            alt={`${title} - screenshot ${activeIndex + 1}`}
                            fill
                            className={lbStyles.image}
                            sizes="100vw"
                            priority
                        />
                    </div>

                    {/* Next */}
                    {images.length > 1 && (
                        <button className={`${lbStyles.arrow} ${lbStyles.arrowRight}`} onClick={e => { e.stopPropagation(); next(); }} aria-label="Next">›</button>
                    )}
                </div>
            )}
        </>
    );
}
