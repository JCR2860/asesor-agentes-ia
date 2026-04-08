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
    CheckCircle2,
    CreditCard,
    Network,
    Cpu,
    Banknote
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { UserMenu } from "@/components/user-menu";
import React from "react";

export default function ManualPage() {
    const { t, language } = useLanguage();

    const sections = [
        {
            icon: <Scale className="w-8 h-8 text-blue-400" />,
            title: language === 'es' ? "1. Privacidad de Élite y Protocolo Zero-Log" : "1. Elite Privacy and Zero-Log Protocol",
            content: language === 'es' 
                ? "LexIA opera bajo el inquebrantable principio de la 'Privacidad Efímera'. No almacenamos registros (logs), ni guardamos historial de tus dictámenes. La sesión es estéril y se desvanece al cerrar tu navegador.\n\nInnovación 2026 (F5 Resilience): Entendemos que los errores ocurren. Nuestro sistema ahora es resiliente a recargas accidentales (F5); si recargas la página por error, tu chat y dictamen permanecerán intactos. Sin embargo, en cumplimiento del protocolo Zero-Log, toda la información se destruirá físicamente en cuanto cierres la pestaña o la aplicación." 
                : "LexIA operates under the unwavering principle of 'Ephemeral Privacy'. We do not store logs, nor do we keep a history of your evaluations. The session is sterile and vanishes when you close your browser.\n\n2026 Innovation (F5 Resilience): We understand errors happen. Our system is now resilient to accidental reloads (F5); if you reload by mistake, your chat and report will remain intact. However, in compliance with the Zero-Log protocol, all information will be physically destroyed as soon as you close the tab or the application."
        },
        {
            icon: <CreditCard className="w-8 h-8 text-emerald-400" />,
            title: language === 'es' ? "2. Adquisición y Gestión de Consultas (Tokens)" : "2. Acquisition and Query Management (Tokens)",
            content: language === 'es'
                ? "El consumo de Consultas (Tokens) varía rigurosamente según el departamento:\n\n• Asesores Especialistas (One-Shot): Al remitir tu caso a uno de los asesores, se descontará 1 Token de forma inmediata a cambio de tu exhaustivo y extenso Dictamen Jurídico Digital.\n\n• Recepción de la Directora: El chat de la Directora permite una conversación interactiva preliminar. Consumirá 1 Token solo al salir de la sala (cerrando definitivamente el expediente) o si alcanzas el límite térmico de 15 intervenciones en una misma sesión.\n\nNota Especial: Si ya obtuviste un dictamen final de un asesor, desde su misma interfaz podrás derivar el caso a la Directora (usando tu contexto) para realizar preguntas complementarias y seguir auditando tu respuesta inicial sin consumir crédito extra."
                : "Token consumption varies rigorously depending on the department:\n\n• Specialist Advisors (One-Shot): When submitting your case to one of the advisors, 1 Token is instantly deducted in exchange for your exhaustive Digital Legal Report.\n\n• Director's Reception: The Director's chat allows interactive preliminary conversation. It will consume 1 Token only when you leave the operating room (closing the file completely) or if you reach the thermal limit of 15 interventions in a single session.\n\nSpecial Note: If you already have a final report from an advisor, from their interface you can directly jump to the Director (carrying your context along) to ask complementary questions and continue auditing your initial response without spending extra credits."
        },
        {
            icon: <Network className="w-8 h-8 text-purple-400" />,
            title: language === 'es' ? "3. Flujos de Trabajo: Directora vs Acceso Directo" : "3. Workflows: Director vs Direct Access",
            content: language === 'es'
                ? "Para garantizar el máximo aprovechamiento arquitectónico, sugerimos dos vías para atacar una contingencia:\n\nModalidad A (Recepción General con la Directora): Si tu caso atañe múltiples sub-jurisdicciones o dadas las ramificaciones no tienes claro qué rama de derecho prima, la Directora procesará un abordaje comprensible del tema. Ella recabará contexto, determinará la estrategia central y convocará al Asesor especializado pertinente para que continúes sin vacilaciones.\n\nModalidad B (Acceso Directo de Especialista): Si dominas la naturaleza del conflicto (laboral, migración corporativa, fiscal de ganancias de capital), puedes elegir al Agente respectivo desde nuestro panel de expertos para atacar su resolución incisiva inmediata."
                : "To guarantee maximum architectural utilization, we suggest two ways to tackle a contingency:\n\nMode A (General Reception with Director): If your case involves multiple sub-jurisdictions or due to the ramifications you are not clear on which branch of law presides, the Director will process an understandable approach. She will gather context, outline the core strategy, and summon the relevant specialized Advisor for you to proceed unhesitatingly.\n\nMode B (Direct Specialist Access): If you already master the nature of the conflict (labor, corporate migration, capital gains tax), you can pick the respective Agent from our expert panel to immediately attack its incisive resolution."
        },
        {
            icon: <BookOpen className="w-8 h-8 text-amber-400" />,
            title: language === 'es' ? "4. La Guía Maestra de Casos Preconfigurados" : "4. The Master Preconfigured Case Guide",
            content: language === 'es'
                ? "Una formulación vaga y difusa de un evento legal inevitablemente resultará en un consejo tibio. Para anular este riesgo, hemos provisto una herramienta clave: la 'Guía Maestra'.\n\nÉsta es una inmensa biblioteca viva con más de 400 escenarios complejos (Trusts internacionales, expropiaciones, etc), diseñados milimétricamente por abogados tradicionales. Puedes filtrar por tu área para hallar un caso gemelo a tu realidad. La Guía te ofrece dos vías de acción tácticas: puedes copiar el texto del caso y llevártelo para personalizarlo calmadamente a tu ritmo, o puedes usar la función de enviar directamente al agente experto, asegurando así un inicio blindado y un rendimiento óptimo por parte de la IA."
                : "A vague and diffused formulation of a legal event will inevitably result in lukewarm counsel. To nullify this risk, we have provided a key tool: the 'Master Guide'.\n\nThis is an immense living library with over 400 complex scenarios (International trusts, expropriations, etc) millimetrically designed by conventional lawyers. You can filter by your area to find a twin case to your reality. The Guide offers two tactical paths: you may copy the text to pull it apart and cleanly customize it at your own pace, or you can use the function to send it directly to the expert agent, securing a bulletproof kickoff and optimal performance from the AI."
        },
        {
            icon: <Cpu className="w-8 h-8 text-red-400" />,
            title: language === 'es' ? "5. Dinámica de Operación Singular (One-Shot)" : "5. Singular Operating Dynamics (One-Shot)",
            content: language === 'es'
                ? "El ecosistema técnico de LexIA no ha sido diseñado para platicar superficialmente; ha sido concebido para inyectar recursos ingentes y entregar un ensayo de viabilidad contundente. Por esta vía, se ejerce una política asíncrona denominada 'One-Shot'.\n\nDebes proveer, de manera extensa mediante los prompts incivilizados, el relato total y absoluto de tus preocupaciones. A cambio de tu envío, los asesores usarán esa 'bala de plata' para articular y expedir un extenso e incontestable Dictamen Jurídico. Para pedir segundas y terceras matizaciones a partir de ello, deberás volver a la recepción y relanzar el conflicto con el nuevo foco adquirido."
                : "The LexIA technical ecosystem was not designed for superficial chatting; it has been conceived to inject enormous hardware resources to deliver an overwhelming feasibility essay. Through this mechanism, an asynchronous policy named 'One-Shot' is exercised.\n\nYou must provide, extensively via prompts, the total and absolute narrative of your worries. In return, the advisors will use that 'silver bullet' to articulate and issue a massive and unarguable Legal Report. To seek second and third nuances thereon, you must return to the reception and relaunch the conflict with your newly acquired focus."
        },
        {
            icon: <Mic className="w-8 h-8 text-rose-400" />,
            title: language === 'es' ? "6. Transcripción de Voz y Análisis de Adjuntos" : "6. Voice Transcription and Attachment Analysis",
            content: language === 'es'
                ? "El despacho admite que la articulación manual de un gran conglomerado de sucesos legales sea agotador. Todas nuestras interfaces integran mecanismos de reconocimiento de voz. Presiona 🎤, narra libremente como si se tratara de una reunión de negocios y el dictáfono transformará tus ideas abstractas a peticiones textuales.\n\nAñadiendo a ello, cada agente posee en su campo de comando un clip documental (📎). Puedes anexar contratos PDF, extractos bancarios en imágenes JPG/PNG o txt. El sistema los procesará internamente, usando Inteligencia Visual para diseccionarlos, y fundamentará sólidamente la viabilidad del reclutamiento legal."
                : "The firm acknowledges that manually articulating a grand conglomerate of legal events is exhausting. All our interfaces nest voice recognition mechanisms. Hit 🎤, freely narrate as if in a business meeting, and the dictaphone will sculpt your abstract ideas into textual pleadings.\n\nAdding onto that, each agent possesses a document clip (📎) inside their command field. You can annex PDF contracts, bank excerpts as JPG/PNG, or txt logs. The system assesses them internally, leveraging Visual Intelligence to dissect them, and heavily bounds the feasibility of its legal recruitment."
        },
        {
            icon: <Download className="w-8 h-8 text-cyan-400" />,
            title: language === 'es' ? "7. Blindaje de Dictamen y Descarga PDF" : "7. Shielded Reports and PDF Download",
            content: language === 'es' 
                ? "Para proteger tu inversión y estrategia, el sistema implementa un 'Cepo de Navegación'. Durante una consulta activa en móviles, el menú lateral y el botón 'atrás' del sistema quedarán bloqueados para evitar la pérdida accidental de datos.\n\nDeberás usar siempre el botón oficial de «Descargar Dictamen Digital PDF» o la flecha de salida controlada (←) para finalizar tu expediente. Al hacerlo, el autómata ensamblará la sabiduría colectiva conversada en un sofisticado panfleto gráfico, descargable de inmediato para tu retención privada."
                : "To protect your investment and strategy, the system implements a 'Navigation Lock'. During an active consultation on mobile devices, the sidebar menu and the system's 'back' button will be blocked to prevent accidental data loss.\n\nYou must always use the official «Download Digital PDF Report» button or the controlled exit arrow (←) to finalize your file. Upon doing so, the automaton will assemble the collective wisdom discussed into a sophisticated graphic pamphlet, immediately downloadable for your private retention."
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
                        <span className="hidden sm:inline font-bold text-sm text-neutral-300">Lex<span className="text-blue-500">IA</span></span>
                        <span className="hidden sm:inline mx-2 text-neutral-700">|</span>
                        <span className="text-sm font-black text-neutral-200 uppercase tracking-widest">{language === 'es' ? 'Manual del Usuario Administrativo' : 'Administrative User Manual'}</span>
                    </div>
                </div>
                <UserMenu />
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-16">
                <div className="text-center mb-20 relative">
                    {/* Background glow for hero text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-900/10 blur-[100px] -z-10 rounded-full" />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/20 shadow-xl shadow-blue-900/10"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Official Handbook 2.0.5 - LexIA Technologies
                    </motion.div>
                    
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-neutral-200 to-neutral-500 leading-tight">
                        {language === 'es' ? "Domina la Inteligencia " : "Master Executive "}
                        <br className="hidden md:block" />
                        {language === 'es' ? "Jurídica Institucional" : "Legal Intelligence"}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                        {language === 'es' 
                            ? "LexIA no es una simple aproximación de chat, se rige a sí mismo como la firma más robusta dentro de tu bolsillo. Accese hoy al conjunto exhaustivo de doctrinas sobre cómo desplegar consultas, asegurar su trazabilidad transaccional, navegar por la guía maestra y acatar el marco operativo One-Shot." 
                            : "LexIA is not a simple chat approximation, it rules itself as the most robust firm right inside your pocket. Access today the exhaustive compound of doctrines on how to deploy queries, secure your transactional traceability, navigate through the master guide, and abide by the One-Shot operating frame."}
                    </p>
                </div>

                <div className="flex flex-col gap-10 mb-20">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
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
                            {language === 'es' ? "Advertencia Corporativa: Destrucción de Contexto" : "Corporate Warning: Context Annihilation"}
                        </h3>
                        <p className="text-rose-200/70 leading-relaxed mb-6 font-medium">
                            {language === 'es' 
                                ? "Con el propósito explícito y unívoco de resguardar el secreto profesional asociado al ecosistema jurídico de tu empresa, LexIA procede al borrado paramétrico de tus bases de consulta. Si elijes ignorar el enlace de exportación estática PDF, se considerará que los datos han cumplido su ciclo de vida y tu resolución será permanentemente irrecuperable de la red neutral de servidores activos."
                                : "With the explicit and univocal purpose of holding the professional secrecy bounded to your corporate legal ecosystem, LexIA proceeds to the parametric erasure of your querying frames. If you choose to ignore the static PDF export link, it shall be deduced that the data has fulfilled its life-cycle and your resolution will be permanently irretrievable from the active neutral server grid."}
                        </p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                            <div className="flex items-center gap-2 text-xs font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-4 py-2 rounded-xl">
                                <CheckCircle2 className="w-4 h-4" /> Zero-Logs
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-4 py-2 rounded-xl">
                                <CheckCircle2 className="w-4 h-4" /> No Memory Fallback
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-4 py-2 rounded-xl">
                                <CheckCircle2 className="w-4 h-4" /> Absolute Opacity
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Telegram Community */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-blue-700 to-blue-500 border border-blue-400/30 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center gap-8 shadow-2xl shadow-blue-900/40 mb-16"
                >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-300/30 blur-[100px] rounded-full -z-10 translate-x-1/3 -translate-y-1/3" />
                    
                    <div className="w-24 h-24 shrink-0 rounded-full bg-white flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
                        <svg className="w-12 h-12 text-blue-600 ml-[-4px]" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.96-.64-.34-1 .22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.98 1.25-5.59 3.69-.53.36-1.01.53-1.44.52-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.32-.49.88-.76 3.45-1.5 5.76-2.5 6.94-3 3.3-1.38 3.99-1.62 4.43-1.63.1 0 .32.02.43.12.09.08.12.19.12.31z"/>
                        </svg>
                    </div>
                    
                    <div className="flex-1">
                        <h3 className="text-2xl font-black text-white mb-4 tracking-tight drop-shadow-sm">
                            {language === 'es' ? "Comunidad Operativa Global (Airdrops)" : "Global Operative Community (Airdrops)"}
                        </h3>
                        <p className="text-blue-50 leading-relaxed mb-6 font-medium text-lg text-balance drop-shadow-sm">
                            {language === 'es' 
                                ? "Únete al canal oficial de Telegram para mantenerte informado de novedades algorítmicas y ser el primero en recibir códigos cifrados con Tokens (Consultas) de regalo gratuitos. Podrías ser uno de los afortunados."
                                : "Join the official Telegram channel to stay informed on algorithmic updates and be the first to receive exclusive crypto-codes pre-loaded with free Tokens (Queries). You might be lucky!"}
                        </p>
                        <a 
                            href="https://t.me/AsesorLexAI"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-[1rem] bg-white text-blue-700 font-black text-lg hover:scale-105 hover:bg-neutral-50 transition-all shadow-xl"
                        >
                            {language === 'es' ? "Unirme ahora a Telegram" : "Join Telegram Now"}
                        </a>
                    </div>
                </motion.div>

                <div className="text-center py-12">
                    <Link 
                        href="/"
                        className="px-12 py-5 rounded-[2rem] bg-white text-black font-black text-xl hover:bg-neutral-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] inline-flex items-center gap-3"
                    >
                        {language === 'es' ? "He asimilado el manual. Volver." : "I assimilated the manual. Return."}
                        <ArrowLeft className="w-6 h-6 text-blue-600" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
