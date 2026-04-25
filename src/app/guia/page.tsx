"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowLeft, 
    ArrowRight,
    Copy, 
    Check, 
    Search,
    Landmark,
    Briefcase,
    Users,
    Gavel,
    Plane,
    Building,
    Lightbulb,
    Home as HomeIcon,
    Bitcoin,
    Globe,
    Sparkles,
    Lock as LockIcon,
    X
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { agentExamples } from "@/lib/agents-data";
import { UserMenu } from "@/components/user-menu";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GuiaPage() {
    const { t, language } = useLanguage();
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [activeModalQuery, setActiveModalQuery] = useState<{question: string, agentId: string} | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<string>("");

    const credits = user?.publicMetadata?.credits !== undefined 
        ? Number(user.publicMetadata.credits) 
        : 0;
        
    const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push("/sign-in");
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded || !isSignedIn) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-blue-500 animate-pulse" />
            </div>
        );
    }

    const agentIcons: Record<string, any> = {
        "asesor-fiscal": <Landmark className="w-5 h-5 text-emerald-400" />,
        "asesor-extranjeria": <Globe className="w-5 h-5 text-cyan-400" />,
        "asesor-mercantil": <Briefcase className="w-5 h-5 text-blue-400" />,
        "asesor-laboral": <Users className="w-5 h-5 text-orange-400" />,
        "asesor-penal": <Gavel className="w-5 h-5 text-red-400" />,
        "asesor-aeronautico": <Plane className="w-5 h-5 text-sky-400" />,
        "asesor-civil": <Building className="w-5 h-5 text-indigo-400" />,
        "asesor-pi": <Lightbulb className="w-5 h-5 text-yellow-400" />,
        "asesor-inmobiliario": <HomeIcon className="w-5 h-5 text-purple-400" />,
        "asesor-cripto": <Bitcoin className="w-5 h-5 text-amber-400" />,
    };


    const agentKeyMap: Record<string, string> = {
        "asesor-fiscal": "fiscal",
        "asesor-extranjeria": "extra",
        "asesor-mercantil": "merc",
        "asesor-laboral": "lab",
        "asesor-penal": "penal",
        "asesor-aeronautico": "aero",
        "asesor-civil": "civil",
        "asesor-pi": "pi",
        "asesor-inmobiliario": "inmo",
        "asesor-cripto": "cripto"
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const filterAgent = searchParams?.get('agent');

    const currentExamples = agentExamples[language] || agentExamples["es"];

    const filteredAgents = Object.keys(currentExamples)
        .filter(agentId => !filterAgent || agentId === filterAgent)
        .map(agentId => {
            const questions = currentExamples[agentId].filter(q => 
                q.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return { agentId, questions };
        }).filter(agent => agent.questions.length > 0);

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-20">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/"
                        className="p-2 -ml-2 rounded-full hover:bg-neutral-900 transition-colors text-neutral-400 hover:text-white" 
                        title={t("chat.back")}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="LexIA" className="w-8 h-8 rounded-md" />
                        <span className="font-bold text-sm text-neutral-300">Lex<span className="text-blue-500">IA</span></span>
                        <span className="mx-2 text-neutral-700">|</span>
                        <span className="text-sm font-medium text-neutral-400">{t("guide.nav")}</span>
                    </div>
                </div>
                <UserMenu />
            </header>

            <main className="max-w-5xl mx-auto px-6 pt-12">
                {/* Privacy Warning Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-4"
                >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                        <LockIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-1">
                            {language === 'es' ? "Privacidad de Análisis Local" : "Local Analysis Privacy"}
                        </h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                            {language === 'es' 
                                ? "Recuerda que LexIA es un entorno efímero. No guardamos registros de tus consultas en nuestros servidores. La única forma de conservar tu historial es descargando el dictamen en PDF antes de salir."
                                : "Remember that LexIA is an ephemeral environment. We do not keep records of your queries on our servers. The only way to keep your history is by downloading the PDF report before leaving."}
                        </p>
                    </div>
                </motion.div>

                {/* Hero section of the guide */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/20"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Premium Guide
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400"
                    >
                        {t("guide.page.title")}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10"
                    >
                        {t("guide.page.subtitle").replace("200", "400")}
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative max-w-xl mx-auto"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                        <input 
                            type="text" 
                            placeholder={language === "es" ? "Buscar por palabra clave (ej. IVA, despido, multa...)" : "Search by keyword (e.g. VAT, dismissal, fine...)"}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-neutral-200"
                        />
                    </motion.div>
                </div>

                {/* Agents and Questions */}
                {isAdmin || credits > 0 ? (
                    <div className="space-y-16">
                        {filteredAgents.map((agent, agentIdx) => (
                            <motion.section 
                                key={agent.agentId}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: agentIdx * 0.1 }}
                            >
                                <div className="flex items-center gap-3 mb-8 border-b border-neutral-900 pb-4">
                                    <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                                        {agentIcons[agent.agentId]}
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {t(`agent.${agentKeyMap[agent.agentId] || "fiscal"}.sub`)}
                                    </h2>
                                    <span className="ml-auto text-xs font-medium text-neutral-500 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-md">
                                        {agent.questions.length} {language === "es" ? "Ejemplos" : "Examples"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {agent.questions.map((question, qIdx) => {
                                        const qId = `${agent.agentId}-${qIdx}`;
                                        return (
                                            <div 
                                                key={qId}
                                                className="group relative p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300"
                                            >
                                                <p className="text-neutral-300 text-sm leading-relaxed mb-4 pr-10">
                                                    &quot;{question}&quot;
                                                </p>
                                                
                                                <div className="flex items-center justify-between mt-auto">
                                                    <button 
                                                        onClick={() => setActiveModalQuery({question, agentId: agent.agentId})}
                                                        className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1"
                                                    >
                                                        {language === "es" ? "Usar esta consulta" : "Use this query"}
                                                        <ArrowLeft className="w-3 h-3 rotate-180" />
                                                    </button>
                                                    
                                                    <button 
                                                        onClick={() => handleCopy(question, qId)}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                            copiedId === qId 
                                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                                                            : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white border border-transparent"
                                                        }`}
                                                    >
                                                        {copiedId === qId ? (
                                                            <>
                                                                <Check className="w-3.5 h-3.5" />
                                                                {t("guide.copy.success")}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-3.5 h-3.5" />
                                                                {t("guide.copy.btn")}
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        ))}
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center max-w-3xl mx-auto backdrop-blur-md"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                             <LockIcon className="w-10 h-10 text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">{t("guide.locked")}</h2>
                        <p className="text-lg text-neutral-400 mb-10 leading-relaxed">
                            {t("guide.page.subtitle")}
                        </p>
                        <Link 
                            href="/#precios"
                            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-black font-black text-xl hover:bg-neutral-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] group"
                        >
                            {t("guide.locked.btn")}
                            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse group-hover:scale-125 transition-transform" />
                        </Link>
                        <p className="mt-8 text-[10px] text-neutral-600 font-bold uppercase tracking-[0.2em]">
                            Acceso Inmediato • Sin Suscripción • Pago Único
                        </p>
                    </motion.div>
                )}

                {(isAdmin || credits > 0) && filteredAgents.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-800">
                            <Search className="w-8 h-8 text-neutral-700" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            {language === "es" ? "No se encontraron resultados" : "No results found"}
                        </h3>
                        <p className="text-neutral-500">
                            {language === "es" ? "Prueba con otra palabra clave o borra la búsqueda." : "Try another keyword or clear your search."}
                        </p>
                        <button 
                            onClick={() => setSearchTerm("")}
                            className="mt-6 text-blue-500 font-bold hover:underline"
                        >
                            {language === "es" ? "Borrar búsqueda" : "Clear search"}
                        </button>
                    </div>
                )}
            </main>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {activeModalQuery && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-neutral-900 border border-neutral-800 p-8 rounded-[2rem] max-w-lg w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
                            <button 
                                onClick={() => setActiveModalQuery(null)}
                                className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 shadow-xl">
                                    <Sparkles className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{t("guide.modal.title")}</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed">
                                    {t("guide.modal.desc").replace("{agent}", t(`agent.${agentKeyMap[activeModalQuery.agentId] || "fiscal"}.sub`))}
                                    <br/><br/>
                                    <span className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
                                        {t("guide.modal.cost")}
                                    </span>
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 mb-6 italic text-sm text-neutral-500 text-center line-clamp-3">
                                &quot;{activeModalQuery.question}&quot;
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 text-center">
                                    {language === 'es' ? 'Selecciona tu jurisdicción' : 'Select your jurisdiction'}
                                </label>
                                <select
                                    value={selectedCountry}
                                    onChange={e => setSelectedCountry(e.target.value)}
                                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none text-center"
                                >
                                    <option value="">{language === 'es' ? '-- Selecciona un país --' : '-- Select a country --'}</option>
                                    <option value="España">🇪🇸 España</option>
                                    <option value="México">🇲🇽 México</option>
                                    <option value="Argentina">🇦🇷 Argentina</option>
                                    <option value="Colombia">🇨🇴 Colombia</option>
                                    <option value="Chile">🇨🇱 Chile</option>
                                    <option value="Perú">🇵🇪 Perú</option>
                                    <option value="Venezuela">🇻🇪 Venezuela</option>
                                    <option value="Ecuador">🇪🇨 Ecuador</option>
                                    <option value="Bolivia">🇧🇴 Bolivia</option>
                                    <option value="Uruguay">🇺🇾 Uruguay</option>
                                    <option value="Paraguay">🇵🇾 Paraguay</option>
                                    <option value="Guatemala">🇬🇹 Guatemala</option>
                                    <option value="Costa Rica">🇨🇷 Costa Rica</option>
                                    <option value="Panamá">🇵🇦 Panamá</option>
                                    <option value="República Dominicana">🇩🇴 República Dominicana</option>
                                    <option value="Cuba">🇨🇺 Cuba</option>
                                    <option value="Honduras">🇭🇳 Honduras</option>
                                    <option value="El Salvador">🇸🇻 El Salvador</option>
                                    <option value="Nicaragua">🇳🇮 Nicaragua</option>
                                    <option value="Puerto Rico">🇵🇷 Puerto Rico</option>
                                    <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
                                    <option value="Canadá">🇨🇦 Canadá</option>
                                    <option value="Brasil">🇧🇷 Brasil</option>
                                    <option value="Reino Unido">🇬🇧 Reino Unido</option>
                                    <option value="Alemania">🇩🇪 Alemania</option>
                                    <option value="Francia">🇫🇷 Francia</option>
                                    <option value="Italia">🇮🇹 Italia</option>
                                    <option value="Portugal">🇵🇹 Portugal</option>
                                    <option value="Países Bajos">🇳🇱 Países Bajos</option>
                                    <option value="Bélgica">🇧🇪 Bélgica</option>
                                    <option value="Suiza">🇨🇭 Suiza</option>
                                    <option value="Austria">🇦🇹 Austria</option>
                                    <option value="Polonia">🇵🇱 Polonia</option>
                                    <option value="Rumanía">🇷🇴 Rumanía</option>
                                    <option value="Suecia">🇸🇪 Suecia</option>
                                    <option value="Noruega">🇳🇴 Noruega</option>
                                    <option value="Dinamarca">🇩🇰 Dinamarca</option>
                                    <option value="Irlanda">🇮🇪 Irlanda</option>
                                    <option value="Andorra">🇦🇩 Andorra</option>
                                    <option value="Emiratos Árabes Unidos">🇦🇪 Emiratos Árabes</option>
                                    <option value="Arabia Saudí">🇸🇦 Arabia Saudí</option>
                                    <option value="Qatar">🇶🇦 Qatar</option>
                                    <option value="Turquía">🇹🇷 Turquía</option>
                                    <option value="Israel">🇮🇱 Israel</option>
                                    <option value="Rusia">🇷🇺 Rusia</option>
                                    <option value="China">🇨🇳 China</option>
                                    <option value="Japón">🇯🇵 Japón</option>
                                    <option value="Corea del Sur">🇰🇷 Corea del Sur</option>
                                    <option value="India">🇮🇳 India</option>
                                    <option value="Indonesia">🇮🇩 Indonesia</option>
                                    <option value="Singapur">🇸🇬 Singapur</option>
                                    <option value="Filipinas">🇵🇭 Filipinas</option>
                                    <option value="Vietnam">🇻🇳 Vietnam</option>
                                    <option value="Tailandia">🇹🇭 Tailandia</option>
                                    <option value="Marruecos">🇲🇦 Marruecos</option>
                                    <option value="Egipto">🇪🇬 Egipto</option>
                                    <option value="Sudáfrica">🇿🇦 Sudáfrica</option>
                                    <option value="Nigeria">🇳🇬 Nigeria</option>
                                    <option value="Kenia">🇰🇪 Kenia</option>
                                    <option value="Australia">🇦🇺 Australia</option>
                                    <option value="Nueva Zelanda">🇳🇿 Nueva Zelanda</option>
                                    {/* Hubs Financieros, Cripto y Off-shore */}
                                    <option value="Luxemburgo">🇱🇺 Luxemburgo</option>
                                    <option value="Malta">🇲🇹 Malta</option>
                                    <option value="Liechtenstein">🇱🇮 Liechtenstein</option>
                                    <option value="Mónaco">🇲🇨 Mónaco</option>
                                    <option value="Chipre">🇨🇾 Chipre</option>
                                    <option value="Estonia">🇪🇪 Estonia</option>
                                    <option value="Georgia">🇬🇪 Georgia</option>
                                    <option value="Gibraltar">🇬🇮 Gibraltar</option>
                                    <option value="Hong Kong">🇭🇰 Hong Kong</option>
                                    <option value="Bahamas">🇧🇸 Bahamas</option>
                                    <option value="Islas Caimán">🇰🇾 Islas Caimán</option>
                                    <option value="Bermudas">🇧🇲 Bermudas</option>
                                    <option value="Islas Vírgenes Británicas">🇻🇬 Islas Vírgenes Brit.</option>
                                    <option value="Mauricio">🇲🇺 Mauricio</option>
                                    <option value="Seychelles">🇸🇨 Seychelles</option>
                                    <option value="Otro">{language === 'es' ? '🌐 Otro / Internacional' : '🌐 Other / International'}</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => router.push(`/chat/${activeModalQuery.agentId}?q=${encodeURIComponent(activeModalQuery.question)}&c=${encodeURIComponent(selectedCountry)}`)}
                                    disabled={!selectedCountry}
                                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                    {language === 'es' 
                                        ? (selectedCountry ? t("guide.modal.btn.go") : "Selecciona un país para continuar") 
                                        : (selectedCountry ? t("guide.modal.btn.go") : "Select a country to continue")}
                                </button>
                                <button 
                                    onClick={() => setActiveModalQuery(null)}
                                    className="w-full py-4 text-neutral-500 hover:text-neutral-300 transition-colors text-sm font-medium"
                                >
                                    {t("guide.modal.btn.cancel")}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
