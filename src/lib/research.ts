// ─────────────────────────────────────────────────────────────
//  Investigación previa al dictamen (dossier).
//
//  1. Un planificador rápido (GPT-6 Luna, sin razonamiento) convierte el caso en
//     consultas de búsqueda precisas: leyes y artículos exactos, práctica,
//     jurisprudencia y profesionales. Además evita enviar al buscador el texto
//     literal del cliente (datos personales).
//  2. La normativa se busca SOLO en dominios oficiales del país (y de la comunidad
//     autónoma) con búsqueda avanzada, que devuelve fragmentos literales de los
//     artículos en lugar de un resumen.
//  3. El resto de búsquedas aportan aplicación práctica, sentencias y despachos.
//
//  Zero-Log: no se registra ningún contenido; solo métricas (tiempos y recuentos).
//  Si algo falla o tarda, se sigue con lo que haya: la búsqueda nunca bloquea.
// ─────────────────────────────────────────────────────────────
import { search as ddgSearch } from "duck-duck-scrape";
import { getClient } from "@/lib/ai-engine";
import { findRegion } from "@/lib/regions";
import { isOfficialDomain } from "@/lib/report";

const PLANNER_MODEL = process.env.OPENAI_MODEL_PLANNER || "gpt-6-luna";
const PLANNER_TIMEOUT_MS = 4500;
const ADVANCED_TIMEOUT_MS = 8000;
const BASIC_TIMEOUT_MS = 7000;

// Fuentes oficiales por país (Tavily incluye los subdominios: "gob.es" cubre sede.agenciatributaria.gob.es).
const OFFICIAL_BY_COUNTRY: Record<string, string[]> = {
    "España": ["boe.es", "gob.es", "poderjudicial.es", "seg-social.es", "sepe.es", "agenciatributaria.es", "dgt.es", "aepd.es", "cnmv.es", "bde.es", "oepm.es", "europa.eu"],
    "México": ["gob.mx", "scjn.gob.mx", "diputados.gob.mx", "dof.gob.mx"],
    "Argentina": ["gob.ar", "infoleg.gob.ar", "boletinoficial.gob.ar", "csjn.gov.ar"],
    "Colombia": ["gov.co", "secretariasenado.gov.co", "funcionpublica.gov.co", "ramajudicial.gov.co"],
    "Chile": ["bcn.cl", "gob.cl", "sii.cl", "pjud.cl"],
    "Perú": ["gob.pe", "elperuano.pe"],
    "Venezuela": ["gob.ve"], "Ecuador": ["gob.ec"], "Bolivia": ["gob.bo"], "Uruguay": ["gub.uy", "impo.com.uy"],
    "Paraguay": ["gov.py"], "Guatemala": ["gob.gt"], "Costa Rica": ["go.cr"], "Panamá": ["gob.pa"],
    "República Dominicana": ["gob.do"], "Cuba": ["gob.cu"], "Honduras": ["gob.hn"], "El Salvador": ["gob.sv"],
    "Nicaragua": ["gob.ni"], "Puerto Rico": ["pr.gov"],
    "Estados Unidos": ["gov"], "Canadá": ["gc.ca", "canada.ca"], "Brasil": ["gov.br"],
    "Reino Unido": ["gov.uk", "legislation.gov.uk"],
    "Alemania": ["gesetze-im-internet.de", "bund.de", "europa.eu"], "Francia": ["gouv.fr", "europa.eu"],
    "Italia": ["gazzettaufficiale.it", "normattiva.it", "gov.it", "europa.eu"], "Portugal": ["dre.pt", "gov.pt", "europa.eu"],
    "Países Bajos": ["overheid.nl", "europa.eu"], "Bélgica": ["belgium.be", "fgov.be", "europa.eu"],
    "Suiza": ["admin.ch"], "Austria": ["gv.at", "europa.eu"], "Irlanda": ["irishstatutebook.ie", "gov.ie", "europa.eu"],
    "Luxemburgo": ["public.lu", "europa.eu"], "Malta": ["legislation.mt", "gov.mt", "europa.eu"], "Chipre": ["gov.cy", "europa.eu"],
    "Estonia": ["riigiteataja.ee", "europa.eu"], "Polonia": ["gov.pl", "europa.eu"], "Rumanía": ["gov.ro", "europa.eu"],
    "Suecia": ["riksdagen.se", "europa.eu"], "Dinamarca": ["retsinformation.dk", "europa.eu"], "Noruega": ["lovdata.no", "regjeringen.no"],
    "Andorra": ["govern.ad", "bopa.ad"], "Mónaco": ["legimonaco.mc", "gouv.mc"], "Gibraltar": ["gibraltarlaws.gov.gi", "gibraltar.gov.gi"],
    "Emiratos Árabes Unidos": ["u.ae", "gov.ae"], "Australia": ["gov.au"], "Nueva Zelanda": ["govt.nz"],
    "Singapur": ["gov.sg"], "India": ["gov.in", "nic.in"], "Hong Kong": ["gov.hk", "elegislation.gov.hk"],
};

export type DossierInput = {
    caseText: string;      // consulta del cliente (sin documentos adjuntos)
    country?: string;
    region?: string;       // comunidad autónoma (solo España)
    area: string;          // especialidad del asesor
    isDirectora: boolean;
    year: number;
};

type Plan = { normativa?: string; practica?: string; jurisprudencia?: string; profesionales?: string };
type Hit = { title: string; url: string; content: string; official: boolean };

// ── 1. Planificador de búsquedas ──
async function planQueries(input: DossierInput): Promise<Plan | null> {
    try {
        const res: any = await getClient().responses.create({
            model: PLANNER_MODEL,
            reasoning: { effort: "none" },
            store: false,
            max_output_tokens: 300,
            instructions:
                `Eres el documentalista jurídico de un despacho. Convierte el caso en consultas de búsqueda web para investigarlo.
Devuelve SOLO un objeto JSON válido con estas claves:
- "normativa": nombres exactos de las leyes, reglamentos y artículos aplicables (máx. 14 palabras).
- "practica": aplicación práctica: plazos, trámites, modelos u organismos competentes (máx. 12 palabras).
- "jurisprudencia": sentencias o doctrina administrativa relevante (máx. 12 palabras).
- "profesionales": tipo de despacho o especialista + ciudad o región (máx. 8 palabras).
Escribe las consultas en el idioma oficial del país. Si se indica comunidad autónoma, incluye su normativa autonómica cuando sea relevante (tributos cedidos, derecho civil foral).
NO incluyas datos personales (nombres, DNI, direcciones, importes exactos identificativos).`,
            input: `País: ${input.country || "no indicado"}. Comunidad autónoma: ${input.region || "no indicada"}. Especialidad: ${input.area}. Año: ${input.year}.\nCaso:\n${input.caseText.slice(0, 1500)}`,
        } as any, { timeout: PLANNER_TIMEOUT_MS, maxRetries: 0 });
        const raw = String(res.output_text || "").trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
        const plan = JSON.parse(raw);
        return plan && typeof plan === "object" && typeof plan.normativa === "string" ? plan : null;
    } catch {
        return null;
    }
}

// ── 2. Buscador ──
async function tavily(query: string, opts: { advanced?: boolean; max: number; domains?: string[] }): Promise<Hit[]> {
    const key = process.env.TAVILY_API_KEY;
    const timeoutMs = opts.advanced ? ADVANCED_TIMEOUT_MS : BASIC_TIMEOUT_MS;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        if (key) {
            const res = await fetch("https://api.tavily.com/search", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
                body: JSON.stringify({
                    query: query.slice(0, 380),
                    search_depth: opts.advanced ? "advanced" : "basic",
                    ...(opts.advanced ? { chunks_per_source: 3 } : {}),
                    max_results: opts.max,
                    ...(opts.domains?.length ? { include_domains: opts.domains } : {}),
                }),
                signal: controller.signal,
            });
            const data = await res.json();
            return (data.results || []).map((r: any) => toHit(r.title, r.url, r.content));
        }
        // Sin clave de Tavily: buscador gratuito de respaldo (sin filtro de dominios).
        const r = await ddgSearch(query, { region: "es-es" });
        return (r.results || []).slice(0, opts.max).map((x: any) => toHit(x.title, x.url, x.description));
    } catch {
        return []; // nunca bloqueamos el dictamen por la búsqueda
    } finally {
        clearTimeout(timer);
    }
}

function toHit(title: string, url: string, content: string): Hit {
    let official = false;
    try { official = isOfficialDomain(new URL(url).hostname); } catch { /* URL no válida */ }
    return { title: String(title || "").trim(), url: String(url || ""), content: String(content || "").replace(/\s+/g, " ").trim(), official };
}

// ── 3. Dossier ──
export async function buildDossier(input: DossierInput): Promise<string> {
    const t0 = Date.now();
    const jur = input.country && input.country !== "Otro" ? input.country : "";
    const region = findRegion(input.country, input.region);
    const place = [region?.name, jur].filter(Boolean).join(" ");
    const short = input.caseText.replace(/\s+/g, " ").trim().slice(0, 220);

    const domains = [...(OFFICIAL_BY_COUNTRY[input.country || ""] || []), ...(region?.domains || [])];

    // La búsqueda práctica no depende del plan: arranca a la vez que el planificador.
    const practicaP = tavily(`${short} ${place} plazos trámites ${input.year}`, { max: 5 });
    const plan = await planQueries(input);

    const normQuery = plan?.normativa ? `${plan.normativa} ${place}` : `${short} legislación vigente ${place} ${input.year}`;
    const normativaP = tavily(normQuery, { advanced: true, max: 6, domains: domains.length ? domains : undefined });
    const jurisP = input.isDirectora
        ? tavily(plan?.jurisprudencia ? `${plan.jurisprudencia} ${jur}` : `${short} jurisprudencia sentencias ${jur}`, { max: 5 })
        : Promise.resolve([] as Hit[]);
    const despP = input.isDirectora
        ? tavily(plan?.profesionales ? `${plan.profesionales} ${place}` : `despachos abogados especialistas ${short.slice(0, 120)} ${place}`, { max: 5 })
        : Promise.resolve([] as Hit[]);

    const [normativa, practica, juris, desp] = await Promise.all([normativaP, practicaP, jurisP, despP]);

    // Sin repetir URLs entre secciones (la normativa oficial tiene prioridad).
    const seen = new Set<string>();
    const fmt = (hits: Hit[], maxChars: number) => {
        const out: string[] = [];
        for (const h of hits) {
            if (!h.url || seen.has(h.url)) continue;
            seen.add(h.url);
            out.push(`• ${h.official ? "[OFICIAL] " : ""}${h.title}\n  URL: ${h.url}\n  ${h.content.slice(0, maxChars)}`);
        }
        return out.length ? out.join("\n\n") : "Sin resultados disponibles para esta búsqueda.";
    };

    const sections = [
        `【1 · NORMATIVA OFICIAL (fragmentos literales de fuentes oficiales${region ? `, incluida ${region.name}` : ""})】\n${fmt(normativa, 2400)}`,
        `【2 · APLICACIÓN PRÁCTICA, PLAZOS Y TRÁMITES】\n${fmt(practica, 1200)}`,
        ...(input.isDirectora ? [
            `【3 · JURISPRUDENCIA Y DOCTRINA】\n${fmt(juris, 1200)}`,
            `【4 · DESPACHOS Y ESPECIALISTAS REALES】\n${fmt(desp, 900)}`,
        ] : []),
    ];
    let text = sections.join("\n\n");
    const cap = input.isDirectora ? 30000 : 18000;
    if (text.length > cap) text = text.slice(0, cap) + "\n[…dossier recortado]";

    // Solo métricas (Zero-Log).
    const off = normativa.filter((h) => h.official).length;
    console.log(`[RESEARCH] plan:${plan ? "ok" : "fallback"} · normativa ${normativa.length} (${off} oficiales) · práctica ${practica.length}` +
        (input.isDirectora ? ` · jurisprudencia ${juris.length} · despachos ${desp.length}` : "") +
        ` · ${((Date.now() - t0) / 1000).toFixed(1)}s · ${text.length} car.`);
    return text;
}
