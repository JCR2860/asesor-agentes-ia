"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useChat } from "ai/react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export function SupportBubble() {
    const pathname = usePathname();
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/support-chat",
        initialMessages: [
            {
                id: 'welcome',
                role: 'assistant',
                content: language === 'es' 
                    ? 'Hola. Soy Soporte Técnico LexIA. Estoy aquí para ayudarte ante cualquier duda que tengas sobre el funcionamiento de la plataforma, la gestión de consultas o los tokens.' 
                    : 'Hello. I am LexIA Technical Support. I am here to help you with any questions you have about the platform, query management, or tokens.'
            }
        ]
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Hide support bubble inside chat windows to avoid overlapping chat UI
    if (pathname?.startsWith('/chat')) {
        return null;
    }

    return (
        <>
            {/* Bubble Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`group fixed bottom-6 right-6 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center gap-3 shadow-2xl shadow-blue-500/40 transition-all hover:scale-105 z-40 origin-bottom-right ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <Bot className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-medium text-sm hidden sm:inline-block">{language === 'es' ? 'Hola, soy el Soporte Técnico' : 'Hi, I am Tech Support'}</span>
                <span className="font-medium text-sm sm:hidden">{language === 'es' ? 'Soporte LexIA' : 'LexIA Support'}</span>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 flex animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-blue-600 px-4 py-3 flex items-center justify-between shadow-md shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm leading-tight">{language === 'es' ? 'Soporte LexIA' : 'LexIA Support'}</h3>
                                <p className="text-blue-100 text-xs">{language === 'es' ? 'Agente Técnico' : 'Technical Agent'}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950">
                        {/* Initial message populates automatically, no need for static fallback */}
                        {messages.map(m => (
                            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {m.role === 'assistant' && (
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1">
                                        <Bot className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                                <div className={`px-4 py-2 text-[13px] rounded-2xl max-w-[85%] ${
                                    m.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                                        : 'bg-neutral-800 text-neutral-200 rounded-tl-sm border border-neutral-700/50 leading-relaxed'
                                }`}>
                                    <span className="whitespace-pre-wrap">{m.content}</span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 justify-start">
                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1">
                                    <Bot className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="px-4 py-3 text-sm rounded-2xl bg-neutral-800 text-neutral-400 rounded-tl-sm border border-neutral-700/50 flex space-x-1.5 items-center">
                                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-3 bg-neutral-950 border-t border-neutral-800 flex gap-2 shrink-0 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            placeholder={language === 'es' ? "Tengo un problema con..." : "I have an issue with..."}
                            className="flex-1 bg-neutral-900 border border-neutral-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-600 hover:bg-blue-500 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 shrink-0 shadow-sm"
                        >
                            <Send className="w-4 h-4 ml-[-2px]" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
