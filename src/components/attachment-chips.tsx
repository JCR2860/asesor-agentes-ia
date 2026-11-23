"use client";
// Lista de documentos adjuntos de la consulta, con su estado de lectura.
import React from "react";
import { FileText, Image as ImageIcon, FileType, Loader2, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { MAX_PAGES, type ChatAttachment } from "@/lib/attachments";

export function AttachmentChips({ list, onRemove, language }: { list: ChatAttachment[]; onRemove: (id: string) => void; language: "es" | "en" }) {
    const es = language === "es";
    if (!list.length) return null;
    const pages = list.filter((a) => a.status === "ready").reduce((s, a) => s + a.pages, 0);
    const icon = (a: ChatAttachment) => a.kind === "image" ? <ImageIcon className="w-4 h-4" /> : a.kind === "word" ? <FileType className="w-4 h-4" /> : <FileText className="w-4 h-4" />;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap gap-2">
                {list.map((a) => (
                    <div key={a.id} title={a.error || a.name}
                        className={`flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-lg border text-xs max-w-full ${a.status === "error"
                            ? "bg-red-500/10 border-red-500/30 text-red-200"
                            : a.status === "ready" ? "bg-gold-500/10 border-gold-500/25 text-gold-200" : "bg-neutral-900 border-neutral-700 text-neutral-300"}`}>
                        <span className="shrink-0 opacity-80">{icon(a)}</span>
                        <span className="font-medium truncate max-w-[160px] sm:max-w-[220px]">{a.name}</span>
                        <span className="shrink-0 flex items-center gap-1 text-[11px] opacity-90">
                            {a.status === "processing" && (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    {a.progress && a.progress.total > 1
                                        ? (es ? `Leyendo ${a.progress.done}/${a.progress.total}` : `Reading ${a.progress.done}/${a.progress.total}`)
                                        : (es ? "Leyendo…" : "Reading…")}
                                </>
                            )}
                            {a.status === "ready" && (
                                <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    {a.pages} {es ? (a.pages === 1 ? "pág." : "págs.") : (a.pages === 1 ? "page" : "pages")}
                                </>
                            )}
                            {a.status === "error" && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                        </span>
                        <button type="button" onClick={() => onRemove(a.id)} disabled={a.status === "processing"}
                            className="shrink-0 p-0.5 rounded hover:bg-white/10 disabled:opacity-30" aria-label={es ? "Quitar" : "Remove"}>
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>
            {list.filter((a) => a.status === "error").map((a) => (
                <p key={`e-${a.id}`} className="text-[11px] text-red-300/90 leading-snug">{a.name}: {a.error}</p>
            ))}
            {pages > 0 && (
                <p className="text-[11px] text-neutral-500">
                    {es ? `${pages} de ${MAX_PAGES} páginas por consulta. Las fotos y los escaneos se transcriben automáticamente.` : `${pages} of ${MAX_PAGES} pages per query. Photos and scans are transcribed automatically.`}
                </p>
            )}
        </div>
    );
}
