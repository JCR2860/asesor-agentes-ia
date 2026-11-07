"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, ArrowLeft, Download, CheckCircle2, ShieldCheck, Sparkles, Loader2, Briefcase,
    Home as HomeIcon, Gavel, Users, Search, Globe, Mail, Eye, X, ClipboardList, Scale, FileEdit,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { UserMenu } from "@/components/user-menu";
import { documentTemplates, type DocumentTemplate } from "@/lib/document-templates";

// El texto de los documentos (≈ 600 KB) y el maquetador PDF se cargan solo al usarlos.
const loadContent = async (id: string) => (await import("@/lib/document-content")).DOCUMENT_CONTENT[id] || "";

const CATEGORY_ICON: Record<string, React.ReactNode> = {
    inmobiliario: <HomeIcon className="w-6 h-6" />, mercantil: <Briefcase className="w-6 h-6" />, laboral: <Users className="w-6 h-6" />,
    civil: <Gavel className="w-6 h-6" />, digital: <Globe className="w-6 h-6" />, reclamaciones: <Mail className="w-6 h-6" />,
};

// ── Vista previa con aspecto de documento de despacho ──
function DocumentPreview({ content }: { content: string }) {
    const blocks: React.ReactNode[] = [];
    let inNotes = false;
    let prevBlank = true;
    content.split(/\r?\n/).forEach((raw, i) => {
        const line = raw.trim();
        if (!line) { prevBlank = true; return; }
        const tight = !prevBlank;
        prevBlank = false;
        let m: RegExpMatchArray | null;
        if ((m = line.match(/^#\s+(.+)/))) { blocks.push(<h1 key={i} className="text-center font-bold text-xl uppercase tracking-wide mb-2">{m[1]}</h1>, <div key={`r${i}`} className="w-16 h-0.5 bg-gold-500 mx-auto mb-8" />); return; }
        if ((m = line.match(/^##\s+(.+)/))) {
            if (/^NOTAS DEL ASESOR/i.test(m[1])) {
                inNotes = true;
                blocks.push(<div key={i} className="mt-12 mb-4 rounded-lg border border-gold-500/40 bg-[#FAF6EC] px-4 py-3 font-sans"><div className="text-sm font-bold text-gold-700">NOTAS DEL ASESOR</div><div className="text-xs text-neutral-500">Guía para cumplimentar y firmar. No forma parte del documento: elimínela antes de firmar.</div></div>);
            } else blocks.push(<h2 key={i} className="text-center font-bold uppercase tracking-wide mt-8 mb-4">{m[1]}</h2>);
            return;
        }
        if ((m = line.match(/^###\s+(.+)/))) { blocks.push(<h3 key={i} className="font-bold mt-6 mb-2">{m[1]}</h3>); return; }
        if ((m = line.match(/^\[FIRMAS?:\s*(.+)\]$/i))) {
            const roles = m[1].split("|").map((x) => x.trim()).filter(Boolean);
            blocks.push(
                <div key={i} className={`grid ${roles.length > 1 ? "grid-cols-2" : "grid-cols-1 max-w-xs"} gap-8 mt-10 mb-6`}>
                    {roles.map((r) => (
                        <div key={r} className="text-center pt-14">
                            <div className="border-t border-neutral-400 mx-4 pt-2 text-xs font-bold uppercase">{r}</div>
                            <div className="text-xs text-neutral-500 mt-1">Fdo.: ____________________</div>
                        </div>
                    ))}
                </div>
            );
            return;
        }
        if (/^\(Esta sección no forma parte/i.test(line)) return;
        const gap = tight ? "mt-[-0.4rem] mb-2" : "mb-3";
        const notes = inNotes ? "font-sans text-[13px] text-neutral-700" : "";
        const bullet = line.match(/^[-•]\s+(.*)$/);
        const letter = line.match(/^([a-zñ]\)|[ivx]+\))\s+(.*)$/i);
        if (bullet) blocks.push(<p key={i} className={`pl-5 -indent-3 ${gap} ${notes}`}><span className="text-gold-700 mr-2">•</span>{bullet[1]}</p>);
        else if (letter) blocks.push(<p key={i} className={`pl-7 -indent-5 sm:text-justify ${gap}`}><span className="mr-2">{letter[1]}</span>{letter[2]}</p>);
        else blocks.push(<p key={i} className={`sm:text-justify ${gap} ${notes}`}>{line}</p>);
    });
    return <div className="font-serif text-[15px] leading-[1.75] text-neutral-900 [font-variant-numeric:lining-nums] [&_h1]:font-serif [&_h2]:font-serif">{blocks}</div>;
}

export default function DocumentosPage() {
    const { language } = useLanguage();
    const es = language === "es";
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [successId, setSuccessId] = useState<string | null>(null);
    const [preview, setPreview] = useState<{ template: DocumentTemplate; content: string } | null>(null);
    const [loadingPreview, setLoadingPreview] = useState<string | null>(null);

    const categories = [
        { id: "inmobiliario", label: es ? "Inmobiliario" : "Real Estate", icon: <HomeIcon className="w-4 h-4" /> },
        { id: "mercantil", label: es ? "Mercantil" : "Business", icon: <Briefcase className="w-4 h-4" /> },
        { id: "laboral", label: es ? "Laboral" : "Labor", icon: <Users className="w-4 h-4" /> },
        { id: "civil", label: es ? "Derecho Civil" : "Civil Law", icon: <Gavel className="w-4 h-4" /> },
        { id: "digital", label: es ? "Digital y Web" : "Digital & Web", icon: <Globe className="w-4 h-4" /> },
        { id: "reclamaciones", label: es ? "Reclamaciones" : "Claims", icon: <Mail className="w-4 h-4" /> },
    ];

    const filteredTemplates = documentTemplates.filter((tpl) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch = tpl.title.toLowerCase().includes(q) || tpl.description.toLowerCase().includes(q);
        return matchesSearch && (selectedCategory ? tpl.category === selectedCategory : true);
    });

    // Bloquear el scroll del fondo con la vista previa abierta; cerrar con Escape.
    useEffect(() => {
        if (!preview) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPreview(null); };
        window.addEventListener("keydown", onKey);
        return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
    }, [preview]);

    // Descarga en PDF (maquetado para imprimir y firmar) o Word (editable). La clave
    // "<id>:<formato>" permite mostrar el estado en el botón correcto.
    const download = async (template: DocumentTemplate, format: "pdf" | "docx") => {
        const key = `${template.id}:${format}`;
        setGeneratingId(key);
        try {
            const content = await loadContent(template.id);
            if (format === "pdf") {
                const { buildTemplatePDF } = await import("@/lib/document-pdf");
                buildTemplatePDF({ id: template.id, title: template.title, content }).save(`LexIA_${template.id}.pdf`);
            } else {
                const { buildTemplateDocx } = await import("@/lib/document-docx");
                const blob = await buildTemplateDocx({ id: template.id, title: template.title, content });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `LexIA_${template.id}.docx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 2000);
            }
            setSuccessId(key);
            setTimeout(() => setSuccessId((v) => (v === key ? null : v)), 4000);
        } catch (error) {
            console.error("Document generation failed", error);
            alert(es ? "No se pudo generar el documento. Inténtelo de nuevo." : "The document could not be generated. Please try again.");
        } finally {
            setGeneratingId(null);
        }
    };

    // Botones de descarga (tarjeta y vista previa)
    const downloadButtons = (template: DocumentTemplate, compact = false) => (["pdf", "docx"] as const).map((format) => {
        const key = `${template.id}:${format}`;
        const busy = generatingId === key;
        const done = successId === key;
        const primary = format === "pdf";
        return (
            <button key={format} onClick={() => download(template, format)} disabled={generatingId !== null}
                title={primary ? (es ? "PDF maquetado, listo para imprimir y firmar" : "Print-ready PDF") : (es ? "Word editable: rellénelo en el ordenador" : "Editable Word file")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all disabled:opacity-70 ${done
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : primary ? "bg-gold-600 text-white hover:bg-gold-700 shadow-lg shadow-gold-900/20" : "bg-neutral-800 text-neutral-100 border border-white/10 hover:border-gold-500/40"}`}>
                {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : done ? <CheckCircle2 className="w-3.5 h-3.5" /> : primary ? <Download className="w-3.5 h-3.5" /> : <FileEdit className="w-3.5 h-3.5" />}
                {compact ? (primary ? "PDF" : "Word") : done ? (es ? "¡Listo!" : "Done!") : primary ? "PDF" : "Word"}
            </button>
        );
    });

    const openPreview = async (template: DocumentTemplate) => {
        setLoadingPreview(template.id);
        try { setPreview({ template, content: await loadContent(template.id) }); }
        finally { setLoadingPreview(null); }
    };

    return (
        <div className="min-h-screen bg-[#04070E] text-white font-sans selection:bg-gold-600/30">
            {/* Header */}
            <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-neutral-900 transition-all text-neutral-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="font-extrabold text-xl tracking-tight">Lex<span className="text-gold-500">IA</span></span>
                        <span className="mx-1 sm:mx-2 text-neutral-800">|</span>
                        <span className="text-xs sm:text-sm font-bold text-neutral-500 uppercase tracking-widest truncate">
                            {es ? "Bóveda de Documentos" : "Document Vault"}
                        </span>
                    </div>
                </div>
                <UserMenu />
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gold-600/5 blur-[120px] rounded-full -z-10" />

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
                    <div className="max-w-2xl">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-[10px] font-bold uppercase tracking-widest mb-4 border border-gold-500/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            {es ? "Redacción de despacho" : "Law-firm drafting"}
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                            {es ? "Bóveda de Documentos Legales" : "Legal Document Vault"}
                        </h1>
                        <p className="text-lg text-neutral-400 leading-relaxed">
                            {es
                                ? "Contratos y escritos redactados con el rigor de un despacho de abogados: estipulaciones completas, cláusulas de protección de datos y de negociación previa actualizadas, y notas del asesor para cumplimentarlos sin errores."
                                : "Contracts and letters drafted with law-firm rigour: complete clauses, up-to-date data protection and pre-litigation negotiation terms, and adviser notes to fill them in correctly."}
                        </p>
                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-xs text-neutral-500">
                            <span className="inline-flex items-center gap-1.5"><Scale className="w-3.5 h-3.5 text-gold-500" />{es ? "Derecho español vigente" : "Current Spanish law"}</span>
                            <span className="inline-flex items-center gap-1.5"><ClipboardList className="w-3.5 h-3.5 text-gold-500" />{es ? "Notas del asesor en cada documento" : "Adviser notes in every document"}</span>
                            <span className="inline-flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-gold-500" />{es ? "PDF listo para firmar y Word editable" : "Print-ready PDF and editable Word"}</span>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input type="text" placeholder={es ? "Buscar documento..." : "Search document..."} value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-900/60 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all" />
                    </div>
                </div>

                {/* Categorías */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10">
                    <button onClick={() => setSelectedCategory(null)}
                        className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${selectedCategory === null ? "bg-white text-black border-white" : "bg-neutral-900/40 text-neutral-400 border-white/5 hover:border-white/10"}`}>
                        {es ? "Todos" : "All"}
                    </button>
                    {categories.map((cat) => (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${selectedCategory === cat.id ? "bg-gold-600 text-white border-gold-500 shadow-lg shadow-gold-900/20" : "bg-neutral-900/40 text-neutral-400 border-white/5 hover:border-white/10"}`}>
                            {cat.icon}{cat.label}
                        </button>
                    ))}
                </div>

                {/* Documentos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredTemplates.map((template) => (
                            <motion.div layout key={template.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative p-6 rounded-[2rem] bg-neutral-900/40 border border-white/5 hover:bg-neutral-900/60 hover:border-gold-500/30 transition-all flex flex-col gap-5">
                                <div className="flex items-start justify-between">
                                    <div className="p-4 rounded-2xl bg-neutral-800 text-gold-400 group-hover:bg-gold-600 group-hover:text-white transition-all">
                                        {CATEGORY_ICON[template.category]}
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-neutral-800/50 text-[9px] font-black uppercase tracking-widest text-neutral-500">
                                        {categories.find((c) => c.id === template.category)?.label}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-gold-400 transition-colors">{template.title}</h3>
                                    <p className="text-sm text-neutral-500 leading-relaxed">{template.description}</p>
                                </div>

                                <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                                    <span className="px-2.5 py-1 rounded-lg bg-neutral-800/70 text-neutral-400">≈ {template.pages} {es ? "págs." : "pages"}</span>
                                    <span className="px-2.5 py-1 rounded-lg bg-neutral-800/70 text-neutral-400">{template.words.toLocaleString(es ? "es-ES" : "en-US")} {es ? "palabras" : "words"}</span>
                                    <span className="px-2.5 py-1 rounded-lg bg-gold-500/10 text-gold-400 border border-gold-500/20">{es ? "Notas del asesor" : "Adviser notes"}</span>
                                    <span className="px-2.5 py-1 rounded-lg bg-neutral-800/70 text-neutral-400">PDF · Word</span>
                                </div>

                                <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between gap-2">
                                    <button onClick={() => openPreview(template)} disabled={loadingPreview !== null}
                                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-300 border border-white/10 hover:border-gold-500/40 hover:text-white transition-all">
                                        {loadingPreview === template.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                                        {es ? "Vista previa" : "Preview"}
                                    </button>
                                    <div className="flex items-center gap-2">{downloadButtons(template)}</div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredTemplates.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6"><Search className="w-8 h-8 text-neutral-700" /></div>
                        <h3 className="text-xl font-bold text-neutral-500">{es ? "No se han encontrado documentos" : "No documents found"}</h3>
                        <p className="text-sm text-neutral-600">{es ? "Pruebe con otros términos de búsqueda o categoría." : "Try other search terms or categories."}</p>
                    </div>
                )}

                {/* Garantía */}
                <div className="mt-20 p-8 sm:p-10 rounded-[3rem] bg-gradient-to-br from-gold-600/10 to-transparent border border-gold-500/10 flex flex-col md:flex-row items-center gap-8 sm:gap-10">
                    <div className="p-6 rounded-[2rem] bg-gold-600 text-white shadow-2xl shadow-gold-900/40 shrink-0"><ShieldCheck className="w-12 h-12" /></div>
                    <div>
                        <h3 className="text-2xl font-bold mb-4">{es ? "Calidad de despacho" : "Law-firm quality"}</h3>
                        <p className="text-neutral-400 leading-relaxed text-sm">
                            {es
                                ? "Cada documento está redactado como lo haría un abogado: partes plenamente identificadas, antecedentes, estipulaciones con sus supuestos y consecuencias, protección de datos conforme al RGPD, cláusula de negociación previa (LO 1/2025), notificaciones fehacientes y fuero aplicable. Al final encontrará las notas del asesor con los requisitos legales, la fiscalidad y los errores que conviene evitar. Descárguelo en Word para rellenarlo en el ordenador o en PDF para imprimirlo; complete los campos marcados, elimine las notas y, en operaciones de importe relevante, haga revisar el documento por un profesional antes de firmar."
                                : "Every document is drafted as a lawyer would: fully identified parties, recitals, clauses with their scenarios and consequences, GDPR-compliant data protection, pre-litigation negotiation clause, formal notices and jurisdiction. The adviser notes at the end cover legal requirements, tax and common mistakes. Download it in Word to fill it in on your computer or in PDF to print it; complete the marked fields, remove the notes and, for significant transactions, have a professional review the document before signing."}
                        </p>
                    </div>
                </div>
            </main>

            {/* Vista previa */}
            <AnimatePresence>
                {preview && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6"
                        onClick={() => setPreview(null)} role="dialog" aria-modal="true">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-4xl h-full max-h-[94vh] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900">
                            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10">
                                <div className="min-w-0">
                                    <div className="font-bold text-sm sm:text-base truncate">{preview.template.title}</div>
                                    <div className="text-[11px] text-neutral-500">≈ {preview.template.pages} {es ? "páginas" : "pages"} · {es ? "vista previa" : "preview"}</div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {downloadButtons(preview.template, true)}
                                    <button onClick={() => setPreview(null)} className="p-2 rounded-xl border border-white/10 text-neutral-400 hover:text-white" aria-label={es ? "Cerrar" : "Close"}>
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto bg-neutral-800/60 p-2 sm:p-8">
                                <div className="mx-auto max-w-[760px] bg-white rounded-sm shadow-xl px-6 sm:px-14 py-10 sm:py-14">
                                    <DocumentPreview content={preview.content} />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
