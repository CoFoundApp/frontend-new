import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/providers/providers";
import VersionChecker from "@/components/version-checker";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "CoFound",
    description: "CoFound est une marketplace collaborative destinée en priorité aux jeunes, mais ouverte à toute personne souhaitant lancer ou rejoindre un projet.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body
                className={cn(
                    "min-h-screen font-sans antialiased",
                    fontSans.variable,
                )}
            >
                <Providers>
                    <VersionChecker />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
