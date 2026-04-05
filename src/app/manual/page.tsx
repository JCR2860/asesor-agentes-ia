"use client";

import { motion } from "framer-motion";
import { 
    ArrowLeft, 
    BookOpen, 
    ShieldCheck, 
    FileText, 
    Download, 
    Mic, 
    Sparkles, 
    LockIcon,
    Scale,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { UserMenu } from "@/components/user-menu";

export default function ManualPage() {
    const { t, language } = useLanguage();

    const sections = [
        {
            icon: <Scale className="w-8 h-8 text-blue-400" />,
            title: language === 'es' ? "Filosofía del Despacho" : "Firm Philosophy",
            content: language === 'es' 
                ? "LexIA es un despacho de inteligencia jurídica de alta precisión. A diferencia de un chat convencional, LexIA está diseñado para realizar análisis profundos y estratégicos en una única sesión (One-Shot). No almacenamos historial para proteger tu privacidad absoluta." 
                : "LexIA is a high-precision legal intelligence firm. Unlike a conventional chat, LexIA is designed to perform deep and strategic analysis in a single session (One-Shot). We do not store history to protect your absolute privacy."
        },
        {
            icon: <BookOpen className="w-8 h-8 text-purple-400" />,
            title: language === 'es' ? "Modalidades de Consulta" : "Query Modalities",
            content: language === 'es' 
                ? "Tienes dos formas de usar el despacho: Recepción Central (Modalidad A) para casos complejos que requieren un comité de expertos, o el Especialista Directo (Modalidad B) a través de la Guía Maestra para consultas técnicas específicas."
                : "You have two ways to use the law firm: Central Reception (Mode A) for complex cases requiring a committee of experts, or Direct Specialist (Mode B) through the Master Guide for specific technical inquiries."
        },
        {
            icon: <Mic className="w-8 h-8 text-rose-400" />,
            title: language === 'es' ? "Consulta por Voz" : "Voice Consultation",
            content: language === 'es' 
                ? "Puedes pulsar el icono del micrófono 🎤 para hablar directamente con los asesores. La plataforma transcribirá tus palabras con precisión para que no tengas que escribir casos largos manualmente."
                : "You can press the microphone icon 🎤 to speak directly with the advisors. The platform will transcribe your words with precision so you don't have to type long cases manually."
        },
        {
            icon: <Download className="w-8 h-8 text-emerald-400" />,
            title: language === 'es' ? "Dictámenes en PDF" : "PDF Reports",
            content: language === 'es' 
                ? "Es fundamental descargar tu consulta en PDF antes de salir. Dado que no guardamos historial, el PDF es el único registro legal y estratégico que te pertenece. Una vez cierras la pestaña, los datos se eliminan del servidor."
                : "It is fundamental to download your query as a PDF before leaving. Since we do not store history, the PDF is the only legal and strategic record that belongs to you. Once you close the tab, the data is deleted from the server."
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-20">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/"
                        className="p-2 -ml-2 rounded-full hover:bg-neutral-900 transition-colors text-neutral-400 hover:text-white" 
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="LexIA" className="w-8 h-8 rounded-md" />
                        <span className="font-bold text-sm text-neutral-300">Lex<span className="text-blue-500">IA</span></span>
                        <span className="mx-2 text-neutral-700">|</span>
                        <span className="text-sm font-medium text-neutral-400">Manual de Usuario</span>
                    </div>
                </div>
                <UserMenu />
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-16">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6 border border-amber-500/20"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Official Manual 2025
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                        {language === 'es' ? "¿Cómo Funciona LexIA?" : "How LexIA Works?"}
                    </h1>
                    <p className="text-lg text-neutral-400">
                        {language === 'es' ? "Guía rápida para dominar la inteligencia jurídica de élite." : "Quick guide to master elite legal intelligence."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-neutral-900/40 p-8 rounded-[2.5rem] border border-neutral-800 hover:border-neutral-700 transition-colors group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-neutral-950 flex items-center justify-center mb-6 shadow-inner border border-neutral-900 group-hover:scale-105 transition-transform">
                                {section.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                            <p className="text-neutral-400 leading-relaxed text-sm">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Important Alert */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[80px] -z-10" />
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                            {language === 'es' ? "Atención: La información se autodestruye" : "Warning: Information Self-Destructs"}
                        </h3>
                    </div>
                    <p className="text-neutral-300 leading-relaxed mb-6">
                        {language === 'es' 
                            ? "Para garantizar tu secreto profesional, LexIA NO guarda base de datos de los chats. Si sales de la página sin descargar el PDF, NO podrás recuperar la información. Es un sistema de un solo uso por consulta para máxima seguridad."
                            : "To guarantee your professional secrecy, LexIA DOES NOT keep a database of chats. If you leave the page without downloading the PDF, you will NOT be able to recover the information. It is a one-time use per query system for maximum security."}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest">
                            <CheckCircle2 className="w-4 h-4" /> No Logs
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest">
                            <CheckCircle2 className="w-4 h-4" /> No Tracking
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest">
                            <CheckCircle2 className="w-4 h-4" /> 100% Ephemeral
                        </div>
                    </div>
                </motion.div>

                <div className="mt-16 text-center">
                    <Link 
                        href="/"
                        className="px-12 py-5 rounded-full bg-white text-black font-black text-xl hover:scale-105 transition-all shadow-xl inline-flex items-center gap-3"
                    >
                        {language === 'es' ? "Entendido, Ir al Despacho" : "Understood, Go to Office"}
                        <Sparkles className="w-6 h-6 text-blue-600" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
