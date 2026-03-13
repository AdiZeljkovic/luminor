"use client";

interface OfferPrintButtonProps {
    label: string;
}

export default function OfferPrintButton({ label }: OfferPrintButtonProps) {
    return (
        <button
            onClick={() => window.print()}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#FF9F1C',
                color: '#0F172A',
                border: '2px solid #0F172A',
                borderRadius: '0.5rem',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '3px 3px 0 #0F172A',
                transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translate(-2px, -2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '5px 5px 0 #0F172A';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = '';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '3px 3px 0 #0F172A';
            }}
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
            </svg>
            {label}
        </button>
    );
}
