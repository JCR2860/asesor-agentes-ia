"use client";
// ─────────────────────────────────────────────────────────────
//  Presentación de la respuesta de los asesores y la Directora en el chat.
//
//  - DictamenMessage: el dictamen como documento (formato desde la primera
//    palabra, también mientras se escribe), con conclusión e indicadores,
//    índice, secciones numeradas, avisos, hoja de ruta, fuentes y acciones.
//  - DictamenPending: tarjeta de progreso mientras se investiga el caso.
//  - UserQuery: la consulta del cliente (con documentos adjuntos plegados).
// ─────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Scale, Crown, FileText, Copy, Check, FileDown, Loader2, Sun, Moon, ShieldCheck, ShieldAlert,
    ChevronDown, Gavel, CheckCircle2, Circle, Paperclip, List,
} from "lucide-react";
import { splitSummary, splitSections, extractSources, splitDisclaimer } from "@/lib/report";
import {
    DictamenMarkdown, ConclusionPanel, SourcesGrid, sectionVariant, cleanDictamenText,
    DARK_THEME, LIGHT_THEME, type DocTheme,
} from "@/components/dictamen-markdown";
import { parseQuery } from "@/components/case-intake";

// Superficies propias de la tarjeta del chat (el resto de la paleta es compartida).
const shellOf = (th: DocTheme) => th.dark
    ? { shell: "bg-[#0A101D] border-white/[0.07]", bar: "bg-white/[0.02] border-white/[0.06]" }
    : { shell: "bg-[#FBF9F4] border-[#E6DFCF]", bar: "bg-[#F4EFE3] border-[#E6DFCF]" };

// Divide el Markdown en bloques (párrafos, listas, tablas, borradores) para que,
// mientras se escribe, solo se vuelva a procesar el último bloque. Respeta los
// bloques de código y mantiene juntas las listas y sus párrafos sangrados.
const LIST_RE = /^\s*([-*+]|\d+[.)])\s/;
function splitBlocks(md: string): string[] {
    const blocks: string[] = [];
    let cur: string[] = [];
    let inFence = false;
    const push = () => {
        if (!cur.length) return;
        const block = cur.join("\n");
        const prev = blocks[blocks.length - 1];
        const continues = prev !== undefined && (/^\s{2,}\S/.test(block) || (LIST_RE.test(block) && LIST_RE.test(prev)));
        if (continues) blocks[blocks.length - 1] = prev + "\n\n" + block;
        else blocks.push(block);
        cur = [];
    };
    for (const line of md.split("\n")) {
        if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
        if (!inFence && line.trim() === "") { push(); continue; }
        cur.push(line);
    }
    push();
    return blocks;
}

function SectionBody({ markdown, variant = "normal", th, streaming }: { markdown: string; variant?: ReturnType<typeof sectionVariant>; th: DocTheme; streaming: boolean }) {
    if (!streaming) return <DictamenMarkdown markdown={markdown} variant={variant} th={th} />;
    return <>{splitBlocks(markdown).map((b, k) => <DictamenMarkdown key={k} markdown={b} variant={variant} th={th} />)}</>;
}

const formatDate = (es: boolean) =>
    new Date().toLocaleDateString(es ? "es-ES" : "en-US", { day: "numeric", month: "short", year: "numeric" });

type MessageProps = {
    index: number;
    content: string;
    streaming: boolean;
    elapsed: number;
    agentTitle: string;
    agentColor: string;
    isDirectora: boolean;
    modelLabel: string;
    country?: string;
    region?: string;
    language: "es" | "en";
    light: boolean;
    downloading: boolean;
    onToggleLight: () => void;
    onOpenReport: (index: number) => void;
    onDownloadPDF: () => void;
};

export const DictamenMessage = React.memo(function DictamenMessage(p: MessageProps) {
    const es = p.language === "es";
    const th = p.light ? LIGHT_THEME : DARK_THEME;
    const sh = shellOf(th);

    // Mientras se escribe, refrescamos el documento unas 5 veces por segundo en vez
    // de en cada fragmento: el texto aparece ya formateado sin congelar el navegador.
    const latest = useRef(p.content);
    latest.current = p.content;
    const [shown, setShown] = useState(p.content);
    useEffect(() => {
        if (!p.streaming) return;
        const id = setInterval(() => setShown((prev) => (prev === latest.current ? prev : latest.current)), 150);
        return () => clearInterval(id);
    }, [p.streaming]);
    const text = p.streaming ? shown : p.content;

    const { body, summary, intro, sections, sources, flag, disclaimer } = useMemo(() => {
        const flagMatch = text.match(/\[BANDERA:\s*(VERDE|AMARILLO|ROJO)\]\s*-?\s*([^\n]*)/);
        const { body, summary } = splitSummary(cleanDictamenText(text));
        // La línea final de aviso legal se muestra como nota discreta al pie.
        const { body: main, disclaimer } = splitDisclaimer(body);
        const { intro, sections } = splitSections(main);
        return {
            body, summary, intro, sections, disclaimer,
            // Las fuentes se calculan al terminar (durante la escritura no hacen falta).
            sources: p.streaming ? [] : extractSources(body),
            flag: flagMatch ? { type: flagMatch[1] as "VERDE" | "AMARILLO" | "ROJO", text: flagMatch[2].trim() } : null,
        };
    }, [text, p.streaming]);

    const [copied, setCopied] = useState(false);
    const [sourcesOpen, setSourcesOpen] = useState(false);
    const copy = async () => {
        try { await navigator.clipboard.writeText(body); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* sin portapapeles */ }
    };
    const anchor = (id: string) => `dm-${p.index}-${id}`;
    const goTo = (id: string) => document.getElementById(anchor(id))?.scrollIntoView({ behavior: "smooth", block: "start" });

    const showToc = !p.streaming && sections.length >= 4;
    const official = sources.filter((s) => s.official).length;
    const meta = [es ? "Dictamen" : "Opinion", p.country, p.region, formatDate(es)].filter(Boolean).join(" · ");

    return (
        <article className={`w-full rounded-2xl border overflow-hidden shadow-2xl shadow-black/40 transition-colors duration-300 ${sh.shell} ${th.text}`}>
            <div className="h-[2px] bg-gradient-to-r from-gold-600 via-gold-400 to-transparent" />

            {/* Cabecera: quién firma y estado */}
            <header className={`flex items-center justify-between gap-3 px-4 sm:px-7 py-3 border-b ${sh.bar}`}>
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center ${p.agentColor}`}>
                        {p.isDirectora ? <Crown className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                        <div className={`font-display text-[15px] font-bold truncate ${th.head}`}>
                            {p.agentTitle} <span className={`font-sans text-[11px] font-semibold ${th.muted}`}>· {p.modelLabel}</span>
                        </div>
                        <div className={`text-[10px] uppercase tracking-widest truncate ${th.muted}`}>{meta}</div>
                    </div>
                </div>
                {p.streaming ? (
                    <span className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                        {es ? "Redactando" : "Writing"} · <span className="font-mono tabular-nums">{p.elapsed}s</span>
                    </span>
                ) : (
                    <div className="shrink-0 flex items-center gap-1.5">
                        <button onClick={p.onToggleLight} className={`p-2 rounded-lg border ${th.btn}`} title={p.light ? (es ? "Modo oscuro" : "Dark mode") : (es ? "Modo lectura (claro)" : "Reading mode (light)")}>
                            {p.light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </button>
                        <button onClick={() => p.onOpenReport(p.index)} className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold-500/10 border hover:bg-gold-500/20 text-[11px] font-bold transition-colors ${th.dark ? "border-gold-500/30 text-gold-400" : "border-gold-600/40 text-gold-700"}`}>
                            <FileText className="w-3.5 h-3.5" />
                            {es ? "Ver como informe" : "View as report"}
                        </button>
                    </div>
                )}
            </header>

            {/* Documento */}
            <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-9">
                <div className="max-w-3xl mx-auto">
                    {summary?.titulo && (
                        <h2 className={`font-display text-2xl sm:text-[28px] font-bold leading-tight mb-5 ${th.head}`}>{summary.titulo}</h2>
                    )}
                    <ConclusionPanel summary={summary} th={th} es={es} accent className="mb-8" />

                    {showToc && (
                        <nav className="mb-9" aria-label={es ? "Índice del dictamen" : "Contents"}>
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-2.5 ${th.muted}`}>
                                <List className="w-3.5 h-3.5" />{es ? "Índice" : "Contents"}
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
                                {sections.map((s, i) => (
                                    <button key={s.id} onClick={() => goTo(s.id)} className={`shrink-0 max-w-[260px] truncate px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${th.btn} hover:border-gold-500/40`}>
                                        <span className={`font-bold tabular-nums mr-1.5 ${th.accent}`}>{String(i + 1).padStart(2, "0")}</span>{s.title}
                                    </button>
                                ))}
                            </div>
                        </nav>
                    )}

                    {intro && (sections.length > 0
                        ? <div className="mb-9"><SectionBody markdown={intro} th={th} streaming={p.streaming} /></div>
                        : <SectionBody markdown={intro} th={th} streaming={p.streaming} />)}

                    {sections.map((s, i) => (
                        <section key={s.id} id={anchor(s.id)} className="scroll-mt-6 mb-11 last:mb-0">
                            <h2 className={`font-display text-xl sm:text-2xl font-bold flex items-baseline gap-3 mb-5 pb-3 border-b ${th.line} ${th.head}`}>
                                <span className={`text-xs font-sans font-bold tabular-nums ${th.accent}`}>{String(i + 1).padStart(2, "0")}</span>
                                <span className="min-w-0">{s.title}</span>
                            </h2>
                            <SectionBody markdown={s.markdown} variant={sectionVariant(s.title)} th={th} streaming={p.streaming} />
                        </section>
                    ))}

                    {flag && (
                        <div className={`mt-8 p-4 rounded-xl border flex gap-3 ${flag.type === "VERDE" ? "border-emerald-500/30 bg-emerald-500/[0.07]" : flag.type === "AMARILLO" ? "border-amber-500/30 bg-amber-500/[0.07]" : "border-rose-500/30 bg-rose-500/[0.07]"}`}>
                            <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${flag.type === "VERDE" ? "text-emerald-500" : flag.type === "AMARILLO" ? "text-amber-500" : "text-rose-500"}`} />
                            <div className="text-[15px] leading-relaxed">
                                <div className={`font-bold mb-0.5 ${th.head}`}>
                                    {flag.type === "VERDE" ? (es ? "Nivel seguro" : "Safe level") : flag.type === "AMARILLO" ? (es ? "Atención" : "Caution") : (es ? "Riesgo alto" : "High risk")}
                                </div>
                                {flag.text}
                            </div>
                        </div>
                    )}

                    {disclaimer && (
                        <p className={`mt-9 text-xs italic leading-relaxed ${th.muted}`}>{disclaimer}</p>
                    )}

                    {p.streaming && (
                        <div className={`mt-6 flex items-center gap-2 text-xs ${th.muted}`}>
                            <span className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                            {p.isDirectora
                                ? (es ? "La Directora sigue redactando el dictamen. No cierre la pestaña." : "The Director is still writing. Do not close the tab.")
                                : (es ? "Su asesor sigue redactando…" : "Your advisor is still writing…")}
                        </div>
                    )}

                    {/* Fuentes citadas (plegadas para no repetir lo que ya está en el texto) */}
                    {sources.length > 0 && (
                        <div className={`mt-10 pt-6 border-t ${th.line}`}>
                            <button onClick={() => setSourcesOpen(!sourcesOpen)} className="w-full flex items-center justify-between gap-3 text-left">
                                <span className={`flex items-center gap-2 text-sm font-semibold ${th.head}`}>
                                    <Gavel className={`w-4 h-4 ${th.accent}`} />
                                    {es ? "Fuentes citadas" : "Cited sources"}
                                    <span className={`font-normal ${th.muted}`}>
                                        · {sources.length}{official > 0 ? ` (${official} ${es ? (official === 1 ? "oficial" : "oficiales") : "official"})` : ""}
                                    </span>
                                </span>
                                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${th.muted} ${sourcesOpen ? "rotate-180" : ""}`} />
                            </button>
                            {sourcesOpen && <div className="mt-4"><SourcesGrid sources={sources} th={th} es={es} /></div>}
                        </div>
                    )}
                </div>
            </div>

            {/* Acciones al terminar */}
            {!p.streaming && (
                <footer className={`px-4 sm:px-7 py-4 border-t flex flex-col md:flex-row md:items-center justify-between gap-3 ${sh.bar}`}>
                    <div className={`flex items-center gap-2 text-xs ${th.muted}`}>
                        <ShieldCheck className={`w-4 h-4 shrink-0 ${th.accent}`} />
                        {es ? "Copia única: no guardamos este dictamen. Descargue el PDF antes de salir." : "Only copy: we don't store this opinion. Download the PDF before leaving."}
                    </div>
                    <div className="grid grid-cols-2 sm:flex gap-2 shrink-0">
                        <button onClick={copy} className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold ${th.btn}`}>
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? (es ? "Copiado" : "Copied") : (es ? "Copiar" : "Copy")}
                        </button>
                        <button onClick={p.onDownloadPDF} disabled={p.downloading} className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold disabled:opacity-60 ${th.btn}`}>
                            {p.downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                            PDF
                        </button>
                        <button onClick={() => p.onOpenReport(p.index)} className="col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gold-600 hover:bg-gold-700 text-white text-xs font-bold transition-colors">
                            <FileText className="w-4 h-4" />
                            {es ? "Abrir vista de informe" : "Open report view"}
                        </button>
                    </div>
                </footer>
            )}
        </article>
    );
});

// ─────────────────────────────────────────────────────────────
//  Tarjeta de progreso antes de que empiece a escribir
// ─────────────────────────────────────────────────────────────
export function DictamenPending(p: { elapsed: number; isDirectora: boolean; agentTitle: string; agentColor: string; modelLabel: string; language: "es" | "en"; light: boolean }) {
    const es = p.language === "es";
    const th = p.light ? LIGHT_THEME : DARK_THEME;
    const sh = shellOf(th);
    const searchEnd = p.isDirectora ? 11 : 9;
    const steps = [
        es ? "Consulta recibida" : "Query received",
        es ? "Investigando legislación vigente y fuentes oficiales" : "Researching current legislation and official sources",
        p.isDirectora
            ? (es ? "Coordinando a los especialistas y razonando el caso" : "Coordinating specialists and reasoning the case")
            : (es ? "Analizando su caso" : "Analysing your case"),
        es ? "Redactando el dictamen" : "Writing the opinion",
    ];
    const current = p.elapsed < 1 ? 0 : p.elapsed < searchEnd ? 1 : 2;
    const slow = p.isDirectora ? p.elapsed >= 120 : p.elapsed >= 45;

    return (
        <div className={`w-full rounded-2xl border overflow-hidden shadow-2xl shadow-black/40 ${sh.shell} ${th.text}`}>
            <div className="relative h-[2px] overflow-hidden bg-gold-500/15">
                <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold-400 to-transparent animate-[lexia-indeterminate_1.6s_ease-in-out_infinite]" />
            </div>
            <div className={`flex items-center justify-between gap-3 px-4 sm:px-7 py-3 border-b ${sh.bar}`}>
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center ${p.agentColor}`}>
                        {p.isDirectora ? <Crown className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                        <div className={`font-display text-[15px] font-bold truncate ${th.head}`}>{p.agentTitle} <span className={`font-sans text-[11px] font-semibold ${th.muted}`}>· {p.modelLabel}</span></div>
                        <div className={`text-[10px] uppercase tracking-widest ${th.muted}`}>{es ? "Preparando su dictamen" : "Preparing your opinion"}</div>
                    </div>
                </div>
                <span className={`shrink-0 font-mono text-xs tabular-nums ${th.muted}`}>{p.elapsed}s</span>
            </div>
            <div className="px-5 sm:px-8 py-5">
                <ol className="space-y-3">
                    {steps.map((label, i) => {
                        const done = i < current;
                        const active = i === current;
                        return (
                            <li key={label} className={`flex items-center gap-3 text-sm ${done ? th.text : active ? th.head + " font-semibold" : th.muted}`}>
                                {done ? <CheckCircle2 className="w-4 h-4 shrink-0 text-gold-500" />
                                    : active ? <Loader2 className="w-4 h-4 shrink-0 text-gold-500 animate-spin" />
                                        : <Circle className="w-4 h-4 shrink-0 opacity-40" />}
                                {label}
                            </li>
                        );
                    })}
                </ol>
                <p className={`mt-5 pt-4 border-t text-xs leading-relaxed ${th.line} ${slow ? "text-amber-500" : th.muted}`}>
                    {slow
                        ? (es ? "Su caso requiere más análisis de lo habitual. El dictamen sigue en curso: no cierre la pestaña." : "Your case needs more analysis than usual. Still in progress: do not close the tab.")
                        : p.isDirectora
                            ? (es ? "Un dictamen completo de la Directora suele tardar entre 2 y 3 minutos. Verá el texto aparecer en cuanto empiece a redactar." : "A full opinion from the Director usually takes 2–3 minutes. Text will appear as soon as writing starts.")
                            : (es ? "Su asesor suele empezar a escribir en unos 15 segundos, tras consultar las fuentes oficiales." : "Your advisor usually starts writing in about 15 seconds, after checking official sources.")}
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
//  Consulta del cliente
// ─────────────────────────────────────────────────────────────
export function UserQuery({ content, language, imageCount = 0 }: { content: string; language: "es" | "en"; imageCount?: number }) {
    const es = language === "es";
    const [open, setOpen] = useState(false);
    const { text, ficha, docName } = parseQuery(content);
    const long = text.length > 650;

    return (
        <div className="flex justify-end">
            <div className="max-w-[94%] sm:max-w-[80%] rounded-2xl rounded-tr-md border border-gold-500/25 bg-gradient-to-br from-gold-500/[0.13] to-gold-500/[0.04] px-5 py-4 shadow-lg shadow-black/20">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gold-400 mb-1.5">{es ? "Su consulta" : "Your query"}</div>
                {text && (
                    <div className={`whitespace-pre-wrap break-words text-[15px] leading-relaxed text-neutral-100 ${long && !open ? "line-clamp-6" : ""}`}>{text}</div>
                )}
                {long && (
                    <button onClick={() => setOpen(!open)} className="mt-2 text-xs font-semibold text-gold-300 hover:text-gold-200">
                        {open ? (es ? "Mostrar menos" : "Show less") : (es ? "Ver consulta completa" : "Show full query")}
                    </button>
                )}
                {ficha.length > 0 && (
                    <dl className="mt-3 pt-3 border-t border-gold-500/15 grid sm:grid-cols-2 gap-x-5 gap-y-1.5">
                        {ficha.map(([k, v]) => (
                            <div key={k} className="min-w-0 text-xs leading-snug">
                                <dt className="inline text-gold-400/80 font-semibold">{k}: </dt>
                                <dd className="inline text-neutral-200 break-words">{v}</dd>
                            </div>
                        ))}
                    </dl>
                )}
                {(docName || imageCount > 0) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {docName && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/25 border border-white/10 text-xs text-neutral-300 max-w-full">
                                <Paperclip className="w-3.5 h-3.5 shrink-0 text-gold-400" /><span className="truncate">{docName}</span>
                            </span>
                        )}
                        {imageCount > 0 && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/25 border border-white/10 text-xs text-neutral-300">
                                <Paperclip className="w-3.5 h-3.5 text-gold-400" />{imageCount} {es ? (imageCount === 1 ? "imagen adjunta" : "imágenes adjuntas") : "image(s)"}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
