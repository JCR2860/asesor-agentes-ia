"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { X, Send, Bot, AlertCircle, RotateCcw } from "lucide-react";
import { useChat } from "ai/react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/context/LanguageContext";

// Respuesta de error del servidor: { code, message, retryAfterSec }
function describeError(err: Error | undefined, es: boolean): { text: string; canRetry: boolean } | null {
    if (!err) return null;
    let data: { code?: string; message?: string; retryAfterSec?: number } = {};
    try { data = JSON.parse(err.message); } catch { /* texto plano */ }
    const minutes = Math.max(1, Math.ceil((data.retryAfterSec || 60) / 60));
    switch (data.code) {
        case "rate_limited":
            return { canRetry: false, text: es ? `Ha alcanzado el límite de mensajes del soporte. Podrá volver a escribir en ${minutes} min.` : `You have reached the support message limit. You can write again in ${minutes} min.` };
        case "busy":
            return { canRetry: false, text: es ? "El soporte para visitantes está muy solicitado ahora mismo. Inicie sesión o inténtelo más tarde." : "Visitor support is very busy right now. Please sign in or try again later." };
        case "maintenance":
            return { canRetry: false, text: es ? "El soporte técnico está en mantenimiento por una actualización. Estaremos disponibles pronto." : "Support is under maintenance for an update. We will be back soon." };
        default:
            return { canRetry: true, text: es ? "No se pudo conectar con el soporte. Compruebe su conexión e inténtelo de nuevo." : "Could not reach support. Check your connection and try again." };
    }
}

export function SupportBubble() {
    const pathname = usePathname();
    const { language } = useLanguage();
    const es = language === "es";
    const { isSignedIn } = useUser();
    const [isOpen, setIsOpen] = useState(false);

    const initialMessages = useMemo(() => [
        {
            id: "welcome",
            role: "assistant" as const,
            content: es
                ? "Hola. Soy el **Soporte Técnico de LexIA**. Le ayudo con el funcionamiento de la plataforma, las consultas, los créditos y la privacidad."
                : "Hello. I am **LexIA Technical Support**. I can help you with how the platform works, queries, credits and privacy.",
        },
    ], [es]);

    const { messages, input, handleInputChange, handleSubmit, isLoading, error, append, reload } = useChat({
        api: "/api/support-chat",
        initialMessages,
    });

    // Preguntas frecuentes (se muestran al abrir, antes de escribir nada)
    const faqs = es
        ? [
            ...(isSignedIn ? ["¿Cuántos créditos me quedan?"] : ["¿Cómo funciona LexIA?"]),
            "¿Cómo compro créditos?",
            "¿Qué diferencia hay entre un asesor y la Directora?",
            "¿Se guardan mis consultas?",
            "¿Cómo descargo el dictamen en PDF?",
        ]
        : [
            ...(isSignedIn ? ["How many credits do I have left?"] : ["How does LexIA work?"]),
            "How do I buy credits?",
            "What is the difference between an advisor and the Director?",
            "Are my queries stored?",
            "How do I download the opinion as PDF?",
        ];

    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, error, isLoading]);

    // Oculto dentro de las consultas para no tapar el chat
    if (pathname?.startsWith("/chat")) return null;

    const problem = describeError(error, es);
    const showFaqs = messages.length === 1 && !isLoading && !error;

    return (
        <>
            {/* Botón */}
            <button
                onClick={() => setIsOpen(true)}
                className={`group fixed bottom-6 right-6 px-5 py-3.5 bg-gold-600 hover:bg-gold-700 text-white rounded-full flex items-center gap-3 shadow-2xl shadow-gold-500/40 transition-all hover:scale-105 z-40 origin-bottom-right ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
            >
                <Bot className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-medium text-sm hidden sm:inline-block">{es ? "Hola, soy el Soporte Técnico" : "Hi, I am Tech Support"}</span>
                <span className="font-medium text-sm sm:hidden">{es ? "Soporte LexIA" : "LexIA Support"}</span>
            </button>

            {/* Ventana */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[370px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-6rem)] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5">
                    <div className="bg-gold-600 px-4 py-3 flex items-center justify-between shadow-md shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"><Bot className="w-5 h-5" /></div>
                            <div>
                                <h3 className="text-white font-bold text-sm leading-tight">{es ? "Soporte LexIA" : "LexIA Support"}</h3>
                                <p className="text-gold-100 text-xs">{es ? "Asistente técnico · responde al momento" : "Technical assistant · instant replies"}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gold-100 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10" aria-label={es ? "Cerrar" : "Close"}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                {m.role === "assistant" && (
                                    <div className="w-6 h-6 rounded-full bg-gold-600 flex items-center justify-center shrink-0 mt-1"><Bot className="w-3.5 h-3.5 text-white" /></div>
                                )}
                                <div className={`px-4 py-2.5 text-[13px] rounded-2xl max-w-[85%] leading-relaxed ${m.role === "user"
                                    ? "bg-gold-600 text-white rounded-tr-sm whitespace-pre-wrap"
                                    : "bg-neutral-800 text-neutral-200 rounded-tl-sm border border-neutral-700/50"}`}>
                                    {m.role === "user" ? m.content : (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ node, ...p }) => <p className="mb-2 last:mb-0" {...p} />,
                                                strong: ({ node, ...p }) => <strong className="font-semibold text-white" {...p} />,
                                                ul: ({ node, ...p }) => <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-1 marker:text-gold-500" {...p} />,
                                                ol: ({ node, ...p }) => <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-1 marker:text-gold-500" {...p} />,
                                                a: ({ node, ...p }) => <a className="text-gold-400 underline underline-offset-2 break-words" target="_blank" rel="noopener noreferrer" {...p} />,
                                                h1: ({ node, ...p }) => <p className="font-semibold text-white mb-1" {...p} />,
                                                h2: ({ node, ...p }) => <p className="font-semibold text-white mb-1" {...p} />,
                                                h3: ({ node, ...p }) => <p className="font-semibold text-white mb-1" {...p} />,
                                                code: ({ node, ...p }) => <code className="px-1 rounded bg-neutral-900 text-gold-200 text-[12px]" {...p} />,
                                            }}
                                        >
                                            {m.content}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        ))}

                        {showFaqs && (
                            <div className="pl-9 flex flex-col items-start gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{es ? "Preguntas frecuentes" : "Frequent questions"}</span>
                                {faqs.map((q) => (
                                    <button key={q} onClick={() => append({ role: "user", content: q })}
                                        className="text-left text-[12.5px] px-3 py-1.5 rounded-xl border border-gold-500/30 bg-gold-500/[0.06] text-gold-200 hover:bg-gold-500/15 transition-colors">
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isLoading && messages[messages.length - 1]?.role === "user" && (
                            <div className="flex gap-3 justify-start">
                                <div className="w-6 h-6 rounded-full bg-gold-600 flex items-center justify-center shrink-0 mt-1"><Bot className="w-3.5 h-3.5 text-white" /></div>
                                <div className="px-4 py-3 text-sm rounded-2xl bg-neutral-800 text-neutral-400 rounded-tl-sm border border-neutral-700/50 flex space-x-1.5 items-center">
                                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}

                        {problem && !isLoading && (
                            <div className="flex gap-2.5 items-start rounded-xl border border-amber-500/30 bg-amber-500/[0.08] px-3 py-2.5 text-[12.5px] text-amber-200 leading-relaxed">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                                <div className="flex-1">
                                    {problem.text}
                                    {problem.canRetry && (
                                        <button onClick={() => reload()} className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-100">
                                            <RotateCcw className="w-3.5 h-3.5" />{es ? "Reintentar" : "Retry"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="p-3 bg-neutral-950 border-t border-neutral-800 flex gap-2 shrink-0 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            maxLength={1000}
                            placeholder={es ? "Escriba su duda sobre la plataforma..." : "Type your question about the platform..."}
                            className="flex-1 bg-neutral-900 border border-neutral-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-gold-500 disabled:opacity-50 transition-colors"
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}
                            className="bg-gold-600 hover:bg-gold-700 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 shrink-0 shadow-sm"
                            aria-label={es ? "Enviar" : "Send"}>
                            <Send className="w-4 h-4 ml-[-2px]" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
