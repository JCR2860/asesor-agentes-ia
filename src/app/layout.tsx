import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { LanguageProvider } from '@/context/LanguageContext';
import { SupportBubble } from '@/components/support-bubble';
import { ZeroLogModal } from '@/components/ZeroLogModal';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LexIA | Asesoría y Despacho IA",
  description: "Ecosistema de agentes de IA jurídicos y técnicos escalable y preciso.",
  openGraph: {
    title: "LexIA | Asesoría y Despacho IA",
    description: "Ecosistema de agentes de IA jurídicos y técnicos escalable y preciso.",
    siteName: "LexIA Asesores",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "LexIA Logo" }],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
        >
          <LanguageProvider>
            {children}
            <SupportBubble />
            <ZeroLogModal />
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
