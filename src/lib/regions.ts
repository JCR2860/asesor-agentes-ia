// ─────────────────────────────────────────────────────────────
//  Comunidades y ciudades autónomas de España.
//  En España, gran parte del resultado depende de la comunidad: tributos cedidos
//  (Sucesiones y Donaciones, Transmisiones, tramo autonómico del IRPF), derecho
//  civil foral (familia, herencias) y haciendas forales (País Vasco y Navarra).
// ─────────────────────────────────────────────────────────────

export type SpanishRegion = {
    name: string;
    /** Dominios oficiales (gobierno y boletín) para la búsqueda de normativa autonómica. */
    domains: string[];
    /** Tiene derecho civil propio (aplicable según vecindad civil). */
    foralCivil?: boolean;
    /** Régimen fiscal foral (concierto / convenio económico). */
    foralTax?: boolean;
};

export const SPANISH_REGIONS: SpanishRegion[] = [
    { name: "Andalucía", domains: ["juntadeandalucia.es"] },
    { name: "Aragón", domains: ["aragon.es"], foralCivil: true },
    { name: "Principado de Asturias", domains: ["asturias.es"] },
    { name: "Illes Balears", domains: ["caib.es"], foralCivil: true },
    { name: "Canarias", domains: ["gobiernodecanarias.org"] },
    { name: "Cantabria", domains: ["cantabria.es"] },
    { name: "Castilla-La Mancha", domains: ["castillalamancha.es", "jccm.es"] },
    { name: "Castilla y León", domains: ["jcyl.es"] },
    { name: "Cataluña", domains: ["gencat.cat"], foralCivil: true },
    { name: "Comunitat Valenciana", domains: ["gva.es"] },
    { name: "Extremadura", domains: ["juntaex.es"] },
    { name: "Galicia", domains: ["xunta.gal"], foralCivil: true },
    { name: "La Rioja", domains: ["larioja.org"] },
    { name: "Comunidad de Madrid", domains: ["comunidad.madrid", "bocm.es"] },
    { name: "Región de Murcia", domains: ["carm.es", "borm.es"] },
    { name: "Comunidad Foral de Navarra", domains: ["navarra.es"], foralCivil: true, foralTax: true },
    { name: "País Vasco", domains: ["euskadi.eus", "bizkaia.eus", "gipuzkoa.eus", "araba.eus"], foralCivil: true, foralTax: true },
    { name: "Ceuta", domains: ["ceuta.es"] },
    { name: "Melilla", domains: ["melilla.es"] },
];

export const findRegion = (name?: string | null) =>
    name ? SPANISH_REGIONS.find((r) => r.name === name) : undefined;
