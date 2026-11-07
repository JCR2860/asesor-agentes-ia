"use client";
// ─────────────────────────────────────────────────────────────
//  Piezas compartidas para presentar un dictamen como documento:
//  las usan la respuesta dentro del chat (DictamenMessage) y la
//  vista de informe a pantalla completa (ReportView), para que el
//  dictamen se vea igual en ambos sitios.
// ─────────────────────────────────────────────────────────────
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle, CheckCircle2, Clock, Wallet, Gavel, FileText, BadgeCheck, ExternalLink } from "lucide-react";
import { levelTone, type ReportSource, type ReportSummary } from "@/lib/report";

// ── Paletas: oscuro premium y lectura clara tipo papel ──
export type DocTheme = {
    dark: boolean;
    card: string; soft: string; text: string; head: string; muted: string; accent: string;
    line: string; chip: string; th: string; tdBorder: string; btn: string;
};

export const DARK_THEME: DocTheme = {
    dark: true,
    card: "bg-neutral-900/50 border-neutral-800", soft: "bg-neutral-950/60 border-neutral-800",
    text: "text-neutral-300", head: "text-white", muted: "text-neutral-500", accent: "text-gold-400",
    line: "border-neutral-800", chip: "bg-neutral-800", th: "bg-neutral-800/60 text-gold-200", tdBorder: "border-neutral-800/70",
    btn: "bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800",
};

export const LIGHT_THEME: DocTheme = {
    dark: false,
    card: "bg-white border-[#E6DFCF]", soft: "bg-[#FAF7F0] border-[#E6DFCF]",
    text: "text-[#2C313C]", head: "text-[#0E1524]", muted: "text-[#6E7380]", accent: "text-gold-700",
    line: "border-[#E6DFCF]", chip: "bg-[#F0EADC]", th: "bg-[#F3EEE2] text-[#0E1524]", tdBorder: "border-[#EEE8DA]",
    btn: "bg-white border-[#E4DDCC] text-[#2C313C] hover:bg-[#FAF7F0]",
};

// Preferencia "modo lectura" compartida entre el chat y la vista de informe.
export const LIGHT_PREF_KEY = "lexia_report_light";
export function readLightPref(): boolean {
    try { return localStorage.getItem(LIGHT_PREF_KEY) === "1"; } catch { return false; }
}
export function saveLightPref(v: boolean) {
    try { localStorage.setItem(LIGHT_PREF_KEY, v ? "1" : "0"); } catch { /* sin almacenamiento */ }
}

// ── Tipo de sección según su título ──
export type SectionVariant = "normal" | "warnings" | "roadmap";
const WARN_RE = /aviso|advertencia|alerta|precauci|riesgos? cr[ií]tic|warning|critical/i;
const ROADMAP_RE = /hoja de ruta|pasos|plan de acci|calendario|roadmap|next steps|action plan/i;
export const sectionVariant = (title: string): SectionVariant =>
    WARN_RE.test(title) ? "warnings" : ROADMAP_RE.test(title) ? "roadmap" : "normal";

/** Quita del texto lo que nunca debe verse como prosa (gráficos antiguos, banderas). */
export function cleanDictamenText(content: string): string {
    return content
        .replace(/<(visual_graph|visual_data)>[\s\S]*?<\/\1>/g, "")
        .replace(/\[BANDERA:\s*(VERDE|AMARILLO|ROJO)\][^\n]*/g, "")
        .replace(/\[ASIGNAR:[^\]]*\]/g, "");
}

// ── Markdown con el estilo del despacho ──
// Memorizado: mientras el dictamen se escribe, solo se vuelve a procesar la
// sección que está cambiando (las anteriores tienen el mismo texto).
export const DictamenMarkdown = React.memo(function DictamenMarkdown(
    { markdown, variant = "normal", th }: { markdown: string; variant?: SectionVariant; th: DocTheme }
) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({ node, ...p }) => <p className="mb-4 last:mb-0 leading-[1.8] text-[16px]" {...p} />,
                strong: ({ node, ...p }) => <strong className={`font-semibold ${th.head}`} {...p} />,
                em: ({ node, ...p }) => <em className="italic" {...p} />,
                h1: ({ node, ...p }) => <h3 className={`font-display text-xl font-bold mt-7 mb-3 ${th.head}`} {...p} />,
                h2: ({ node, ...p }) => <h3 className={`font-display text-xl font-bold mt-7 mb-3 ${th.head}`} {...p} />,
                h3: ({ node, ...p }) => <h3 className={`font-display text-lg font-bold mt-7 mb-3 ${th.accent}`} {...p} />,
                h4: ({ node, ...p }) => <h4 className={`text-[13px] font-bold uppercase tracking-wider mt-6 mb-2 ${th.accent}`} {...p} />,
                a: ({ node, ...p }) => <a className={`${th.accent} underline underline-offset-2 decoration-gold-500/40 break-words hover:opacity-80`} target="_blank" rel="noopener noreferrer" {...p} />,
                // Citas y borradores de escritos: recuadro neutro de "documento".
                blockquote: ({ node, ...p }) => <blockquote className={`my-5 rounded-r-xl border-l-2 border-gold-500/60 px-5 py-3 text-[15px] ${th.dark ? "bg-white/[0.03]" : "bg-[#FAF7F0]"}`} {...p} />,
                pre: ({ node, children }) => (
                    <div className={`my-5 rounded-xl border p-5 text-[14px] leading-relaxed whitespace-pre-wrap break-words overflow-x-auto ${th.soft}
                        [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit [&_code]:font-sans [&_code]:text-[14px]`}>{children}</div>
                ),
                hr: () => <hr className={`my-7 ${th.line}`} />,
                code: ({ node, ...p }) => <code className={`px-1.5 py-0.5 rounded text-[13px] font-mono break-words ${th.chip} ${th.accent}`} {...p} />,
                table: ({ node, ...p }) => <div className={`my-6 overflow-x-auto rounded-xl border ${th.line}`}><table className="w-full text-left text-sm border-collapse" {...p} /></div>,
                thead: ({ node, ...p }) => <thead className={th.th} {...p} />,
                th: ({ node, ...p }) => <th className={`px-4 py-2.5 font-semibold border-b ${th.line} whitespace-nowrap`} {...p} />,
                td: ({ node, ...p }) => <td className={`px-4 py-2.5 border-b ${th.tdBorder} align-top leading-relaxed`} {...p} />,
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
                    return <li className="leading-[1.75] text-[16px] pl-1" {...p}>{children}</li>;
                },
            }}
        >
            {markdown}
        </ReactMarkdown>
    );
});

// ── Conclusión e indicadores ──
export function summaryIndicators(summary: ReportSummary | null, th: DocTheme, es: boolean) {
    if (!summary) return [];
    // En modo claro se usan tonos más oscuros para mantener el contraste sobre papel.
    const tone = {
        good: th.dark ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/25" : "text-emerald-700 bg-emerald-500/10 border-emerald-600/30",
        mid: th.dark ? "text-amber-500 bg-amber-500/10 border-amber-500/25" : "text-amber-700 bg-amber-500/10 border-amber-600/30",
        bad: th.dark ? "text-rose-500 bg-rose-500/10 border-rose-500/25" : "text-rose-700 bg-rose-500/10 border-rose-600/30",
        info: th.dark ? "text-sky-500 bg-sky-500/10 border-sky-500/25" : "text-sky-700 bg-sky-500/10 border-sky-600/30",
    };
    const toneClass = (t: ReturnType<typeof levelTone>) => t === "neutral" ? `${th.muted} ${th.soft}` : tone[t];
    return [
        summary.viabilidad && { icon: <CheckCircle2 className="w-4 h-4" />, label: es ? "Viabilidad" : "Feasibility", value: summary.viabilidad, c: toneClass(levelTone("viabilidad", summary.viabilidad)) },
        summary.riesgo && { icon: <AlertTriangle className="w-4 h-4" />, label: es ? "Riesgo" : "Risk", value: summary.riesgo, c: toneClass(levelTone("riesgo", summary.riesgo)) },
        summary.plazo_clave && { icon: <Clock className="w-4 h-4" />, label: es ? "Plazo clave" : "Key deadline", value: summary.plazo_clave, c: tone.bad },
        summary.coste && { icon: <Wallet className="w-4 h-4" />, label: es ? "Coste" : "Cost", value: summary.coste, c: tone.info },
    ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; c: string }[];
}

export function ConclusionPanel({ summary, th, es, className = "", accent = false }: { summary: ReportSummary | null; th: DocTheme; es: boolean; className?: string; accent?: boolean }) {
    const indicators = summaryIndicators(summary, th, es);
    if (!summary?.conclusion && indicators.length === 0) return null;
    // accent: panel con tinte dorado para destacar dentro de otra tarjeta (respuesta del chat).
    const surface = accent
        ? (th.dark ? "border-gold-500/25 bg-gold-500/[0.05]" : "border-gold-600/25 bg-[#FBF5E6]")
        : th.card;
    return (
        <div className={`rounded-2xl border p-4 sm:p-7 ${surface} ${className}`}>
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${th.accent}`}>{es ? "Conclusión" : "Conclusion"}</div>
            {summary?.conclusion && <p className={`font-display text-[17px] sm:text-xl leading-snug ${indicators.length ? "mb-5" : ""} ${th.head}`}>{summary.conclusion}</p>}
            {indicators.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    {indicators.map((k) => (
                        <div key={k.label} className={`rounded-xl border p-3 ${k.c}`}>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest opacity-90">{k.icon}{k.label}</div>
                            <div className="mt-1 text-sm font-bold leading-snug line-clamp-3" title={k.value}>{k.value}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Fuentes citadas ──
export function SourcesGrid({ sources, th, es }: { sources: ReportSource[]; th: DocTheme; es: boolean }) {
    return (
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
    );
}
