"use client";

import { motion } from "framer-motion";
import {
    ArrowLeft,
    BookOpen,
    ShieldCheck,
    Download,
    Mic,
    AlertTriangle,
    CheckCircle2,
    Coins,
    Users,
    Crown,
    Globe,
    Rocket,
    Paperclip,
    FolderLock
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { UserMenu } from "@/components/user-menu";
import React from "react";

export default function ManualPage() {
    const { language } = useLanguage();
    const es = language === 'es';

    const sections = [
        {
            icon: <Rocket className="w-8 h-8 text-gold-400" />,
            title: es ? "1. Cómo empezar (primeros pasos)" : "1. Getting started",
            content: es
                ? "Usar LexIA es sencillo. En cuatro pasos tiene su primer dictamen:\n\n1. Regístrese con su correo electrónico. Es el único dato de cuenta que necesitamos. Anote su contraseña: si la olvida, podrá recuperarla por email desde la pantalla de acceso.\n\n2. Consiga créditos. Compre un pack desde el menú «Comprar» (pago seguro con tarjeta a través de Stripe) o canjee un código de regalo si dispone de uno.\n\n3. Elija con quién consultar: un Asesor Especialista para una duda concreta, o la Directora General para un caso complejo. Más abajo se explica cuándo usar cada uno.\n\n4. Plantee su caso, reciba el dictamen y descárguelo en PDF. Ese PDF será su copia; guárdelo bien."
                : "Using LexIA is simple. Four steps to your first legal opinion:\n\n1. Sign up with your email. It is the only account data we need. Write down your password: if you forget it, you can recover it by email from the login screen.\n\n2. Get credits. Buy a pack from the «Buy» menu (secure card payment via Stripe) or redeem a gift code if you have one.\n\n3. Choose who to consult: a Specialist Advisor for a specific question, or the Managing Partner for a complex case. See below when to use each.\n\n4. Present your case, receive the opinion and download it as a PDF. That PDF is your copy; keep it safe."
        },
        {
            icon: <Coins className="w-8 h-8 text-emerald-400" />,
            title: es ? "2. Créditos y precios (cómo se cobra)" : "2. Credits and pricing",
            content: es
                ? "Cada consulta se paga con créditos, y el coste depende de a quién pregunte:\n\n• Asesor Especialista: 1 crédito por cada mensaje enviado.\n• Directora General: 3 créditos por cada mensaje enviado (analiza varias áreas a la vez con el motor GPT-5.6 Sol, el más avanzado).\n\nEjemplo: con el pack de 50 créditos podría hacer 50 consultas a especialistas, o unas 16 a la Directora, o cualquier combinación.\n\nPacks disponibles: 9,50 € (25 créditos), 16,50 € (50 créditos) y 29,50 € (100 créditos). Sin suscripciones ni cuotas: paga solo por lo que usa.\n\nImportante: el crédito se descuenta al pulsar «enviar», no antes. Mientras escribe puede editar y ampliar su texto todo lo que quiera sin coste. Cuando se quede sin créditos, recargue desde «Comprar» o canjee un código."
                : "Each query is paid with credits, and the cost depends on who you ask:\n\n• Specialist Advisor: 1 credit per message sent.\n• Managing Partner: 3 credits per message (analyses several areas at once with GPT-5.6 Sol, the most advanced engine).\n\nExample: with the 50-credit pack you could make 50 specialist queries, or about 16 to the Partner, or any mix.\n\nPacks: €9.50 (25 credits), €16.50 (50 credits) and €29.50 (100 credits). No subscriptions: pay only for what you use.\n\nImportant: the credit is charged when you press «send», not before. While typing you can edit and expand freely at no cost. When you run out, top up from «Buy» or redeem a code."
        },
        {
            icon: <Users className="w-8 h-8 text-gold-400" />,
            title: es ? "3. Asesor Especialista o Directora General: ¿cuál elijo?" : "3. Specialist Advisor or Managing Partner?",
            content: es
                ? "LexIA le ofrece dos formas de consultar. Elegir bien es clave para aprovechar sus créditos:\n\n• Asesores Especialistas (1 crédito). Son 14 expertos, cada uno en su materia (fiscal, laboral, penal, mercantil, inmobiliario, cripto, extranjería, etc.). Dan una respuesta ágil, directa y práctica de unas 4-6 páginas. Úselos cuando su duda es concreta y de una sola área. Cada especialista responde solo de su especialidad; si le pregunta algo de otra materia, le indicará a quién acudir.\n\n• Directora General (3 créditos). Es el servicio insignia, con el modelo más potente. Coordina a todos los especialistas a la vez y emite un dictamen extenso y completo. Úsela cuando su caso es complejo o cruza varias áreas (por ejemplo, una herencia con inmuebles y fiscalidad internacional, o un despido con implicaciones penales).\n\nRegla práctica: duda simple y clara → Especialista. Caso enredado o multidisciplinar → Directora."
                : "LexIA offers two ways to consult. Choosing well is key to making the most of your credits:\n\n• Specialist Advisors (1 credit). 14 experts, each in their field (tax, labour, criminal, corporate, real estate, crypto, immigration, etc.). They give a quick, direct, practical answer of about 4-6 pages. Use them for a specific, single-area question. Each one only answers within its specialty and will point you to the right one otherwise.\n\n• Managing Partner (3 credits). The flagship service, with the most powerful model. Coordinates all specialists at once and issues an extensive, complete opinion. Use it for complex or multi-area cases (e.g. an inheritance with real estate and international tax, or a dismissal with criminal implications).\n\nRule of thumb: simple, clear question → Specialist. Tangled or cross-disciplinary case → Partner."
        },
        {
            icon: <Globe className="w-8 h-8 text-cyan-400" />,
            title: es ? "4. Indique siempre su país (obligatorio)" : "4. Always state your country (required)",
            content: es
                ? "Antes de enviar una consulta debe seleccionar el país en el desplegable que hay sobre el cuadro de texto. Es obligatorio: hasta que no elija país, el botón de enviar permanece bloqueado.\n\n¿Por qué? Porque la ley cambia en cada país. Al indicar su jurisdicción, el asesor basa todo el análisis en la legislación, los organismos y los tribunales de ESE país, y le cita las fuentes oficiales correctas (por ejemplo, el BOE en España). Si su caso tiene relación con varios países, indíquelo también en el texto de su consulta.\n\nSi el botón de enviar no le funciona, casi siempre es porque falta elegir el país."
                : "Before sending a query you must select a country from the dropdown above the text box. It is mandatory: the send button stays locked until you choose one.\n\nWhy? Because the law differs in every country. By stating your jurisdiction, the advisor bases the whole analysis on that country's legislation, bodies and courts, and cites the correct official sources. If your case involves several countries, mention it in your query text too.\n\nIf the send button won't work, it is almost always because the country hasn't been selected."
        },
        {
            icon: <Paperclip className="w-8 h-8 text-purple-400" />,
            title: es ? "5. Cómo hacer una buena consulta" : "5. How to ask a good question",
            content: es
                ? "La calidad de la respuesta depende de la calidad de su pregunta. Consejos:\n\n• Cuéntelo todo en un solo mensaje. Los especialistas trabajan con una política de «una consulta, un dictamen completo»: aprovechan todo lo que usted escribe para elaborar una respuesta a fondo. Detalle fechas, cantidades, personas implicadas y qué quiere conseguir. Para matizar o hacer un seguimiento, tendrá que lanzar una nueva consulta.\n\n• Adjunte documentos. Con el clip (📎) puede añadir contratos en PDF, o fotos de documentos en JPG/PNG, o archivos de texto. El asesor los analiza al momento y en memoria (no se guardan en ningún sitio).\n\n• Dicte por voz. Pulse el micrófono (🎤) y hable con naturalidad; el sistema transcribe lo que diga. Ideal para casos largos. (Disponible en Chrome o Edge.)\n\n• Apóyese en la Guía Maestra: una biblioteca con más de 560 consultas de ejemplo diseñadas por abogados. Busque una parecida a la suya y úsela como plantilla para redactar mejor."
                : "The quality of the answer depends on the quality of your question. Tips:\n\n• Tell everything in a single message. Specialists work on a «one query, one full opinion» basis: they use everything you write to craft a thorough answer. Include dates, amounts, people involved and your goal. To add nuance or follow up, you'll need to start a new query.\n\n• Attach documents. With the clip (📎) you can add PDF contracts, photos of documents in JPG/PNG, or text files. The advisor analyses them instantly and in memory (nothing is stored).\n\n• Dictate by voice. Press the microphone (🎤) and speak naturally; the system transcribes it. Ideal for long cases. (Available in Chrome or Edge.)\n\n• Use the Master Guide: a library of 560+ example queries designed by lawyers. Find one similar to yours and use it as a template."
        },
        {
            icon: <BookOpen className="w-8 h-8 text-amber-400" />,
            title: es ? "6. Guía Maestra y Bóveda de Documentos" : "6. Master Guide and Document Vault",
            content: es
                ? "Además de los asesores, dispone de dos recursos incluidos:\n\n• Guía Maestra: más de 560 consultas de referencia por áreas. Le sirve tanto para inspirarse como para redactar su caso con la precisión que el asesor necesita.\n\n• Bóveda de Documentos: una colección de 25 plantillas legales profesionales y extensas, organizadas en 6 categorías (Inmobiliario, Mercantil, Laboral, Civil, Digital/Web y Reclamaciones). Encontrará desde contratos de arras, alquiler o compraventa, pactos de socios y contratos laborales, hasta política de privacidad RGPD, burofax de reclamación o desistimiento de compra online.\n\nCada plantilla se descarga en PDF, lista para rellenar los campos marcados y firmar. Son un excelente punto de partida; para casos delicados, revíselas con un profesional."
                : "Beyond the advisors, you have two included resources:\n\n• Master Guide: 560+ reference queries by area. Useful both for inspiration and to write your case with the precision the advisor needs.\n\n• Document Vault: a collection of 25 professional, extensive legal templates in 6 categories (Real Estate, Business, Labour, Civil, Digital/Web and Claims). From deposit, rental or sale contracts, shareholder agreements and employment contracts, to GDPR privacy policies, formal demand letters or online purchase withdrawals.\n\nEach template downloads as a PDF, ready to fill in the marked fields and sign. A great starting point; for sensitive cases, review them with a professional."
        },
        {
            icon: <Download className="w-8 h-8 text-cyan-400" />,
            title: es ? "7. Descargue su dictamen en PDF" : "7. Download your opinion as PDF",
            content: es
                ? "Cuando termine una consulta, descargue siempre el dictamen en PDF. Es la parte más importante del proceso.\n\nAl finalizar, pulse el botón «Descargar Dictamen PDF» o la flecha de salida (←). El sistema generará un documento profesional con la marca LexIA, su número de expediente y todo el contenido de la consulta, listo para guardar o imprimir.\n\nEn el móvil, durante una consulta activa el menú y el botón «atrás» se bloquean a propósito, para que no pierda su dictamen por un toque accidental. Use siempre el botón oficial de descarga o la flecha de salida para terminar.\n\nRecuerde: ese PDF es la ÚNICA copia que existirá de su dictamen (ver el punto 8)."
                : "When you finish a query, always download the opinion as a PDF. It is the most important part of the process.\n\nWhen done, press «Download PDF Report» or the exit arrow (←). The system generates a professional document with the LexIA brand, your case number and all the content, ready to save or print.\n\nOn mobile, during an active query the menu and «back» button are locked on purpose, so you don't lose your opinion with an accidental tap. Always use the official download button or the exit arrow to finish.\n\nRemember: that PDF is the ONLY copy that will exist of your opinion (see point 8)."
        },
        {
            icon: <FolderLock className="w-8 h-8 text-emerald-400" />,
            title: es ? "8. Privacidad Zero-Log: no guardamos nada" : "8. Zero-Log privacy: we store nothing",
            content: es
                ? "LexIA se diseñó al revés que otras plataformas: no guardamos ningún historial de sus consultas. No hay base de datos de casos. Lo que usted consulta, solo lo sabe usted.\n\nSu conversación vive únicamente en su navegador mientras dura la sesión. Si recarga la página por error (F5), no se pierde: el sistema es resiliente a recargas accidentales. Pero en cuanto cierra la pestaña o el navegador, toda la información se destruye de forma permanente e irrecuperable.\n\nPor eso es imprescindible descargar el PDF antes de salir: si no lo hace, su dictamen desaparecerá para siempre. El único dato que conservamos es su email de acceso, y los datos de pago los custodia exclusivamente Stripe. Sus consultas nunca se usan para entrenar modelos de IA."
                : "LexIA was designed the opposite way to other platforms: we keep no history of your queries. There is no case database. What you consult, only you know.\n\nYour conversation lives only in your browser during the session. If you reload by mistake (F5), it isn't lost: the system is resilient to accidental reloads. But as soon as you close the tab or browser, all information is permanently and irrecoverably destroyed.\n\nThat is why downloading the PDF before leaving is essential: otherwise your opinion vanishes forever. The only data we keep is your login email, and payment data is held exclusively by Stripe. Your queries are never used to train AI models."
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-20 selection:bg-neutral-800">
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
                        <span className="hidden sm:inline font-bold text-sm text-neutral-300">Lex<span className="text-gold-500">IA</span></span>
                        <span className="hidden sm:inline mx-2 text-neutral-700">|</span>
                        <span className="text-sm font-black text-neutral-200 uppercase tracking-widest">{es ? 'Manual de Usuario' : 'User Manual'}</span>
                    </div>
                </div>
                <UserMenu />
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
                <div className="text-center mb-20 relative">
                    {/* Background glow for hero text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-900/10 blur-[100px] -z-10 rounded-full" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold uppercase tracking-wider mb-6 border border-gold-500/20 shadow-xl shadow-gold-900/10"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        {es ? 'Guía de uso · LexIA' : 'User Guide · LexIA'}
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-neutral-200 to-neutral-500 leading-tight">
                        {es ? "Cómo sacar el máximo partido a LexIA" : "How to get the most out of LexIA"}
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                        {es
                            ? "Todo lo que necesita saber para usar la plataforma: cómo empezar, cómo funcionan los créditos, cuándo usar a un especialista o a la Directora, cómo hacer una buena consulta y cómo descargar y proteger su dictamen."
                            : "Everything you need to use the platform: how to start, how credits work, when to use a specialist or the Managing Partner, how to ask a good question, and how to download and protect your opinion."}
                    </p>
                </div>

                <div className="flex flex-col gap-10 mb-20">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: Math.min(idx * 0.08, 0.4) }}
                            className="bg-neutral-900/40 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border border-neutral-800/80 hover:bg-neutral-900/60 transition-all shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 transition-opacity">
                               {React.cloneElement(section.icon, { className: "w-64 h-64" })}
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-20 h-20 shrink-0 rounded-[1.5rem] bg-neutral-950 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] border border-neutral-800/50 group-hover:scale-105 transition-transform duration-500">
                                    {React.cloneElement(section.icon, { className: "w-10 h-10" })}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">{section.title}</h3>
                                    <div className="text-neutral-400 leading-relaxed text-base md:text-lg space-y-4 whitespace-pre-wrap">
                                        {section.content}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Important Alert */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-8 sm:p-12 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/20 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center gap-8 shadow-2xl shadow-rose-900/10 mb-16"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-rose-500/5 blur-[120px] -z-10" />

                    <div className="w-24 h-24 shrink-0 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
                        <AlertTriangle className="w-10 h-10" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-2xl font-black text-rose-100 mb-4 tracking-tight">
                            {es ? "Lo más importante: descargue su PDF" : "Most important: download your PDF"}
                        </h3>
                        <p className="text-rose-200/70 leading-relaxed mb-6 font-medium">
                            {es
                                ? "Para proteger su privacidad, LexIA borra su consulta al cerrar la sesión. No hay copia de seguridad ni historial: si cierra la pestaña sin descargar el PDF, su dictamen se pierde de forma definitiva. Descárguelo siempre antes de salir."
                                : "To protect your privacy, LexIA erases your query when the session closes. There is no backup or history: if you close the tab without downloading the PDF, your opinion is lost for good. Always download it before leaving."}
                        </p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                            <div className="flex items-center gap-2 text-xs font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-4 py-2 rounded-xl">
                                <CheckCircle2 className="w-4 h-4" /> {es ? 'Sin historial' : 'No history'}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-4 py-2 rounded-xl">
                                <CheckCircle2 className="w-4 h-4" /> {es ? 'El PDF es su única copia' : 'PDF is your only copy'}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-4 py-2 rounded-xl">
                                <CheckCircle2 className="w-4 h-4" /> Zero-Log
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Telegram Community */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-gold-700 to-gold-500 border border-gold-400/30 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center gap-8 shadow-2xl shadow-gold-900/40 mb-16"
                >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-300/30 blur-[100px] rounded-full -z-10 translate-x-1/3 -translate-y-1/3" />

                    <div className="w-24 h-24 shrink-0 rounded-full bg-white flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
                        <svg className="w-12 h-12 text-gold-600 ml-[-4px]" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.96-.64-.34-1 .22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.98 1.25-5.59 3.69-.53.36-1.01.53-1.44.52-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.32-.49.88-.76 3.45-1.5 5.76-2.5 6.94-3 3.3-1.38 3.99-1.62 4.43-1.63.1 0 .32.02.43.12.09.08.12.19.12.31z"/>
                        </svg>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-2xl font-black text-white mb-4 tracking-tight drop-shadow-sm">
                            {es ? "Comunidad en Telegram (códigos gratis)" : "Telegram community (free codes)"}
                        </h3>
                        <p className="text-gold-50 leading-relaxed mb-6 font-medium text-lg text-balance drop-shadow-sm">
                            {es
                                ? "Únase a nuestro canal oficial de Telegram para enterarse de las novedades y ser de los primeros en recibir códigos con créditos de regalo para canjear en la plataforma."
                                : "Join our official Telegram channel to hear about updates and be among the first to receive codes with free credits to redeem on the platform."}
                        </p>
                        <a
                            href="https://t.me/AsesorLexAI"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-[1rem] bg-white text-gold-700 font-black text-lg hover:scale-105 hover:bg-neutral-50 transition-all shadow-xl"
                        >
                            {es ? "Unirme a Telegram" : "Join Telegram"}
                        </a>
                    </div>
                </motion.div>

                <div className="text-center py-12">
                    <Link
                        href="/"
                        className="px-12 py-5 rounded-[2rem] bg-white text-black font-black text-xl hover:bg-neutral-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] inline-flex items-center gap-3"
                    >
                        {es ? "Volver al inicio" : "Back to home"}
                        <ArrowLeft className="w-6 h-6 text-gold-600" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
