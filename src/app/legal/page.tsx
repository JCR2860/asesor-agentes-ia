"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale, Cookie } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { UserMenu } from "@/components/user-menu";

export default function LegalPage() {
    const { language } = useLanguage();
    const { user } = useUser();

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-neutral-300 font-sans selection:bg-neutral-800">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between p-6 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-neutral-900 transition-colors text-neutral-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="LexIA" className="w-8 h-8 rounded-md" />
                        <span className="font-bold text-sm text-white">Lex<span className="text-blue-500">IA</span> Legal</span>
                    </div>
                </div>
                <div>{user && <UserMenu />}</div>
            </header>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-24">
                
                {/* Intro */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        {language === 'es' ? "Documentación Legal" : "Legal Documentation"}
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                        {language === 'es' 
                            ? "LexIA opera bajo el estricto principio de Amnesia Digital y soberanía de datos del cliente." 
                            : "LexIA operates under the strict principle of Digital Amnesia and client data sovereignty."}
                    </p>
                </motion.div>

                {/* Privacy Policy */}
                <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
                        <h2 className="text-2xl font-bold text-white">{language === 'es' ? "Política de Privacidad Efímera" : "Ephemeral Privacy Policy"}</h2>
                    </div>
                    <div className="prose prose-invert max-w-none text-neutral-400 leading-relaxed space-y-4">
                        {language === 'es' ? (
                            <>
                                <p><strong>1. Cero Retención de Casos:</strong> Las consultas estratégicas y los datos legales introducidos en el entorno de chat son procesados de manera volátil ("One-Shot"). Una vez se cierra la sesión o se emite el Dictamen PDF, la información es destruida por completo de nuestros servidores. No existen bases de datos de históricos.</p>
                                <p><strong>2. Pagos y Transacciones:</strong> No almacenamos información bancaria. Todo el procesamiento financiero está delegado de forma exclusiva a <span className="text-neutral-200">Stripe</span> (Nivel 1 PCI), asegurando opacidad transaccional total.</p>
                                <p><strong>3. Datos de Identidad:</strong> Los únicos datos conservados en la plataforma son el correo electrónico del cliente para propósitos de autenticación segura (vía Clerk) y el balance de sus créditos (LexCoins).</p>
                            </>
                        ) : (
                            <>
                                <p><strong>1. Zero Case Retention:</strong> Strategic queries and legal data entered into the chat environment are processed in a volatile manner ("One-Shot"). Once the session is closed or the PDF Report is issued, the information is completely destroyed from our servers. There are no historical databases.</p>
                                <p><strong>2. Payments and Transactions:</strong> We do not store banking information. All financial processing is exclusively delegated to <span className="text-neutral-200">Stripe</span> (PCI Level 1), ensuring total transactional opacity.</p>
                                <p><strong>3. Identity Data:</strong> The only data retained on the platform is the client's email address for secure authentication purposes (via Clerk) and their credits balance (LexCoins).</p>
                            </>
                        )}
                    </div>
                </motion.section>

                {/* Terms of Service */}
                <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Scale className="w-6 h-6" /></div>
                        <h2 className="text-2xl font-bold text-white">{language === 'es' ? "Términos y Condiciones" : "Terms and Conditions"}</h2>
                    </div>
                    <div className="prose prose-invert max-w-none text-neutral-400 leading-relaxed space-y-4">
                        {language === 'es' ? (
                            <>
                                <p><strong>1. Naturaleza del Servicio:</strong> LexIA provee simulaciones de estructuración legal e inteligencia artificial generativa. Los resultados emitidos no constituyen consejo legal vinculante ni reemplazan la representación jurídica colegiada ante los tribunales. Siempre se recomienda la ratificación final de un letrado.</p>
                                <p><strong>2. Uso Apropiado:</strong> El usuario se compromete a no utilizar las herramientas de LexIA para automatizar actos delictivos tipificados en la legislación correspondiente a su jurisdicción.</p>
                                <p><strong>3. Suscripción y Saldo:</strong> Los créditos de "Auditoría One-Shot" son personales e intransferibles. Los paquetes de saldo no tienen fecha de caducidad y podrán ser utilizados a conveniencia.</p>
                            </>
                        ) : (
                            <>
                                <p><strong>1. Nature of Service:</strong> LexIA provides legal structuring simulations and generative artificial intelligence. The results issued do not constitute binding legal counsel and do not replace formal legal representation before the courts. Final review by a licensed attorney is always recommended.</p>
                                <p><strong>2. Appropriate Use:</strong> The user agrees not to use LexIA's tools to automate criminal acts defined by the legislation of their jurisdiction.</p>
                                <p><strong>3. Subscription and Balance:</strong> "One-Shot Audit" credits are personal and non-transferable. Balance packages have no expiration date and can be used at your convenience.</p>
                            </>
                        )}
                    </div>
                </motion.section>

                {/* Cookies Policy */}
                <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><Cookie className="w-6 h-6" /></div>
                        <h2 className="text-2xl font-bold text-white">{language === 'es' ? "Política de Cookies" : "Cookies Policy"}</h2>
                    </div>
                    <div className="prose prose-invert max-w-none text-neutral-400 leading-relaxed space-y-4">
                        {language === 'es' ? (
                            <>
                                <p>Nos enorgullece afirmar que aplicamos una estricta política de <strong>"No Tracking"</strong>. LexIA no utiliza píxeles de seguimiento, cookies de marketing invasivas, ni vendemos datos a terceros. Toda nuestra arquitectura publicitaria es Zero-Party.</p>
                                <p><strong>¿Qué Cookies Esenciales usamos entonces?</strong></p>
                                <ul className="space-y-2 mt-4 ml-4">
                                    <li><span className="text-white">ClerkAuth:</span> Cookies puramente técnicas (Strictly Necessary) para mantener tu sesión segura y encriptada (para que no tengas que escribir tu email en cada página).</li>
                                    <li><span className="text-white">LexContext (LocalStorage):</span> Un token completamente efímero que permite mover el contexto de tu consulta desde el Asesor Especialista hacia la Directora. Se auto-destruye al ser leído.</li>
                                    <li><span className="text-white">Stripe Checkout:</span> Cookies operativas de nuestro clúster bancario necesarias para procesar pagos de forma encriptada bajo normativas europeas y norteamericanas.</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <p>We proudly uphold a strict <strong>"No Tracking"</strong> policy. LexIA does not use tracking pixels, invasive marketing cookies, nor do we sell data to third parties. All our advertising architecture is Zero-Party.</p>
                                <p><strong>What Essential Cookies do we use then?</strong></p>
                                <ul className="space-y-2 mt-4 ml-4">
                                    <li><span className="text-white">ClerkAuth:</span> Purely technical cookies (Strictly Necessary) to keep your session secure and encrypted (so you do not have to type your email on every page).</li>
                                    <li><span className="text-white">LexContext (LocalStorage):</span> A completely ephemeral token that allows the context of your query to be moved from the Specialist Advisor to the Director. It auto-destructs when read.</li>
                                    <li><span className="text-white">Stripe Checkout:</span> Operational cookies from our banking cluster required to process payments securely under European and North American regulations.</li>
                                </ul>
                            </>
                        )}
                    </div>
                </motion.section>

                <div className="text-center pt-16 pb-8 border-t border-neutral-900 text-sm font-medium text-neutral-600">
                    <p>contact@asesorlexia.com — LexIA Digital Intelligence © 2026</p>
                </div>
            </div>
        </main>
    );
}
