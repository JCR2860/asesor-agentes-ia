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
    Lock as LockIcon,
    Paperclip,
    X,
    Loader2,
    PieChart,
    BarChart3,
    Network,
    TrendingUp,
    Workflow,
    Sparkles,
    ArrowRight,
    Mic,
    MicOff,
    HelpCircle,
    ChevronRight,
    MessageSquareText,
    FileText,
    ShieldCheck
} from "lucide-react";
import { generatePDF, generateFullHistoryPDF, generateElitePDF, generateModernReport } from "@/lib/pdf";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
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
    const userName = searchParams.get("name") || "";
    const isFollowUp = searchParams.get("handoff") === "true";
    const initialCountry = searchParams.get("c") || "";
    const agentId = params.id as string;

    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const handleExpandAudit = () => {
        const userMsg = messages.find(m => m.role === 'user')?.content || "";
        const assistantMsg = messages.filter(m => m.role === 'assistant').pop()?.content || "";
        const handoffData = {
            agent: agent.title,
            query: userMsg,
            response: assistantMsg
        };
        localStorage.setItem('lexia_handoff', JSON.stringify(handoffData));
        router.push('/chat/asesor-direccion?handoff=true');
    };

    const { user } = useUser();
    const { language, t } = useLanguage();
    const router = useRouter();
    const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    const [attachment, setAttachment] = useState<{name: string, text?: string, type: string, url?: string} | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [micSupported, setMicSupported] = useState(true);
    const recognitionRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize with messages from sessionStorage if available to resist F5
    const getStoredMessages = () => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem(`lexia_chat_store_${agentId}`);
            if (saved) return JSON.parse(saved);
        }
        return initialQuery ? [] : [
            {
                id: "initial",
                role: "assistant",
                content: agentId === "asesor-direccion" 
                    ? (userName 
                        ? `${language === 'es' ? 'Bienvenido/a' : 'Welcome'} ${userName}. Soy la Directora Legal del despacho. ${language === 'es' ? '¿En qué puedo dirigir su estrategia legal hoy?' : 'How can I direct your legal strategy today?'}`
                        : `${language === 'es' ? 'Bienvenido/a' : 'Welcome'}. Soy la Directora Legal. ${language === 'es' ? 'Por favor, exponga su caso con detalle para coordinar a los especialistas.' : 'Please expose your case in detail to coordinate the specialists.'}`)
                    : (userName
                        ? `${language === 'es' ? 'Hola' : 'Hello'} ${userName}. ${language === 'es' ? 'Soy su especialista designado. ¿En qué puedo asistirle técnicamente hoy?' : 'I am your designated specialist. How can I assist you technically today?'}'`
                        : `${language === 'es' ? 'Hola.' : 'Hello.'} ${language === 'es' ? 'Soy su especialista designado en esta área técnica. ¿En qué puedo asistirle?' : 'I am your designated specialist in this technical area. How can I assist you?'}`)
            }
        ];
    };

    const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry);

    const { messages, input, handleInputChange, handleSubmit, append, error, isLoading, setInput, setMessages } = useChat({
        body: { agentId, language, isFollowUp, country: selectedCountry },
        onResponse: (response) => {
            if (response.ok && user) {
                user.reload();
            }
        },
        initialMessages: getStoredMessages()
    });

    // Mirror messages to sessionStorage to survive F5
    useEffect(() => {
        if (typeof window !== 'undefined' && messages.length > 0) {
            sessionStorage.setItem(`lexia_chat_store_${agentId}`, JSON.stringify(messages));
        }
    }, [messages, agentId]);

    const [hasSentInitial, setHasSentInitial] = useState(false);

    // Keep a copy of current chat in localStorage for the global "Directora" button in sidebar
    useEffect(() => {
        if (agentId !== 'asesor-direccion' && messages.length > 1) {
            const userMsg = messages.find(m => m.role === 'user')?.content || "";
            const assistantMsg = messages.filter(m => m.role === 'assistant').pop()?.content || "";
            const handoffData = {
                agent: agentConfig[agentId]?.title || "Especialista",
                query: userMsg,
                response: assistantMsg
            };
            localStorage.setItem('lexia_handoff', JSON.stringify(handoffData));
        }
    }, [messages, agentId]);

    // Update session active flag for navigation warnings
    useEffect(() => {
        if (typeof sessionStorage !== 'undefined') {
            const hasMessages = messages.filter(m => m.role === 'user').length > 0;
            sessionStorage.setItem('lexia_chat_active', hasMessages.toString());
        }
        return () => {
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.removeItem('lexia_chat_active');
            }
        };
    }, [messages]);

    // Elapsed time counter while loading
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    useEffect(() => {
        let interval: any;
        if (isLoading) {
            setElapsedSeconds(0);
            interval = setInterval(() => {
                setElapsedSeconds(s => s + 1);
            }, 1000);
        } else {
            setElapsedSeconds(0);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    // Optimized Auto-scroll logic that doesn't "fight" the user
    useEffect(() => {
        const container = document.getElementById('chat-scroll-container');
        if (container) {
            // Check if there are actual user questions
            const hasUserMessages = messages.some(m => m.role === 'user');

            if (!hasUserMessages) {
                // INITIAL STATE: Force scroll to TOP to show welcome & examples
                container.scrollTop = 0;
                return;
            }

            // ACTIVE CHAT: Follow the conversation
            if (isLoading) {
                const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 200;
                if (isNearBottom) {
                    container.scrollTop = container.scrollHeight;
                }
            } else {
                // Scroll to bottom on completion/update only if user is already watching the bottom
                const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 300;
                if (isNearBottom) {
                    container.scrollTop = container.scrollHeight;
                }
            }
        }
    }, [messages, isLoading]);

    // Track scroll position to show "Scroll to bottom" button
    const [showScrollBottom, setShowScrollBottom] = useState(false);
    useEffect(() => {
        const container = document.getElementById('chat-scroll-container');
        if (!container) return;

        const handleScroll = () => {
            const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
            setShowScrollBottom(!isAtBottom);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToBottom = () => {
        const container = document.getElementById('chat-scroll-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };

    // Block back button and page refresh to prevent data loss
    useEffect(() => {
        const hasMessages = messages.filter(m => m.role === 'user').length > 0;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasMessages) {
                e.preventDefault();
                e.returnValue = ''; // Required for legacy browsers
                return '';
            }
        };

        const handlePopState = (e: PopStateEvent) => {
            if (hasMessages) {
                // Force push current state back to keep user in page
                window.history.pushState(null, '', window.location.href);
                // Show the official leave/PDF dialog
                setShowLeaveDialog(true);
            }
        };

        // Standard browser events
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Push a dummy state to history so we can catch the first "Back" intent
        if (hasMessages) {
            window.history.pushState(null, '', window.location.href);
            window.addEventListener('popstate', handlePopState);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [messages]);

    // Handle bfcache (mobile Back/Forward Cache) for strict privacy
    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                window.location.reload();
            }
        };
        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);

    // Effect to auto-submit initial query from Guide
    useEffect(() => {
        if (initialQuery && !hasSentInitial && append) {
            setHasSentInitial(true);
            
            // Auto submit
            append({
                role: "user",
                content: initialQuery
            });
            
            // Clean URL to prevent resubmitting on manual refresh
            window.history.replaceState({}, '', `/chat/${agentId}`);
        }
    }, [initialQuery, hasSentInitial, append, agentId]);

    // Initialize speech recognition
    useEffect(() => {
        // Handle Contextual Handoff
        const handoff = localStorage.getItem('lexia_handoff');
        if (handoff && agentId === 'asesor-direccion' && messages.length <= 1) {
            try {
                const data = JSON.parse(handoff);
                localStorage.removeItem('lexia_handoff'); // Clean up
                const followUpText = language === 'es'
                    ? `Vengo de consultar con el ${data.agent}.\n\n--- MI CASO ---\n${data.query}\n\n--- RESPUESTA DEL ASESOR ---\n${data.response.substring(0, 800)}...\n\nMe gustaría realizar una auditoría más profunda sobre este dictamen o aclarar algunos puntos estratégicos.`
                    : `I just consulted with the ${data.agent}.\n\n--- MY CASE ---\n${data.query}\n\n--- ADVISOR RESPONSE ---\n${data.response.substring(0, 800)}...\n\nI would like to conduct a deeper audit on this report or clarify some strategic points.`;
                
                append({ role: 'user', content: followUpText });
            } catch (e) {
                console.error("Handoff parse error", e);
            }
        }

        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            // On mobile, predictive voice engines flood interimResults causing repetition bugs
            recognitionRef.current.interimResults = !isMobile;
            recognitionRef.current.lang = language === 'es' ? 'es-ES' : 'en-US';
            recognitionRef.current._initialInput = '';

            recognitionRef.current.onresult = (event: any) => {
                let finalT = '';
                let interimT = '';
                for (let i = 0; i < event.results.length; ++i) {
                    // Mobile browsers are notorious for weird resultIndex events
                    // So we safely reconstruct the entire phrase from scratch every frame.
                    if (event.results[i].isFinal) {
                        finalT += event.results[i][0].transcript + ' ';
                    } else {
                        interimT += event.results[i][0].transcript;
                    }
                }
                
                const currentSessionText = (finalT + interimT).replace(/\s+/g, ' ').trim();
                const prefix = recognitionRef.current._initialInput;
                setInput(prefix + (prefix && currentSessionText ? ' ' : '') + currentSessionText);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            // Browser doesn't support speech recognition
            setMicSupported(false);
        }
    }, [language, setInput]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
            const msg = language === 'es' 
                ? isFirefox 
                    ? "Firefox no soporta el reconocimiento de voz. Por favor, usa Google Chrome, Microsoft Edge o Safari para usar el micrófono."
                    : "Tu navegador no soporta el reconocimiento de voz. Prueba con Google Chrome o Microsoft Edge."
                : isFirefox
                    ? "Firefox does not support voice recognition. Please use Google Chrome, Microsoft Edge or Safari to use the microphone."
                    : "Your browser does not support voice recognition. Try Google Chrome or Microsoft Edge.";
            alert(msg);
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            // Store the manual input *before* starting the mic, so we don't overwrite it
            recognitionRef.current._initialInput = input.trim();
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const getAgentExamples = (id: string) => {
        const langExamples = agentExamples[language] || agentExamples["es"];
        return (langExamples[id] || []).slice(0, 9);
    };

    const agentConfig: Record<string, any> = {
        "asesor-direccion": {
            title: language === "es" ? "Directora LexIA" : "Managing Partner", 
            icon: <Sparkles />, 
            color: "text-blue-400 bg-blue-600/10 border-blue-500/20",
            hint: language === "es" ? "💡 Tip: Expón tu caso con todo el lujo de detalles posible para que la Directora convoque a los expertos pertinentes." : "💡 Tip: Expose your case in full detail so the Director can convene the relevant experts.",
            examples: language === "es" ? [
                "Tengo una villa en España que quiero vender, pero el dinero lo quiero reinvertir en bienes raíces en Dubai usando una LLC americana. ¿Qué impuestos pago y qué problemas puedo tener?",
                "Me estoy divorciando, tenemos bienes compartidos, pero descubrí que mi cónyuge tiene medio millón en Bitcoin oculto en una billetera fría. ¿Cómo puedo reclamar mi parte legalmente?",
                "Quiero desarrollar una app de inteligencia artificial en Europa, los servidores están en EE.UU y mis clientes serán de Latinoamérica. ¿Qué leyes de protección de datos debo cumplir y bajo qué jurisdicción?",
                "Una empresa asiática incumplió un gran contrato de suministro, provocando pérdidas masivas en mi fábrica en México y España. ¿Cuál es la estrategia legal y mercantil a seguir?"
            ] : [
                "I have a villa in Spain I want to sell, but I want to reinvest the money in real estate in Dubai using a US LLC. What taxes do I pay and what issues might I face?",
                "I am getting divorced, we have shared assets, but I discovered my spouse has half a million in Bitcoin hidden in a cold wallet. How can I legally claim my share?",
                "I want to develop an AI app in Europe, servers are in the US and clients in LatAm. What data protection laws must I comply with and under what jurisdiction?",
                "An Asian supplier breached a massive supply contract, causing massive losses in my factories in Mexico and Spain. What is the legal strategy to follow?"
            ]
        },
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

    const renderMarkdown = (text: string) => (
        <ReactMarkdown 
            components={{
                p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-white bg-blue-500/10 px-1 rounded" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-5 mb-3 text-white" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-5 mb-3 text-white border-b border-neutral-700 pb-1" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-md font-bold mt-4 mb-2 text-blue-300" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
            }}
        >
            {text}
        </ReactMarkdown>
    );

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
                        <div key={`text-${lastIndex}`} className="text-neutral-300">
                            {renderMarkdown(content.substring(lastIndex, match.index))}
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
                    <div key={`text-${lastIndex}`} className="text-neutral-300">
                        {renderMarkdown(content.substring(lastIndex))}
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
                        return <div key={i} className="text-neutral-300">{renderMarkdown(part)}</div>;
                    })}
                </div>
            );
        }

        return <div className="text-neutral-300">{renderMarkdown(content)}</div>;
    };

    const handlePlayAudioGuide = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            
            const audioTexts: Record<string, any> = {
                "asesor-direccion": {
                    es: "Bienvenido a la Dirección General de LexIA. Soy su Directora Legal. Para una estrategia ganadora, detalle su caso incluyendo países involucrados, cifras y fechas clave. Analizaré su situación para convocar a los especialistas necesarios y redactar su hoja de ruta.",
                    en: "Welcome to LexIA Management. I am your Legal Director. For a winning strategy, detail your case including countries involved, figures and key dates. I will analyze your situation to convene the necessary specialists and draft your roadmap."
                },
                "asesor-fiscal": {
                    es: "Área Tributaria. Indique su residencia fiscal y si es particular o empresa. Detalle el tipo de ingreso o patrimonio. La precisión territorial es vital en fiscalidad.",
                    en: "Tax Department. State your tax residence and entity type. Detail the income or assets. Territorial precision is vital in taxation."
                },
                "asesor-mercantil": {
                    es: "Consultoría Corporativa. Detalle la estructura de su sociedad. Especifique si busca pactos de socios, ampliaciones de capital o resolución de conflictos.",
                    en: "Corporate Consulting. Detail your company structure. Specify if you seek partner agreements, capital increases or dispute resolution."
                },
                "asesor-laboral": {
                    es: "Estrategia Laboral. Indique su país, tipo de contrato y si es trabajador o empresa. Detalle el conflicto o la consulta prestacional.",
                    en: "Labor Strategy. State your country, contract type, and role. Detail the conflict or benefit inquiry."
                },
                "asesor-penal": {
                    es: "Compliance y Defensa Penal. Exponga los hechos de forma objetiva. Indique si hay procesos judiciales abiertos o citaciones pendientes.",
                    en: "Compliance and Criminal Defense. State the facts objectively. Indicate if there are open judicial processes or pending summons."
                },
                "asesor-aeronautico": {
                    es: "Derecho Aeronáutico. Si es una reclamación de vuelo, indique origen, destino y aerolínea. Para gestión de aeronaves, detalle el tipo de operación.",
                    en: "Aeronautical Law. For flight claims, state origin, destination and airline. For aircraft management, detail the operation type."
                },
                "asesor-civil": {
                    es: "Protección de Patrimonio y Familia. Indique su región para aplicar la legislación sucesoria o civil correspondiente. Detalle el vínculo familiar o contractual.",
                    en: "Family and Asset Protection. State your region to apply the relevant succession or civil law. Detail the family or contractual bond."
                },
                "asesor-pi": {
                    es: "Propiedad Intelectual. Especifique si se trata de una marca, patente o derechos de autor. Indique el ámbito territorial de protección deseado.",
                    en: "Intellectual Property. Specify if it is a trademark, patent or copyright. State the desired territorial scope of protection."
                },
                "asesor-inmobiliario": {
                    es: "Derecho Inmobiliario. Indique la ubicación del activo y su rol en la operación. Detalle si hay cargas registrales o problemas urbanísticos.",
                    en: "Real Estate Law. State the asset location and your role. Detail if there are registry charges or urban planning issues."
                },
                "asesor-cripto": {
                    es: "Estrategia Web3 y Activos Digitales. Detalle la naturaleza de sus activos, exchanges utilizados y residencia fiscal para un dictamen normativo preciso.",
                    en: "Web3 Strategy and Digital Assets. Detail the nature of your assets, exchanges used, and tax residence for a precise regulatory opinion."
                },
                "asesor-extranjeria": {
                    es: "Movilidad Global y Visados. Indique su nacionalidad actual y el país de destino. Detalle si el objetivo es residencia por inversión, trabajo o reagrupación.",
                    en: "Global Mobility and Visas. State your current nationality and destination country. Detail if the goal is residency by investment, work or reunification."
                }
            };

            const defaultText = {
                es: "Soy su especialista técnico. Para un dictamen preciso, elija una pregunta de la guía o describa su caso con todos los documentos adjuntos posibles. Estamos listos para proceder.",
                en: "I am your technical specialist. For a precise opinion, choose a question from the guide or describe your case with all possible attached documents. We are ready to proceed."
            };

            const text = audioTexts[agentId]?.[language] || defaultText[language] || defaultText.es;
            
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = language === "es" ? "es-ES" : "en-US";
            msg.rate = 1.0;
            window.speechSynthesis.speak(msg);
        } else {
            alert("No audio API supported in your browser.");
        }
    };
    const handleElitePDF = async () => {
        try {
            setIsGeneratingPDF(true); 
            
            // Generar el PDF directamente desde los datos (más fiable que captura pantalla)
            await generateElitePDF(messages, agent.title, language);

            setIsGeneratingPDF(false); 
            setShowLeaveDialog(false);
            
            // Redirect after a short delay, clearing state securely
            setTimeout(() => {
                setMessages([]);
                router.push('/');
            }, 500);
        } catch (err: any) {
            console.error("Elite PDF Gen failed", err);
            setIsGeneratingPDF(false);
            alert("Hubo un error al generar el PDF: " + err.message);
        }
    };

    const handleBack = () => {
        if (messages.length > 1) {
            setShowLeaveDialog(true);
        } else {
            // Full nuclear clear on exit
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem(`lexia_chat_store_${agentId}`);
                sessionStorage.removeItem('lexia_chat_active');
            }
            setMessages([]);
            router.push("/");
        }
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
        <div className="flex flex-col h-[100dvh] overflow-hidden bg-neutral-950 text-neutral-100 font-sans relative">

            {/* Top Navigation Bar */}
            <header className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-neutral-950 z-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 group">
                        <button 
                            onClick={handleBack}
                            className="p-2 -ml-2 rounded-full hover:bg-neutral-900 transition-colors text-neutral-400 hover:text-white flex items-center gap-2" 
                            title={t("chat.back")}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            {messages.length > 1 && (
                                <span className="text-[10px] font-black uppercase tracking-tighter bg-blue-600 text-white px-2 py-0.5 rounded-full animate-pulse whitespace-nowrap">
                                    {language === 'es' ? 'Finalizar y PDF' : 'End & PDF'}
                                </span>
                            )}
                        </button>
                    </div>
                    <div className="hidden sm:flex flex-col justify-center mr-4 border-r border-neutral-800 pr-4">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="LexIA" className="w-7 h-7 rounded-md shadow-[0_0_10px_rgba(59,130,246,0.2)]" />
                            <span className="font-bold text-sm text-neutral-300">Lex<span className="text-blue-500">IA</span></span>
                        </div>
                        <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest text-center mt-1">GPT-5.5 Powered</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${agent.color}`}>
                            {agent.icon}
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight">{agent.title}</h1>
                            <span className="relative flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                                    {/* Mic Ripple Animation */}
                                    {isListening && (
                                        <>
                                            <motion.div 
                                                initial={{ scale: 0.8, opacity: 0.5 }}
                                                animate={{ scale: 1.5, opacity: 0 }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                className="absolute inset-0 bg-blue-500 rounded-full -z-10"
                                            />
                                            <motion.div 
                                                initial={{ scale: 0.8, opacity: 0.5 }}
                                                animate={{ scale: 2, opacity: 0 }}
                                                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                                                className="absolute inset-0 bg-blue-400/30 rounded-full -z-10"
                                            />
                                        </>
                                    )}
                                    <Mic className={`w-5 h-5 ${isListening ? 'text-white animate-pulse' : 'text-blue-400'}`} />
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

            {/* Chat Area - IMPORTANT: scroll-smooth removed to prevent scroll blocking/lag */}
            <main id="chat-scroll-container" className="flex-1 overflow-y-auto p-2 sm:p-6 pb-2 w-full overscroll-contain">

                <div id="pdf-download-area" className="max-w-3xl mx-auto flex flex-col gap-6 p-4 rounded-xl">
                    
                    {/* Report Header (Only visible on print) */}
                    <div id="report-header" className="hidden flex-row justify-between items-start border-b-2 border-blue-600 pb-6 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <img src="/logo.png" alt="LexIA" className="w-12 h-12 rounded-xl" />
                                <span className="text-3xl font-black text-blue-600">LexIA</span>
                            </div>
                            <h2 className="text-xl font-bold text-neutral-800">Dictamen Jurídico Digital</h2>
                            <p className="text-neutral-500 text-sm">Asesoría especializada por IA de última generación</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-neutral-800 uppercase tracking-widest">{agent.title}</p>
                            <p className="text-xs text-neutral-500">{new Date().toLocaleString('es-ES')}</p>
                            <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded text-[10px] text-blue-700 font-bold">
                                EXPEDIENTE: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* Minimal Legal Warning replaced the huge block */}
                    <div className="text-[10px] text-neutral-600 border-b border-neutral-900 pb-2 mb-2 text-center uppercase tracking-widest hidden sm:block">
                        {language === 'es' ? 'Aviso Legal: Entorno Técnico de Especialista' : 'Legal Notice: Specialist Technical Environment'}
                    </div>

                    {/* One-Shot Policy Information replaced examples */}
                    {agentId !== "asesor-direccion" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col gap-3 mb-10 border-b border-neutral-900 pb-6"
                        >
                            <div className="p-4 rounded-xl border border-neutral-800/60 bg-neutral-900/40 text-xs text-neutral-400 text-center leading-relaxed max-w-2xl mx-auto flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />
                                <div className="text-left">
                                    {language === "es" 
                                        ? "Los agentes técnicos operan bajo una política de revisión en un solo paso (One-Shot). Para debatir la respuesta, añadir matices o pedir segundas opiniones, te invitamos a tratar tu expediente en Recepción Central." 
                                        : "Technical agents operate under a One-Shot review policy. To discuss the response, add details, or request second opinions, please handle your file at the Central Reception."}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {messages.map((msg, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={i}
                            id={msg.role === 'user' ? `user-msg-${i}` : undefined}
                            className={`print-msg flex gap-4 ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
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
                            </div>
                        </motion.div>
                    ))}

                    {/* Empty block where original examples were */}
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
                                    {error.message.includes("403") || error.message.includes("Session limit")
                                        ? t("chat.error.limit")
                                        : error.message.includes("402") || error.message.includes("credits")
                                        ? t("chat.error.empty")
                                        : error.message.includes("timeout") || error.message.includes("limit")
                                            ? language === 'es' ? 'Tiempo de espera agotado' : 'Request Timeout'
                                            : t("chat.error.conn")}
                                </p>
                                <p className="text-sm">
                                    {error.message.includes("403") || error.message.includes("Session limit")
                                        ? t("chat.error.limit.desc")
                                        : error.message.includes("402") || error.message.includes("credits")
                                        ? t("chat.error.empty.desc")
                                        : error.message.includes("quota") || error.message.includes("429")
                                            ? t("chat.error.quota")
                                            : error.message.includes("timeout") || error.message.includes("limit")
                                                ? language === 'es' ? 'La IA está tardando demasiado en procesar tanta información (límite de 60 segundos del servidor excedido). Intenta hacer una pregunta un poco más concreta.' : 'The AI is taking too long to process (60s server timeout). Try asking a more specific question.'
                                                : t("chat.error.unknown") + error.message}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Loading indicator - Progressive with elapsed time */}
                    {isLoading && messages[messages.length - 1].role === "user" && !error && (() => {
                        const isConcierge = agentId === "asesor-direccion";
                        const phase =
                            elapsedSeconds < 8  ? { icon: "🔍", text: language === 'es' ? "Buscando legislación vigente y fuentes oficiales..." : "Searching current legislation and official sources...", color: "text-blue-400" } :
                            elapsedSeconds < 20 ? { icon: "⚖️", text: language === 'es' ? "Analizando normativa, jurisprudencia y BOE..." : "Analysing regulations, case law and official bulletins...", color: "text-indigo-400" } :
                            elapsedSeconds < 40 ? { icon: "✍️", text: language === 'es' ? "Redactando dictamen jurídico detallado..." : "Drafting detailed legal opinion...", color: "text-purple-400" } :
                            elapsedSeconds < 70 ? { icon: "📋", text: language === 'es' ? "Estructurando análisis multi-área y hoja de ruta..." : "Structuring multi-area analysis and roadmap...", color: "text-amber-400" } :
                                                  { icon: "⏳", text: language === 'es' ? "Finalizando respuesta experta. Consultas complejas requieren más tiempo..." : "Finalising expert response. Complex queries take longer...", color: "text-orange-400" };
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4 justify-start"
                            >
                                <div className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center ${agent.color}`}>
                                    <Scale className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col gap-2 px-5 py-4 rounded-2xl bg-neutral-900 border border-neutral-800 rounded-tl-sm min-w-[260px] max-w-sm">
                                    {/* Animated dots row */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                        <span className="text-xs text-neutral-500 font-mono">{elapsedSeconds}s</span>
                                    </div>
                                    {/* Phase message */}
                                    <p className={`text-xs font-medium ${phase.color}`}>
                                        {phase.icon} {phase.text}
                                    </p>
                                    {/* Warning after 45s */}
                                    {elapsedSeconds >= 45 && (
                                        <p className="text-[11px] text-amber-500/80 border-t border-neutral-800 pt-2 mt-1">
                                            {language === 'es'
                                                ? isConcierge
                                                    ? "La Directora está realizando múltiples búsquedas y redactando un dictamen exhaustivo. Por favor, espera."
                                                    : "Tu asesor está consultando fuentes actualizadas. Respuestas detalladas requieren más tiempo."
                                                : isConcierge
                                                    ? "The Director is performing multiple searches and drafting a thorough opinion. Please wait."
                                                    : "Your advisor is checking updated sources. Detailed responses take more time."}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })()}
                    
                    {/* Info banners at the bottom of the scroll stream */}
                    <div className="flex justify-center mt-6">
                        <div className="text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 py-2 px-4 rounded-xl flex items-center justify-center gap-3 text-center">
                            <div className="flex flex-col sm:flex-row items-center gap-1">
                                <span>{language === 'es' ? 'Saldo actual en cuenta:' : 'Current account balance:'} <span className="font-bold text-white">{isAdmin ? "∞" : (user?.publicMetadata?.credits ? String(user.publicMetadata.credits) : "0")}</span> {language === 'es' ? 'consultas.' : 'queries.'}</span>
                            </div>
                            <div className="hidden sm:block w-px h-4 bg-blue-500/30"></div>
                            <div className="flex items-center gap-2">
                                <span>{language === 'es' ? 'Mensajes libres restantes en esta sala:' : 'Free messages remaining in this room:'}</span>
                                <span className="font-bold text-white">{Math.max(0, 15 - userMessageCount)} / 15</span>
                            </div>
                        </div>
                    </div>

                    {/* Proactive Loading Message */}
                    <AnimatePresence>
                        {isLoading && messages.filter(m => m.role === 'assistant').length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex gap-4 justify-start"
                            >
                                <div className="shrink-0 w-8 h-8 rounded-lg border border-blue-500/20 bg-blue-500/10 flex items-center justify-center">
                                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                                </div>
                                <div className="px-5 py-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-blue-300 rounded-tl-sm text-sm italic flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                    {language === 'es' ? "Analizando y redactando estrategia..." : "Analyzing and drafting strategy..."}
                                    {elapsedSeconds >= 5 && (
                                        <span className="text-[10px] text-neutral-500 ml-2">
                                            ({language === 'es' ? 'La IA está procesando un dictamen complejo...' : 'The AI is processing a complex report...'})
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="text-center mt-3 text-xs text-neutral-600 mb-2">
                        {t("chat.warning")}
                    </div>
                    
                    {/* Element to scroll to */}
                    <div ref={messagesEndRef} className="h-2 w-full shrink-0" />
                </div>

                {/* Floating "Scroll to Bottom" button for Mobile */}
                <AnimatePresence>
                    {showScrollBottom && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={scrollToBottom}
                            className="fixed bottom-32 right-6 p-3 bg-blue-600 text-white rounded-full shadow-2xl z-50 border-2 border-white/20 hover:scale-110 active:scale-90 transition-transform sm:hidden"
                        >
                            <ChevronRight className="w-6 h-6 rotate-90" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </main>

            {/* Input Area */}
            {/* Input Area - IMPORTANT: overflow-hidden to prevent touch hijacking */}
            <footer className="shrink-0 z-40 p-3 sm:p-6 border-t border-neutral-900 bg-neutral-950 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                {/* Country selector - compact, above the input */}
                <div className="max-w-3xl mx-auto mb-2 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <select
                        value={selectedCountry}
                        onChange={e => setSelectedCountry(e.target.value)}
                        className="flex-1 bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    >
                        <option value="">{language === 'es' ? '🌍 País de la consulta (opcional)' : '🌍 Country of the query (optional)'}</option>
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
                {agent.hint && (
                    <div className="max-w-3xl mx-auto mb-2 hidden sm:block">
                        <p className="text-[12px] font-medium text-blue-400/70 text-center">{agent.hint}</p>
                    </div>
                )}
                {agentId === "asesor-direccion" ? (
                    /* Modalidad A: Chat interactivo (Solo Directora) */
                    <form onSubmit={submitForm} className="max-w-3xl mx-auto relative group flex flex-col gap-2">
                        {/* PDF Download hint - shown when there are messages */}
                        {messages.length > 1 && (
                            <div className="flex items-center justify-between mb-1 px-1">
                                <p className="text-[11px] text-neutral-600">
                                    {language === 'es' ? 'Pulsa la flecha ← arriba para salir y descargar el PDF' : 'Press ← arrow above to exit and download the PDF'}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setShowLeaveDialog(true)}
                                    className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg transition-all hover:bg-cyan-500/20"
                                >
                                    <FileDown className="w-3.5 h-3.5" />
                                    {language === 'es' ? 'Descargar PDF' : 'Download PDF'}
                                </button>
                            </div>
                        )}
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
                            {!selectedCountry && (
                                <div className="absolute -top-8 left-0 right-0 flex justify-center">
                                    <span className="bg-amber-500/10 text-amber-500 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-500/20 animate-pulse">
                                        {language === 'es' ? '⚠️ Selecciona el país arriba para habilitar el chat' : '⚠️ Select a country above to enable chat'}
                                    </span>
                                </div>
                            )}
                            <textarea
                                value={input || ""}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (!e.shiftKey) {
                                            e.stopPropagation();
                                        }
                                    }
                                }}
                                disabled={isSessionLimitReached || !selectedCountry}
                                placeholder={selectedCountry ? `${t("chat.input.placeholder")}${agent.title}... (Usa Enter para saltar de línea, Click en Enviar para consultar)` : (language === 'es' ? "Esperando selección de país..." : "Waiting for country selection...")}
                                rows={3}
                                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-3xl pl-12 pr-24 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-sm placeholder:text-neutral-600 resize-none disabled:opacity-50"
                            />
                            
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".pdf,.txt,.jpg,.jpeg,.png"
                                disabled={isSessionLimitReached || !selectedCountry}
                                className="hidden" 
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading || !!attachment || isSessionLimitReached || !selectedCountry}
                                className="absolute left-3 bottom-3 w-10 h-10 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-blue-400 transition-all disabled:opacity-50"
                                title={t("chat.upload.title")}
                            >
                                {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Paperclip className="w-5 h-5" />}
                            </button>

                            <div className="absolute right-3 bottom-3 flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    disabled={!selectedCountry}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${
                                        !micSupported || !selectedCountry
                                            ? 'opacity-40 cursor-not-allowed text-neutral-600' 
                                            : isListening 
                                                ? 'bg-red-500 text-white animate-pulse' 
                                                : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
                                    }`}
                                    title={
                                        !selectedCountry ? (language === "es" ? "⚠️ Selecciona el país primero" : "⚠️ Select country first") :
                                        !micSupported 
                                            ? (language === "es" ? "⚠️ Micrófono no disponible en Firefox. Usa Chrome o Edge." : "⚠️ Microphone not available in Firefox. Use Chrome or Edge.") 
                                            : (language === "es" ? "Usar micrófono" : "Use microphone")
                                    }
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    {!micSupported && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-500 rounded-full border border-neutral-950 text-[7px] flex items-center justify-center text-white font-bold">!</span>}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSessionLimitReached || (!input?.trim() && !attachment) || isUploading || !selectedCountry}
                                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-600 flex items-center justify-center text-white transition-all shadow-md shadow-blue-900/20"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    /* Modalidad B: One-Shot (Especialistas) */
                    (!isLoading || messages.filter(m => m.role === 'user').length >= 1) && (
                        <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center shadow-2xl">

                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                                <button 
                                    type="button"
                                    onClick={() => setShowLeaveDialog(true)}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800 text-white font-bold rounded-xl border border-neutral-700 hover:bg-neutral-700 transition-all w-full sm:w-auto"
                                >
                                    <FileDown className="w-5 h-5"/>
                                    {language === "es" ? "Descargar Dictamen PDF" : "Download PDF Report"}
                                </button>
                                <button 
                                    onClick={handleExpandAudit}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all w-full sm:w-auto shadow-lg shadow-blue-900/20"
                                >
                                    {language === "es" ? "Ampliar Auditoría en Recepción" : "Expand Audit at Reception"}
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    )
                )}
            </footer>

            {/* Leave Dialog */}
            {showLeaveDialog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
                        <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileDown className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Finalizar Expediente</h3>
                        <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                            Se va a generar de forma silenciosa el Dictamen final, optimizado y estructurado con el formato oficial de reporte Jurídico Elite.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleElitePDF}
                                disabled={isGeneratingPDF}
                                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-wait text-white rounded-xl py-3 font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {isGeneratingPDF ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin"/>
                                        Generando Dictamen...
                                    </>
                                ) : (
                                    <>
                                        <FileDown className="w-5 h-5"/>
                                        Descargar Dictamen Oficial
                                    </>
                                )}
                            </button>
                            <button 
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        sessionStorage.removeItem(`lexia_chat_store_${agentId}`);
                                        sessionStorage.removeItem('lexia_chat_active');
                                    }
                                    setMessages([]);
                                    router.push('/');
                                }}
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

            {/* Logo loading if needed */}
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

