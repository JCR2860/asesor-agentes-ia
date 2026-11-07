"use client";
// ─────────────────────────────────────────────────────────────
//  Ficha del caso y selector de comunidad autónoma.
//  Los datos que más cambian un dictamen (quién es el cliente, fechas,
//  importes, si hay un procedimiento abierto y qué quiere conseguir) se
//  piden de forma estructurada y se añaden a la consulta como un bloque
//  [FICHA DEL CASO] que el asesor recibe junto al texto.
// ─────────────────────────────────────────────────────────────
import React from "react";
import { MapPin, ClipboardList, ChevronDown } from "lucide-react";
import { regionSetFor } from "@/lib/regions";

export type CaseFicha = {
    perfil?: string;
    municipio?: string;
    fechas?: string;
    importe?: string;
    procedimiento?: string;
    objetivo?: string;
};

const FICHA_TAG = "[FICHA DEL CASO]";

const PERFILES = {
    es: ["Particular", "Autónomo / profesional", "Empresa", "Heredero / familia", "Otro"],
    en: ["Individual", "Self-employed", "Company", "Heir / family", "Other"],
};
const PROCEDIMIENTOS = {
    es: ["No", "Sí, administrativo (Hacienda, Seguridad Social…)", "Sí, judicial", "No lo sé"],
    en: ["No", "Yes, administrative", "Yes, court proceedings", "I don't know"],
};

/** Convierte la ficha en el bloque de texto que se añade a la consulta (solo campos rellenos). */
export function formatFicha(f: CaseFicha, country?: string, region?: string, es = true): string {
    const set = regionSetFor(country);
    const rows = [
        region && [set ? set.label[es ? "es" : "en"] : (es ? "Región" : "Region"), region],
        f.perfil && [es ? "Perfil del cliente" : "Client profile", f.perfil],
        f.municipio?.trim() && [es ? "Ciudad o municipio" : "City", f.municipio.trim()],
        f.fechas?.trim() && [es ? "Fechas clave" : "Key dates", f.fechas.trim()],
        f.importe?.trim() && [es ? "Importe aproximado" : "Approximate amount", f.importe.trim()],
        f.procedimiento && [es ? "Procedimiento abierto" : "Open proceedings", f.procedimiento],
        f.objetivo?.trim() && [es ? "Objetivo" : "Goal", f.objetivo.trim()],
    ].filter(Boolean) as string[][];
    if (!rows.length) return "";
    return `${FICHA_TAG}\n${rows.map(([k, v]) => `- ${k}: ${v.replace(/\s+/g, " ").slice(0, 300)}`).join("\n")}`;
}

/** Separa el texto de la consulta, la ficha y el documento adjunto (para mostrarlos por separado). */
export function parseQuery(content: string): { text: string; ficha: [string, string][]; docName?: string } {
    const docMatch = content.match(/\n*\[DOCUMENTO ADJUNTO:\s*([^\]]+)\]/);
    const beforeDoc = docMatch ? content.slice(0, docMatch.index) : content;
    const i = beforeDoc.indexOf(FICHA_TAG);
    const text = (i >= 0 ? beforeDoc.slice(0, i) : beforeDoc).trim();
    const ficha: [string, string][] = i >= 0
        ? beforeDoc.slice(i + FICHA_TAG.length).split("\n")
            .map((l) => l.match(/^\s*-\s*([^:]+):\s*(.+)$/))
            .filter(Boolean)
            .map((m) => [m![1].trim(), m![2].trim()] as [string, string])
        : [];
    return { text, ficha, docName: docMatch?.[1]?.trim() };
}

// ── Selector de región (comunidad autónoma, estado, provincia…) para países con legislación regional ──
export function RegionSelect({ country, value, onChange, language, className = "" }: { country: string; value: string; onChange: (v: string) => void; language: "es" | "en"; className?: string }) {
    const es = language === "es";
    const set = regionSetFor(country);
    if (!set) return null;
    const label = set.label[language];
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`flex-1 min-w-0 bg-neutral-900 border ${value ? "border-neutral-800" : "border-gold-500/30"} text-neutral-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all`}
                title={es ? `En ${country}, impuestos y parte de la legislación cambian según ${label.toLowerCase()}` : `In ${country}, taxes and part of the law vary by ${label.toLowerCase()}`}
            >
                <option value="">{`📍 ${label} (${es ? "recomendado" : "recommended"})`}</option>
                {set.regions.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
            </select>
        </div>
    );
}

// ── Ficha del caso (desplegable) ──
export function CaseIntakeFields({ value, onChange, language, open, onToggle }: {
    value: CaseFicha; onChange: (v: CaseFicha) => void; language: "es" | "en"; open: boolean; onToggle: () => void;
}) {
    const es = language === "es";
    const set = (k: keyof CaseFicha) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange({ ...value, [k]: e.target.value });
    const filled = Object.values(value).filter((v) => v && String(v).trim()).length;
    const input = "w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50";
    const label = "block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1";

    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60">
            <button type="button" onClick={onToggle} className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left">
                <span className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                    <ClipboardList className="w-4 h-4 text-gold-500" />
                    {es ? "Ficha del caso" : "Case details"}
                    <span className="font-normal text-neutral-500">
                        {filled ? `· ${filled} ${es ? (filled === 1 ? "dato" : "datos") : "fields"}` : (es ? "· opcional, mejora mucho la precisión" : "· optional, greatly improves accuracy")}
                    </span>
                </span>
                <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="grid sm:grid-cols-2 gap-3 px-3 pb-3">
                    <div>
                        <label className={label}>{es ? "Usted es" : "You are"}</label>
                        <select value={value.perfil || ""} onChange={set("perfil")} className={input}>
                            <option value="">—</option>
                            {PERFILES[language].map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={label}>{es ? "¿Hay un procedimiento abierto?" : "Open proceedings?"}</label>
                        <select value={value.procedimiento || ""} onChange={set("procedimiento")} className={input}>
                            <option value="">—</option>
                            {PROCEDIMIENTOS[language].map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={label}>{es ? "Ciudad o municipio" : "City or town"}</label>
                        <input value={value.municipio || ""} onChange={set("municipio")} maxLength={80} className={input}
                            placeholder={es ? "p. ej. Medellín (impuestos locales, urbanismo)" : "e.g. city (local taxes, zoning)"} />
                    </div>
                    <div>
                        <label className={label}>{es ? "Fechas clave" : "Key dates"}</label>
                        <input value={value.fechas || ""} onChange={set("fechas")} maxLength={200} className={input}
                            placeholder={es ? "p. ej. fallecimiento 03/2026, despido 15/10" : "e.g. notice received 15/10"} />
                    </div>
                    <div>
                        <label className={label}>{es ? "Importe aproximado" : "Approximate amount"}</label>
                        <input value={value.importe || ""} onChange={set("importe")} maxLength={120} className={input}
                            placeholder={es ? "p. ej. piso de 250.000 €, salario 2.000 €/mes" : "e.g. €250,000 property"} />
                    </div>
                    <div>
                        <label className={label}>{es ? "¿Qué quiere conseguir?" : "What do you want to achieve?"}</label>
                        <input value={value.objetivo || ""} onChange={set("objetivo")} maxLength={240} className={input}
                            placeholder={es ? "p. ej. pagar lo mínimo legalmente, recuperar la fianza, evitar un juicio" : "e.g. pay the legal minimum, avoid court"} />
                    </div>
                    <p className="sm:col-span-2 text-[11px] text-neutral-600 leading-relaxed">
                        {es ? "No escriba nombres, DNI ni datos bancarios: no hacen falta para el dictamen." : "Do not include names, IDs or bank details: they are not needed."}
                    </p>
                </div>
            )}
        </div>
    );
}
