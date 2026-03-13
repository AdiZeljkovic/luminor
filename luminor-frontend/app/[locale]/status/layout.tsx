import { Metadata } from 'next';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'System Status | Luminor Solutions',
        description: 'Real-time system status for Luminor Solutions services.',
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default function StatusLayout({ children }: Props) {
    return <>{children}</>;
}
