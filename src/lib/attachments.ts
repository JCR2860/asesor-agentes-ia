// ─────────────────────────────────────────────────────────────
//  Preparación de documentos adjuntos en el navegador.
//
//  - PDF: se lee el texto de cada página. Las páginas sin texto (escaneos o
//    fotos convertidas a PDF) se convierten en imagen y se transcriben con IA.
//  - Fotos (JPG, PNG, WEBP…): se comprimen (máx. 2000 px) y se transcriben.
//  - Word (.docx), .txt, .md, .csv: se lee el texto directamente.
//  El resultado es TEXTO que se añade a la consulta: ligero para el historial,
//  el PDF del dictamen y las siguientes preguntas a la Directora.
// ─────────────────────────────────────────────────────────────

export type AttachmentKind = "pdf" | "image" | "word" | "text";

export type ChatAttachment = {
    id: string;
    name: string;
    kind: AttachmentKind;
    status: "processing" | "ready" | "error";
    pages: number;          // páginas leídas (o 1 para fotos y textos)
    scanned: number;        // páginas transcritas desde imagen
    text: string;
    progress?: { done: number; total: number };
    error?: string;
};

/** Máximo de páginas por consulta (entre todos los adjuntos) y de texto total. */
export const MAX_PAGES = 30;
export const MAX_CHARS = 150_000;

export const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif,.docx,.txt,.md,.csv";

class AttachmentError extends Error {}

export function kindOf(file: File): AttachmentKind | null {
    const n = file.name.toLowerCase();
    if (file.type === "application/pdf" || n.endsWith(".pdf")) return "pdf";
    if (file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|heic|heif)$/.test(n)) return "image";
    if (n.endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "word";
    if (file.type.startsWith("text/") || /\.(txt|md|csv)$/.test(n)) return "text";
    return null;
}

// ── Imágenes ──
const MAX_SIDE = 2000;

async function canvasToJpeg(canvas: HTMLCanvasElement, quality = 0.82): Promise<Blob> {
    return new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new AttachmentError("No se pudo preparar la imagen."))), "image/jpeg", quality));
}

/** Comprime una foto a JPEG (máx. 2000 px) respetando la orientación del móvil. */
async function compressImage(file: File, es: boolean): Promise<Blob> {
    let bmp: ImageBitmap;
    try {
        bmp = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
    } catch {
        throw new AttachmentError(/\.(heic|heif)$/i.test(file.name)
            ? (es ? "Este navegador no puede abrir fotos HEIC del iPhone. Envíela como JPG (Ajustes › Cámara › Formatos › Más compatible) o haga una captura de pantalla." : "This browser cannot open iPhone HEIC photos. Send it as JPG or take a screenshot.")
            : (es ? "No se pudo abrir la imagen." : "The image could not be opened."));
    }
    const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close?.();
    return canvasToJpeg(canvas);
}

/** Envía una página en imagen al servidor para transcribirla. */
async function transcribe(blob: Blob, opts: { endpoint: string; name: string; index: number; total: number; es: boolean }): Promise<string> {
    const fd = new FormData();
    fd.append("page", blob, `pagina-${opts.index}.jpg`);
    fd.append("name", opts.name);
    fd.append("index", String(opts.index));
    fd.append("total", String(opts.total));
    let res: Response;
    try {
        res = await fetch(opts.endpoint, { method: "POST", body: fd });
    } catch {
        throw new AttachmentError(opts.es ? "Sin conexión al leer el documento. Inténtelo de nuevo." : "Connection lost while reading the document.");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new AttachmentError(data.error || (opts.es ? "No se pudo leer la página." : "The page could not be read."));
    return String(data.text || "").trim();
}

// Ejecuta tareas con un máximo de N a la vez (manteniendo el orden de los resultados).
async function pool<T>(items: (() => Promise<T>)[], size: number): Promise<T[]> {
    const out: T[] = new Array(items.length);
    let next = 0;
    await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
        while (next < items.length) { const i = next++; out[i] = await items[i](); }
    }));
    return out;
}

// ── PDF ──
async function readPdf(file: File, o: Options): Promise<Result> {
    const { getDocumentProxy } = await import("unpdf");
    let pdf: any;
    try {
        pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
    } catch (e: any) {
        if (/password/i.test(String(e?.name) + String(e?.message))) throw new AttachmentError(o.es ? "El PDF está protegido con contraseña. Quite la protección o envíe capturas de las páginas." : "The PDF is password-protected.");
        throw new AttachmentError(o.es ? "No se pudo abrir el PDF. Puede estar dañado." : "The PDF could not be opened.");
    }
    const total: number = pdf.numPages;
    if (total > o.pagesLeft) {
        throw new AttachmentError(o.es
            ? `El PDF tiene ${total} páginas y en esta consulta quedan ${o.pagesLeft} (máximo ${MAX_PAGES} por consulta). Envíe solo las páginas relevantes.`
            : `The PDF has ${total} pages and only ${o.pagesLeft} are left for this query (max ${MAX_PAGES}).`);
    }

    // 1) Texto de cada página
    const texts: string[] = [];
    for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        const t = tc.items.map((it: any) => ("str" in it ? it.str + (it.hasEOL ? "\n" : " ") : "")).join("")
            .replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
        texts.push(t);
    }

    // 2) Las páginas sin texto real (escaneos) se convierten en imagen y se transcriben
    const scannedIdx = texts.map((t, i) => (t.replace(/\s/g, "").length < 40 ? i : -1)).filter((i) => i >= 0);
    let done = total - scannedIdx.length;
    o.onProgress(done, total);
    const tasks = scannedIdx.map((i) => async () => {
        const page = await pdf.getPage(i + 1);
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: Math.min(3, 1700 / base.width) });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        const blob = await canvasToJpeg(canvas);
        texts[i] = await transcribe(blob, { endpoint: o.endpoint, name: file.name, index: i + 1, total, es: o.es });
        o.onProgress(++done, total);
    });
    await pool(tasks, 3);
    pdf.destroy?.();

    const text = total === 1 ? texts[0] : texts.map((t, i) => `--- Página ${i + 1} ---\n${t}`).join("\n\n");
    return { kind: "pdf", pages: total, scanned: scannedIdx.length, text };
}

// ── Word ──
async function readWord(file: File, o: Options): Promise<Result> {
    const mammoth: any = await import("mammoth");
    try {
        const { value } = await (mammoth.default || mammoth).extractRawText({ arrayBuffer: await file.arrayBuffer() });
        return { kind: "word", pages: 1, scanned: 0, text: String(value || "").replace(/\n{3,}/g, "\n\n").trim() };
    } catch {
        throw new AttachmentError(o.es ? "No se pudo leer el Word. Guárdelo como .docx o PDF e inténtelo de nuevo." : "The Word file could not be read.");
    }
}

type Options = { endpoint: string; es: boolean; pagesLeft: number; onProgress: (done: number, total: number) => void };
type Result = { kind: AttachmentKind; pages: number; scanned: number; text: string };

/** Lee un archivo y devuelve su texto (transcribiendo las imágenes con IA). */
export async function readAttachment(file: File, opts: Partial<Options> & { es: boolean; pagesLeft: number; onProgress: Options["onProgress"] }): Promise<Result> {
    const o: Options = { endpoint: "/api/upload", ...opts } as Options;
    const kind = kindOf(file);
    if (!kind) {
        throw new AttachmentError(/\.doc$/i.test(file.name)
            ? (o.es ? "Los Word antiguos (.doc) no se pueden leer. Guárdelo como .docx o PDF." : "Old .doc files are not supported. Save it as .docx or PDF.")
            : (o.es ? "Formato no compatible. Use PDF, Word (.docx), texto o imágenes." : "Unsupported format. Use PDF, Word (.docx), text or images."));
    }
    if (file.size > 40 * 1024 * 1024) throw new AttachmentError(o.es ? "El archivo supera 40 MB." : "The file exceeds 40 MB.");
    if (o.pagesLeft < 1) throw new AttachmentError(o.es ? `Ha alcanzado el máximo de ${MAX_PAGES} páginas por consulta.` : `You reached the maximum of ${MAX_PAGES} pages per query.`);

    let result: Result;
    if (kind === "pdf") result = await readPdf(file, o);
    else if (kind === "word") result = await readWord(file, o);
    else if (kind === "text") result = { kind, pages: 1, scanned: 0, text: (await file.text()).trim() };
    else {
        o.onProgress(0, 1);
        const blob = await compressImage(file, o.es);
        const text = await transcribe(blob, { endpoint: o.endpoint, name: file.name, index: 1, total: 1, es: o.es });
        o.onProgress(1, 1);
        result = { kind: "image", pages: 1, scanned: 1, text };
    }
    if (!result.text.replace(/\s/g, "")) {
        throw new AttachmentError(o.es ? "No se ha encontrado texto legible en el documento." : "No readable text was found in the document.");
    }
    return result;
}

export const attachmentErrorMessage = (e: unknown, es: boolean) =>
    e instanceof AttachmentError ? e.message : (es ? "No se pudo leer el archivo." : "The file could not be read.");

/** Bloque de texto que se añade a la consulta por cada adjunto listo. */
export function attachmentsToText(list: ChatAttachment[], es = true): string {
    let budget = MAX_CHARS;
    return list.filter((a) => a.status === "ready").map((a) => {
        const label = `${a.name} · ${a.pages} ${a.pages === 1 ? (es ? "página" : "page") : (es ? "páginas" : "pages")}${a.scanned ? (es ? `, ${a.scanned} transcrita${a.scanned === 1 ? "" : "s"} de imagen` : `, ${a.scanned} from image`) : ""}`;
        let text = a.text;
        if (text.length > budget) text = text.slice(0, Math.max(0, budget)) + (es ? "\n[…documento recortado por longitud]" : "\n[…truncated]");
        budget -= text.length;
        return `\n\n[DOCUMENTO ADJUNTO: ${label}]\n${text}`;
    }).join("");
}
