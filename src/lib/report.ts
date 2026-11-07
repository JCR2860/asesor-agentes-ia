// ─────────────────────────────────────────────────────────────
//  Utilidades de la "Vista de informe" de los dictámenes.
//
//  Los modelos terminan cada dictamen con un bloque oculto:
//    <lexia_resumen>{"titulo": "...", "conclusion": "...", ...}</lexia_resumen>
//  que alimenta la tarjeta de conclusión e indicadores. Nunca se muestra como
//  texto: se separa del cuerpo aquí (también si aún está llegando en streaming).
// ─────────────────────────────────────────────────────────────

export type ReportSummary = {
    titulo?: string;
    conclusion?: string;
    viabilidad?: string;   // Alta | Media | Baja
    riesgo?: string;       // Bajo | Medio | Alto
    plazo_clave?: string;
    coste?: string;
};

const OPEN = "<lexia_resumen>";
const CLOSE = "</lexia_resumen>";

/** Separa el bloque de resumen (JSON) del cuerpo. Tolera bloques incompletos (streaming). */
export function splitSummary(content: string): { body: string; summary: ReportSummary | null } {
    if (!content) return { body: "", summary: null };

    let text = content;
    // Si el final del texto es el comienzo de la etiqueta (p. ej. "<lexia_res"), lo ocultamos.
    for (let i = OPEN.length - 1; i > 0; i--) {
        if (text.endsWith(OPEN.slice(0, i))) { text = text.slice(0, -i); break; }
    }

    const start = text.indexOf(OPEN);
    if (start === -1) return { body: text.trim(), summary: null };

    const end = text.indexOf(CLOSE, start);
    const body = (text.slice(0, start) + (end !== -1 ? text.slice(end + CLOSE.length) : "")).trim();
    if (end === -1) return { body, summary: null }; // el bloque aún se está recibiendo

    const raw = text.slice(start + OPEN.length, end).trim()
        .replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    try {
        const parsed = JSON.parse(raw);
        return { body, summary: parsed && typeof parsed === "object" ? parsed : null };
    } catch {
        return { body, summary: null };
    }
}

export const stripSummary = (content: string) => splitSummary(content).body;

/**
 * Separa la línea final de aviso legal que añade el modelo ("**Aviso: ...**") para
 * mostrarla como nota discreta al pie en lugar de un párrafo en negrita.
 */
export function splitDisclaimer(body: string): { body: string; disclaimer: string | null } {
    const re = /\n\s*(?:[-*_]{3,}\s*\n\s*)?\*\*\s*((?:Aviso|Advertencia|Disclaimer|Nota legal)[^\n]{20,600}?)\s*\*\*\s*$/i;
    const m = body.match(re);
    if (!m || m.index === undefined) return { body, disclaimer: null };
    return { body: body.slice(0, m.index).trimEnd(), disclaimer: m[1].replace(/\*\*/g, "").trim() };
}

// ── Secciones (para el índice) ───────────────────────────────

export type ReportSection = { id: string; title: string; markdown: string };

const slug = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "seccion";

/** Limpia un título: quita emojis, numeración inicial y negritas; pasa MAYÚSCULAS a frase. */
export function cleanTitle(raw: string): string {
    let t = raw
        .replace(/\*\*/g, "")
        .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, "")
        .replace(/^\s*(\d{1,2}|[IVX]{1,4})[.)\-–:]\s*/i, "")
        .trim();
    const letters = t.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "");
    if (letters.length > 3 && letters === letters.toUpperCase()) {
        t = t.charAt(0) + t.slice(1).toLowerCase();
    }
    return t;
}

/**
 * Divide el cuerpo por títulos de nivel 2 (## ). Si el modelo usó nivel 1 (# ),
 * divide por esos. El texto anterior al primer título se devuelve como "intro".
 */
export function splitSections(body: string): { intro: string; sections: ReportSection[] } {
    const lines = body.split("\n");
    const hasH2 = lines.some((l) => /^##\s+\S/.test(l));
    const marker = hasH2 ? /^##\s+(.+)$/ : /^#\s+(.+)$/;

    const sections: ReportSection[] = [];
    const intro: string[] = [];
    let current: { title: string; lines: string[] } | null = null;
    const used = new Set<string>();

    for (const line of lines) {
        const m = line.match(marker);
        if (m) {
            if (current) sections.push(finish(current));
            current = { title: cleanTitle(m[1]), lines: [] };
        } else if (current) {
            current.lines.push(line);
        } else {
            intro.push(line);
        }
    }
    if (current) sections.push(finish(current));

    function finish(c: { title: string; lines: string[] }): ReportSection {
        let id = slug(c.title);
        let n = 2;
        while (used.has(id)) id = `${slug(c.title)}-${n++}`;
        used.add(id);
        return { id, title: c.title || "Sección", markdown: c.lines.join("\n").trim() };
    }

    return { intro: intro.join("\n").trim(), sections };
}

// ── Fuentes citadas ──────────────────────────────────────────

export type ReportSource = { url: string; domain: string; title: string; official: boolean };

// Dominios de organismos públicos y fuentes oficiales (España, UE, Latam, otros).
const OFFICIAL_SUFFIXES = [
    ".gob.es", ".gob.mx", ".gob.ar", ".gob.cl", ".gob.pe", ".gob.ec", ".gob.bo", ".gob.gt", ".gob.do",
    ".gob.pa", ".gob.ve", ".gob.hn", ".gob.sv", ".gob.ni", ".gob.cu", ".gov.py", ".go.cr",
    ".gov.co", ".gov.uk", ".gov", ".gouv.fr", ".europa.eu", ".gub.uy", ".gov.br", ".gov.pt", ".gov.it",
    ".gc.ca", ".gov.au", ".govt.nz", ".gov.sg", ".gov.in", ".gov.ae", ".gov.hk",
];
const OFFICIAL_DOMAINS = [
    "boe.es", "europa.eu", "poderjudicial.es", "agenciatributaria.es", "seg-social.es", "sepe.es",
    "comunidad.madrid", "bocm.es", "gencat.cat", "juntadeandalucia.es", "aragon.es", "larioja.org", "euskadi.eus",
    "bizkaia.eus", "gipuzkoa.eus", "araba.eus", "xunta.gal", "navarra.es", "gva.es", "carm.es", "borm.es",
    "jcyl.es", "castillalamancha.es", "jccm.es", "gobiernodecanarias.org", "caib.es", "asturias.es",
    "cantabria.es", "juntaex.es", "ceuta.es", "melilla.es", "dgt.es", "cnmv.es", "bde.es", "cnmc.es",
    "aepd.es", "oepm.es", "wipo.int", "oecd.org", "un.org", "bcn.cl", "sii.cl", "pjud.cl", "elperuano.pe",
    "impo.com.uy", "dre.pt", "normattiva.it", "gazzettaufficiale.it", "admin.ch", "gv.at", "canada.ca",
    "u.ae", "govern.ad", "bopa.ad", "public.lu", "overheid.nl", "gesetze-im-internet.de", "irishstatutebook.ie",
];

export function isOfficialDomain(host: string): boolean {
    const h = host.toLowerCase().replace(/^www\./, "");
    return OFFICIAL_SUFFIXES.some((s) => h.endsWith(s) || h === s.slice(1)) ||
        OFFICIAL_DOMAINS.some((d) => h === d || h.endsWith("." + d));
}

/** Extrae los enlaces citados en el markdown (con título si es un enlace con texto). */
export function extractSources(markdown: string): ReportSource[] {
    const out = new Map<string, ReportSource>();
    const seenUrls = new Set<string>();
    const add = (rawUrl: string, label?: string) => {
        const url = rawUrl.replace(/[).,;:!?»"'\]]+$/, "");
        let host = "";
        try { host = new URL(url).hostname; } catch { return; }
        const domain = host.replace(/^www\./, "");
        const cleanLabel = label && !/^https?:\/\//i.test(label.trim()) ? label.replace(/\*\*/g, "").trim() : "";
        const title = cleanLabel || domain;
        // Una tarjeta por enlace, y una sola por documento+nombre (aunque apunte a otro #artículo).
        const key = `${url.split("#")[0]}|${title.toLowerCase()}`;
        if (seenUrls.has(url) || out.has(key)) return;
        seenUrls.add(url);
        out.set(key, { url, domain, title, official: isOfficialDomain(host) });
    };

    // Enlaces markdown [texto](url)
    for (const m of markdown.matchAll(/\[([^\]]{1,160})\]\((https?:\/\/[^\s)]+)\)/g)) add(m[2], m[1]);
    // URLs sueltas
    const withoutMdLinks = markdown.replace(/\[([^\]]{1,160})\]\((https?:\/\/[^\s)]+)\)/g, " ");
    for (const m of withoutMdLinks.matchAll(/https?:\/\/[^\s<>()]+/g)) add(m[0]);

    // Primero las oficiales
    return [...out.values()].sort((a, b) => Number(b.official) - Number(a.official));
}

// ── Indicadores ──────────────────────────────────────────────

/** Color del indicador según el valor (verde = favorable, ámbar = medio, rojo = desfavorable). */
export function levelTone(kind: "viabilidad" | "riesgo", value?: string): "good" | "mid" | "bad" | "neutral" {
    const v = (value || "").toLowerCase();
    if (!v) return "neutral";
    if (kind === "viabilidad") {
        if (/alta|high/.test(v)) return "good";
        if (/media|medium|moderada/.test(v)) return "mid";
        if (/baja|low|nula/.test(v)) return "bad";
    } else {
        if (/bajo|low/.test(v)) return "good";
        if (/medio|medium|moderado/.test(v)) return "mid";
        if (/alto|high|crítico|critico/.test(v)) return "bad";
    }
    return "neutral";
}
