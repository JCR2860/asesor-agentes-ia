// Lectura de una consulta del cliente: texto, ficha del caso y documentos adjuntos.
// (Sin dependencias de React: se usa en el chat, la vista de informe y el PDF.)

export const FICHA_TAG = "[FICHA DEL CASO]";
const DOC_RE = /\[DOCUMENTO ADJUNTO:\s*([^\]]+)\]/g;

export function parseQuery(content: string): { text: string; ficha: [string, string][]; docNames: string[]; docName?: string } {
    const first = content.search(/\n*\[DOCUMENTO ADJUNTO:/);
    const beforeDoc = first >= 0 ? content.slice(0, first) : content;
    const i = beforeDoc.indexOf(FICHA_TAG);
    const text = (i >= 0 ? beforeDoc.slice(0, i) : beforeDoc).trim();
    const ficha: [string, string][] = i >= 0
        ? beforeDoc.slice(i + FICHA_TAG.length).split("\n")
            .map((l) => l.match(/^\s*-\s*([^:]+):\s*(.+)$/))
            .filter(Boolean)
            .map((m) => [m![1].trim(), m![2].trim()] as [string, string])
        : [];
    const docNames = [...content.matchAll(DOC_RE)].map((m) => m[1].trim());
    return { text, ficha, docNames, docName: docNames[0] };
}

/** Versión para el PDF del dictamen: la consulta y la ficha, y solo los nombres de los adjuntos (no su texto completo). */
export function queryForReport(content: string, es = true): string {
    const { text, ficha, docNames } = parseQuery(content);
    const parts = [text];
    if (ficha.length) parts.push(`${es ? "Ficha del caso" : "Case details"}:\n${ficha.map(([k, v]) => `- ${k}: ${v}`).join("\n")}`);
    if (docNames.length) parts.push(`${es ? "Documentos adjuntos analizados" : "Attached documents analysed"}:\n${docNames.map((d) => `- ${d}`).join("\n")}`);
    return parts.filter(Boolean).join("\n\n");
}
