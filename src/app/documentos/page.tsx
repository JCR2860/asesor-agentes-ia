"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FileText, 
    ArrowLeft, 
    Download, 
    CheckCircle2, 
    ShieldCheck, 
    Sparkles,
    Loader2,
    Briefcase,
    Home as HomeIcon,
    Shield,
    Gavel,
    Users,
    Search
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { UserMenu } from "@/components/user-menu";
import { documentTemplates, DocumentTemplate } from "@/lib/document-templates";
import jsPDF from "jspdf";

export default function DocumentosPage() {
    const { t, language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [successId, setSuccessId] = useState<string | null>(null);

    const categories = [
        { id: 'inmobiliario', label: language === 'es' ? 'Inmobiliario' : 'Real Estate', icon: <HomeIcon className="w-4 h-4" /> },
        { id: 'mercantil', label: language === 'es' ? 'Mercantil' : 'Business', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'laboral', label: language === 'es' ? 'Laboral' : 'Labor', icon: <Users className="w-4 h-4" /> },
        { id: 'civil', label: language === 'es' ? 'Derecho Civil' : 'Civil Law', icon: <Gavel className="w-4 h-4" /> },
    ];

    const filteredTemplates = documentTemplates.filter(template => {
        const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             template.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? template.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const downloadPDF = async (template: DocumentTemplate) => {
        setGeneratingId(template.id);
        
        // Simular procesamiento para feedback visual premium
        await new Promise(r => setTimeout(r, 1200));

        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            let y = 25;

            // Header Premium
            doc.setFillColor(30, 64, 175);
            doc.rect(0, 0, pageWidth, 40, 'F');
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(28);
            doc.setTextColor(255, 255, 255);
            doc.text("LexIA", margin, 25);
            
            doc.setFontSize(8);
            doc.setTextColor(200, 220, 255);
            doc.text("DOCUMENTACIÓN LEGAL DE ÉLITE", margin, 32);
            
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.text(`ID-DOC: ${template.id.toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`, pageWidth - margin, 25, { align: "right" });

            y = 55;

            // Title
            doc.setFontSize(18);
            doc.setTextColor(40, 40, 40);
            doc.setFont("helvetica", "bold");
            doc.text(template.title.toUpperCase(), pageWidth / 2, y, { align: "center" });
            
            y += 15;
            doc.setDrawColor(230, 230, 230);
            doc.line(margin, y, pageWidth - margin, y);
            y += 15;

            // Content
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.5);
            doc.setTextColor(60, 60, 60);

            const splitContent = doc.splitTextToSize(template.content, pageWidth - 2 * margin);
            
            splitContent.forEach((line: string) => {
                if (y > pageHeight - margin - 15) {
                    doc.addPage();
                    y = margin;
                    // Mini header on new pages
                    doc.setFontSize(8);
                    doc.setTextColor(180);
                    doc.text("LexIA - " + template.title, margin, y);
                    y += 15;
                    doc.setFontSize(10.5);
                    doc.setTextColor(60);
                }
                doc.text(line, margin, y);
                y += 6.5;
            });

            // Footer con Disclaimer
            y += 15;
            if (y > pageHeight - 40) { doc.addPage(); y = 30; }
            
            doc.setFillColor(248, 250, 252);
            doc.rect(margin, y, pageWidth - 2 * margin, 20, 'F');
            doc.setDrawColor(226, 232, 240);
            doc.rect(margin, y, pageWidth - 2 * margin, 20, 'S');
            
            doc.setFontSize(7);
            doc.setTextColor(120);
            const disclaimer = "AVISO LEGAL: Este documento es una plantilla jurídica estándar de alta fidelidad. LexIA proporciona este material con fines informativos. Se recomienda que los espacios subrayados sean completados con datos veraces y que el documento final sea revisado por un profesional jurídico antes de su firma para asegurar el cumplimiento con la normativa específica de su jurisdicción.";
            const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin - 10);
            doc.text(splitDisclaimer, margin + 5, y + 7);

            doc.save(`LexIA_${template.id}_${new Date().getTime()}.pdf`);
            
            setSuccessId(template.id);
            setTimeout(() => setSuccessId(null), 4000);
        } catch (error) {
            console.error("PDF generation failed", error);
        } finally {
            setGeneratingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-600/30">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-neutral-900 transition-all text-neutral-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xl tracking-tight">Lex<span className="text-blue-500">IA</span></span>
                        <span className="mx-2 text-neutral-800">|</span>
                        <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">
                            {language === 'es' ? 'Bóveda de Documentos' : 'Document Vault'}
                        </span>
                    </div>
                </div>
                <UserMenu />
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 relative">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4 border border-blue-500/20"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Acceso Directo Elite
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                            {language === 'es' ? "Bóveda de Documentos Legales" : "Legal Document Vault"}
                        </h1>
                        <p className="text-lg text-neutral-400">
                            {language === 'es' 
                                ? "Descarga directa de contratos y plantillas jurídicas profesionales de alta fidelidad, listos para imprimir y firmar." 
                                : "Direct download of professional, high-fidelity legal contracts and templates, ready to print and sign."}
                        </p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input 
                            type="text"
                            placeholder={language === 'es' ? "Buscar contrato..." : "Search contract..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-900/60 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap items-center gap-3 mb-10">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                            selectedCategory === null 
                            ? "bg-white text-black border-white" 
                            : "bg-neutral-900/40 text-neutral-400 border-white/5 hover:border-white/10"
                        }`}
                    >
                        {language === 'es' ? 'Todos' : 'All'}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                                selectedCategory === cat.id 
                                ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20" 
                                : "bg-neutral-900/40 text-neutral-400 border-white/5 hover:border-white/10"
                            }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredTemplates.map((template) => (
                            <motion.div
                                layout
                                key={template.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative p-6 rounded-[2rem] bg-neutral-900/40 border border-white/5 hover:bg-neutral-900/60 hover:border-blue-500/30 transition-all flex flex-col gap-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="p-4 rounded-2xl bg-neutral-800 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        {template.category === 'inmobiliario' && <HomeIcon className="w-6 h-6" />}
                                        {template.category === 'mercantil' && <Briefcase className="w-6 h-6" />}
                                        {template.category === 'laboral' && <Users className="w-6 h-6" />}
                                        {template.category === 'civil' && <Gavel className="w-6 h-6" />}
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-neutral-800/50 text-[9px] font-black uppercase tracking-widest text-neutral-500">
                                        {template.category}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{template.title}</h3>
                                    <p className="text-sm text-neutral-500 leading-relaxed">
                                        {template.description}
                                    </p>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-600 uppercase tracking-tighter">
                                        <FileText className="w-3 h-3" />
                                        PDF Profesional
                                    </div>
                                    <button
                                        onClick={() => downloadPDF(template)}
                                        disabled={generatingId !== null}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                            successId === template.id
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                            : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20"
                                        }`}
                                    >
                                        {generatingId === template.id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : successId === template.id ? (
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        ) : (
                                            <Download className="w-3.5 h-3.5" />
                                        )}
                                        {successId === template.id ? "¡Listo!" : generatingId === template.id ? "Generando..." : "Descargar"}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredTemplates.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-neutral-700" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-500">No se han encontrado documentos</h3>
                        <p className="text-sm text-neutral-600">Prueba con otros términos de búsqueda o categoría.</p>
                    </div>
                )}

                {/* Professional Footer Info */}
                <div className="mt-20 p-10 rounded-[3rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/10 flex flex-col md:flex-row items-center gap-10">
                    <div className="p-6 rounded-[2rem] bg-blue-600 text-white shadow-2xl shadow-blue-900/40 shrink-0">
                        <ShieldCheck className="w-12 h-12" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Garantía de Calidad LexIA</h3>
                        <p className="text-neutral-400 leading-relaxed italic text-sm">
                            "Nuestra Bóveda de Documentos ha sido diseñada para ofrecer una base jurídica sólida y profesional. A diferencia de otros generadores automáticos, aquí priorizamos la extensión y la protección legal total, incluyendo cláusulas de sumisión expresa y protección de datos actualizadas. Descarga tu contrato, rellena los campos variables y opera con la tranquilidad de un respaldo jurídico de élite."
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
