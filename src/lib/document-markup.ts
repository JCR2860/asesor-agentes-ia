// ─────────────────────────────────────────────────────────────
//  Lectura del marcado de los documentos de la Bóveda (compartido por el PDF y el Word).
//    # TÍTULO                      → título del documento (una vez)
//    ## REUNIDOS / ESTIPULACIONES  → encabezado de parte, centrado
//    ### PRIMERA.— OBJETO          → título de cláusula
//    a) … / - …                    → enumeraciones
//    [FIRMAS: ROL 1 | ROL 2]       → bloque de firmas
//    ## NOTAS DEL ASESOR …         → notas finales (no forman parte del documento)
//  Cada línea es un bloque; las líneas consecutivas sin línea en blanco entre ellas
//  (campos de formulario: "Nombre: ____", "DNI: ____") se marcan como "tight".
// ─────────────────────────────────────────────────────────────

export type Block =
    | { t: "title"; text: string }
    | { t: "section"; text: string; annex: boolean }
    | { t: "clause"; text: string }
    | { t: "para"; text: string; indent: number; label?: string; tight?: boolean }
    | { t: "sign"; roles: string[] }
    | { t: "notes"; text: string };

export function parseTemplate(content: string): Block[] {
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
            blocks.push(/^NOTAS DEL ASESOR/i.test(text) ? { t: "notes", text } : { t: "section", text, annex: /^ANEXO/i.test(text) });
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

/** El documento es un contrato (dos o más firmantes): lleva línea de rúbrica en cada página. */
export const isContract = (blocks: Block[]) => blocks.some((b) => b.t === "sign" && b.roles.length >= 2);

export const templateRef = (id: string) => `${id.toUpperCase()}-${new Date().getFullYear()}`;
