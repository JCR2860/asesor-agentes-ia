import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toJpeg } from 'html-to-image';
import { Language } from '@/context/LanguageContext';

const l = (lang: Language, es: string, en: string) => lang === 'es' ? es : en;

// Identidad visual LexIA en papel (oro/marino, coherente con la plataforma)
const GOLD: [number, number, number] = [154, 123, 36];       // #9A7B24 — oro bronce legible en papel
const GOLD_LIGHT: [number, number, number] = [212, 175, 55]; // #D4AF37 — líneas y acentos
const NAVY: [number, number, number] = [14, 21, 36];         // #0E1524 — marca

export function generatePDF(content: string, agentTitle: string, userPrompt?: string, lang: Language = 'es') {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = margin;

    // Divider Line
    drawPDFHeader(doc, agentTitle, margin, pageWidth, lang);
    y = 45;

    // Content Parsing
    const cleanMarkdown = (text: string) => {
        // Convertir etiquetas de gráficos en resúmenes de texto legibles
        let clean = text
            .replace(/<(?:visual_graph|visual_data)>([\s\S]*?)<\/(?:visual_graph|visual_data)>/g, (match, jsonStr) => {
                try {
                    const data = JSON.parse(jsonStr.trim());
                    let summary = `\n---------------------------------------------------------------\n📊 ${l(lang, "EXTRACTO DATOS DEL GRÁFICO", "GRAPH DATA EXTRACT")}: ${data.titulo.toUpperCase()}\n(${l(lang, "Tipo de análisis", "Analysis type")}: ${data.tipo})\n`;
                    if (data.datos) {
                        data.datos.forEach((item: any) => {
                            summary += `  • ${item.etiqueta}${item.valor !== undefined ? ' -> ' + l(lang, 'Valor/Impacto', 'Value/Impact') + ': ' + item.valor : ''}${item.children ? '\n      ' + l(lang, 'Sub-niveles', 'Sub-levels') + ': ' + item.children.join(', ') : ''}\n`;
                        });
                    }
                    return summary + "---------------------------------------------------------------\n\n";
                } catch (e) {
                    return `\n[${l(lang, "Gráfico Visual / Infografía convertida a texto", "Visual Graph / Infographic converted to text")}]\n`;
                }
            })
            // Limpiar posibles restos de markdown de imagen que el modelo intente forzar
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[BANDERA:\s*(VERDE|AMARILLO|ROJO)\]/g, '$1:')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/###(.*)/g, '$1')
            .replace(/##(.*)/g, '$1')
            .replace(/#(.*)/g, '$1');
        return clean;
    };

    let combineText = "";
    if (userPrompt) {
        combineText += `${l(lang, "CONSULTA ORIGINAL", "ORIGINAL QUERY")}:\n${cleanMarkdown(userPrompt)}\n\n`;
        combineText += `--------------------------------------------------\n\n`;
        combineText += `${l(lang, "RESPUESTA DEL ASESOR", "ADVISOR RESPONSE")}:\n`;
    }
    combineText += cleanMarkdown(content);

    const splitText = doc.splitTextToSize(combineText, pageWidth - 2 * margin);

    // Pagination logic
    for (let i = 0; i < splitText.length; i++) {
        if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
            // Add a subtle header on new pages
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text(`${agentTitle} - ${l(lang, "Continuación", "Continuation")}`, margin, y);
            y += 10;
            doc.setFontSize(11);
            doc.setTextColor(50, 50, 50);
        }
        doc.text(splitText[i], margin, y);
        y += 7; // Line height
    }

    // Footer
    addPDFLegalDisclaimer(doc, pageWidth, pageHeight, margin, lang);

    const filename = `LexIA_Asesoria_${new Date().getTime()}.pdf`;

    // Create a blob and download link to support mobile browsers better
    const blob = doc.output('blob');
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

export function generateFullHistoryPDF(messages: any[], agentTitle: string, lang: Language = 'es') {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = margin;

    // Divider Line
    drawPDFHeader(doc, agentTitle, margin, pageWidth, lang);
    y = 45;

    const cleanMarkdown = (text: string) => {
        let clean = text
            .replace(/<(?:visual_graph|visual_data)>([\s\S]*?)<\/(?:visual_graph|visual_data)>/g, (match, jsonStr) => {
                try {
                    const data = JSON.parse(jsonStr.trim());
                    let summary = `\n---------------------------------------------------------------\n📊 ${l(lang, "EXTRACTO DATOS DEL GRÁFICO", "GRAPH DATA EXTRACT")}: ${data.titulo.toUpperCase()}\n(${l(lang, "Tipo de análisis", "Analysis type")}: ${data.tipo})\n`;
                    if (data.datos) {
                        data.datos.forEach((item: any) => {
                            summary += `  • ${item.etiqueta}${item.valor !== undefined ? ' -> ' + l(lang, 'Valor/Impacto', 'Value/Impact') + ': ' + item.valor : ''}${item.children ? '\n      ' + l(lang, 'Sub-niveles', 'Sub-levels') + ': ' + item.children.join(', ') : ''}\n`;
                        });
                    }
                    return summary + "---------------------------------------------------------------\n\n";
                } catch (e) {
                    return `\n[${l(lang, "Gráfico Visual / Infografía convertida a texto", "Visual Graph / Infographic converted to text")}]\n`;
                }
            })
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[BANDERA:\s*(VERDE|AMARILLO|ROJO)\]/g, '$1:')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/###(.*)/g, '$1')
            .replace(/##(.*)/g, '$1')
            .replace(/#(.*)/g, '$1');
        return clean;
    };

    messages.forEach((msg, idx) => {
        if (msg.role === 'system') return;

        const sender = msg.role === 'user' ? (l(lang, 'USUARIO', 'USER')) : agentTitle.toUpperCase();
        const contentLines = doc.splitTextToSize(`${sender}:\n${cleanMarkdown(msg.content)}`, pageWidth - 2 * margin);

        for (let i = 0; i < contentLines.length; i++) {
            if (y > pageHeight - margin - 20) {
                doc.addPage();
                y = margin;
                doc.setFontSize(9);
                doc.setTextColor(150, 150, 150);
                doc.text(`${agentTitle} - ${l(lang, "Chat Completo", "Full Chat")}`, margin, y);
                y += 15;
            }

            doc.setFontSize(11);
            doc.setTextColor(50, 50, 50);
            doc.text(contentLines[i], margin, y);
            y += 7;
        }

        y += 10; // Extra space between messages
        doc.setDrawColor(240, 240, 240);
        doc.line(margin, y - 5, pageWidth - margin, y - 5);
    });

    // Footer
    addPDFLegalDisclaimer(doc, pageWidth, pageHeight, margin, lang);

    const filename = `Expediente_LexIA_${new Date().getTime()}.pdf`;
    const blob = doc.output('blob');
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

async function getLogoBase64(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Failed to load logo for PDF", e);
        return "";
    }
}

export async function generateElitePDF(messages: any[], agentTitle: string, lang: Language = 'es') {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentW = pageWidth - 2 * margin;
    let y = margin;

    const BODY = 60; // gris del cuerpo de texto

    // Nº de expediente ÚNICO para todo el documento (antes se regeneraba en cada página)
    const caseId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const dateStr = new Date().toLocaleString(lang === 'es' ? 'es-ES' : 'en-US');

    // Predescarga del logo para evitar esperas síncronas bloqueantes
    const logoBase64 = await getLogoBase64('/logo.png');

    const drawHeader = () => {
        if (logoBase64) {
            try { doc.addImage(logoBase64, 'PNG', margin, y - 8, 15, 15); } catch (e) { /* sin logo */ }
        }
        const brandX = logoBase64 ? margin + 18 : margin;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
        doc.text("Lex", brandX, y + 2);
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.text("IA", brandX + doc.getTextWidth("Lex"), y + 2);

        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(l(lang, "INTELIGENCIA JURÍDICA ESTRATÉGICA", "STRATEGIC LEGAL INTELLIGENCE"), brandX + 0.5, y + 7);

        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        doc.text(`${l(lang, "EXPEDIENTE", "CASE-ID")}: ${caseId}`, pageWidth - margin, y, { align: "right" });
        doc.text(`${l(lang, "EMITIDO", "ISSUED")}: ${dateStr}`, pageWidth - margin, y + 5, { align: "right" });

        y += 18;
        doc.setDrawColor(GOLD_LIGHT[0], GOLD_LIGHT[1], GOLD_LIGHT[2]);
        doc.setLineWidth(0.8);
        doc.line(margin, y, pageWidth - margin, y);
        y += 15;
    };

    const purificarTexto = (t: string) => {
        return t
            .replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
            .replace(/—/g, '-').replace(/–/g, '-')
            .replace(/…/g, '...').replace(/€/g, l(lang, 'EUR ', 'EUR '))
            .replace(/[•◦‣●]/g, '-')
            .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/gu, '')
            .replace(/[━─═【】]/g, '');
    };

    // Quita marcas inline de markdown conservando el texto
    const stripInline = (s: string) => s
        .replace(/\*\*([\s\S]*?)\*\*/g, '$1')
        .replace(/\*([\s\S]*?)\*/g, '$1')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');

    const ensureSpace = (needed = 12) => {
        if (y > pageHeight - margin - needed) {
            doc.addPage();
            y = margin;
            drawHeader();
        }
    };

    const setBodyStyle = () => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(BODY, BODY, BODY);
    };

    // Renderizado con jerarquía tipográfica real: títulos, viñetas y separadores
    const renderMarkdown = (raw: string) => {
        const srcLines = raw.split('\n');
        for (const src of srcLines) {
            const t = purificarTexto(src).trim();

            if (!t) { y += 2.5; continue; }

            // Separador horizontal (--- / ***) -> línea fina, no texto literal
            if (/^(-{3,}|_{3,}|\*{3,})$/.test(t)) {
                ensureSpace();
                doc.setDrawColor(225, 225, 225);
                doc.setLineWidth(0.3);
                doc.line(margin, y - 1, pageWidth - margin, y - 1);
                y += 5;
                continue;
            }

            // Títulos: markdown (#...), línea completa en negrita, o "N. TÍTULO EN MAYÚSCULAS"
            const mdHeading = t.match(/^(#{1,4})\s*(.+)$/);
            const boldLine = t.match(/^\*\*(.+?)\*\*:?\s*$/);
            const numbered = t.match(/^\d{1,2}[.)]\s+(.{3,80})$/);
            const numberedCaps = numbered && !/[a-záéíóúüñ]/.test(numbered[1]);
            if (mdHeading || boldLine || numberedCaps) {
                const text = stripInline(mdHeading ? mdHeading[2] : boldLine ? boldLine[1] : t);
                const isMajor = mdHeading ? mdHeading[1].length <= 2 : !!numberedCaps;
                y += 3.5;
                ensureSpace(20);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(isMajor ? 12.5 : 11);
                doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
                const hLines = doc.splitTextToSize(text, contentW);
                hLines.forEach((hl: string) => { ensureSpace(); doc.text(hl, margin, y); y += 6.5; });
                if (isMajor) {
                    doc.setDrawColor(GOLD_LIGHT[0], GOLD_LIGHT[1], GOLD_LIGHT[2]);
                    doc.setLineWidth(0.3);
                    doc.line(margin, y - 4, margin + 28, y - 4);
                    y += 1.5;
                }
                setBodyStyle();
                continue;
            }

            // Viñetas (- / *) con sangría francesa
            const bullet = t.match(/^[-*]\s+(.+)$/);
            if (bullet) {
                const text = stripInline(bullet[1]);
                const bLines = doc.splitTextToSize(text, contentW - 6);
                setBodyStyle();
                bLines.forEach((bl: string, idx: number) => {
                    ensureSpace();
                    if (idx === 0) doc.text("-", margin + 1, y);
                    doc.text(bl, margin + 6, y);
                    y += 5.3;
                });
                y += 0.7;
                continue;
            }

            // Párrafo normal
            const text = stripInline(t);
            const pLines = doc.splitTextToSize(text, contentW);
            setBodyStyle();
            pLines.forEach((pl: string) => { ensureSpace(); doc.text(pl, margin, y); y += 5.3; });
            y += 1.2;
        }
    };

    drawHeader();

    // Portada del dictamen
    doc.setFontSize(17);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setFont("helvetica", "bold");
    doc.text(l(lang, "DICTAMEN DE ASESORÍA ESPECIALIZADA", "SPECIALIZED ADVISORY REPORT"), pageWidth / 2, y, { align: "center" });
    y += 8;

    doc.setDrawColor(GOLD_LIGHT[0], GOLD_LIGHT[1], GOLD_LIGHT[2]);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 22, y - 3, pageWidth / 2 + 22, y - 3);

    doc.setFontSize(10.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(90, 90, 90);
    doc.text(`${agentTitle} · ${new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US')}`, pageWidth / 2, y + 3, { align: "center" });
    y += 10;

    doc.setFontSize(8.5);
    doc.setTextColor(140, 140, 140);
    doc.text(
        l(lang, `EXPEDIENTE Nº ${caseId} · COPIA ÚNICA DEL CLIENTE (PROTOCOLO ZERO-LOG)`, `CASE NO. ${caseId} · CLIENT'S ONLY COPY (ZERO-LOG PROTOCOL)`),
        pageWidth / 2, y + 2, { align: "center" }
    );
    y += 16;

    // Omitimos el saludo automático inicial: el dictamen empieza en la consulta real del cliente.
    const firstUserIdx = messages.findIndex((m) => m.role === 'user');
    const printable = messages.filter((msg, i) =>
        msg.role !== 'system' &&
        msg.id !== 'initial' &&
        !(msg.role === 'assistant' && (firstUserIdx === -1 ? i === 0 : i < firstUserIdx))
    );

    printable.forEach((msg) => {
        const isUser = msg.role === 'user';

        ensureSpace(30);

        // Etiqueta de sección
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        if (isUser) doc.setTextColor(110, 110, 110);
        else doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.text(
            isUser ? l(lang, "CONSULTA DEL CLIENTE", "CLIENT INQUIRY") : `${l(lang, "DICTAMEN DE", "OPINION BY")} ${agentTitle.toUpperCase()}`,
            margin, y
        );
        y += 7;
        setBodyStyle();

        let rawContent = msg.content;
        let tablesToDraw: any[] = [];

        // Detectar Bandera de Riesgo
        const flagMatch = rawContent.match(/\[BANDERA:\s*(VERDE|AMARILLO|ROJO)\]/);
        let flagData: { type: string, color: number[] } | null = null;
        if (flagMatch) {
            const type = flagMatch[1];
            let color = [34, 197, 94]; // Verde
            const flagMap: Record<string, string> = {
                'VERDE': l(lang, 'VERDE', 'GREEN'),
                'AMARILLO': l(lang, 'AMARILLO', 'YELLOW'),
                'ROJO': l(lang, 'ROJO', 'RED')
            };
            const displayType = flagMap[type] || type;
            if (type === 'AMARILLO') color = [234, 179, 8];
            if (type === 'ROJO') color = [239, 68, 68];
            flagData = { type: displayType, color };
            rawContent = rawContent.replace(/\[BANDERA:\s*(VERDE|AMARILLO|ROJO)\]/, '');
        }

        // Extraer Gráficos
        rawContent = rawContent.replace(/<(?:visual_graph|visual_data)>([\s\S]*?)<\/(?:visual_graph|visual_data)>/g, (match: string, json: string) => {
            try { tablesToDraw.push(JSON.parse(json)); return `\n[${l(lang, "SECCIÓN DE DATOS", "DATA SECTION")}]\n`; } catch (e) { return ""; }
        });

        renderMarkdown(rawContent);

        // Renderizar caja de bandera si existe
        if (flagData) {
            y += 4;
            ensureSpace(25);
            doc.setFillColor(flagData.color[0], flagData.color[1], flagData.color[2]);
            doc.rect(margin, y, contentW, 12, 'F');
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255);
            doc.text(`${l(lang, "EVALUACIÓN DE VIABILIDAD", "VIABILITY ASSESSMENT")}: ${flagData.type}`, margin + 5, y + 8);
            y += 18;
            setBodyStyle();
        }

        // Renderizar tablas
        tablesToDraw.forEach(table => {
            y += 5;
            ensureSpace(30);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
            doc.text(`${l(lang, "DATO ESTRATÉGICO", "STRATEGIC DATA")}: ${purificarTexto(table.titulo || (l(lang, 'Desglose', 'Breakdown')))}`, margin, y);

            const tableBody = table.datos ? table.datos.map((d: any) => [purificarTexto(d.etiqueta), purificarTexto(String(d.valor || '-'))]) : [];
            autoTable(doc, {
                startY: y + 3,
                head: [[l(lang, 'Concepto', 'Concept'), l(lang, 'Referencia/Valor', 'Reference/Value')]],
                body: tableBody,
                theme: 'striped',
                styles: { fontSize: 9 },
                headStyles: { fillColor: GOLD },
                margin: { left: margin, right: margin }
            });
            y = (doc as any).lastAutoTable.finalY + 15;
            setBodyStyle();
        });

        y += 8;
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.3);
        doc.line(margin, y - 4, pageWidth - margin, y - 4);
        y += 5;
    });

    // Añadir Descargo de Responsabilidad Jurídica (Disclaimer)
    if (y > pageHeight - margin - 40) {
        doc.addPage();
        y = margin;
    }

    y += 10;
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y, pageWidth - 2 * margin, 25, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(margin, y, pageWidth - 2 * margin, 25, 'S');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(l(lang, "AVISO LEGAL / LIMITACIÓN DE RESPONSABILIDAD:", "LEGAL NOTICE / LIMITATION OF LIABILITY:"), margin + 5, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const disclaimerText = "Este documento ha sido generado por un sistema de Inteligencia Artificial (LexIA) con fines estrictamente informativos y orientativos. No constituye asesoramiento jurídico profesional, dictamen vinculante ni sustituye la consulta personalizada con un experto colegiado. LexIA no se hace responsable de las consecuencias derivadas del uso de esta información. Se recomienda encarecidamente contrastar estas conclusiones con un especialista humano antes de realizar cualquier acción legal.";
    const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - 2 * margin - 10);
    doc.text(disclaimerLines, margin + 5, y + 14);

    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let j = 1; j <= totalPages; j++) {
        doc.setPage(j);
        doc.setFontSize(8);
        doc.setTextColor(180);
        doc.text(`${agentTitle} - ${l(lang, "Pág.", "Pg.")} ${j}/${totalPages} | ${l(lang, "Documento confidencial para uso exclusivo del destinatario.", "Confidential document for the exclusive use of the recipient.")}`, pageWidth/2, pageHeight - 10, { align: "center" });
    }

    doc.save(`LexIA_Dictamen_${agentTitle.replace(/\s+/g, '_')}.pdf`);
}

/**
 * Genera un PDF de alta fidelidad basado en el DOM actual (lo que ve el usuario)
 * Esto preserva los colores, el Tailwind CSS, los gráficos de Recharts y la cabecera del reporte.
 * Utilizamos html-to-image porque es mucho más compatible con CSS moderno (v4) que html2canvas.
 */
export async function generateModernReport(elementId: string, filenameBase: string) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error("Element not found for PDF generation:", elementId);
        return;
    }

    try {
        // Obtenemos la imagen del elemento con alta fidelidad
        const dataUrl = await toJpeg(element, {
            quality: 0.95,
            pixelRatio: 2,
            backgroundColor: '#ffffff' // Asegurar fondo blanco para el PDF
        });

        // Calculamos dimensiones para jsPDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Si el contenido es más largo que una sola página, jsPDF por defecto lo corta.
        // Pero como es una sola imagen vertical, la distribuimos.
        // Nota: Para documentos multipágina MUY largos, se podría splitear la imagen,
        // pero para reportes estándar esto es lo más fiel.

        let heightLeft = pdfHeight;
        let position = 0;
        let pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(dataUrl, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(dataUrl, 'JPEG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${filenameBase}_${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error("Critical error in High-Fidelity PDF generation:", error);
        throw error;
    }
}

// Private helper to draw a consistent header
function drawPDFHeader(doc: jsPDF, agentTitle: string, margin: number, pageWidth: number, lang: Language = 'es') {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text("Lex", margin, 20);
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.text("IA", margin + doc.getTextWidth("Lex"), 20);

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(l(lang, "INTELIGENCIA JURÍDICA ESTRATÉGICA", "STRATEGIC LEGAL INTELLIGENCE"), margin, 24);

    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(agentTitle.toUpperCase(), pageWidth - margin, 20, { align: "right" });

    doc.setFontSize(10);
    doc.text(`${l(lang, "Fecha", "Date")}: ${new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US')} ${new Date().toLocaleTimeString()}`, pageWidth / 2, 24, { align: "center" });

    doc.setDrawColor(GOLD_LIGHT[0], GOLD_LIGHT[1], GOLD_LIGHT[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, 28, pageWidth - margin, 28);
}

// Private helper for disclaimer
function addPDFLegalDisclaimer(doc: jsPDF, pageWidth: number, pageHeight: number, margin: number, lang: Language = 'es') {
    const y = pageHeight - 35;
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y, pageWidth - 2 * margin, 20, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(margin, y, pageWidth - 2 * margin, 20, 'S');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100);
    doc.text(l(lang, "ADVERTENCIA LEGAL:", "LEGAL WARNING:"), margin + 4, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    const text = l(lang,
        "Este documento es informativo y ha sido generado por IA. No constituye asesoramiento legal profesional ni sustituye a un abogado colegiado. Consulte siempre con un especialista humano antes de tomar decisiones.",
        "This document is informative and has been generated by IA. It does not constitute professional legal advice nor does it replace a registered lawyer. Always consult with a human specialist before making decisions."
    );
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin - 8);
    doc.text(lines, margin + 4, y + 10);

    doc.setFontSize(7);
    doc.setTextColor(180);
    doc.text(`${l(lang, "Generado automáticamente por LexIA Digital Advisory.", "Automatically generated by LexIA Digital Advisory.")}`, pageWidth / 2, pageHeight - 10, { align: "center" });
}
