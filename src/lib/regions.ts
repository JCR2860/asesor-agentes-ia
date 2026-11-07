// ─────────────────────────────────────────────────────────────
//  Regiones con legislación propia (comunidades, estados, provincias…).
//  En estos países gran parte del resultado depende de la región: impuestos
//  regionales, derecho civil/familia/sucesiones, laboral o procesal propio.
//  Se usa en el cliente (selector) y en el servidor (instrucciones y búsqueda).
// ─────────────────────────────────────────────────────────────

export type Region = {
    name: string;
    /** Dominios oficiales (gobierno y boletín) para buscar normativa regional. */
    domains?: string[];
    /** España: derecho civil propio (aplicable según vecindad civil). */
    foralCivil?: boolean;
    /** España: régimen fiscal foral (concierto / convenio económico). */
    foralTax?: boolean;
    /** Particularidad jurídica relevante de la región. */
    note?: string;
};

export type RegionSet = {
    /** Nombre del tipo de región (en singular). */
    label: { es: string; en: string };
    /** Qué depende de la región en ese país (para las instrucciones del asesor). */
    scope: string;
    regions: Region[];
};

const r = (names: string[]): Region[] => names.map((name) => ({ name }));

export const SPANISH_REGIONS: Region[] = [
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

export const REGIONS_BY_COUNTRY: Record<string, RegionSet> = {
    "España": {
        label: { es: "Comunidad autónoma", en: "Autonomous community" },
        scope: "tributos cedidos (Sucesiones y Donaciones, Transmisiones Patrimoniales y AJD, tramo autonómico del IRPF, Patrimonio), derecho civil foral y normativa autonómica",
        regions: SPANISH_REGIONS,
    },
    "Estados Unidos": {
        label: { es: "Estado", en: "State" },
        scope: "la mayor parte del derecho civil, contratos, familia y divorcio, sucesiones (probate), inmobiliario, laboral estatal (además del federal), sociedades e impuestos estatales sobre la renta, ventas y sucesiones; cita el código y los tribunales del estado además de la normativa federal",
        regions: [
            ...r(["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Distrito de Columbia", "Florida", "Georgia", "Hawái", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky"]),
            { name: "Luisiana", note: "Luisiana tiene un sistema de derecho civil de tradición francesa/española (Código Civil de Luisiana), distinto del common law del resto de estados." },
            ...r(["Maine", "Maryland", "Massachusetts", "Míchigan", "Minnesota", "Misisipi", "Misuri", "Montana", "Nebraska", "Nevada", "Nueva Hampshire", "Nueva Jersey", "Nuevo México", "Nueva York", "Carolina del Norte", "Dakota del Norte", "Ohio", "Oklahoma", "Oregón", "Pensilvania", "Rhode Island", "Carolina del Sur", "Dakota del Sur", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "Virginia Occidental", "Wisconsin", "Wyoming"]),
        ],
    },
    "México": {
        label: { es: "Estado", en: "State" },
        scope: "el Código Civil y el Código de Procedimientos Civiles estatales (familia, sucesiones, arrendamientos, contratos civiles), el código penal estatal para delitos del fuero común, el Registro Público de la Propiedad e impuestos estatales y municipales (Impuesto sobre Nómina, ISAI/traslado de dominio, predial)",
        regions: r(["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"]),
    },
    "Argentina": {
        label: { es: "Provincia", en: "Province" },
        scope: "los códigos procesales provinciales, la organización judicial provincial, los impuestos provinciales (Ingresos Brutos, Sellos, inmobiliario) y la normativa provincial y municipal; el Código Civil y Comercial de la Nación es común a todo el país",
        regions: r(["Ciudad Autónoma de Buenos Aires", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"]),
    },
    "Brasil": {
        label: { es: "Estado", en: "State" },
        scope: "los impuestos estatales (ICMS, ITCMD sobre herencias y donaciones, IPVA), la normativa y los tribunales de justicia estatales; el derecho civil, laboral y penal es federal",
        regions: r(["Acre", "Alagoas", "Amapá", "Amazonas", "Bahía", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Río de Janeiro", "Río Grande del Norte", "Río Grande del Sur", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"]),
    },
    "Canadá": {
        label: { es: "Provincia o territorio", en: "Province or territory" },
        scope: "el derecho de propiedad, contratos, familia, sucesiones, laboral provincial, arrendamientos e impuestos provinciales (renta provincial, PST/HST); el derecho penal y el divorcio son federales",
        regions: [
            { name: "Alberta", domains: ["alberta.ca"] },
            { name: "Columbia Británica", domains: ["gov.bc.ca"] },
            { name: "Manitoba", domains: ["gov.mb.ca"] },
            { name: "Nuevo Brunswick", domains: ["gnb.ca"] },
            { name: "Terranova y Labrador", domains: ["gov.nl.ca"] },
            { name: "Nueva Escocia", domains: ["novascotia.ca"] },
            { name: "Ontario", domains: ["ontario.ca"] },
            { name: "Isla del Príncipe Eduardo", domains: ["princeedwardisland.ca"] },
            { name: "Quebec", domains: ["quebec.ca", "gouv.qc.ca"], note: "Quebec se rige por el Código Civil de Quebec (tradición civilista), distinto del common law del resto de Canadá." },
            { name: "Saskatchewan", domains: ["saskatchewan.ca"] },
            { name: "Territorios del Noroeste" }, { name: "Nunavut" }, { name: "Yukón" },
        ],
    },
    "Reino Unido": {
        label: { es: "Jurisdicción", en: "Jurisdiction" },
        scope: "el sistema jurídico aplicable (Inglaterra y Gales, Escocia e Irlanda del Norte tienen derecho, tribunales y procedimientos propios en familia, sucesiones, propiedad y procesal) y algunos impuestos devueltos (p. ej. tipos del impuesto sobre la renta y del impuesto sobre transmisiones en Escocia y Gales)",
        regions: [
            { name: "Inglaterra", domains: ["legislation.gov.uk"] },
            { name: "Gales", domains: ["gov.wales"] },
            { name: "Escocia", domains: ["gov.scot"], note: "Escocia tiene un sistema jurídico propio (Scots law), mixto, con tribunales y procedimientos diferentes de Inglaterra y Gales." },
            { name: "Irlanda del Norte", domains: ["nidirect.gov.uk", "legislation.gov.uk"] },
        ],
    },
    "Suiza": {
        label: { es: "Cantón", en: "Canton" },
        scope: "los impuestos cantonales y municipales (renta, patrimonio, sucesiones y donaciones), la organización judicial y la normativa cantonal; el Código Civil y el de Obligaciones son federales",
        regions: r(["Argovia", "Appenzell Rodas Exteriores", "Appenzell Rodas Interiores", "Basilea-Campiña", "Basilea-Ciudad", "Berna", "Friburgo", "Ginebra", "Glaris", "Grisones", "Jura", "Lucerna", "Neuchâtel", "Nidwalden", "Obwalden", "San Galo", "Schaffhausen", "Schwyz", "Soleura", "Tesino", "Turgovia", "Uri", "Valais", "Vaud", "Zug", "Zúrich"]),
    },
    "Alemania": {
        label: { es: "Estado federado (Land)", en: "State (Land)" },
        scope: "el tipo del impuesto sobre transmisiones inmobiliarias (Grunderwerbsteuer), la normativa de vivienda, educación y administración regional y los tribunales del Land; el derecho civil (BGB), laboral y penal es federal",
        regions: r(["Baden-Wurtemberg", "Baviera", "Berlín", "Brandeburgo", "Bremen", "Hamburgo", "Hesse", "Baja Sajonia", "Mecklemburgo-Pomerania Occidental", "Renania del Norte-Westfalia", "Renania-Palatinado", "Sarre", "Sajonia", "Sajonia-Anhalt", "Schleswig-Holstein", "Turingia"]),
    },
    "Australia": {
        label: { es: "Estado o territorio", en: "State or territory" },
        scope: "el derecho de propiedad y arrendamientos, sucesiones, el impuesto de actos jurídicos documentados (stamp duty), la normativa laboral y de consumo estatal y los tribunales del estado; el derecho de familia y el impuesto sobre la renta son federales",
        regions: r(["Nueva Gales del Sur", "Victoria", "Queensland", "Australia Occidental", "Australia Meridional", "Tasmania", "Territorio de la Capital Australiana", "Territorio del Norte"]),
    },
};

export const regionSetFor = (country?: string | null): RegionSet | undefined =>
    country ? REGIONS_BY_COUNTRY[country] : undefined;

/** Busca una región válida del país (solo se aceptan valores de la lista). */
export function findRegion(country?: string | null, name?: string | null): Region | undefined {
    if (!name) return undefined;
    return regionSetFor(country)?.regions.find((x) => x.name === name);
}

/** Instrucciones para el asesor según el país y la región elegidos. */
export function regionInstructions(country?: string | null, region?: Region): string {
    const set = regionSetFor(country);
    if (!set) return "";
    const label = set.label.es.toUpperCase();
    if (!region) {
        return `\n\n📍 ${label}: no indicada. En ${country} el resultado puede depender de la región (${set.scope}). Si es relevante, indícalo y explica las diferencias principales.`;
    }
    let text = `\n\n📍 ${label}: **${region.name}** (${country}). Aplica, además de la normativa nacional/federal, la normativa propia de ${region.name} y cita sus fuentes oficiales cuando proceda. En ${country} depende de la región: ${set.scope}.`;
    if (region.foralCivil) text += ` ${region.name} tiene DERECHO CIVIL PROPIO: en familia, régimen económico matrimonial y sucesiones aplica su normativa foral, que depende de la vecindad civil del interesado (no solo de su residencia); si la vecindad civil es dudosa, indícalo.`;
    if (region.foralTax) text += ` ${region.name} tiene RÉGIMEN FISCAL FORAL (concierto/convenio económico) con hacienda foral propia: los impuestos directos se rigen por su normativa foral.`;
    if (region.note) text += ` ${region.note}`;
    return text;
}
