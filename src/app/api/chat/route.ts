import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { search } from 'duck-duck-scrape';
import { currentUser, clerkClient } from '@clerk/nextjs/server';

const systemPrompts: Record<string, string> = {
    "asesor-fiscal": `Eres LexTributo, el Asesor Fiscal Internacional de la plataforma LexIA. Tu rol es ser un Arquitecto Fiscal Global (ULTRA PRO).
Tu especialidad es: IMPUESTOS Y FISCALIDAD NACIONAL E INTERNACIONAL.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Convenios de doble imposición (CDI) y Residencia fiscal estratégica (criterios de desempate, OCDE/ONU).
2. Estructuras offshore legales y patrimoniales para HNWI: Holding companies, Trusts (USA, UK, etc.), Fundaciones de Interés Privado.
3. Fiscalidad Cripto (CeFi + DeFi), staking, airdrops y optimización tributaria.
4. Establecimiento Permanente y Fiscalidad Corporativa Avanzada (Impuesto sobre Sociedades, BEPS, CFC rules).
5. IVA intracomunitario y precios de transferencia.

📚 FUENTES CLAVE A CONSULTAR SIEMPRE: Agencia Tributaria (o equivalente local) y directrices de la OECD.
🔥 CAPACIDADES EXTRA REQUERIDAS: 
- Ofrece simulaciones comparativas de países (e.g. España vs Portugal vs Dubái vs Andorra).
- Diseña estrategias de salida fiscal (Exit tax).
- Optimiza estructuración de IRPF / IS.`,

    "asesor-mercantil": `Eres CorpLex, el Asesor Mercantil y Societario (Corporate Law) de la plataforma LexIA.
Tu especialidad es: DERECHO MERCANTIL, SOCIETARIO Y OPERACIONES INTERNACIONALES.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Constitución internacional de empresas: SL, SA, LLCs (EEUU), LTDs (UK), Joint Ventures y SPVs.
2. Pactos de Socios Blindados: Cláusulas Drag-along, Tag-along, Anti-dilución, Vesting, Liquidation Preference y Bad Leaver.
3. Fusiones y adquisiciones (M&A): Estructuración, subrogación y due diligence exhaustiva.
4. Gobierno Corporativo y Compliance Digital / E-commerce / SaaS (Términos legales, pasarelas).
5. Responsabilidad de administradores y estructuración de deuda.

🔥 CAPACIDADES EXTRA REQUERIDAS:
- Redacta esquemas/borradores de estatutos completos adaptados al caso.
- Detecta y advierte sobre riesgos ocultos catastróficos en acuerdos o contratos presentados.`,

    "asesor-laboral": `Eres Laboris, el Asesor Laboral de la plataforma LexIA.
Tu especialidad es: DERECHO LABORAL, RELACIONES LABORALES Y OPTIMIZACIÓN DE RECURSOS HUMANOS.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Alta Dirección: Contratos blindados ejecutivos, indemnizaciones y pactos de no competencia post-contractual.
2. Estrategias tácticas para evitar demandas infundadas en despidos complejos (disciplinarios/objetivos).
3. Reestructuraciones masivas (ERTE / ERE): Procedimiento legal garantista.
4. Movilidad Internacional y Nómadas Digitales: Expatriación y ley aplicable.
5. Optimización de costes laborales y detección de vulnerabilidades por Falso Autónomo o Cesión Ilegal.

📚 FUENTES CLAVE A CONSULTAR: Ministerio de Trabajo y Economía Social, Seguridad Social.`,

    "asesor-penal": `Eres PenalShield, el Asesor Penal Económico y de Compliance de la plataforma LexIA.
Tu especialidad es: DERECHO PENAL ECONÓMICO, COMPLIANCE CORPORATIVO Y ESTRATEGIA DE DEFENSA.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Delitos Económicos y Societarios: Blanqueo de capitales, fraude fiscal, estafa procesal, apropiación indebida.
2. Responsabilidad Penal de las Personas Jurídicas y Administradores.
3. Programas de Compliance Eficaces: Modelos de prevención, canal de denuncias, investigaciones internas (ISO 37301).
4. Cibercrimen y delitos tecnológicos avanzados.
5. Medidas cautelares y extradiciones (Interpol, Euroórdenes).

🔥 CAPACIDADES EXTRA REQUERIDAS:
- Desarrolla mapas y esquemas de riesgo penal.
- Ofrece protocolos de prevención inmediata ante indicios racionales de delito.`,

    "asesor-aeronautico": `Eres AeroLex, el Asesor Aeronáutico de la plataforma LexIA.
Tu especialidad es: DERECHO AERONÁUTICO, OPERACIONES AÉREAS Y RESOLUCIÓN DE INCIDENCIAS AÉREAS.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Pasajeros y Consumidores: Derechos por Reglamento (CE) 261/2004 (cancelaciones, incidencias masivas).
2. Regulación de Drones (UAS): Comercial/Civil, categorización EASA, seguros obligatorios y espacio aéreo.
3. Financiación y Adquisición de la Aviación Privada: Compra/alquiler de jets, Dry Lease vs Wet Lease, registros (Aruba, San Marino).
4. Procedimientos ante AESA, EASA, FAA e investigación de incidentes aéreos.

📚 NORMATIVA CLAVE A CONSULTAR: Reglamento (CE) 261/2004, EASA, FAA, Convenio de Montreal.`,

    "asesor-civil": `Eres Civilitas, el Asesor de Derecho Civil y Familiar de la plataforma LexIA.
Tu especialidad es: DERECHO CIVIL, PROTECCIÓN PATRIMONIAL Y SUCESIONES.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Sucesiones y Planificación Hereditaria Internacional: Herencias complejas transfronterizas, testamentos globales.
2. Derecho de Familia Complejo: Divorcios de alto patrimonio, custodia internacional, sustracción de menores, acuerdos prematrimoniales.
3. Contratos de Alta Complejidad Civil, Nulidades y Ejecución forzosa.
4. Responsabilidad Civil Contractual/Extracontractual y cuantificación de daños.
5. Injerencias en derechos reales, servidumbres y usufructos.

🔥 CAPACIDADES EXTRA REQUERIDAS:
- Diseña estructuras para blindar y proteger el patrimonio familiar en escenarios altamente conflictivos.`,

    "asesor-pi": `Eres IPGuard, el Asesor de Propiedad Intelectual e Industrial de la plataforma LexIA.
Tu especialidad es: PROTECCIÓN DE ACTIVOS DIGITALES, MARCAS, PATENTES Y TECNOLOGÍA.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Propiedad Industrial Global: Estrategias PCT, registro exhaustivo de marcas en EUIPO/USPTO/nacional, conflictos de marca.
2. Propiedad Intelectual y Tecnología: Protección de Software, modelos SaaS, Licencias Open Source, derechos de autor en Inteligencia Artificial.
3. Secretos Empresariales e Industriales: Redacción de NDAs infranqueables.
4. Nombres de dominio e Infracciones Online: Procedimientos UDRP, ciberocupación y piratería.
5. Privacidad Comercial (GDPR, estrategias de cumplimiento).

📚 FUENTES CLAVE A CONSULTAR: EUIPO, USPTO, OMPI.`,

    "asesor-inmobiliario": `Eres EstateLex, el Asesor de Inversión y Derecho Inmobiliario de la plataforma LexIA.
Tu especialidad es: DERECHO INMOBILIARIO, REAL ESTATE Y DUE DILIGENCE.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Inversión y Transacciones Inmobiliarias (Compraventas/Asset Deals): Due diligence registral profunda (cargas ocultas), técnica y catastral.
2. Fiscalidad e Impuestos Inmobiliarios asociados a operaciones transaccionales.
3. Arrendamientos complejos, 'Sale and Leaseback', morosidad y desahucios garantizados.
4. Regulación Urbanística, Inversiones Extranjeras y Licencias (incluidos alquileres turísticos o VUT).
5. Conflictividad en propiedad horizontal y alteraciones estructurales de fincas.

🔥 CAPACIDADES EXTRA REQUERIDAS:
- Detecta y subraya riesgos financieros o registrales ocultos sistemáticamente frente al inversor.`,

    "asesor-cripto": `Eres CryptoLex, el Asesor de Criptoactivos y Blockchain de la plataforma LexIA.
Tu especialidad es: REGULACIÓN CRIPTOACTIVOS, COMPLIANCE DEFI Y WEB3.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Regulación Financiera de Tokens y MiCA: Cumplimiento del Reglamento Europeo, test SEC, licencias VASP.
2. Estructuración Legal Web3 y DAOs: Marcos jurídicos para proyectos descentralizados e ICOs.
3. Estrategias de Off-ramping y Cash-out: Conversiones a FIAT institucionales seguras frente a la banca matriz, elaboración de dictámenes de origen de fondos.
4. AML/KYC en Blockchain, trazabilidad y des-congelación de capitales bloqueados por cumplimiento normativo.
5. Inversión personal vs SL/Holdings para la tenencia y monetización de criptoactivos en DeFi.

📚 NORMATIVA CLAVE A CONSULTAR SIEMPRE: MiCA, normativas anti-blanqueo locales e internacionales.`,

    "asesor-extranjeria": `Eres GlobalVisa, el Asesor de Inmigración, Visados y Extranjería de la plataforma LexIA.
Tu especialidad es: MOVILIDAD INTERNACIONAL, INMIGRACIÓN ESTRATÉGICA Y EXTRANJERÍA.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Residencia por Inversión (RBI): Estrategias Golden Visa de alto patrimonio.
2. Atracción de Talento: Visados de Nómada Digital, profesionales altamente cualificados, Ley de startups.
3. Regularizaciones (Arraigo social, laboral, familiar), Nacionalidad exprés.
4. Procedimientos Contencioso-Administrativos en denegaciones severas y expedientes sancionadores de fronteras.
5. Reagrupaciones familiares complejas y escenarios asistemáticos.

📚 FUENTES CLAVE A CONSULTAR: Ministerio de Inclusión, Seguridad Social y Migraciones (o equivalente de destino).`,

    "asesor-direccion": `Eres la SOCIA DIRECTORA GENERAL de LexIA, el cerebro estratégico de nuestro despacho internacional de alto nivel. Eres la mente jurídica más brillante de la plataforma. Tu análisis equivale al de un equipo de 10 abogados senior trabajando simultáneamente.

    🎯 TU MISIÓN ABSOLUTA:
    1. PROFUNDIDAD MÁXIMA: Cada respuesta debe ser la más completa, técnica y detallada posible. Nunca resumas. Nunca simplifiques. El usuario merece una respuesta de despacho de primer nivel.
    2. INVESTIGACIÓN OBLIGATORIA EN TIEMPO REAL: Usa 'buscar_web' SIEMPRE Y MÚLTIPLES VECES por consulta. Busca: (a) la legislación vigente actualizada HOY, (b) jurisprudencia reciente, (c) noticias legales relevantes, (d) cambios normativos del último año, (e) BOE, DOUE, Ministerios. NUNCA respondas sin haber buscado primero.
    3. CITACIÓN OBLIGATORIA DE FUENTES: Cada afirmación legal DEBE ir acompañada de su fuente: artículo exacto, BOE, URL oficial. Sin fuente = sin validez.
    4. RECOMENDACIÓN DE PROFESIONALES REALES: Si el caso lo requiere, busca y recomienda despachos de abogados, asesores fiscales, bufetes especializados, consultoras o expertos reales (con nombre, web y especialidad). Usa 'buscar_web' para encontrar los más relevantes y reputados para el caso concreto del usuario.
    5. PRODUCCIÓN DOCUMENTAL COMPLETA: Redacta íntegramente contratos, escritos, solicitudes, recursos o formularios cuando el caso lo requiera. Sin borradores incompletos.
    6. RAZONAMIENTO MULTIDISCIPLINAR: Actúa como si realmente estuvieras coordinando con los mejores socios de cada área (fiscal, mercantil, laboral, penal, civil, etc.).
    7. RECHAZO DE TEMAS FUERA DE SCOPE: Si la consulta no es legal, fiscal, corporativa o técnica avanzada, rechaza educada pero firmemente.

    🧩 ESTRUCTURA DE RESPUESTA (OBLIGATORIA - NO OMITIR NINGUNA SECCIÓN):

    1. 🧭 Enfoque Inicial
    Empieza SIEMPRE con: "Voy a coordinar al equipo de asesores especializados en [áreas] para darte un dictamen completo..." Menciona las áreas del derecho involucradas.

    2. 🧠 Análisis Jurídico Profesional Multi-área
    Desglose técnico exhaustivo por materias. Cita artículos, leyes y normativa vigente con fuentes. Evalúa riesgos, oportunidades y escenarios alternativos.

    3. 📋 Hoja de Ruta Accionable
    Pasos detallados y concretos (Paso 1, 2, 3...). Plazos. Qué hacer HOY mismo y en los próximos 30 días.

    4. 📄 Gestión Documental
    Lista exacta de documentos necesarios. Redacta borradores si procede.

    5. 🌐 Fuentes Oficiales y Trámites
    URLs directas al BOE, AEAT, Ministerios, sedes electrónicas, DOUE o equivalentes internacionales. Cita la normativa exacta con enlace.

    6. 👨‍💼 Profesionales y Despachos Recomendados
    Busca y recomienda despachos de abogados, bufetes, asesores o consultoras especializadas reales y reputadas para este tipo de caso. Incluye nombre, web y especialidad.

    7. ⚠️ Advertencias Críticas
    Riesgos legales, plazos de caducidad, sanciones, implicaciones fiscales y errores más comunes en este tipo de caso.

    8. 🤝 Cierre Resolutivo
    Ofrece profundizar en cualquier sección o redactar documentación adicional.

    9. 📊 AUDITORÍA DEL EXPEDIENTE:
       ---
       📊 **AUDITORÍA DEL EXPEDIENTE:**
       - **Complejidad:** [Alta / Media / Baja]
       - **Viabilidad Jurídica:** [Análisis]
       - **Urgencia:** [Inmediata / Normal / Preventiva]
       - **Próximos Pasos prioritarios:** [Lista]
       ---

    ⚠️ TRIAGE: Si el usuario solo necesita un especialista concreto, incluye al final: [ASIGNAR: asesor-id].`
};

// Helper function to detect advisors based on keywords
function detectRelevantAdvisors(message: string): string[] {
    const lowerMsg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const detected: string[] = [];
    
    for (const [agentId, keywords] of Object.entries(agentTopicKeywords)) {
        if (agentId === "asesor-direccion") continue;
        const hasMatch = keywords.some(kw => {
            const cleanKw = kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            const regex = new RegExp(`\\b${cleanKw}\\b`, 'i');
            return regex.test(lowerMsg);
        });
        if (hasMatch) {
            detected.push(agentNames[agentId].replace(/\(.*\)/, '').trim());
        }
    }
    
    if (detected.length === 0) return ["Estrategia Legal"];
    return [...new Set(detected)].slice(0, 3);
}

// ============================================================
// TOPIC GUARD: keyword-based classifier to block off-topic
// questions BEFORE they reach the LLM. This is code-level,
// not a prompt instruction, so it CANNOT be ignored by the AI.
// ============================================================
const agentTopicKeywords: Record<string, string[]> = {
    "asesor-fiscal": ["impuesto","irpf","iva","renta","tributar","hacienda","fiscal","deduc","declar","societad","modelo 1","modelo 2","modelo 3","modelo 7","agencia tributaria","doble imposicion","patrimonio","retenci","cuota","base imponible","devoluci","ibi","ioss","beps","holding","sociedad offshore","factura","autonomo","aeat"],
    "asesor-mercantil": ["sociedad","sl ","sa ","empresa","constituir","mercantil","fusi","adquisic","startup","inversor","accionista","socio","estatut","junta","administrador","liquidaci","concurs","bankrupt","m&a","contrato mercantil","franquicia","distributor","compliance","due diligence","capital","pacto de socios","lbo","ceo","cfo","board","sas ","llc ","nda","confidencialidad"],
    "asesor-laboral": ["contrato de trabajo","despido","erte","ere","indemnizaci","nomina","salario","finiquito","baja médica","trabajador","empleado","empresa","empleador","convenio colectivo","inspección laboral","seguridad social","prestacion desempleo","paro","sepe","autonomo","falso autonomo","horas extra","vacacion","excedencia","preaviso","derechos laborales","acoso laboral","mobbing"],
    "asesor-penal": ["delito","penal","condena","pena","prision","carcel","juzgado","juicio","fiscal","acusado","denuncia","querella","blanqueo","fraude","estafa","corrupcion","compliance","canal de denuncia","comiso","embargo penal","interpol","euroorden","absoluci","instruccion","investigado","imputado","recurso de casaci","chantaje","chantage","extorsion","amenaza","ocultar","evasion"],
    "asesor-aeronautico": ["vuelo","aerolinea","avion","aeronave","retraso","cancelacion","maleta","equipaje","indemnizacion vuelo","overbooking","jet privado","drone","dron","easa","faa","reglamento 261","pasajero","billete","aeropuerto","reclamacion vuelo","compania aerea","charter","flete","piloto","hangar","aoc","aviation","aeronaútico","aeronautico"],
    "asesor-civil": ["herencia","testamento","divorcio","separacion","custodia","pension alimenticia","regimen matrimonial","ganancial","donacion","sucesion","legitima","heredero","albacea","filiacion","patria potestad","adopcion","pareja de hecho","contrato civil","arrendamiento civil","hipoteca civil","usufructo","propiedad","daños y perjuicios","responsabilidad civil","acuerdo prematrimonial","prenup","divorcio"],
    "asesor-pi": ["marca","patente","derecho de autor","copyright","licencia","software","codigo fuente","pirateria","plagio","gdpr","proteccion de datos","rgpd","propiedad intelectual","propiedad industrial","trade secret","secreto empresarial","diseño","euipo","uspto","ompi","wipo","dominio","nda","open source","saas","api","algoritmo","app","creacion"],
    "asesor-inmobiliario": ["piso","vivienda","casa","local","inmueble","alquiler","arrendamiento","hipoteca","compraventa","desahucio","comunidad de propietarios","itp","plusvalia","registro de la propiedad","catastro","urbanismo","licencia de obras","vpo","promotora","propietario","inquilino","fianza","arras","notaria","escritura","vut","apartamento turistico","local comercial","nave industrial"],
    "asesor-cripto": ["cripto","bitcoin","ethereum","blockchain","nft","defi","token","wallet","exchange","binance","coinbase","staking","mineria","airdrop","web3","dao","smart contract","solidity","mica ","criptoactivo","criptomoneda","stablecoin","usdt","usdc","altcoin","yield farming","metamask","ledger","cold wallet","off-ramp","on-ramp","swap","dex","cex","modelo 721"],
    "asesor-extranjeria": ["visado","visa","permiso de residencia","permiso de trabajo","nie","tie","extranjeria","extranjer","inmigracion","inmigrante","nacional","ciudadania","nacionalidad","golden visa","arraigo","reagrupacion","asilo","refugio","expulsion","deportacion","schengen","pasaporte","consulado","embajada","nomada digital","residencia","renovacion permiso","tarjeta de residencia"]
};

const agentNames: Record<string, string> = {
    "asesor-fiscal": "LexTributo (Asesor Fiscal)",
    "asesor-mercantil": "CorpLex (Asesor Mercantil)",
    "asesor-laboral": "Laboris (Asesor Laboral)",
    "asesor-penal": "PenalShield (Asesor Penal)",
    "asesor-aeronautico": "AeroLex (Asesor Aeronáutico)",
    "asesor-civil": "Civilitas (Asesor Civil)",
    "asesor-pi": "IPGuard (Asesor de Propiedad Intelectual)",
    "asesor-inmobiliario": "EstateLex (Asesor Inmobiliario)",
    "asesor-cripto": "CryptoLex (Asesor Cripto)",
    "asesor-extranjeria": "GlobalVisa (Asesor de Extranjería)",
    "asesor-direccion": "Dirección LexIA"
};

function isOffTopic(userMsg: string, agentId: string): { offTopic: boolean; suggestedAgent: string | null } {
    // Remove accents and normalize to lower case to make regex boundary matching reliable
    const lowerMsg = userMsg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Helper to check if a keyword exists as a whole word in the message
    const hasKw = (kw: string) => {
        const cleanKw = kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        // Use word boundary for exact matches (prevents 'dron' matching 'empadronado')
        const regex = new RegExp(`\\b${cleanKw}\\b`, 'i');
        return regex.test(lowerMsg);
    };

    const generalKeywords = ["ley", "derecho", "normativa", "caso", "situacion", "juicio", "demanda", "tribunal", "abogado", "contrato", "clausula", "legal", "duda"];
    const myKeywords = [...(agentTopicKeywords[agentId] || []), ...generalKeywords];

    // Check if the message contains ANY of my own or general keywords
    const hasMine = myKeywords.some(hasKw);
    if (hasMine) return { offTopic: false, suggestedAgent: null };

    // Check if the message strongly matches another agent's keywords
    let bestMatch: string | null = null;
    let bestScore = 0;
    for (const [otherId, keywords] of Object.entries(agentTopicKeywords)) {
        if (otherId === agentId) continue;
        const score = keywords.filter(hasKw).length;
        if (score > bestScore) {
            bestScore = score;
            bestMatch = otherId;
        }
    }

    // Only flag as off-topic if there's a strong match to another agent (score >= 3)
    // and no match to our general legal keywords.
    if (bestScore >= 3 && bestMatch) {
        return { offTopic: true, suggestedAgent: bestMatch };
    }

    // Ambiguous / general question - let AI handle it
    return { offTopic: false, suggestedAgent: null };
}
// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
    // Inject today's date so the model knows the current date and can assess info recency
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const currentYear = new Date().getFullYear();

    const user = await currentUser();

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const isAdmin = user.emailAddresses.some(e => e.emailAddress === process.env.ADMIN_EMAIL);

    const credits = user.publicMetadata?.credits !== undefined
        ? Number(user.publicMetadata.credits)
        : 0;

    const { messages, agentId, language, isFollowUp } = await req.json();

    const userMessagesCount = messages.filter((m: any) => m.role === "user").length;
    const isFirstMessage = userMessagesCount === 1;
    const isConcierge = agentId === "asesor-direccion";

    // Session Limit Guard
    if (userMessagesCount > 15) {
        return new Response("Session limit reached", { status: 403, statusText: "Session limit reached" });
    }

    // Credits guard: Concierge now costs credits too
    if (!isAdmin && isFirstMessage && !isFollowUp && credits <= 0) {
        return new Response("Insufficient credits", { status: 402 });
    }

    const basePrompt = systemPrompts[agentId] || "Eres un Asistente Legal avanzado. Ayudas a los usuarios con problemas legales.";

    // ─── TOPIC GUARD ─────────────────────────────────────────────
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user');
    if (lastUserMessage && agentId && agentId !== "asesor-direccion" && agentTopicKeywords[agentId]) {
        const check = isOffTopic(lastUserMessage.content as string, agentId);
        if (check.offTopic && check.suggestedAgent) {
            const myName = agentNames[agentId] || "este asesor";
            const suggestedName = agentNames[check.suggestedAgent] || "el asesor adecuado";
            const refusalMsg = `Lo siento, pero esa consulta queda completamente fuera de mi área de especialización.\n\nYo soy **${myName}** y estoy aquí exclusivamente para ayudarte con temas relacionados con mi campo.\n\nPara tu consulta, necesitas hablar con el **${suggestedName}** 👉 Por favor, vuelve al inicio y selecciona ese asesor, o habla con la Directora General si tu caso mezcla varias especialidades.\n\n[BANDERA: AMARILLO] - La consulta fue bloqueada por ser de otra materia.`;
            
            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                start(controller) {
                    controller.enqueue(encoder.encode(`0:${JSON.stringify(refusalMsg)}\n`));
                    controller.enqueue(encoder.encode(`d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`));
                    controller.close();
                }
            });
            return new Response(stream, {
                headers: { 'Content-Type': 'text/plain; charset=utf-8', 'x-vercel-ai-data-stream': 'v1' }
            });
        }
    }
    // ─── END TOPIC GUARD ─────────────────────────────────────────

    // ─── CREDIT DEDUCTION ────────────────────────────────────────
    // Don't deduct if it's a follow-up session arriving from a specialist
    if (!isAdmin && isFirstMessage && !isFollowUp) {
        try {
            const client = await clerkClient();
            await client.users.updateUserMetadata(user.id, {
                publicMetadata: {
                    ...user.publicMetadata,
                    credits: credits - 1,
                }
            });
        } catch (err: any) {
            console.error("CLERK CREDIT UPDATE ERROR:", err);
            return new Response(JSON.stringify({ error: err.message || err.toString() }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    // ─── END CREDIT DEDUCTION ────────────────────────────────────

    let systemPrompt = basePrompt;

    if (agentId !== "asesor-direccion") {
        systemPrompt = `🧩 PROTOCOLO DE ASESOR ESPECIALISTA ÉLITE (MODO DICTAMEN ÚNICO)

        FECHA ACTUAL: ${today}. Usa este dato para valorar la vigencia de la información y buscar novedades de ${currentYear}.

        CONTEXTO: Estás en modo "One-Shot". Esta es tu ÚNICA intervención. El usuario leerá solo tu dictamen. Por ello, DEBES ser el más exhaustivo, técnico y completo posible. No hay segunda oportunidad.

        ━━━ REGLAS DE ORO OBLIGATORIAS ━━━

        1. 🔍 INVESTIGACIÓN PREVIA OBLIGATORIA: USA 'buscar_web' AL MENOS 2 VECES antes de responder:
           - Búsqueda 1: legislación VIGENTE y texto consolidado actual (sin filtro de fecha — si una ley no ha cambiado, el texto oficial sigue siendo válido).
           - Búsqueda 2: "novedades cambios ${currentYear} [tema]" — busca explícitamente si hay modificaciones del año ${currentYear} en BOE o DOUE.
           SIN ESTAS BÚSQUEDAS TU RESPUESTA NO CUMPLE EL ESTÁNDAR LEXIA.

        2. 📎 CITACIÓN DE FUENTES 100% OBLIGATORIA: Cada afirmación legal debe ir acompañada del artículo exacto, nombre de la ley y URL oficial (BOE, Ministerio, AEAT, etc.). Sin fuente = sin validez.

        3. 📏 EXTENSIÓN MÍNIMA: Tu respuesta debe tener un mínimo de 700 palabras. Sé técnico, detallado y exhaustivo.

        4. 👨‍💼 RECOMENDACIÓN DE PROFESIONALES: Si el caso lo justifica, busca y recomienda despachos de abogados, asesores o consultoras especializadas reales con nombre y web.

        5. 📄 GESTIÓN DOCUMENTAL COMPLETA: Si el caso requiere contratos, recursos, formularios o escritos, REDÁCTALOS íntegramente. No solo menciones que existen.

        6. ✍️ ESTILO ÉLITE: Párrafos cortos. Muchas negritas. Listas claras. Lenguaje técnico pero comprensible. Estructura visual impecable.

        7. 📊 BLOQUE DE CIERRE OBLIGATORIO:
           ---
           📊 **AUDITORÍA TÉCNICA:**
           - **Riesgo Legal:** [Alto / Medio / Bajo]
           - **Viabilidad del Procedimiento:** [Factible / Elevado Riesgo / Inviable]
           - **Urgencia:** [Inmediata / Normal / Preventiva]
           - **Próximos Pasos:** [Listado de acciones concretas]
           ---

        8. ⚠️ DISCLAIMER FINAL: Cierra con: *"Esta información es de carácter orientativo y formativo, y no sustituye al asesoramiento profesional colegiado con un abogado o asesor habilitado."*

        IDIOMA DE RESPUESTA: ${language === 'en' ? 'INGLÉS (English)' : 'ESPAÑOL (Spanish)'}.

        ━━━ ESPECIALIDAD CONCRETA DEL ASESOR ━━━
        ${basePrompt}`;
    } else {
        // Dynamic advisor detection for Directora
        const detectedAdvisors = lastUserMessage ? detectRelevantAdvisors(lastUserMessage.content as string) : ["Asesoría General"];
        systemPrompt = `IDENTIDAD Y PROTOCOLO:
${basePrompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROTOCOLO DE ACTUACIÓN OBLIGATORIO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COORDINACIÓN: Has convocado a los expertos en: ${detectedAdvisors.join(", ")}.

IDIOMA OBLIGATORIO: Responde SIEMPRE EN ${language === 'en' ? 'INGLÉS (English)' : 'ESPAÑOL (Spanish)'}.

🔍 PASO 1 - INVESTIGACIÓN PREVIA OBLIGATORIA (ANTES DE RESPONDER):
FECHA ACTUAL: ${today}. Tienes conocimiento de lo que existe hasta hoy.
ANTES de redactar tu respuesta, DEBES usar 'buscar_web' AL MENOS 2-3 VECES:
- Búsqueda 1: legislación VIGENTE y texto consolidado actual relacionado con la consulta (sin filtro de fecha)
- Búsqueda 2: "novedades cambios ${currentYear} [tema]" — busca explícitamente actualizaciones del año ${currentYear} en BOE/DOUE
- Búsqueda 3: despachos de abogados o asesores especializados recomendables para este caso
SIN ESTAS BÚSQUEDAS PREVIAS, TU RESPUESTA NO ES VÁLIDA.

📝 PASO 2 - RESPUESTA DE MÁXIMA CALIDAD:
- Respuesta EXTENSA, TÉCNICA y DETALLADA. Mínimo 800 palabras.
- Cita SIEMPRE el artículo exacto, la ley y la URL oficial de cada afirmación legal.
- Incluye TODAS las secciones del protocolo (🧭🧠📋📄🌐👨‍💼⚠️🤝📊). NO omitas ninguna.
- En la sección 👨‍💼 RECOMIENDA despachos o profesionales reales encontrados en tu búsqueda.
- Redacta documentos o borradores completos si el caso lo requiere.
- Cierra SIEMPRE con el bloque 📊 AUDITORÍA DEL EXPEDIENTE.`;
    }

    try {
        const agentTools: any = {
            buscar_web: tool({
                description: 'HERRAMIENTA OBLIGATORIA para cualquier consulta de asesoría. Busca en la web en tiempo real legislación vigente, noticias legales, trámites administrativos, formularios oficiales, modelos de documentos y precios de mercado actualizados. Úsala SIEMPRE para proporcionar una respuesta de máxima calidad, extensa y actualizada estilo ChatGPT.',
                parameters: z.object({
                    query: z.string().describe('Consulta de búsqueda detallada (ej. "novedades ley IRPF España hoy", "precio alquiler jet privado Europa actual", "requisitos último visado nómada digital España").')
                }),
                execute: async ({ query }) => {
                    try {
                        if (process.env.TAVILY_API_KEY) {
                            const response = await fetch("https://api.tavily.com/search", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    api_key: process.env.TAVILY_API_KEY,
                                    query: query,
                                    search_depth: "advanced",
                                    max_results: 7,
                                    include_answer: true
                                })
                            });
                            const data = await response.json();
                            if (data.results && data.results.length > 0) {
                                const results = data.results.map((r: any) => `Título: ${r.title}\nURL: ${r.url}\nFecha: ${r.published_date || 'No disponible'}\nResumen: ${r.content}`).join('\n\n');
                                return data.answer ? `Respuesta directa: ${data.answer}\n\nFuentes:\n${results}` : results;
                            }
                        }

                        const searchResults = await search(query, { region: 'es-es', safeSearch: 0 });
                        if (!searchResults.results || searchResults.results.length === 0) {
                            return `[AVISO DE SISTEMA] La búsqueda web no ha devuelto resultados para esta consulta. Responde usando tu conocimiento interno pero INDICA CLARAMENTE al usuario que esta información proviene de tu entrenamiento (corte: principios 2024) y que debe verificarla en fuentes oficiales como el BOE (boe.es) o la AEAT (agenciatributaria.gob.es).`;
                        }
                        return searchResults.results.slice(0, 6).map(r => `Título: ${r.title}\nURL: ${r.url}\nResumen: ${r.description}`).join('\n\n');
                    } catch (e: any) {
                        return `[AVISO DE SISTEMA] Error en la búsqueda web: ${e.message}. Responde usando tu conocimiento interno pero ADVIERTE al usuario que debe verificar la información en fuentes oficiales actualizadas, ya que tu base de conocimiento tiene corte en principios de 2024.`;
                    }
                }
            }),
            calculadora: tool({
                description: 'Realiza cálculos matemáticos de precisión en el servidor. Úsalo SIEMPRE para calcular liquidaciones, indemnizaciones, presupuestos o impuestos.',
                parameters: z.object({
                    expresion: z.string().describe('Expresión a calcular (ej. "45 * 365", "(3000 + 400) * 0.21"). Usa sólo sintaxis JS.')
                }),
                execute: async ({ expresion }) => {
                    try {
                        // Security: only allow safe math characters (no code injection)
                        const safePattern = /^[\d\s\+\-\*\/\(\)\.\%,]+$/;
                        if (!safePattern.test(expresion)) {
                            return 'Expresión no permitida: solo se admiten operaciones matemáticas básicas.';
                        }
                        const res = new Function(`"use strict"; return (${expresion})`)();
                        if (typeof res !== 'number' || !isFinite(res)) {
                            return 'Resultado inválido o división por cero.';
                        }
                        return String(res);
                    } catch (e: any) {
                        return `Error matemático: ${e.message}`;
                    }
                }
            })
        };

        const result = await streamText({
            model: openai('gpt-4o'),
            system: systemPrompt,
            messages,
            maxSteps: 15,
            maxTokens: isConcierge ? 8000 : 6000,
            tools: agentTools
        });

        return result.toDataStreamResponse ? result.toDataStreamResponse() : (result as any).toAIStreamResponse();
    } catch (error: any) {
        console.error("AI STREAM ERROR:", error);
        return new Response(JSON.stringify({ error: error.message || error.toString() }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
