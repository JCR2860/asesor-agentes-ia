// ─────────────────────────────────────────────────────────────
//  Motor de IA de LexIA (servidor) — SDK oficial de OpenAI, Responses API.
//
//  Por qué existe: el SDK `ai@3` que usa el chat siempre envía `temperature`
//  y no permite controlar el razonamiento, lo que es incompatible con GPT-6.
//  Aquí llamamos a OpenAI directamente y devolvemos la respuesta en el mismo
//  formato de streaming que espera `useChat` (protocolo "data stream v1"),
//  así el cliente del chat no cambia nada.
//
//  Privacidad (Zero-Log): `store: false` → OpenAI no guarda la conversación.
// ─────────────────────────────────────────────────────────────
import OpenAI from "openai";
import { stripSummary } from "./report";

let client: OpenAI | null = null;
export const getClient = () => (client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY }));

export type Effort = "none" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max";

type UIMessage = {
    id?: string;
    role: string;
    content?: string;
    experimental_attachments?: { url?: string; contentType?: string; name?: string }[];
};

// Precio por millón de tokens (entrada / entrada en caché / salida), para el log de costes.
const PRICES: Record<string, [number, number, number]> = {
    "gpt-6-astra": [10, 1, 50],
    "gpt-6.1-sol": [2, 0.1, 10],
    "gpt-6-sol": [2, 0.2, 10],
    "gpt-6.1-terra": [1, 0.05, 5],
    "gpt-6-luna": [0.1, 0.01, 0.5],
    "gpt-5.6-sol": [4, 0.4, 20],
    "gpt-5.6-terra": [2, 0.2, 12],
    "gpt-5.6-luna": [0.2, 0.02, 1.2],
};

export function estimateCostUSD(model: string, inTok: number, cachedTok: number, outTok: number): number | null {
    const p = PRICES[model];
    if (!p) return null;
    return ((inTok - cachedTok) * p[0] + cachedTok * p[1] + outTok * p[2]) / 1_000_000;
}

/** Convierte los mensajes de useChat al formato de entrada de la Responses API. */
function toInput(messages: UIMessage[]) {
    const input: any[] = [];
    for (const m of messages) {
        if (m.role !== "user" && m.role !== "assistant") continue;
        if (m.id === "initial") continue; // saludo automático: no aporta contexto
        const text = (m.role === "assistant" ? stripSummary(m.content ?? "") : (m.content ?? "")).toString();
        const images = (m.experimental_attachments || []).filter(
            (a) => a?.url && (a.contentType?.startsWith("image/") || a.url.startsWith("data:image/"))
        );
        if (!text.trim() && images.length === 0) continue;

        if (m.role === "user" && images.length) {
            input.push({
                role: "user",
                content: [
                    ...(text.trim() ? [{ type: "input_text", text }] : []),
                    ...images.map((a) => ({ type: "input_image", image_url: a.url, detail: "auto" })),
                ],
            });
        } else {
            input.push({ role: m.role, content: text });
        }
    }
    return input;
}

export type StreamOptions = {
    model: string;
    instructions: string;
    messages: UIMessage[];
    effort?: Effort;
    maxOutputTokens?: number;
    label?: string; // para los logs (p. ej. "DIRECTORA")
    /** Se llama si la IA falla. `hadOutput` indica si llegó a enviarse texto al usuario. */
    onError?: (err: unknown, hadOutput: boolean) => Promise<void> | void;
};

/**
 * Llama al modelo en streaming y devuelve una Response compatible con `useChat` (ai@3).
 * Formato: líneas `0:"texto"` (deltas), `3:"error"` (error) y `d:{...}` (fin).
 */
export function streamResponse(opts: StreamOptions): Response {
    const { model, instructions, messages, effort, maxOutputTokens, label = "IA", onError } = opts;
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const send = (s: string) => controller.enqueue(encoder.encode(s));
            const t0 = Date.now();
            let firstTokenMs: number | null = null;
            let hadOutput = false;

            try {
                const events = await getClient().responses.create({
                    model,
                    instructions,
                    input: toInput(messages),
                    stream: true,
                    store: false,
                    ...(effort ? { reasoning: { effort } } : {}),
                    ...(maxOutputTokens ? { max_output_tokens: maxOutputTokens } : {}),
                } as any);

                let usage: any = null;
                let incomplete = false;
                for await (const ev of events as any) {
                    if (ev.type === "response.output_text.delta" && ev.delta) {
                        if (firstTokenMs === null) firstTokenMs = Date.now() - t0;
                        hadOutput = true;
                        send(`0:${JSON.stringify(ev.delta)}\n`);
                    } else if (ev.type === "response.completed") {
                        usage = ev.response?.usage;
                    } else if (ev.type === "response.incomplete") {
                        usage = ev.response?.usage;
                        incomplete = true;
                    } else if (ev.type === "response.failed" || ev.type === "error") {
                        throw new Error(ev.response?.error?.message || ev.message || "El modelo no pudo completar la respuesta.");
                    }
                }

                const inTok = usage?.input_tokens ?? 0;
                const cached = usage?.input_tokens_details?.cached_tokens ?? 0;
                const outTok = usage?.output_tokens ?? 0;
                const cost = estimateCostUSD(model, inTok, cached, outTok);
                // Zero-Log: solo métricas, nunca contenido de la consulta.
                console.log(
                    `[AI] ${label} model=${model} effort=${effort ?? "default"} in=${inTok} (cache ${cached}) out=${outTok}` +
                    ` first=${firstTokenMs ?? "-"}ms total=${Date.now() - t0}ms` +
                    (cost !== null ? ` ~$${cost.toFixed(4)}` : "") + (incomplete ? " INCOMPLETE" : "")
                );

                send(`d:${JSON.stringify({ finishReason: incomplete ? "length" : "stop", usage: { promptTokens: inTok, completionTokens: outTok } })}\n`);
            } catch (err: any) {
                console.error(`[AI] ${label} ERROR model=${model}:`, err?.message || err);
                try { await onError?.(err, hadOutput); } catch (e) { console.error("[AI] onError failed:", e); }
                send(`3:${JSON.stringify(err?.message || "Error al contactar con la IA.")}\n`);
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "x-vercel-ai-data-stream": "v1" },
    });
}
