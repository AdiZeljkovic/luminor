import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Luminor Solutions — Service Proposal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const serviceNames: Record<string, { line1: string; line2: string }> = {
    'web-development':    { line1: 'Web', line2: 'Development' },
    'graphic-design':     { line1: 'Graphic', line2: 'Design' },
    'digital-marketing':  { line1: 'Digital', line2: 'Marketing' },
    'seo':                { line1: 'SEO', line2: 'Optimisation' },
    'ai-automation':      { line1: 'AI &', line2: 'Automation' },
    'mobile-development': { line1: 'Mobile', line2: 'Development' },
    'hosting':            { line1: 'Hosting &', line2: 'Infrastructure' },
};

export default async function Image({
    params,
}: {
    params: Promise<{ locale: string; service: string }>;
}) {
    const { service, locale } = await params;
    const name = serviceNames[service] ?? { line1: 'Service', line2: 'Proposal' };
    const badgeLabel = locale === 'bs' ? 'ZVANIČNA PONUDA' : 'OFFICIAL PROPOSAL';
    const tagline = locale === 'bs' ? 'Vazi 30 dana' : 'Valid for 30 days';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    background: '#0F172A',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
            >
                {/* Top orange stripe */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        background: '#FF9F1C',
                        display: 'flex',
                    }}
                />

                {/* Decorative right-side geometric shape */}
                <div
                    style={{
                        position: 'absolute',
                        right: '-60px',
                        top: '-60px',
                        width: '420px',
                        height: '420px',
                        border: '2px solid #1E293B',
                        borderRadius: '50%',
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        right: '20px',
                        top: '20px',
                        width: '280px',
                        height: '280px',
                        border: '2px solid #1E293B',
                        borderRadius: '50%',
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        right: '100px',
                        top: '100px',
                        width: '120px',
                        height: '120px',
                        background: '#FF9F1C',
                        borderRadius: '50%',
                        display: 'flex',
                        opacity: 0.12,
                    }}
                />

                {/* Bottom-right accent rectangle */}
                <div
                    style={{
                        position: 'absolute',
                        right: '0px',
                        bottom: '0px',
                        width: '320px',
                        height: '4px',
                        background: '#FF9F1C',
                        display: 'flex',
                        opacity: 0.4,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        right: '0px',
                        bottom: '0px',
                        width: '4px',
                        height: '320px',
                        background: '#FF9F1C',
                        display: 'flex',
                        opacity: 0.4,
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '54px 80px',
                        flex: 1,
                        maxWidth: '780px',
                    }}
                >
                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span
                            style={{
                                color: 'white',
                                fontSize: '26px',
                                fontWeight: 900,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Luminor
                        </span>
                        <span
                            style={{
                                color: '#FF9F1C',
                                fontSize: '26px',
                                fontWeight: 900,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            .Solutions
                        </span>
                    </div>

                    {/* Badge */}
                    <div style={{ display: 'flex', marginTop: '36px' }}>
                        <div
                            style={{
                                background: '#FF9F1C',
                                color: '#0F172A',
                                fontSize: '12px',
                                fontWeight: 800,
                                letterSpacing: '0.12em',
                                padding: '8px 18px',
                                borderRadius: '4px',
                                display: 'flex',
                            }}
                        >
                            {badgeLabel}
                        </div>
                    </div>

                    {/* Service name */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: '28px',
                            flex: 1,
                        }}
                    >
                        <span
                            style={{
                                color: '#94A3B8',
                                fontSize: '68px',
                                fontWeight: 900,
                                letterSpacing: '-0.03em',
                                lineHeight: 1.05,
                                display: 'flex',
                            }}
                        >
                            {name.line1}
                        </span>
                        <span
                            style={{
                                color: 'white',
                                fontSize: '68px',
                                fontWeight: 900,
                                letterSpacing: '-0.03em',
                                lineHeight: 1.05,
                                display: 'flex',
                            }}
                        >
                            {name.line2}
                        </span>
                    </div>

                    {/* Footer row */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '24px',
                            borderTop: '1px solid #1E293B',
                        }}
                    >
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <span
                                style={{
                                    color: '#475569',
                                    fontSize: '14px',
                                    display: 'flex',
                                }}
                            >
                                luminor.solutions
                            </span>
                            <span
                                style={{
                                    color: '#475569',
                                    fontSize: '14px',
                                    display: 'flex',
                                }}
                            >
                                info@luminor.solutions
                            </span>
                        </div>
                        <span
                            style={{
                                color: '#FF9F1C',
                                fontSize: '13px',
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                display: 'flex',
                            }}
                        >
                            {tagline}
                        </span>
                    </div>
                </div>
            </div>
        ),
        { ...size },
    );
}
