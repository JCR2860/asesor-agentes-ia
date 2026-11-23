// ─────────────────────────────────────────────────────────────
//  Lectura de páginas en imagen (escaneos, fotos de documentos, fotografías).
//  GPT-6 Luna transcribe literalmente cada página (o describe la foto si no es
//  un documento). Coste aproximado: 0,0004 $ por página.
//  Zero-Log: store:false y solo se registran métricas, nunca el contenido.
// ─────────────────────────────────────────────────────────────
import { getClient, estimateCostUSD } from "@/lib/ai-engine";

const OCR_MODEL = process.env.OPENAI_MODEL_OCR || "gpt-6-luna";

const INSTRUCTIONS = `Eres el transcriptor documental de un despacho de abogados. Recibes una página en imagen de un documento que un cliente ha enviado para su análisis jurídico.

Si la imagen contiene un documento (contrato, carta, notificación, nómina, factura, sentencia, formulario, captura de pantalla…):
- Transcribe LITERALMENTE todo el texto visible, en su idioma original y en su orden de lectura, respetando párrafos, títulos y numeración de cláusulas.
- Copia con exactitud nombres, fechas, importes, porcentajes, plazos y referencias legales. No resumas, no corrijas y no completes nada que no se vea.
- Lo que no se pueda leer, márcalo como [ilegible]. Marca las firmas como [firma manuscrita], los sellos como [sello: texto legible], las casillas marcadas como [X] y las anotaciones a mano como [manuscrito: texto].
- Reproduce las tablas como líneas con las columnas separadas por " | ".

Si la imagen NO es un documento (por ejemplo, una foto de un daño, un vehículo, una vivienda o un lugar), empieza por "[FOTOGRAFÍA]" y descríbela en español de forma objetiva y detallada, señalando lo que pueda ser relevante para un análisis jurídico (estado, daños, fechas u otros textos visibles).

Devuelve solo la transcripción o la descripción, sin comentarios previos ni posteriores.`;

/** Transcribe una página en imagen. `dataUrl` es una imagen JPEG/PNG en base64. */
export async function transcribePage(opts: { dataUrl: string; docName: string; page: number; total: number }): Promise<string> {
    const t0 = Date.now();
    const res: any = await getClient().responses.create({
        model: OCR_MODEL,
        reasoning: { effort: "none" },
        store: false,
        max_output_tokens: 4000,
        instructions: INSTRUCTIONS,
        input: [{
            role: "user",
            content: [
                { type: "input_text", text: `Documento «${opts.docName.slice(0, 120)}», página ${opts.page} de ${opts.total}.` },
                { type: "input_image", image_url: opts.dataUrl, detail: "high" },
            ],
        }],
    } as any, { timeout: 90_000, maxRetries: 1 });
    const text = String(res.output_text || "").trim();
    const u = res.usage || {};
    const cost = estimateCostUSD(OCR_MODEL, u.input_tokens || 0, u.input_tokens_details?.cached_tokens || 0, u.output_tokens || 0);
    console.log(`[OCR] model=${OCR_MODEL} in=${u.input_tokens} out=${u.output_tokens} ${Date.now() - t0}ms${cost !== null ? ` ~$${cost.toFixed(4)}` : ""}`);
    return text;
}
