"use client";


import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
    Loader2
} from "lucide-react";
import { generatePDF } from "@/lib/pdf";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useLanguage } from "@/context/LanguageContext";
import { useChat } from "ai/react";
import { UserMenu } from "@/components/user-menu";

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const agentId = params.id as string;

    const [showLeaveDialog, setShowLeaveDialog] = useState(false);

    const { user } = useUser();
    const { language, t } = useLanguage();

    const [attachment, setAttachment] = useState<{name: string, text: string, type: string} | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { messages, input, handleInputChange, handleSubmit, append, error, isLoading } = useChat({
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
                content: "Hola. Soy tu especialista designado. ¿En qué te puedo ayudar hoy concerniente a evaluación de riesgos y normativa?"
            }
        ]
    });

    const agentConfig: Record<string, any> = {
        "asesor-fiscal": {
            title: "LexTributo", icon: <Landmark />, color: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
            hint: "💡 Tip: Indica tu país de residencia fiscal y si eres particular, autónomo o empresa.",
            examples: [
                "¿Cuáles son los requisitos de la Ley Beckham?",
                "Quiero abrir una LLC viviendo en España.",
                "¿Cómo declaro ingresos si trabajo remoto para USA?",
                "¿Qué impacto tienen los convenios de doble imposición en dividendos internacionales?",
                "¿Cómo justificar adecuadamente la residencia fiscal ante la Agencia Tributaria?",
                "¿Cuáles son los límites en la normativa de precios de transferencia?",
                "¿Hay manera legal de evitar la presunción de establecimiento permanente?",
                "¿Qué modelos tributarios debo presentar si recibo rentas internacionales periódicas?",
                "¿Cuál es la tributación óptima para retirar los beneficios de mi sociedad offshore?"
            ]
        },
        "asesor-mercantil": {
            title: "CorpLex", icon: <Briefcase />, color: "text-blue-400 bg-blue-400/10 border-blue-500/20",
            hint: "💡 Tip: Indica tu país y qué tipo de sociedad tienes (SL, SA, Autónomo...).",
            examples: [
                "¿Qué responsabilidad tengo como administrador único?",
                "Necesito redactar un pacto de socios, ¿qué incluyo?",
                "¿Cómo fusionar dos empresas SL?",
                "¿Es obligatorio contar con un manual de compliance penal para mi PYME?",
                "¿Qué diferencia legal hay entre una SA y una SL a la hora de levantar inversión de un VC?",
                "¿Cómo debo estructurar mi e-commerce para la LSSI y el RGPD en Europa?",
                "Consecuencias jurídicas si una SL entra en quiebra sin presentar un concurso de acreedores.",
                "Cláusulas clave para redactar un acuerdo de evitar competencia (NDA) en B2B.",
                "¿Qué componentes debe tener una Due Diligence antes de que adquieran mi startup (M&A)?"
            ]
        },
        "asesor-laboral": {
            title: "Laboris", icon: <Users />, color: "text-orange-400 bg-orange-400/10 border-orange-500/20",
            hint: "💡 Tip: Indica tu país, si eres trabajador/empresa y qué tipo de contrato tienes.",
            examples: [
                "¿Cuánto me corresponde de indemnización por despido laboral ordinario?",
                "¿Cuáles son los supuestos reales para aprobar un ERTE limitativo?",
                "¿Qué normativa aplica para nómadas digitales extracomunitarios en la UE?",
                "¿Cómo se formaliza legalmente un despido objetivo por causas económicas de la empresa?",
                "¿Cuáles son las penalizaciones si la Inspección detecta un entorno de 'falsos autónomos'?",
                "¿Qué permisos retribuidos ineludibles marca la legalidad del Estatuto de los Trabajadores este año?",
                "¿Cómo se justifica y defiende judicialmente un despido disciplinario por presentismo o disminución de rendimiento?",
                "¿Qué diferencias de responsabilidad jurídica tengo si contrato a través de una ETT o plantilla en directo?",
                "¿Puedo monitorizar el ordenador o las redes de mis empleados usando software espía interno de la empresa?"
            ]
        },
        "asesor-penal": {
            title: "PenalShield", icon: <Gavel />, color: "text-red-400 bg-red-400/10 border-red-500/20",
            hint: "💡 Tip: Indica tu país y si eres el acusado, víctima o representante legal.",
            examples: [
                "¿Cuáles son las penas estipuladas por blanqueo de capitales internacional?",
                "¿Cómo se evalúa judicialmente la responsabilidad penal corporativa del gerente?",
                "He recibido una citación judicial en calidad de investigado por un delito económico corporativo.",
                "¿En qué grado me exime un sistema sólido de Prevención de Delitos avalado en mi empresa (Compliance Penal)?",
                "¿Qué penas o gravámenes proceden para un delito continuado y documentado de estafa e insolvencia?",
                "¿Cuáles son los pasos procesales al ser llamado a testificar en la Audiencia Nacional por cibercrimen o phishing?",
                "¿Tengo alguna exención técnica entre ser condenado por blanqueo de capitales imprudente y el doloso intencionado?",
                "¿Cuándo se determina y bajo qué parámetros puede mi persona jurídica ser formal/penalmente suspendida?",
                "¿Es delito no denunciar crímenes informáticos si presencio el blanqueo en mi propio consejo de administración?"
            ]
        },
        "asesor-aeronautico": {
            title: "AeroLex", icon: <Plane />, color: "text-sky-400 bg-sky-400/10 border-sky-500/20",
            hint: "💡 Tip: Indica los países de origen y destino del vuelo comercial, o las especificaciones si deseas comprar/fletar un Jet Privado.",
            examples: [
                "Han cancelado mi vuelo regular, ¿cuánta indemnización puedo solicitar ahora mismo?",
                "Me han destrozado dos maletas en un vuelo transatlántico comercial.",
                "¿Cuáles son las reglas directas para volar y lucrarse con drones urbanos?",
                "¿Tengo derecho a un bono compensatorio plus hotel si la aerolínea retrasa un vuelo más de 6 horas por fallo de máquina?",
                "¿Conlleva recargo a terceros si la interrupción fue por culpa de Control de Tráfico Aéreo y no por problema técnico?",
                "¿Cuál es el procedimiento normativo europeo (ESCR) para que AESA resuelva mi queja legal por overbooking forzoso?",
                "¿Qué permisos aeronáuticos requiero según la norma local de la EASA para grabar spots sobre ciudades con drones?",
                "Si la compañía operaba fuera del área comunitaria (por ejemplo, LATAM), ¿me acoge de igual forma el Reglamento C-261/2004?",
                "Directrices jurídicas obligatorias a la hora de abordar vuelos transportando mercancías identificadas como de alto riesgo o inflamabilidad."
            ]
        },
        "asesor-civil": {
            title: "Civilitas", icon: <Building />, color: "text-indigo-400 bg-indigo-400/10 border-indigo-500/20",
            hint: "💡 Tip: Indica tu país/región, ya que el derecho civil y de familia cambia mucho por territorio.",
            examples: [
                "¿Cómo se reparte jurídicamente una herencia cuantiosa si no hay testamento?",
                "¿Qué responsabilidades asumo si firmo de fiador o avalista un contrato con cláusulas predispuestas y abusivas?",
                "Quiero divorciarme, ambos residimos actualmente en otro estado y queremos información legal de nulidades foráneas.",
                "¿En qué circunstancias excepcionales me permite el Código desheredar legalmente a mis propios herederos legítimos?",
                "Si los padres viven en distintos países: ¿Qué juzgado dictamina las pautas reguladoras del régimen de custodia menor compartida?",
                "¿Con qué argumentos o condiciones es admisible impugnar de manera viable la validez notarial del testamento hecho en vida?",
                "Diferencias sobre los regímenes económicos matrimoniales en derecho español (Gananciales vs. Estricta Separación Patrimonial).",
                "¿Mediante qué juicios procesales compelo al cumplimiento de un préstamo civil personal de gran cuantía si todo fue firmado sin notario?",
                "Tributariamente y civilmente hablando, ¿es preferible que mis abuelos estipulen una venta simulada del hogar o tramiten donación de vivienda?"
            ]
        },
        "asesor-pi": {
            title: "IPGuard", icon: <Lightbulb />, color: "text-yellow-400 bg-yellow-400/10 border-yellow-500/20",
            hint: "💡 Tip: Indica en qué país o ámbito territorial (ej. Europa) quieres proteger tu marca o creación.",
            examples: [
                "Quiero registrar en plazo una marca internacional válida para la EUIPO.",
                "Robaron el código o algoritmo subyacente de mi App móvil. ¿Qué puedo hacer sin patentes?",
                "¿Existen figuras jurídicas concretas sobre patentar metodologías puramente empresariales?",
                "Costos formales en tiempo y base pública del registro tanto denominativo frente a un figurativo en Europa e internacionalmente.",
                "¿Es imprescindible registrar oficialmente la IP desarrollada interna en el organigrama de la propia empresa laboral?",
                "¿A través de qué plataformas judiciales detengo o cierro webs y dominios de terceros de otro país vendiendo mis diseños patentados?",
                "Cláusulas indispensables B2B para formular la estructura completa de licenciamientos EULA/Software as a Service frente a grandes cuentas e internacionales.",
                "Si utilicé nombre comercial una década pero alguien lo registra oficial, ¿tengo resguardo normativo y pruebas para mantener los derechos previos originados?",
                "¿Cómo aseguro las regalías jurídicamente y verifico a los programadores offshore para el tema de los derechos originarios intelectuales de la solución base?"
            ]
        },
        "asesor-inmobiliario": {
            title: "EstateLex", icon: <HomeIcon />, color: "text-purple-400 bg-purple-400/10 border-purple-500/20",
            hint: "💡 Tip: Indica país/ciudad, y si eres propietario, inquilino o comprador.",
            examples: [
                "¿Qué importe global contable real exige comprar un piso listado sobre los 300 mil euros?",
                "El contrato del chico de abajo venció, dejó de pagar la mensualidad. Queremos demandarle un desahucio oficial ágil.",
                "Mi entidad impone la venta encadenada de un seguro de vida gravoso y de hogar para reducir mis intereses de la Hipoteca.",
                "¿Me ampara la normativa frente al casero para desestimarle las exigencias desmesuradas de aval al acceder a una mensualidad?",
                "Disparidades técnicas de carga tributaria (Impuesto de Trasmisiones ITP vs. devengo IVA en obra) en transacciones de carácter mercantil como terrenos de secano.",
                "¿Debemos legalmente las partes asumir una derrama votada del patio anterior a la fecha de traspaso de rúbrica pública notarial?",
                "Procedimientos concretos para detectar una ilegalidad urbanística oculta antes de transferir mi parte del contrato pactado vía Arras confirmatorias.",
                "Por Real Decreto vigente: Mi actual propietario quiere indexarme a los ratios anuales marcados por su propio IPC, saltándose los topes previstos. ¿Se puede negar o rescindir legalmente?",
                "Pautas de requerimientos de embargo ante inquilinos morosos que desintegran la fianza abonada mensual sin preavisar al juzgado el monto acumulado global real transcurrido."
            ]
        },
        "asesor-cripto": {
            title: "CryptoLex", icon: <Bitcoin />, color: "text-amber-400 bg-amber-400/10 border-amber-500/20",
            hint: "💡 Tip: Indica tu país de residencia fiscal actual y el volumen aproximado de la operación.",
            examples: [
                "Tengo más de 500k nominales en stablecoins, busco off-ramping formal mediante redes bancarias crypto-friendly verificadas.",
                "Mi sucursal me amenaza con bloquear transferencias directas provenientes de mi wallet en un Exchange. ¿Qué recurso es legal?",
                "A priori, ¿qué potencias internacionales garantizan mejores escenarios sobre rentas de criptos sin tasas?",
                "El controversial modelo 721. ¿Qué responsabilidades recaen si omito reportar tokens dentro de una infraestructura distribuida cold (como hardware wallets o una red anónima)?",
                "He adquirido fuertes retribuciones derivadas a la participación directa en procesos Airdrops y en bloqueos Proof of Stake. ¿Estructura tributaria aplicable que encaje esto en RCM anuales o patrimoniales?",
                "Tengo previsto desplegar una ICO a lo largo del Q3 en España. ¿Bajo qué estricta licitación marco el proyecto y me homologo ante los reguladores de valor por directiva de MiCA?",
                "Si ejecuto de forma anónima vía red descentralizada múltiples swappings en mi Trustwallet. Legalmente, ¿la permuta originaba a efectos locales ya una ganancia/pérdida gravable base en IRPF a tributar por cada una?",
                "Me enfrento a límites al convertir Fiat si uso una vía tradicional bancarizada pero necesito gran volumen. Pasarelas reguladas e internacionales catalogadas como OTC de respaldo robusto aptas.",
                "Fiscalización general y tratamiento contable tributario para la emisión o liquidación sucesiva a partir de tokens y coleccionables identificados jurídicamente al momento de convertirlos en NFT de arte y pasarlos por marketplaces foráneos."
            ]
        },
        "asesor-extranjeria": {
            title: "GlobalVisa", icon: <Globe />, color: "text-cyan-400 bg-cyan-400/10 border-cyan-500/20",
            hint: "💡 Tip: Indica siempre tu pasaporte/nacionalidad de origen y el país exacto al que planeas mudarte o residir.",
            examples: [
                "¿Qué requisitos hay para tramitar la Golden Visa si invierto en inmuebles en Europa?",
                "Soy ciudadano de LATAM y me han ofrecido trabajo remoto. ¿Dónde es más fácil tramitar una Visa Nómada Digital?",
                "Me quiero mudar a España, ¿qué vías de arraigo o regularización son más seguras?",
                "¿Cómo puedo patrocinar la residencia para mi cónyuge (reagrupación familiar) en mi país destino?",
                "¿Cuánto tiempo legal de empadronamiento o residencia necesito para optar por la ciudadanía?",
                "Tengo antecedentes penales inactivos en mi país de origen. ¿Obstaculizará la aprobación del permiso de trabajo?",
                "¿Qué certificaciones o documentos necesito apostillar en La Haya para convalidar mis estudios universitarios?",
                "Me denegaron la autorización de estancia o residencia temporal, ¿qué plazos tengo para interponer un recurso?",
                "Soy autónomo (freelance). Trámites administrativos y de capital necesarios para montar mi empresa fuera y obtener la residencia."
            ]
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
            return <div className="whitespace-pre-wrap">{content}</div>;
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
                <div className="whitespace-pre-wrap">{textBefore}</div>
                <div className={`mt-2 p-4 rounded-xl border ${styles}`}>
                    <div className="font-bold flex items-center gap-2 mb-2">
                        <ShieldAlert className="w-4 h-4" />
                        {t("chat.risk.eval")} {title}
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{explanation}</div>
                </div>
            </div>
        );
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
                    alert(t("chat.upload.unsupported"));
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

        let finalContent = input || "";
        if (attachment) {
            finalContent = `${finalContent}\n\n[DOCUMENTO ADJUNTO: ${attachment.name}]\n${attachment.text}`;
        }

        append({ role: "user", content: finalContent });
        
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
                        onClick={() => {
                            if (messages.filter(m => m.role === 'assistant' && m.id !== 'initial').length > 0) {
                                setShowLeaveDialog(true);
                            } else {
                                router.push("/");
                            }
                        }} 
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
                            accept=".pdf,.txt"
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
