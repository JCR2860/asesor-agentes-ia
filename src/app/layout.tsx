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

import { currentUser, clerkClient } from "@clerk/nextjs/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;
  

  let isMaintenanceMode = false;
  
  try {
    const client = await clerkClient();
    const adminUsers = await client.users.getUserList({
        emailAddress: [process.env.ADMIN_EMAIL as string],
        limit: 1
    });
    const adminUser = adminUsers.data[0];
    if (adminUser) {
        isMaintenanceMode = (adminUser.publicMetadata?.appConfig as any)?.isMaintenanceMode === true;
    }
  } catch (e) {
    console.error("Maintenance check failed", e);
  }

  // Bloqueamos si: modo mantenimiento activo + no es admin ya logueado
  if (isMaintenanceMode && !isAdmin) {
    return (
      <html lang="es">
        <body className="bg-neutral-950 text-white min-h-screen flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
              <span className="text-4xl text-blue-400">⚖️</span>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              Mantenimiento Programado
            </h1>
            <p className="text-neutral-400 leading-relaxed">
              LexIA se encuentra actualmente en una fase de actualización técnica para mejorar nuestros servicios jurídicos de IA. 
              <br/><br/>
              Estaremos de vuelta en unos minutos. Agradecemos su paciencia.
            </p>
            <div className="pt-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-500 font-mono">
                CODE: LEX-MAINT-503
              </div>
            </div>
            {/* Enlace de acceso admin: discreto, solo visible si sabes que existe */}
            <div className="pt-8">
              <a 
                href="/sign-in"
                className="text-[10px] text-neutral-800 hover:text-neutral-600 transition-colors cursor-pointer select-none"
              >
                staff access
              </a>
            </div>
          </div>
        </body>
      </html>
    );
  }

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
