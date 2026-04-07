'use client';

import styles from './ClientLogosMarquee.module.css';

type Logo = {
    id: number;
    client_name: string;
    logo_url: string;
    website_url: string;
};

export default function ClientLogosMarquee({
    logos,
    label,
}: {
    logos: Logo[];
    label: string;
}) {
    // Duplicate for seamless infinite scroll
    const doubled = [...logos, ...logos];

    return (
        <section className={styles.section}>
            {/* Top accent line */}
            <div className={styles.accentLine} />

            <div className={styles.header}>
                <span className={styles.headerLine} />
                <p className={styles.label}>{label}</p>
                <span className={styles.headerLine} />
            </div>

            <div className={styles.track}>
                {/* Left fade */}
                <div className={styles.fadeLeft} />

                <div className={styles.marquee}>
                    <div className={styles.marqueeInner}>
                        {doubled.map((logo, i) => (
                            <a
                                key={`${logo.id}-${i}`}
                                href={logo.website_url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.logoItem}
                                title={logo.client_name}
                            >
                                <img
                                    src={logo.logo_url}
                                    alt={logo.client_name}
                                    draggable={false}
                                />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right fade */}
                <div className={styles.fadeRight} />
            </div>

            {/* Bottom accent line */}
            <div className={styles.accentLine} />
        </section>
    );
}
