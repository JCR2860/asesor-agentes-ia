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
import { ArrowLeft, Copy, FileDown, Printer, Sun, Moon, Crown, Scale, ShieldCheck, List, ChevronDown, Loader2 } from "lucide-react";
import { splitSummary, splitSections, extractSources, splitDisclaimer } from "@/lib/report";
import {
    DictamenMarkdown, ConclusionPanel, SourcesGrid, sectionVariant, cleanDictamenText,
    DARK_THEME, LIGHT_THEME, readLightPref, saveLightPref,
} from "@/components/dictamen-markdown";

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
    const { body, summary, intro, sections, sources, disclaimer } = useMemo(() => {
        const { body, summary } = splitSummary(cleanDictamenText(content));
        // El aviso legal final del modelo va al recuadro de aviso del pie (sin repetirlo en el texto).
        const { body: main, disclaimer } = splitDisclaimer(body);
        const { intro, sections } = splitSections(main);
        return { body, summary, intro, disclaimer, sections: sections.length ? sections : [{ id: "dictamen", title: es ? "Dictamen" : "Opinion", markdown: intro }], sources: extractSources(body) };
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
        setLight(readLightPref());
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseRef.current(); };
        window.addEventListener("keydown", onKey);
        return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
    }, []);

    const toggleLight = () => {
        const next = !light;
        setLight(next);
        saveLightPref(next);
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
            ...LIGHT_THEME, page: "bg-[#F5F2EA]", bar: "bg-[#F5F2EA]/90 border-[#E4DDCC]",
            tocActive: "text-gold-700 border-gold-600", tocIdle: "text-[#6E7380] border-transparent hover:text-[#0E1524]",
        }
        : {
            ...DARK_THEME, page: "bg-[#070B14]", bar: "bg-[#070B14]/85 border-white/5",
            tocActive: "text-gold-300 border-gold-500", tocIdle: "text-neutral-500 border-transparent hover:text-neutral-200",
        };

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
                        <ConclusionPanel summary={summary} th={th} es={es} className="mb-12" />

                        {showIntroAsBody && <div className="mb-10"><DictamenMarkdown markdown={intro} th={th} /></div>}

                        {/* Secciones */}
                        {sections.map((s, i) => (
                            <section key={s.id} id={`rv-${s.id}`} className="mb-12">
                                <h2 className={`font-display text-2xl font-bold flex items-baseline gap-3 mb-5 ${th.head}`}>
                                    <span className={`text-sm font-sans font-bold ${th.accent}`}>{String(i + 1).padStart(2, "0")}</span>
                                    {s.title}
                                </h2>
                                <DictamenMarkdown markdown={s.markdown} variant={sectionVariant(s.title)} th={th} />
                            </section>
                        ))}

                        {/* Fuentes citadas */}
                        {sources.length > 0 && (
                            <section id={`rv-${SOURCES_ID}`} className="mb-12">
                                <h2 className={`font-display text-2xl font-bold flex items-baseline gap-3 mb-5 ${th.head}`}>
                                    <span className={`text-sm font-sans font-bold ${th.accent}`}>{String(sections.length + 1).padStart(2, "0")}</span>
                                    {es ? "Fuentes citadas" : "Cited sources"}
                                </h2>
                                <SourcesGrid sources={sources} th={th} es={es} />
                            </section>
                        )}

                        <div className={`rounded-xl border p-4 text-xs leading-relaxed ${th.soft} ${th.muted}`}>
                            <strong className={th.head}>{es ? "Aviso legal." : "Legal notice."}</strong>{" "}
                            {es
                                ? "Esta es una orientación de pre-diagnóstico generada por IA. Para representación legal oficial, acuda a un abogado o asesor colegiado."
                                : "This is an AI-generated pre-diagnosis. For official legal representation, consult a licensed lawyer or advisor."}
                            {disclaimer && <span className="block mt-2 italic">{disclaimer.replace(/^(Aviso legal|Aviso|Advertencia|Disclaimer|Nota legal)\s*[:.]\s*/i, "")}</span>}
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
