// ─────────────────────────────────────────────────────────────
//  Versión editable en Word (.docx) de los documentos de la Bóveda.
//  Mismo estilo de despacho que el PDF: Times New Roman justificado, márgenes de
//  2,5 cm, cabecera y pie con "Página X de Y", línea de rúbrica en contratos,
//  bloques de firma, anexos en página nueva y las notas del asesor en una sección
//  aparte (se pueden borrar de una vez antes de firmar).
// ─────────────────────────────────────────────────────────────
import {
    Document, Packer, Paragraph, TextRun, Tab, AlignmentType, BorderStyle, Header, Footer,
    PageNumber, TabStopType, Table, TableRow, TableCell, WidthType, TableBorders, ShadingType,
    SectionType, type ISectionOptions,
} from "docx";
import { parseTemplate, isContract as contractOf, templateRef, type Block } from "@/lib/document-markup";

const SERIF = "Times New Roman";
const SANS = "Arial";
const GOLD = "9A7B24";
const GOLD_LIGHT = "D4AF37";
const INK = "1C1C20";
const MUTED = "78787F";
// A4 con márgenes de 2,5 cm (en twips: 1 cm = 567)
const MARGIN = 1418;
const CONTENT_W = 11906 - 2 * MARGIN;

// Bordes idénticos en los párrafos de la cabecera de notas: Word los agrupa en un único recuadro.
const NOTES_BOX = {
    top: { style: BorderStyle.SINGLE, size: 6, color: GOLD_LIGHT, space: 6 },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD_LIGHT, space: 6 },
    left: { style: BorderStyle.SINGLE, size: 6, color: GOLD_LIGHT, space: 6 },
    right: { style: BorderStyle.SINGLE, size: 6, color: GOLD_LIGHT, space: 6 },
};

const pageProps = {
    page: { size: { width: 11906, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN, header: 709, footer: 709 } },
};

function brandHeader(ref: string) {
    return new Header({
        children: [new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD_LIGHT, space: 4 } },
            children: [
                new TextRun({ text: "Lex", font: SANS, bold: true, size: 28, color: "0E1524" }),
                new TextRun({ text: "IA", font: SANS, bold: true, size: 28, color: GOLD_LIGHT }),
                new TextRun({ text: "   BÓVEDA DE DOCUMENTOS LEGALES", font: SANS, size: 14, color: MUTED }),
                new TextRun({ children: [new Tab(), `Ref. ${ref}`], font: SANS, size: 14, color: MUTED }),
            ],
        })],
    });
}

function smallHeader(title: string) {
    return new Header({
        children: [new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD_LIGHT, space: 4 } },
            children: [
                new TextRun({ text: "LexIA · Bóveda de Documentos Legales", font: SANS, size: 14, color: MUTED }),
                new TextRun({ children: [new Tab(), title], font: SANS, size: 14, color: MUTED }),
            ],
        })],
    });
}

function footer(left: string) {
    return new Footer({
        children: [new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W }],
            border: { top: { style: BorderStyle.SINGLE, size: 2, color: "E1E1E6", space: 4 } },
            children: [
                new TextRun({ text: left, font: SANS, size: 14, color: MUTED }),
                new TextRun({ children: [new Tab(), "Página ", PageNumber.CURRENT, " de ", PageNumber.TOTAL_PAGES], font: SANS, size: 14, color: MUTED }),
            ],
        })],
    });
}

function signatureTable(roles: string[]) {
    const cols = Math.min(2, roles.length);
    const rows: TableRow[] = [];
    for (let i = 0; i < roles.length; i += cols) {
        const cells = roles.slice(i, i + cols).map((role) => new TableCell({
            width: { size: Math.floor(100 / cols), type: WidthType.PERCENTAGE },
            children: [
                new Paragraph({ spacing: { before: 1100 }, children: [] }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    border: { top: { style: BorderStyle.SINGLE, size: 4, color: "5A5A60", space: 4 } },
                    indent: { left: 400, right: 400 },
                    children: [new TextRun({ text: role.toUpperCase(), bold: true, font: SERIF, size: 20, color: INK })],
                }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: "Fdo.: ______________________", font: SERIF, size: 19, color: MUTED })] }),
            ],
        }));
        while (cells.length < cols) cells.push(new TableCell({ children: [new Paragraph({ children: [] })] }));
        rows.push(new TableRow({ cantSplit: true, children: cells }));
    }
    return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: TableBorders.NONE, rows });
}

function paragraphFor(b: Extract<Block, { t: "para" }>, notes: boolean) {
    const font = notes ? SANS : SERIF;
    const size = notes ? 19 : 22;
    const color = notes ? "37373E" : INK;
    const spacing = { before: b.tight ? 0 : undefined, after: b.tight ? 60 : notes ? 80 : 120, line: notes ? 264 : 276 };
    if (b.label) {
        const left = b.label === "•" ? 340 : 425;
        return new Paragraph({
            alignment: notes ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
            indent: { left, hanging: left },
            tabStops: [{ type: TabStopType.LEFT, position: left }],
            spacing,
            children: [
                new TextRun({ text: b.label, font, size, color: b.label === "•" ? GOLD : color }),
                new TextRun({ children: [new Tab(), b.text], font, size, color }),
            ],
        });
    }
    return new Paragraph({
        alignment: notes ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
        spacing,
        children: [new TextRun({ text: b.text, font, size, color })],
    });
}

export async function buildTemplateDocx(opts: { id: string; title: string; content: string }): Promise<Blob> {
    const blocks = parseTemplate(opts.content);
    const ref = templateRef(opts.id);
    const contract = contractOf(blocks);
    const shortTitle = opts.title.length > 70 ? opts.title.slice(0, 68) + "…" : opts.title;

    const body: (Paragraph | Table)[] = [];
    const notes: (Paragraph | Table)[] = [];
    let inNotes = false;

    for (const b of blocks) {
        const out = inNotes ? notes : body;
        switch (b.t) {
            case "title":
                out.push(new Paragraph({
                    alignment: AlignmentType.CENTER, spacing: { before: 120, after: 360 },
                    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GOLD_LIGHT, space: 8 } },
                    children: [new TextRun({ text: b.text.toUpperCase(), bold: true, font: SERIF, size: 30, color: INK })],
                }));
                break;
            case "section":
                out.push(new Paragraph({
                    alignment: AlignmentType.CENTER, keepNext: true, pageBreakBefore: b.annex,
                    spacing: { before: b.annex ? 0 : 320, after: 180 },
                    children: [new TextRun({ text: b.text.toUpperCase(), bold: true, font: SERIF, size: 24, color: INK })],
                }));
                break;
            case "clause":
                out.push(new Paragraph({
                    keepNext: true, spacing: { before: 200, after: 80 },
                    children: [new TextRun({ text: b.text, bold: true, font: SERIF, size: 22, color: INK })],
                }));
                break;
            case "para":
                out.push(paragraphFor(b, inNotes));
                break;
            case "sign":
                out.push(signatureTable(b.roles), new Paragraph({ children: [] }));
                break;
            case "notes":
                inNotes = true;
                notes.push(
                    new Paragraph({
                        shading: { type: ShadingType.CLEAR, color: "auto", fill: "FAF6EC" },
                        border: NOTES_BOX,
                        spacing: { after: 0 },
                        children: [new TextRun({ text: "NOTAS DEL ASESOR", bold: true, font: SANS, size: 24, color: GOLD })],
                    }),
                    new Paragraph({
                        shading: { type: ShadingType.CLEAR, color: "auto", fill: "FAF6EC" },
                        border: NOTES_BOX,
                        spacing: { after: 280 },
                        children: [new TextRun({ text: "Guía para cumplimentar y firmar. Esta sección no forma parte del documento: elimínela antes de firmar.", italics: true, font: SANS, size: 17, color: MUTED })],
                    }),
                );
                break;
        }
    }

    const sections: ISectionOptions[] = [{
        properties: { ...pageProps, titlePage: true },
        headers: { first: brandHeader(ref), default: smallHeader(shortTitle) },
        footers: {
            first: footer(contract ? "Rúbrica de las partes:  ____________    ____________" : `Ref. ${ref}`),
            default: footer(contract ? "Rúbrica de las partes:  ____________    ____________" : `Ref. ${ref}`),
        },
        children: body,
    }];
    if (notes.length) {
        sections.push({
            properties: { ...pageProps, type: SectionType.NEXT_PAGE },
            headers: { default: smallHeader(shortTitle) },
            footers: { default: footer(`Notas del asesor · Ref. ${ref}`) },
            children: notes,
        });
    }

    const doc = new Document({
        creator: "LexIA",
        title: opts.title,
        description: "Documento de la Bóveda de Documentos Legales de LexIA",
        styles: { default: { document: { run: { font: SERIF, size: 22, color: INK }, paragraph: { spacing: { after: 120, line: 276 } } } } },
        sections,
    });
    return Packer.toBlob(doc);
}
