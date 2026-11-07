// ─────────────────────────────────────────────────────────────
//  Maquetación profesional de los documentos de la Bóveda (PDF).
//
//  Marcado de las plantillas:
//    # TÍTULO                      → título del documento (una vez)
//    ## REUNIDOS / ESTIPULACIONES  → encabezado de parte, centrado
//    ### PRIMERA.— OBJETO          → título de cláusula
//    a) … / - … / 1.1. …           → enumeraciones y subapartados
//    [FIRMAS: ROL 1 | ROL 2]       → bloque de firmas
//    ## NOTAS DEL ASESOR …         → página aparte con las notas (no forman parte del documento)
//
//  Estilo de despacho: texto en Times justificado, márgenes amplios, cabecera y pie
//  en todas las páginas, numeración "Página X de Y" y línea de rúbrica en contratos.
// ─────────────────────────────────────────────────────────────
import { jsPDF } from "jspdf";

const NAVY: [number, number, number] = [14, 21, 36];
const GOLD: [number, number, number] = [154, 123, 36];
const GOLD_LIGHT: [number, number, number] = [212, 175, 55];
const INK: [number, number, number] = [28, 28, 32];
const MUTED: [number, number, number] = [120, 120, 128];

// Caracteres fuera de la codificación de las fuentes estándar de PDF.
const sanitize = (s: string) => s
    .replace(/[‐‑‒–]/g, "-").replace(/[―]/g, "—")
    .replace(/[≤]/g, "<=").replace(/[≥]/g, ">=").replace(/[→]/g, "->")
    .replace(/[   ]/g, " ").replace(/[​-‍﻿]/g, "")
    .replace(/[^\x00-\xFF€—–…“”‘’•‰ŠšŽžŒœŸ™]/g, "");

type Block =
    | { t: "title"; text: string }
    | { t: "section"; text: string }
    | { t: "clause"; text: string }
    | { t: "para"; text: string; indent: number; label?: string; tight?: boolean }
    | { t: "sign"; roles: string[] }
    | { t: "notes"; text: string };

function parse(content: string): Block[] {
    // Cada línea es un bloque; las líneas consecutivas sin línea en blanco entre ellas
    // (campos de formulario: "Nombre: ____", "DNI: ____") se maquetan juntas ("tight").
    const blocks: Block[] = [];
    let prevBlank = true;
    for (const raw of content.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line) { prevBlank = true; continue; }
        const tight = !prevBlank;
        prevBlank = false;
        let m: RegExpMatchArray | null;
        if ((m = line.match(/^#\s+(.+)/))) { blocks.push({ t: "title", text: m[1].trim() }); continue; }
        if ((m = line.match(/^##\s+(.+)/))) {
            const text = m[1].trim();
            blocks.push(/^NOTAS DEL ASESOR/i.test(text) ? { t: "notes", text } : { t: "section", text });
            continue;
        }
        if ((m = line.match(/^###\s+(.+)/))) { blocks.push({ t: "clause", text: m[1].trim() }); continue; }
        if ((m = line.match(/^\[FIRMAS?:\s*(.+)\]$/i))) { blocks.push({ t: "sign", roles: m[1].split("|").map((x) => x.trim()).filter(Boolean) }); continue; }
        if (/^\(Esta sección no forma parte/i.test(line)) continue; // ya figura en la cabecera de las notas
        if ((m = line.match(/^([a-zñ]\)|[ivx]+\))\s+(.*)$/i)) && m[1].length <= 6) blocks.push({ t: "para", text: m[2], indent: 7, label: m[1], tight });
        else if ((m = line.match(/^[-•]\s+(.*)$/))) blocks.push({ t: "para", text: m[1], indent: 5, label: "•", tight });
        else blocks.push({ t: "para", text: line, indent: 0, tight });
    }
    return blocks;
}

export function buildTemplatePDF(opts: { id: string; title: string; content: string }): jsPDF {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const ML = 25, MR = 25, TOP = 28, BOTTOM = 26;
    const CW = W - ML - MR;
    const ref = `${opts.id.toUpperCase()}-${new Date().getFullYear()}`;
    const blocks = parse(sanitize(opts.content));
    const isContract = blocks.some((b) => b.t === "sign" && b.roles.length >= 2);
    const notesPages = new Set<number>();
    let inNotes = false;
    let y = TOP;

    const page = () => doc.getCurrentPageInfo().pageNumber;
    const newPage = () => { doc.addPage(); y = TOP; if (inNotes) notesPages.add(page()); };
    const ensure = (h: number) => { if (y + h > H - BOTTOM) newPage(); };

    // Texto justificado línea a línea (la última línea del párrafo queda alineada a la izquierda).
    const justified = (lines: string[], x: number, width: number, lh: number) => {
        lines.forEach((line, i) => {
            ensure(lh);
            const words = line.split(" ").filter(Boolean);
            const last = i === lines.length - 1;
            if (last || words.length < 2) { doc.text(line, x, y); }
            else {
                const total = words.reduce((s, w) => s + doc.getTextWidth(w), 0);
                const gap = (width - total) / (words.length - 1);
                if (gap > 6) { doc.text(line, x, y); } // línea demasiado corta: sin estirar
                else { let cx = x; for (const w of words) { doc.text(w, cx, y); cx += doc.getTextWidth(w) + gap; } }
            }
            y += lh;
        });
    };

    // ── Portada: banda de marca + título ──
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, W, 18, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(15); doc.setTextColor(255, 255, 255);
    doc.text("Lex", ML, 11.5);
    doc.setTextColor(...GOLD_LIGHT); doc.text("IA", ML + doc.getTextWidth("Lex"), 11.5);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(205, 195, 160);
    doc.text("BÓVEDA DE DOCUMENTOS LEGALES", ML + 20, 11.2);
    doc.text(`Ref. ${ref}`, W - MR, 11.2, { align: "right" });
    y = 34;

    for (const b of blocks) {
        switch (b.t) {
            case "title": {
                doc.setFont("times", "bold"); doc.setFontSize(15); doc.setTextColor(...INK);
                const lines = doc.splitTextToSize(b.text.toUpperCase(), CW - 10);
                lines.forEach((l: string) => { doc.text(l, W / 2, y, { align: "center" }); y += 7; });
                doc.setDrawColor(...GOLD_LIGHT); doc.setLineWidth(0.6);
                doc.line(W / 2 - 18, y - 1, W / 2 + 18, y - 1);
                y += 8;
                break;
            }
            case "section": {
                // Los anexos empiezan en página nueva, como es habitual.
                if (/^ANEXO/i.test(b.text) && y > TOP + 10) newPage();
                ensure(22);
                y += 4;
                doc.setFont("times", "bold"); doc.setFontSize(12); doc.setTextColor(...INK);
                const lines = doc.splitTextToSize(b.text.toUpperCase(), CW);
                lines.forEach((l: string) => { doc.text(l, W / 2, y, { align: "center" }); y += 6; });
                y += 3;
                break;
            }
            case "clause": {
                ensure(20);
                y += 2.5;
                doc.setFont("times", "bold"); doc.setFontSize(11); doc.setTextColor(...INK);
                const lines = doc.splitTextToSize(b.text, CW);
                lines.forEach((l: string) => { doc.text(l, ML, y); y += 5.4; });
                y += 1;
                break;
            }
            case "para": {
                const notes = inNotes;
                doc.setFont(notes ? "helvetica" : "times", "normal");
                doc.setFontSize(notes ? 9.5 : 11);
                doc.setTextColor(...(notes ? [55, 55, 62] as [number, number, number] : INK));
                const lh = notes ? 4.9 : 5.4;
                const x = ML + b.indent;
                const width = CW - b.indent;
                const lines = doc.splitTextToSize(b.text, width);
                // Líneas de formulario consecutivas: sin el espacio de párrafo.
                if (b.tight && y > TOP + 2) y -= notes ? 1.2 : 2.0;
                ensure(lh * Math.min(lines.length, 2));
                if (b.label) {
                    if (b.label === "•") { doc.setTextColor(...GOLD); doc.text("•", ML + 1, y); doc.setTextColor(...(notes ? [55, 55, 62] as [number, number, number] : INK)); }
                    else doc.text(b.label, ML + 1, y);
                }
                justified(lines, x, width, lh);
                y += notes ? 1.8 : 2.6;
                break;
            }
            case "sign": {
                const cols = Math.min(2, b.roles.length);
                const rows = Math.ceil(b.roles.length / cols);
                ensure(rows * 38 + 6);
                y += 8;
                const colW = CW / cols;
                b.roles.forEach((role, i) => {
                    const c = i % cols;
                    const r = Math.floor(i / cols);
                    const cx = ML + c * colW + colW / 2;
                    const by = y + r * 38 + 20;
                    doc.setDrawColor(90, 90, 96); doc.setLineWidth(0.3);
                    doc.line(cx - colW / 2 + 8, by, cx + colW / 2 - 8, by);
                    doc.setFont("times", "bold"); doc.setFontSize(10); doc.setTextColor(...INK);
                    doc.splitTextToSize(role.toUpperCase(), colW - 12).forEach((l: string, k: number) => doc.text(l, cx, by + 5 + k * 4.5, { align: "center" }));
                    doc.setFont("times", "normal"); doc.setFontSize(9.5); doc.setTextColor(...MUTED);
                    doc.text("Fdo.: ______________________", cx, by + 14, { align: "center" });
                });
                y += rows * 38 + 4;
                break;
            }
            case "notes": {
                inNotes = true;
                newPage();
                // Cabecera de las notas
                doc.setFillColor(250, 246, 236);
                doc.setDrawColor(...GOLD_LIGHT); doc.setLineWidth(0.4);
                doc.rect(ML, y - 6, CW, 20, "FD");
                doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(...GOLD);
                doc.text("NOTAS DEL ASESOR", ML + 5, y + 0.5);
                doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(...MUTED);
                doc.text("Guía para cumplimentar y firmar. Esta sección no forma parte del documento: elimínela antes de firmar.", ML + 5, y + 7, { maxWidth: CW - 10 });
                y += 22;
                break;
            }
        }
    }

    // ── Cabecera, pie, rúbrica y numeración en todas las páginas ──
    const total = doc.getNumberOfPages();
    const shortTitle = opts.title.length > 70 ? opts.title.slice(0, 68) + "…" : opts.title;
    for (let p = 1; p <= total; p++) {
        doc.setPage(p);
        if (p > 1) {
            doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(...MUTED);
            doc.text("LexIA · Bóveda de Documentos Legales", ML, 15);
            doc.text(sanitize(shortTitle), W - MR, 15, { align: "right" });
            doc.setDrawColor(...GOLD_LIGHT); doc.setLineWidth(0.3);
            doc.line(ML, 17.5, W - MR, 17.5);
        }
        doc.setDrawColor(225, 225, 230); doc.setLineWidth(0.2);
        doc.line(ML, H - 16, W - MR, H - 16);
        doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(...MUTED);
        doc.text(`Página ${p} de ${total}`, W - MR, H - 11, { align: "right" });
        if (isContract && !notesPages.has(p)) doc.text("Rúbrica de las partes:  ____________    ____________", ML, H - 11);
        else doc.text(`Ref. ${ref}`, ML, H - 11);
    }
    return doc;
}
