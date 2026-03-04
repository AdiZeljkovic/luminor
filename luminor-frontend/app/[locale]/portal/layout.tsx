import type { Metadata } from "next";
import PortalLayoutClient from "./PortalLayoutClient";

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    return <PortalLayoutClient>{children}</PortalLayoutClient>;
}
