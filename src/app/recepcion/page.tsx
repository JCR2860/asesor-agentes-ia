"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Send, 
    ArrowLeft, 
    User as UserIcon, 
    Scale, 
    Loader2, 
    ShieldCheck, 
    Sparkles, 
    MessageSquare,
    ChevronRight,
    ArrowRight,
    Lock as LockIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { UserButton, useUser } from "@clerk/nextjs";

export default function RecepcionPage() {
    const { t, language } = useLanguage();
    const { user } = useUser();
    const router = useRouter();
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [userName, setUserName] = useState<string>("");
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

    const agentConfig = useMemo<Record<string, any>>(() => ({
        "asesor-fiscal": { id: "asesor-fiscal", title: t("agent.title.fiscal"), color: "text-emerald-400 bg-emerald-400/10" },
        "asesor-mercantil": { id: "asesor-mercantil", title: t("agent.title.merc"), color: "text-blue-400 bg-blue-400/10" },
        "asesor-laboral": { id: "asesor-laboral", title: t("agent.title.lab"), color: "text-orange-400 bg-orange-400/10" },
        "asesor-penal": { id: "asesor-penal", title: t("agent.title.penal"), color: "text-red-400 bg-red-400/10" },
        "asesor-aeronautico": { id: "asesor-aeronautico", title: t("agent.title.aero"), color: "text-sky-400 bg-sky-400/10" },
        "asesor-civil": { id: "asesor-civil", title: t("agent.title.civil"), color: "text-indigo-400 bg-indigo-400/10" },
        "asesor-pi": { id: "asesor-pi", title: t("agent.title.pi"), color: "text-yellow-400 bg-yellow-400/10" },
        "asesor-inmobiliario": { id: "asesor-inmobiliario", title: t("agent.title.inmo"), color: "text-purple-400 bg-purple-400/10" },
        "asesor-cripto": { id: "asesor-cripto", title: t("agent.title.cripto"), color: "text-amber-400 bg-amber-400/10" },
        "asesor-extranjeria": { id: "asesor-extranjeria", title: t("agent.title.extra"), color: "text-cyan-400 bg-cyan-400/10" }
    }), [t]);

    const credits = user?.publicMetadata?.credits !== undefined 
        ? Number(user.publicMetadata.credits) 
        : 0;

    const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
        body: { 
            agentId: "asesor-direccion", 
            language 
        },
        initialMessages: [
            {
                id: "welcome",
                role: "assistant",
                content: t("recepcion.welcome")
            }
        ]
    });

    // Detectar etiqueta explícita de asignación de la directora: ej. [ASIGNAR: asesor-fiscal]
    useEffect(() => {
        if (messages.length <= 1) return;

        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === 'assistant') {
            const content = lastMessage.content;
            // Buscamos un comando explícito de asignación por parte de la IA
            const match = content.match(/\[ASIGNAR:\s*(asesor-[a-z]+)\]/i);
            
            if (match) {
                const agentId = match[1].toLowerCase();
                if (agentConfig[agentId]) {
                    setSelectedAgentId(agentId);
                }
            } else {
                // Si la IA hace preguntas pero no asigna aún, quitamos el botón si estaba.
                setSelectedAgentId(null);
            }
        }
    }, [messages, agentConfig]);

    const suggestedAgent = selectedAgentId ? agentConfig[selectedAgentId] : null;

    // Intentar extraer el nombre del usuario de los mensajes
    useEffect(() => {
        const userMsg = messages.find(m => m.role === 'user');
        if (userMsg && !userName) {
            const content = userMsg.content.trim();
            const match = content.match(/(?:me llamo|soy|mi nombre es)\s+([A-Z][a-z]+)/i);
            if (match) setUserName(match[1]);
            else if (content.split(' ').length <= 2) setUserName(content);
        }
    }, [messages, userName]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleHandoff = (agentId: string) => {
        if (credits <= 0) {
            router.push("/#precios");
            return;
        }
        const query = encodeURIComponent(messages.filter(m => m.role === 'user').map(m => m.content).join(' '));
        router.push(`/chat/${agentId}?name=${encodeURIComponent(userName)}&q=${query}`);
    };

    return (
        <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-xl z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push("/")} className="p-2 rounded-full hover:bg-neutral-900 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-neutral-400" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight">Dirección LexIA</h1>
                            <span className="text-xs text-blue-400 font-medium">Recepción Oficial</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                        <span>Servicio de Admisión</span>
                        <span className="text-emerald-500">Sin Coste (0 Créditos)</span>
                    </div>
                    <UserButton />
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <div className="max-w-2xl mx-auto flex flex-col gap-6">
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={i}
                                className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                            >
                                <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${
                                        msg.role === "assistant" 
                                            ? "bg-neutral-900 border-neutral-800 text-blue-400" 
                                            : "bg-blue-600 border-blue-500 text-white"
                                    }`}>
                                        {msg.role === "assistant" ? <Scale className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                                    </div>
                                    <div className={`px-5 py-3.5 rounded-2xl leading-relaxed text-sm md:text-base ${
                                        msg.role === "assistant"
                                            ? "bg-neutral-900/50 border border-neutral-800 text-neutral-200"
                                            : "bg-neutral-800 border border-neutral-700 text-white"
                                    }`}>
                                        <div className="whitespace-pre-wrap">{msg.content.replace(/\[ASIGNAR:\s*asesor-[a-z]+\]/gi, '').trim()}</div>
                                        
                                        {/* Sugerencia de Asesor */}
                                        {msg.role === 'assistant' && selectedAgentId && i === messages.length - 1 && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="mt-6 p-4 rounded-xl bg-blue-600/10 border border-blue-500/20"
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${agentConfig[selectedAgentId].color}`}>
                                                        <Sparkles className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white leading-tight">{t("recepcion.handoff.title")}</h4>
                                                        <p className="text-xs text-blue-400 font-medium">{t("recepcion.handoff.assigned")}: {agentConfig[selectedAgentId].title}</p>
                                                    </div>
                                                </div>
                                                
                                                {credits > 0 ? (
                                                    <button 
                                                        onClick={() => handleHandoff(selectedAgentId)}
                                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2"
                                                    >
                                                        {t("recepcion.handoff.btn")}
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <p className="text-xs text-amber-400 font-bold bg-amber-400/10 p-2 rounded-lg border border-amber-500/20 text-center">
                                                            {t("chat.error.no_credits_specialist")}
                                                        </p>
                                                        <button 
                                                            onClick={() => router.push("/#precios")}
                                                            className="w-full bg-white text-black font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                                                        >
                                                            <LockIcon className="w-4 h-4" />
                                                            {t("guide.locked.btn")}
                                                        </button>
                                                    </div>
                                                )}
                                                <p className="text-[10px] text-center mt-3 text-neutral-500">
                                                    {credits > 0 ? t("recepcion.handoff.warn") : t("recepcion.handoff.no_credits")}
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                            </div>
                            <div className="px-5 py-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                                <div className="flex gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </main>

            {/* Input */}
            <footer className="p-6 bg-neutral-950 border-t border-neutral-900">
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!input.trim()) return;
                        handleSubmit(e);
                    }} 
                    className="max-w-2xl mx-auto relative group"
                >
                    <input
                        value={input}
                        onChange={handleInputChange}
                        placeholder={userName ? `Dígame su consulta, ${userName}...` : "Escriba su mensaje aquí..."}
                        className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-neutral-600"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-all disabled:bg-neutral-800 disabled:text-neutral-600 shadow-lg shadow-blue-900/20"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
                <div className="text-center mt-4 flex items-center justify-center gap-4 text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3"/> Consulta Inicial Gratuita</span>
                    <span className="w-1 h-1 bg-neutral-800 rounded-full" />
                    <span className="flex items-center gap-1"><Scale className="w-3 h-3"/> Asignación de Perito</span>
                </div>
            </footer>
        </div>
    );
}
