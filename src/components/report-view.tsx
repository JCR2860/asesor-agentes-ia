"use client";
// ─────────────────────────────────────────────────────────────
//  Vista de informe: presenta un dictamen como documento web (índice
//  lateral, tarjeta de conclusión con indicadores, avisos destacados,
//  hoja de ruta en línea de tiempo y fuentes citadas con sello oficial).
//  Se abre a pantalla completa sobre el chat (portal), sin navegar, para
//  no perder la conversación ni volver a enviar consultas.
// ─────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    ArrowLeft, Copy, FileDown, Printer, Sun, Moon, Crown, Scale, AlertTriangle, Clock,
    CheckCircle2, ShieldCheck, ExternalLink, List, ChevronDown, Wallet, Gavel, FileText,
    BadgeCheck, Loader2,
} from "lucide-react";
import { splitSummary, splitSections, extractSources, levelTone, type ReportSection } from "@/lib/report";

type Props = {
    content: string;
    agentTitle: string;
    isDirectora: boolean;
    modelLabel: string;
    country?: string;
    question?: string;
    language: "es" | "en";
    onClose: () => void;
    onDownloadPDF: () => void;
    isDownloading?: boolean;
};

const SOURCES_ID = "fuentes-citadas";
const WARN_RE = /aviso|advertencia|alerta|precauci|riesgos? cr[ií]tic|warning|critical/i;
const ROADMAP_RE = /hoja de ruta|pasos|plan de acci|calendario|roadmap|next steps|action plan/i;

export function ReportView(props: Props) {
    const { content, agentTitle, isDirectora, modelLabel, country, question, language, onClose, onDownloadPDF, isDownloading } = props;
    const es = language === "es";
    const [mounted, setMounted] = useState(false);
    const [light, setLight] = useState(false);
    const [active, setActive] = useState<string>("");
    const [progress, setProgress] = useState(0);
    const [tocOpen, setTocOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // ── Datos del informe ──
    const { body, summary, intro, sections, sources } = useMemo(() => {
        const cleaned = content
            .replace(/<(visual_graph|visual_data)>[\s\S]*?<\/\1>/g, "")
            .replace(/\[BANDERA:\s*(VERDE|AMARILLO|ROJO)\][^\n]*/g, "");
        const { body, summary } = splitSummary(cleaned);
        const { intro, sections } = splitSections(body);
        return { body, summary, intro, sections: sections.length ? sections : [{ id: "dictamen", title: es ? "Dictamen" : "Opinion", markdown: intro }], sources: extractSources(body) };
    }, [content, es]);

    const showIntroAsBody = sections.length > 0 && sections[0].id !== "dictamen" && intro.length > 0;
    const toc = [...sections, ...(sources.length ? [{ id: SOURCES_ID, title: es ? "Fuentes citadas" : "Cited sources", markdown: "" }] : [])];
    const expediente = useMemo(() => Math.random().toString(36).slice(2, 10).toUpperCase(), []);
    const title = summary?.titulo || (question ? question.slice(0, 90) + (question.length > 90 ? "…" : "") : agentTitle);

    // ── Montaje, preferencias y bloqueo de scroll del fondo (solo una vez) ──
    // onClose se guarda en una ref: el padre crea una función nueva en cada render y,
    // si fuera dependencia, el efecto se repetiría y dejaría el scroll bloqueado al cerrar.
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    useEffect(() => {
        setMounted(true);
        try { setLight(localStorage.getItem("lexia_report_light") === "1"); } catch { /* sin almacenamiento */ }
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseRef.current(); };
        window.addEventListener("keydown", onKey);
        return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
    }, []);

    const toggleLight = () => {
        const next = !light;
        setLight(next);
        try { localStorage.setItem("lexia_report_light", next ? "1" : "0"); } catch { /* sin almacenamiento */ }
    };

    // ── Barra de progreso + índice activo ──
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || !mounted) return;
        const onScroll = () => {
            const max = el.scrollHeight - el.clientHeight;
            setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
            if (el.scrollTop < 120) setActive(toc[0]?.id ?? "");
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        const obs = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActive(visible[0].target.id);
            },
            { root: el, rootMargin: "-15% 0px -70% 0px" }
        );
        toc.forEach((s) => { const n = document.getElementById(`rv-${s.id}`); if (n) obs.observe(n); });
        return () => { el.removeEventListener("scroll", onScroll); obs.disconnect(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted, sections.length, sources.length]);

    const goTo = (id: string) => {
        setTocOpen(false);
        const el = document.getElementById(`rv-${id}`);
        const sc = scrollRef.current;
        if (el && sc) sc.scrollTo({ top: el.offsetTop - 90, behavior: "smooth" });
    };

    const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

    const copyAll = async () => {
        try { await navigator.clipboard.writeText(body); flash(es ? "Dictamen copiado al portapapeles" : "Opinion copied"); }
        catch { flash(es ? "No se pudo copiar" : "Copy failed"); }
    };

    const print = () => {
        const wasLight = light;
        setLight(true);
        document.body.classList.add("lexia-print");
        setTimeout(() => {
            window.print();
            document.body.classList.remove("lexia-print");
            setLight(wasLight);
        }, 80);
    };

    // ── Paleta (oscuro premium / lectura clara tipo papel) ──
    const th = light
        ? {
            page: "bg-[#F5F2EA]", bar: "bg-[#F5F2EA]/90 border-[#E4DDCC]", card: "bg-white border-[#E6DFCF]",
            soft: "bg-[#FAF7F0] border-[#E6DFCF]", text: "text-[#2C313C]", head: "text-[#0E1524]",
            muted: "text-[#6E7380]", accent: "text-gold-700", line: "border-[#E6DFCF]", chip: "bg-[#F0EADC]",
            tocActive: "text-gold-700 border-gold-600", tocIdle: "text-[#6E7380] border-transparent hover:text-[#0E1524]",
            btn: "bg-white border-[#E4DDCC] text-[#2C313C] hover:bg-[#FAF7F0]", th: "bg-[#F3EEE2] text-[#0E1524]", tdBorder: "border-[#EEE8DA]",
        }
        : {
            page: "bg-[#070B14]", bar: "bg-[#070B14]/85 border-white/5", card: "bg-neutral-900/50 border-neutral-800",
            soft: "bg-neutral-950/60 border-neutral-800", text: "text-neutral-300", head: "text-white",
            muted: "text-neutral-500", accent: "text-gold-400", line: "border-neutral-800", chip: "bg-neutral-800",
            tocActive: "text-gold-300 border-gold-500", tocIdle: "text-neutral-500 border-transparent hover:text-neutral-200",
            btn: "bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800", th: "bg-neutral-800/60 text-gold-200", tdBorder: "border-neutral-800/70",
        };

    // ── Renderizado Markdown según el tipo de sección ──
    const md = (markdown: string, variant: "normal" | "warnings" | "roadmap" = "normal") => (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ node, ...p }) => <p className="mb-4 last:mb-0 leading-[1.8] text-[15px]" {...p} />,
                strong: ({ node, ...p }) => <strong className={`font-semibold ${th.head}`} {...p} />,
                em: ({ node, ...p }) => <em className="italic" {...p} />,
                h1: ({ node, ...p }) => <h3 className={`font-display text-xl font-bold mt-6 mb-3 ${th.head}`} {...p} />,
                h2: ({ node, ...p }) => <h3 className={`font-display text-xl font-bold mt-6 mb-3 ${th.head}`} {...p} />,
                h3: ({ node, ...p }) => <h3 className={`font-display text-lg font-bold mt-6 mb-3 ${th.accent}`} {...p} />,
                h4: ({ node, ...p }) => <h4 className={`text-sm font-semibold uppercase tracking-wide mt-5 mb-2 ${th.accent}`} {...p} />,
                a: ({ node, ...p }) => <a className={`${th.accent} underline underline-offset-2 decoration-gold-500/40 break-words hover:opacity-80`} target="_blank" rel="noopener noreferrer" {...p} />,
                blockquote: ({ node, ...p }) => <blockquote className="my-4 rounded-xl border border-amber-500/30 bg-amber-500/[0.07] px-4 py-3 text-[15px]" {...p} />,
                hr: () => <hr className={`my-6 ${th.line}`} />,
                code: ({ node, ...p }) => <code className={`px-1.5 py-0.5 rounded text-[13px] font-mono break-words ${th.chip} ${th.accent}`} {...p} />,
                table: ({ node, ...p }) => <div className={`my-5 overflow-x-auto rounded-xl border ${th.line}`}><table className="w-full text-left text-sm border-collapse" {...p} /></div>,
                thead: ({ node, ...p }) => <thead className={th.th} {...p} />,
                th: ({ node, ...p }) => <th className={`px-4 py-2.5 font-semibold border-b ${th.line} whitespace-nowrap`} {...p} />,
                td: ({ node, ...p }) => <td className={`px-4 py-2.5 border-b ${th.tdBorder} align-top`} {...p} />,
                ul: ({ node, ...p }) =>
                    variant === "warnings"
                        ? <ul className="space-y-3 mb-4 list-none pl-0" {...p} />
                        : <ul className="list-disc pl-5 mb-4 space-y-2 marker:text-gold-500/70" {...p} />,
                // Hoja de ruta: la lista numerada se convierte en línea de tiempo. Los estilos
                // se aplican solo a los hijos directos (<li>) de esta lista numerada.
                ol: ({ node, ...p }) =>
                    variant === "roadmap"
                        ? <ol className={`relative list-none pl-0 ml-3 mb-4 border-l-2 ${th.line} [counter-reset:step]
                            [&>li]:relative [&>li]:ml-7 [&>li]:mb-6 [&>li:last-child]:mb-0 [&>li]:[counter-increment:step]
                            [&>li]:before:content-[counter(step)] [&>li]:before:absolute [&>li]:before:-left-[41px] [&>li]:before:top-0.5
                            [&>li]:before:w-6 [&>li]:before:h-6 [&>li]:before:rounded-full [&>li]:before:flex [&>li]:before:items-center
                            [&>li]:before:justify-center [&>li]:before:text-[11px] [&>li]:before:font-bold [&>li]:before:bg-gold-500 [&>li]:before:text-black`} {...p} />
                        : <ol className="list-decimal pl-5 mb-4 space-y-2 marker:text-gold-500/70 marker:font-semibold" {...p} />,
                li: ({ node, children, ...p }) => {
                    // Avisos críticos: cada viñeta se muestra como recuadro de advertencia.
                    if (variant === "warnings") {
                        return (
                            <li className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.07] p-4 leading-relaxed text-[15px]">
                                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div className="min-w-0 [&>p]:mb-0">{children}</div>
                            </li>
                        );
                    }
                    return <li className="leading-[1.75] text-[15px] pl-1" {...p}>{children}</li>;
                },
            }}
        >
            {markdown}
        </ReactMarkdown>
    );

    const variantOf = (s: ReportSection): "normal" | "warnings" | "roadmap" =>
        WARN_RE.test(s.title) ? "warnings" : ROADMAP_RE.test(s.title) ? "roadmap" : "normal";

    const toneClass = (t: ReturnType<typeof levelTone>) =>
        t === "good" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/25"
            : t === "mid" ? "text-amber-500 bg-amber-500/10 border-amber-500/25"
                : t === "bad" ? "text-rose-500 bg-rose-500/10 border-rose-500/25"
                    : `${th.muted} ${th.soft}`;

    const indicators = summary ? [
        summary.viabilidad && { icon: <CheckCircle2 className="w-4 h-4" />, label: es ? "Viabilidad" : "Feasibility", value: summary.viabilidad, c: toneClass(levelTone("viabilidad", summary.viabilidad)) },
        summary.riesgo && { icon: <AlertTriangle className="w-4 h-4" />, label: es ? "Riesgo" : "Risk", value: summary.riesgo, c: toneClass(levelTone("riesgo", summary.riesgo)) },
        summary.plazo_clave && { icon: <Clock className="w-4 h-4" />, label: es ? "Plazo clave" : "Key deadline", value: summary.plazo_clave, c: "text-rose-500 bg-rose-500/10 border-rose-500/25" },
        summary.coste && { icon: <Wallet className="w-4 h-4" />, label: es ? "Coste" : "Cost", value: summary.coste, c: "text-sky-500 bg-sky-500/10 border-sky-500/25" },
    ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; c: string }[] : [];

    if (!mounted) return null;

    return createPortal(
        <div id="lexia-report-root" className={`fixed inset-0 z-[95] ${th.page} ${th.text} transition-colors duration-300`} role="dialog" aria-modal="true" aria-label={es ? "Vista de informe" : "Report view"}>
            {/* Barra de progreso de lectura */}
            <div className="no-print absolute top-0 left-0 right-0 h-[3px] z-[2]">
                <div className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-[width] duration-150" style={{ width: `${progress}%` }} />
            </div>

            <div ref={scrollRef} className="lexia-report-scroll absolute inset-0 overflow-y-auto overscroll-contain">
                {/* Barra de acciones */}
                <header className={`sticky top-0 z-[1] border-b backdrop-blur-xl ${th.bar}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={onClose} className={`p-2 rounded-lg border ${th.btn}`} title={es ? "Volver al chat" : "Back to chat"}>
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <div className="min-w-0">
                                <div className={`font-display font-bold text-sm sm:text-base truncate ${th.head}`}>{title}</div>
                                <div className={`text-[10px] uppercase tracking-widest truncate ${th.muted}`}>{es ? "Dictamen" : "Opinion"} · {agentTitle}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <button onClick={copyAll} className={`p-2 sm:px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${th.btn}`} title={es ? "Copiar" : "Copy"}>
                                <Copy className="w-4 h-4" /><span className="hidden md:inline">{es ? "Copiar" : "Copy"}</span>
                            </button>
                            <button onClick={print} className={`p-2 sm:px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${th.btn}`} title={es ? "Imprimir" : "Print"}>
                                <Printer className="w-4 h-4" /><span className="hidden md:inline">{es ? "Imprimir" : "Print"}</span>
                            </button>
                            <button onClick={toggleLight} className={`p-2 sm:px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${th.btn}`} title={es ? "Modo lectura" : "Reading mode"}>
                                {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                <span className="hidden md:inline">{light ? (es ? "Modo oscuro" : "Dark mode") : (es ? "Modo lectura" : "Reading mode")}</span>
                            </button>
                            <button onClick={onDownloadPDF} disabled={isDownloading} className="px-3 py-2 rounded-lg bg-gold-600 hover:bg-gold-700 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5">
                                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                                <span className="hidden sm:inline">{es ? "Descargar PDF" : "Download PDF"}</span>
                            </button>
                        </div>
                    </div>

                    {/* Índice desplegable (móvil / tablet) */}
                    <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pb-2 no-print">
                        <button onClick={() => setTocOpen(!tocOpen)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold ${th.btn}`}>
                            <span className="flex items-center gap-2 min-w-0"><List className="w-4 h-4 shrink-0" /><span className="truncate">{es ? "Índice" : "Contents"} · {toc.find((s) => s.id === active)?.title ?? toc[0]?.title}</span></span>
                            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${tocOpen ? "rotate-180" : ""}`} />
                        </button>
                        {tocOpen && (
                            <div className={`mt-2 rounded-lg border p-1 max-h-[50vh] overflow-y-auto ${th.card}`}>
                                {toc.map((s, i) => (
                                    <button key={s.id} onClick={() => goTo(s.id)} className={`w-full text-left px-3 py-2 rounded-md text-sm ${active === s.id ? th.accent + " font-semibold" : th.muted}`}>
                                        {String(i + 1).padStart(2, "0")} · {s.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10 flex gap-10">
                    {/* Índice lateral (escritorio) */}
                    <aside className="no-print hidden lg:block w-60 shrink-0">
                        <nav className="sticky top-24">
                            <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${th.muted}`}>{es ? "Índice del dictamen" : "Contents"}</div>
                            <ul className="space-y-0.5">
                                {toc.map((s, i) => (
                                    <li key={s.id}>
                                        <button onClick={() => goTo(s.id)} className={`w-full text-left pl-3 py-1.5 text-sm border-l-2 transition-colors ${active === s.id ? th.tocActive + " font-semibold" : th.tocIdle}`}>
                                            <span className="opacity-60 mr-1.5">{String(i + 1).padStart(2, "0")}</span>{s.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className={`mt-6 p-3 rounded-xl border text-[11px] leading-relaxed ${th.soft} ${th.muted}`}>
                                <ShieldCheck className={`w-4 h-4 mb-1.5 ${th.accent}`} />
                                {es ? "Copia única del cliente. Este dictamen no se guarda en nuestros servidores: descargue el PDF antes de salir." : "Client's only copy. This opinion is not stored on our servers: download the PDF before leaving."}
                            </div>
                        </nav>
                    </aside>

                    {/* Documento */}
                    <main className="flex-1 min-w-0 max-w-3xl">
                        {/* Cabecera del expediente */}
                        <div className={`rounded-2xl border p-6 sm:p-8 mb-6 ${th.card}`}>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-500 text-xs font-bold">
                                    {isDirectora ? <Crown className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />} {agentTitle} · {modelLabel}
                                </span>
                                <span className={`text-xs ${th.muted}`}>{es ? "Expediente Nº" : "Case No."} <span className="font-mono font-semibold">{expediente}</span></span>
                                {country && <span className={`text-xs ${th.muted}`}>{country}</span>}
                                <span className={`text-xs ${th.muted}`}>{new Date().toLocaleDateString(es ? "es-ES" : "en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                            <h1 className={`font-display text-3xl sm:text-4xl font-bold leading-tight ${question ? "mb-4" : ""} ${th.head}`}>{title}</h1>
                            {question && (
                                <div className={`border-l-2 border-gold-500/60 pl-4 text-sm italic ${th.muted}`}>
                                    “{question.length > 400 ? question.slice(0, 400) + "…" : question}”
                                </div>
                            )}
                        </div>

                        {/* Conclusión e indicadores */}
                        {(summary?.conclusion || indicators.length > 0) && (
                            <div className={`rounded-2xl border p-6 sm:p-8 mb-12 ${th.card}`}>
                                <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${th.accent}`}>{es ? "Conclusión" : "Conclusion"}</div>
                                {summary?.conclusion && <p className={`font-display text-xl leading-snug ${indicators.length ? "mb-6" : ""} ${th.head}`}>{summary.conclusion}</p>}
                                {indicators.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {indicators.map((k) => (
                                            <div key={k.label} className={`rounded-xl border p-3 ${k.c}`}>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest opacity-90">{k.icon}{k.label}</div>
                                                <div className="mt-1 text-sm font-bold leading-snug line-clamp-3" title={k.value}>{k.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {showIntroAsBody && <div className="mb-10">{md(intro)}</div>}

                        {/* Secciones */}
                        {sections.map((s, i) => (
                            <section key={s.id} id={`rv-${s.id}`} className="mb-12">
                                <h2 className={`font-display text-2xl font-bold flex items-baseline gap-3 mb-5 ${th.head}`}>
                                    <span className={`text-sm font-sans font-bold ${th.accent}`}>{String(i + 1).padStart(2, "0")}</span>
                                    {s.title}
                                </h2>
                                {md(s.markdown, variantOf(s))}
                            </section>
                        ))}

                        {/* Fuentes citadas */}
                        {sources.length > 0 && (
                            <section id={`rv-${SOURCES_ID}`} className="mb-12">
                                <h2 className={`font-display text-2xl font-bold flex items-baseline gap-3 mb-5 ${th.head}`}>
                                    <span className={`text-sm font-sans font-bold ${th.accent}`}>{String(sections.length + 1).padStart(2, "0")}</span>
                                    {es ? "Fuentes citadas" : "Cited sources"}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {sources.map((f) => (
                                        <a key={f.url} href={f.url} target="_blank" rel="noopener noreferrer" className={`group rounded-xl border p-3.5 flex items-start gap-3 transition-colors ${th.card} hover:border-gold-500/40`}>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${th.chip}`}>
                                                {f.official ? <Gavel className={`w-4 h-4 ${th.accent}`} /> : <FileText className={`w-4 h-4 ${th.muted}`} />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className={`text-sm font-semibold leading-snug break-words ${th.head}`}>{f.title}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs truncate ${th.muted}`}>{f.domain}</span>
                                                    {f.official
                                                        ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 shrink-0"><BadgeCheck className="w-3 h-3" />{es ? "Oficial" : "Official"}</span>
                                                        : <span className={`text-[10px] font-bold shrink-0 ${th.muted}`}>{es ? "Referencia" : "Reference"}</span>}
                                                </div>
                                            </div>
                                            <ExternalLink className={`w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${th.accent}`} />
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )}

                        <div className={`rounded-xl border p-4 text-xs leading-relaxed ${th.soft} ${th.muted}`}>
                            <strong className={th.head}>{es ? "Aviso legal." : "Legal notice."}</strong>{" "}
                            {es
                                ? "Esta es una orientación de pre-diagnóstico generada por IA. Para representación legal oficial, acuda a un abogado o asesor colegiado."
                                : "This is an AI-generated pre-diagnosis. For official legal representation, consult a licensed lawyer or advisor."}
                        </div>
                        <div className="h-10" />
                    </main>
                </div>
            </div>

            {toast && (
                <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-[3] px-4 py-2.5 rounded-xl bg-neutral-900 border border-gold-500/30 text-sm text-white shadow-2xl">
                    {toast}
                </div>
            )}
        </div>,
        document.body
    );
}
