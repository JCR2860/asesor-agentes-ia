// Lectura de documentos adjuntos (ruta protegida: solo usuarios con sesión).
//
// El navegador prepara los archivos (src/lib/attachments.ts):
//  - PDF con texto, Word y .txt → se leen en el propio navegador (no llegan aquí).
//  - Fotos y páginas escaneadas → se comprimen y se envían aquí de una en una
//    (campo "page") para transcribirlas con GPT-6 Luna.
// Se mantiene la vía antigua ("file") como respaldo para PDF con texto y .txt.
// Zero-Log: nada se guarda; solo se registran métricas.
import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";
import { currentUser } from "@clerk/nextjs/server";
import { transcribePage } from "@/lib/ocr";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 120;

const PAGES_PER_HOUR = Number(process.env.UPLOAD_PAGES_PER_HOUR) || 150;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        // ── Página en imagen → transcripción ──
        const page = formData.get("page") as File | null;
        if (page) {
            const user = await currentUser();
            if (!user) return NextResponse.json({ error: "Inicie sesión para adjuntar documentos." }, { status: 401 });
            const isAdmin = user.emailAddresses.some((e) => e.emailAddress === process.env.ADMIN_EMAIL);
            if (!isAdmin) {
                const r = await rateLimit(`upload:u:${user.id}`, PAGES_PER_HOUR, 3600);
                if (!r.ok) {
                    return NextResponse.json({
                        code: "rate_limited",
                        error: `Ha alcanzado el límite de ${PAGES_PER_HOUR} páginas por hora. Podrá adjuntar más en ${Math.ceil(r.retryAfterSec / 60)} minutos.`,
                    }, { status: 429 });
                }
            }
            if (!page.type.startsWith("image/")) return NextResponse.json({ error: "Formato de página no válido." }, { status: 400 });
            if (page.size > 4 * 1024 * 1024) return NextResponse.json({ error: "La página es demasiado grande." }, { status: 413 });

            const buffer = Buffer.from(await page.arrayBuffer());
            const text = await transcribePage({
                dataUrl: `data:${page.type};base64,${buffer.toString("base64")}`,
                docName: String(formData.get("name") || "documento"),
                page: Number(formData.get("index")) || 1,
                total: Number(formData.get("total")) || 1,
            });
            return NextResponse.json({ text });
        }

        // ── Vía de respaldo: archivo completo (PDF con texto o .txt) ──
        const file = formData.get("file") as File | null;
        if (!file) return NextResponse.json({ error: "No se ha recibido ningún archivo." }, { status: 400 });
        const arrayBuffer = await file.arrayBuffer();

        if (file.type === "application/pdf") {
            const { text, totalPages } = await extractText(new Uint8Array(arrayBuffer), { mergePages: true });
            return NextResponse.json({ text: String(text || "").trim(), pages: totalPages, type: "pdf", name: file.name });
        }
        if (file.type === "text/plain") {
            return NextResponse.json({ text: Buffer.from(arrayBuffer).toString("utf-8"), pages: 1, type: "text", name: file.name });
        }
        return NextResponse.json({ error: "Formato no compatible." }, { status: 400 });
    } catch (error: any) {
        console.error("[UPLOAD] error:", error?.message);
        return NextResponse.json({ error: "No se pudo leer el documento. Inténtelo de nuevo." }, { status: 500 });
    }
}
