"use client";


import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    Send,
    ShieldAlert,
    Scale,
    Landmark,
    Briefcase,
    Users,
    Gavel,
    Plane,
    Building,
    Lightbulb,
    Home as HomeIcon,
    Bitcoin,
    FileDown,
    Globe,
    Paperclip,
    X,
    Loader2,
    PieChart,
    BarChart3,
    Network,
    TrendingUp,
    Workflow
} from "lucide-react";
import { generatePDF, generateFullHistoryPDF } from "@/lib/pdf";
import { motion } from "framer-motion";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useLanguage } from "@/context/LanguageContext";
import { useChat } from "ai/react";
import { UserMenu } from "@/components/user-menu";

import { agentExamples } from "@/lib/agents-data";

function ChatContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const agentId = params.id as string;

    const [showLeaveDialog, setShowLeaveDialog] = useState(false);

    const { user } = useUser();
    const { language, t } = useLanguage();
    const router = useRouter();

    const [attachment, setAttachment] = useState<{name: string, text?: string, type: string, url?: string} | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { messages, input, handleInputChange, handleSubmit, append, error, isLoading, setInput } = useChat({
        body: { agentId, language },
        onResponse: (response) => {
            if (response.ok && user) {
                user.reload();
            }
        },
        initialMessages: [
            {
                id: "initial",
                role: "assistant",
                content: t("chat.initial")
            }
        ]
    });

    // Effect to set initial input from query param
    useEffect(() => {
        if (initialQuery && setInput) {
            setInput(initialQuery);
        }
    }, [initialQuery, setInput]);

    const getAgentExamples = (id: string) => {
        const langExamples = agentExamples[language] || agentExamples["es"];
        return (langExamples[id] || []).slice(0, 9);
    };

    const agentConfig: Record<string, any> = {
        "asesor-fiscal": {
            title: "LexTributo", icon: <Landmark />, color: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
            hint: language === "es" ? "💡 Tip: Indica tu país de residencia fiscal y si eres particular, autónomo o empresa." : "💡 Tip: State your country of tax residence and whether you are an individual, freelancer or company.",
            examples: getAgentExamples("asesor-fiscal")
        },
        "asesor-mercantil": {
            title: "CorpLex", icon: <Briefcase />, color: "text-blue-400 bg-blue-400/10 border-blue-500/20",
            hint: language === "es" ? "💡 Tip: Indica tu país y qué tipo de sociedad tienes (SL, SA, Autónomo...)." : "💡 Tip: State your country and what type of company you have (LLC, Corp, Freelancer...).",
            examples: getAgentExamples("asesor-mercantil")
        },
        "asesor-laboral": {
            title: "Laboris", icon: <Users />, color: "text-orange-400 bg-orange-400/10 border-orange-500/20",
            hint: language === "es" ? "💡 Tip: Indica tu país, si eres trabajador/empresa y qué tipo de contrato tienes." : "💡 Tip: State your country, whether you are an employee/employer and your contract type.",
            examples: getAgentExamples("asesor-laboral")
        },
        "asesor-penal": {
            title: "PenalShield", icon: <Gavel />, color: "text-red-400 bg-red-400/10 border-red-500/20",
            hint: language === "es" ? "💡 Tip: Indica tu país y si eres el acusado, víctima o representante legal." : "💡 Tip: State your country and if you are the accused, victim or legal representative.",
            examples: getAgentExamples("asesor-penal")
        },
        "asesor-aeronautico": {
            title: "AeroLex", icon: <Plane />, color: "text-sky-400 bg-sky-400/10 border-sky-500/20",
            hint: language === "es" ? "💡 Tip: Indica los países de origen y destino del vuelo comercial, o las especificaciones si deseas comprar/fletar un Jet Privado." : "💡 Tip: State the origin and destination countries of your flight, or specs if you wish to buy/charter a Private Jet.",
            examples: getAgentExamples("asesor-aeronautico")
        },
        "asesor-civil": {
            title: "Civilitas", icon: <Building />, color: "text-indigo-400 bg-indigo-400/10 border-indigo-500/20",
            hint: language === "es" ? "💡 Tip: Indica tu país/región, ya que el derecho civil y de familia cambia mucho por territorio." : "💡 Tip: State your country/region, as civil and family law vary significantly by territory.",
            examples: getAgentExamples("asesor-civil")
        },
        "asesor-pi": {
            title: "IPGuard", icon: <Lightbulb />, color: "text-yellow-400 bg-yellow-400/10 border-yellow-500/20",
            hint: language === "es" ? "💡 Tip: Indica en qué país o ámbito territorial (ej. Europa) quieres proteger tu marca o creación." : "💡 Tip: State the country or territory (e.g. Europe) where you want to protect your trademark or creation.",
            examples: getAgentExamples("asesor-pi")
        },
        "asesor-inmobiliario": {
            title: "EstateLex", icon: <HomeIcon />, color: "text-purple-400 bg-purple-400/10 border-purple-500/20",
            hint: language === "es" ? "💡 Tip: Indica país/ciudad, y si eres propietario, inquilino o comprador." : "💡 Tip: State country/city, and whether you are an owner, tenant or buyer.",
            examples: getAgentExamples("asesor-inmobiliario")
        },
        "asesor-cripto": {
            title: "CryptoLex", icon: <Bitcoin />, color: "text-amber-400 bg-amber-400/10 border-amber-500/20",
            hint: language === "es" ? "💡 Tip: Indica tu país de residencia fiscal actual y el volumen aproximado de la operación." : "💡 Tip: State your current tax residence country and the approximate volume of the operation.",
            examples: getAgentExamples("asesor-cripto")
        },
        "asesor-extranjeria": {
            title: "GlobalVisa", icon: <Globe />, color: "text-cyan-400 bg-cyan-400/10 border-cyan-500/20",
            hint: language === "es" ? "💡 Tip: Indica siempre tu pasaporte/nacionalidad de origen y el país exacto al que planeas mudarte o residir." : "💡 Tip: Always state your origin passport/nationality and the exact country you plan to move to.",
            examples: getAgentExamples("asesor-extranjeria")
        }
    };

    const agent = agentConfig[agentId] || { title: "Asesor Legal", icon: <Scale />, color: "text-neutral-400 bg-neutral-800 border-neutral-700", examples: ["¿En qué me puedes ayudar?"] };

    const handleExampleClick = (example: string) => {
        append({ role: "user", content: example });
    };

    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.id !== 'initial');
    let confidenceState = {
        label: t("chat.risk.pend"),
        colorCSS: "text-yellow-500/90 bg-yellow-500/10 border-yellow-500/20"
    };

    if (lastAssistantMsg) {
        if (lastAssistantMsg.content.includes("[BANDERA: VERDE]")) {
            confidenceState = { label: t("chat.risk.green"), colorCSS: "text-emerald-500/90 bg-emerald-500/10 border-emerald-500/20" };
        } else if (lastAssistantMsg.content.includes("[BANDERA: AMARILLO]")) {
            confidenceState = { label: t("chat.risk.yellow"), colorCSS: "text-amber-500/90 bg-amber-500/10 border-amber-500/20" };
        } else if (lastAssistantMsg.content.includes("[BANDERA: ROJO]")) {
            confidenceState = { label: t("chat.risk.red"), colorCSS: "text-red-500/90 bg-red-500/10 border-red-500/20" };
        }
    }

    const formatMessageContent = (content: string) => {
        const flagMatch = content.match(/\[BANDERA:\s*(VERDE|AMARILLO|ROJO)\]([\s\S]*)/);

        if (!flagMatch) {
            return formatMessageText(content);
        }

        const textBefore = content.substring(0, flagMatch.index).trim();
        const flagType = flagMatch[1] as "VERDE" | "AMARILLO" | "ROJO";
        const explanation = flagMatch[2].replace(/^[\s-]*([^\s][\s\S]*)/, '$1').trim();

        let styles = "";
        let title = "";

        if (flagType === "VERDE") {
            styles = "bg-emerald-500/10 border-emerald-500/20 text-emerald-300";
            title = "Nivel Seguro / Viabilidad";
        } else if (flagType === "AMARILLO") {
            styles = "bg-amber-500/10 border-amber-500/20 text-amber-300";
            title = "Atención / Prudencia";
        } else {
            styles = "bg-red-500/10 border-red-500/20 text-red-300";
            title = "Riesgo Alto / Peligro";
        }

        return (
            <div className="flex flex-col gap-4">
                <div className="whitespace-pre-wrap">{formatMessageText(textBefore)}</div>
                <div className={`mt-2 p-4 rounded-xl border ${styles}`}>
                    <div className="font-bold flex items-center gap-2 mb-2">
                        <ShieldAlert className="w-4 h-4" />
                        {t("chat.risk.eval")} {title}
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{formatMessageText(explanation)}</div>
                </div>
            </div>
        );
    };

    const renderGraphic = (jsonStr: string) => {
        try {
            const data = JSON.parse(jsonStr);
            console.log("Rendering graphic:", data);

            return (
                <div className="mt-4 p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl overflow-hidden">
                    <div className="flex items-center gap-2 mb-6 border-b border-neutral-800 pb-3">
                        {data.tipo === 'barras' && <BarChart3 className="w-5 h-5 text-blue-400" />}
                        {data.tipo === 'tarta' && <PieChart className="w-5 h-5 text-purple-400" />}
                        {data.tipo === 'lineas' && <TrendingUp className="w-5 h-5 text-emerald-400" />}
                        {data.tipo === 'arbol_decision' && <Workflow className="w-5 h-5 text-amber-400" />}
                        {data.tipo === 'estructura_societaria' && <Network className="w-5 h-5 text-indigo-400" />}
                        <h4 className="font-bold text-neutral-200">{data.titulo}</h4>
                    </div>

                    {(data.tipo === 'barras' || data.tipo === 'tarta' || data.tipo === 'lineas') && (
                        <div className="flex flex-col gap-4">
                            {data.datos.map((item: any, idx: number) => {
                                const maxVal = Math.max(...data.datos.map((d: any) => d.valor || 0));
                                const percentage = maxVal > 0 ? ((item.valor || 0) / maxVal) * 100 : 0;
                                return (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-medium text-neutral-400">
                                            <span>{item.etiqueta}</span>
                                            <span className="text-neutral-200">{item.valor}</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: item.color || '#3b82f6' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {(data.tipo === 'estructura_societaria' || data.tipo === 'arbol_decision') && (
                        <div className="flex flex-col gap-6 items-center">
                            {data.datos.filter((node: any) => {
                                // Solo renderizamos como nodos raíz aquellos que NO son hijos de ningún otro nodo
                                const isChildOfOther = data.datos.some((other: any) => 
                                    other.children && other.children.includes(node.etiqueta)
                                );
                                return !isChildOfOther;
                            }).map((item: any, idx: number) => (
                                <div key={idx} className="w-full flex flex-col items-center">
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm font-bold text-white shadow-lg mb-4"
                                    >
                                        {item.etiqueta}
                                    </motion.div>
                                    
                                    {item.children && item.children.length > 0 && (
                                        <div className="w-full relative pt-4">
                                            {/* Connector line */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-neutral-700" />
                                            {/* Horizontal connector */}
                                            {item.children.length > 1 && (
                                                 <div className="absolute top-4 left-[25%] right-[25%] h-0.5 bg-neutral-700" />
                                            )}
                                            
                                            <div className="flex justify-around gap-2 pt-4">
                                                {item.children.map((child: string, cidx: number) => (
                                                    <div key={cidx} className="flex flex-col items-center relative">
                                                        <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-0.5 h-4 bg-neutral-700" />
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.2 + (cidx * 0.1) }}
                                                            className="px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-xs text-neutral-300"
                                                        >
                                                            {child}
                                                        </motion.div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        } catch (e) {
            return <div className="text-red-400 text-xs">Error visualizando datos</div>;
        }
    };

    const formatMessageText = (content: string) => {
        // Buscamos cualquier bloque que esté dentro de <visual_graph>...</visual_graph> o el formato antiguo
        const graphRegex = /<(?:visual_graph|visual_data)>([\s\S]*?)<\/(?:visual_graph|visual_data)>/g;
        
        if (content.match(graphRegex)) {
            const parts: React.ReactNode[] = [];
            let lastIndex = 0;
            let match;

            while ((match = graphRegex.exec(content)) !== null) {
                // Añadimos el texto antes del gráfico
                if (match.index > lastIndex) {
                    parts.push(
                        <div key={`text-${lastIndex}`} className="whitespace-pre-wrap">
                            {content.substring(lastIndex, match.index)}
                        </div>
                    );
                }

                // Añadimos el gráfico
                parts.push(<div key={`graph-${match.index}`}>{renderGraphic(match[1])}</div>);
                lastIndex = graphRegex.lastIndex;
            }

            // Añadimos el texto final si queda
            if (lastIndex < content.length) {
                parts.push(
                    <div key={`text-${lastIndex}`} className="whitespace-pre-wrap">
                        {content.substring(lastIndex)}
                    </div>
                );
            }

            return <div className="flex flex-col gap-2">{parts}</div>;
        }

        // Fallback para el formato de etiqueta antiguo si aún lo usa
        if (content.includes("GRÁFICO_GENERADO:")) {
            const parts = content.split(/GRÁFICO_GENERADO:\s*({[\s\S]*?})/);
            return (
                <div className="flex flex-col gap-2">
                    {parts.map((part, i) => {
                        if (part.startsWith("{") && (part.includes('"tipo"') || part.includes('"titulo"'))) {
                            return <div key={i}>{renderGraphic(part)}</div>;
                        }
                        return <div key={i} className="whitespace-pre-wrap">{part}</div>;
                    })}
                </div>
            );
        }

        return <div className="whitespace-pre-wrap">{content}</div>;
    };

    const handleBack = () => {
        if (messages.length > 2) {
            const confirmDownload = window.confirm("¿Deseas descargar un PDF con todo tu expediente y asesoría antes de salir?");
            if (confirmDownload) {
                generateFullHistoryPDF(messages, agent.title);
            }
        }
        router.push("/");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;

        if(file.size > 5 * 1024 * 1024) {
            alert(t("chat.upload.limit"));
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if(res.ok) {
                if(data.type === "image") {
                    setAttachment({ name: data.name, url: data.url, type: "image" });
                } else {
                    setAttachment({ name: data.name, text: data.text, type: data.type });
                }
            } else {
                alert(t("chat.upload.error") + data.error);
            }
        } catch(err) {
            alert(t("chat.error.conn"));
        } finally {
            setIsUploading(false);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input?.trim() && !attachment) return;

        const attachmentsToSubmit = [];
        let finalContent = input || "";

        if (attachment) {
            if (attachment.type === "image" && attachment.url) {
                attachmentsToSubmit.push({
                    name: attachment.name,
                    contentType: "image/jpeg", // Basic assumption
                    url: attachment.url
                });
            } else if (attachment.text) {
                finalContent = `${finalContent}\n\n[DOCUMENTO ADJUNTO: ${attachment.name}]\n${attachment.text}`;
            }
        }

        append({ 
            role: "user", 
            content: finalContent,
            experimental_attachments: (attachmentsToSubmit.length > 0 ? attachmentsToSubmit : undefined) as any
        });
        
        // Reset state
        handleInputChange({ target: { value: '' } } as any);
        setAttachment(null);
    };

    const userMessageCount = messages.filter(m => m.role === "user").length;
    const isSessionLimitReached = userMessageCount >= 15;

    return (
        <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100 font-sans">

            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleBack}
                        className="p-2 -ml-2 rounded-full hover:bg-neutral-900 transition-colors text-neutral-400 hover:text-white" 
                        title={t("chat.back")}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="hidden sm:flex items-center gap-2 mr-4 border-r border-neutral-800 pr-4">
                        <img src="/logo.png" alt="LexIA" className="w-8 h-8 rounded-md shadow-[0_0_10px_rgba(59,130,246,0.2)]" />
                        <span className="font-bold text-sm text-neutral-300">Lex<span className="text-blue-500">IA</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${agent.color}`}>
                            {agent.icon}
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight">{agent.title}</h1>
                            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {t("chat.online")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Top Right section: Risk disclaimer & User menu */}
                <div className="flex items-center gap-4">
                    <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${confidenceState.colorCSS}`}>
                        <ShieldAlert className="w-4 h-4" />
                        {confidenceState.label}
                    </div>
                    <UserMenu />
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <div className="max-w-3xl mx-auto flex flex-col gap-6">

                    {/* Legal Warning Box */}
                    <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 text-sm text-neutral-400 leading-relaxed text-center">
                        {t("chat.disclaimer")}
                    </div>

                    {messages.map((msg, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={i}
                            className={`flex gap-4 ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                        >
                            {msg.role === "assistant" && (
                                <div className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center ${agent.color}`}>
                                    <Scale className="w-4 h-4" />
                                </div>
                            )}

                            <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] leading-relaxed ${msg.role === "assistant"
                                ? "bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-sm"
                                : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm"
                                }`}>
                                {msg.role === "assistant" ? formatMessageContent(msg.content) : <div className="whitespace-pre-wrap">{msg.content}</div>}
                                {msg.role === "assistant" && msg.content.length > 50 && (
                                    <div className="mt-3 pt-3 border-t border-neutral-800 flex justify-end">
                                        <button
                                            onClick={() => {
                                                const userMsg = i > 0 && messages[i - 1].role === "user" ? messages[i - 1].content : undefined;
                                                generatePDF(msg.content, agent.title, userMsg);
                                            }}
                                            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors py-1 px-2 rounded-md hover:bg-neutral-800"
                                            title={t("chat.pdf.title")}
                                        >
                                            <FileDown className="w-4 h-4" />
                                            Descargar PDF
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {messages.length === 1 && agent.examples && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6 flex flex-col gap-3"
                        >
                            <p className="text-sm text-neutral-500 px-2 font-medium">{t("chat.examples")}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {agent.examples.map((example: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleExampleClick(example)}
                                        className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-800 hover:border-neutral-700 hover:shadow-lg transition-all text-sm text-neutral-300 text-left"
                                    >
                                        &quot;{example}&quot;
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                    {/* Error State Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 justify-start"
                        >
                            <div className="shrink-0 w-8 h-8 rounded-lg border border-red-500/20 bg-red-500/10 flex items-center justify-center text-red-500">
                                <ShieldAlert className="w-4 h-4" />
                            </div>
                            <div className="px-5 py-3.5 rounded-2xl max-w-[85%] leading-relaxed bg-red-500/10 border border-red-500/20 text-red-200 rounded-tl-sm">
                                <p className="font-semibold text-sm mb-1">
                                    {error.message.includes("403") || error.message.includes("limit")
                                        ? t("chat.error.limit")
                                        : error.message.includes("402") || error.message.includes("credits")
                                        ? t("chat.error.empty")
                                        : t("chat.error.conn")}
                                </p>
                                <p className="text-sm">
                                    {error.message.includes("403") || error.message.includes("limit")
                                        ? t("chat.error.limit.desc")
                                        : error.message.includes("402") || error.message.includes("credits")
                                        ? t("chat.error.empty.desc")
                                        : error.message.includes("quota") || error.message.includes("429")
                                            ? t("chat.error.quota")
                                            : t("chat.error.unknown") + error.message}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Loading indicator */}
                    {isLoading && messages[messages.length - 1].role === "user" && !error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4 justify-start"
                        >
                            <div className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center ${agent.color}`}>
                                <Scale className="w-4 h-4" />
                            </div>
                            <div className="px-5 py-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-tl-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Input Area */}
            <footer className="p-6 border-t border-neutral-900 bg-neutral-950/80 backdrop-blur-md">
                {agent.hint && (
                    <div className="max-w-3xl mx-auto mb-3">
                        <p className="text-sm font-medium text-blue-400/90">{agent.hint}</p>
                    </div>
                )}
                <form onSubmit={submitForm} className="max-w-3xl mx-auto relative group flex flex-col gap-2">
                    {attachment && (
                        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3 py-2 rounded-lg text-sm w-fit">
                            <Paperclip className="w-4 h-4" />
                            <span className="font-medium truncate max-w-[200px]">{attachment.name}</span>
                            <button type="button" onClick={() => setAttachment(null)} className="ml-2 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <div className="relative">
                        <textarea
                            value={input || ""}
                            onChange={handleInputChange}
                            disabled={isSessionLimitReached}
                            placeholder={`${t("chat.input.placeholder")}${agent.title}...`}
                            rows={3}
                            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-3xl pl-12 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-sm placeholder:text-neutral-600 resize-none disabled:opacity-50"
                        />
                        
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".pdf,.txt,.jpg,.jpeg,.png"
                            disabled={isSessionLimitReached}
                            className="hidden" 
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading || !!attachment || isSessionLimitReached}
                            className="absolute left-3 bottom-3 w-10 h-10 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-blue-400 transition-all disabled:opacity-50"
                            title={t("chat.upload.title")}
                        >
                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Paperclip className="w-5 h-5" />}
                        </button>

                        <button
                            type="submit"
                            disabled={isSessionLimitReached || (!input?.trim() && !attachment) || isUploading}
                            className="absolute right-3 bottom-3 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-600 flex items-center justify-center text-white transition-all shadow-md shadow-blue-900/20"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                </form>
                
                <div className="flex justify-center mt-3">
                    <div className="text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 py-1 px-3 rounded-full flex items-center gap-2">
                        <span>Consultas realizadas en esta sesión sin coste extra:</span>
                        <span className="font-bold">{userMessageCount} / 15</span>
                    </div>
                </div>

                <div className="text-center mt-3 text-xs text-neutral-500">
                    {t("chat.warning")}
                </div>
                <div className="text-center mt-2 text-xs text-neutral-600">
                    {t("chat.footer")}
                </div>
            </footer>

            {/* Leave Dialog */}
            {showLeaveDialog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
                        <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileDown className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Has finalizado tu consulta</h3>
                        <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                            Antes de abandonar el asesor, te recomendamos guardar una copia en PDF con todas las respuestas y consejos que has recibido en esta sesión.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => {
                                    const chatContent = messages.filter(m => m.id !== 'initial').map(m => `**${m.role === 'user' ? 'Tú' : agent.title}**:\n${m.content}`).join('\n\n---\n\n');
                                    generatePDF(chatContent, `${agent.title} - Historial Completo`);
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <FileDown className="w-5 h-5"/>
                                Descargar Historial PDF
                            </button>
                            <button 
                                onClick={() => router.push('/')}
                                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl py-3 font-medium transition-colors"
                            >
                                Salir sin descargar
                            </button>
                            <button 
                                onClick={() => setShowLeaveDialog(false)}
                                className="w-full text-neutral-500 hover:text-white rounded-xl py-2 font-medium transition-colors text-sm mt-1"
                            >
                                Cancelar y volver al chat
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen bg-neutral-950 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
