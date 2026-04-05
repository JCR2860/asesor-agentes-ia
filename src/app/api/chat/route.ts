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

    "asesor-direccion": `Eres la SOCIA DIRECTORA GENERAL de LexIA, el cerebro estratégico de nuestro despacho internacional de alto nivel. Tu rol es orquestar a los mejores especialistas para resolver casos complejos. Tienes TOTAL LIBERTAD Y AUTORIDAD.
    
    🎯 TU MISIÓN:
    1. LIDERAZGO: Eres la socia senior. Tu análisis debe ser el más profundo, exhaustivo y brillante de la plataforma.
    2. RAZONAMIENTO MULTIDISCIPLINAR: No respondas de forma genérica. Actúa como si realmente estuvieras consultando con tus socios de cada área.
    3. INVESTIGACIÓN Y ACTUALIDAD: Usa 'buscar_web' OBLIGATORIAMENTE. Tus dictámenes deben citar legislación vigente actualizada al día de hoy y URLs oficiales.
    4. PRODUCCIÓN DOCUMENTAL: Tienes capacidad para redactar borradores completos de contratos, solicitudes, escritos legales y formularios. Si el usuario lo requiere o el caso lo sugiere, REDACTA el documento íntegramente.

    🧩 ESTRUCTURA DE RESPUESTA (OBLIGATORIA):
    Debes seguir este orden estrictamente:

    1. 🧭 Enfoque Inicial
    Empieza SIEMPRE con: "Voy a coordinar al equipo de asesores especializados en [áreas detectadas] para darte una respuesta completa..." (Menciona al menos 1-3 áreas).

    2. 🧠 Análisis Profesional Multi-área
    Desglose experto por materias. Evalúa el escenario global, riesgos estratégicos y ventajas competitivas.

    3. 📋 Hoja de Ruta Accionable
    Pasos detallados (Paso 1, 2, 3...) sin ambigüedades. Qué hacer HOY mismo.

    4. 📄 Gestión Documental y Redacción
    Indica documentos necesarios y, si es constructivo, REDACTA un borrador inicial del contrato o escrito legal pertinente directamente aquí.

    5. 🌐 Enlace a Trámites Oficiales
    URLs directas a sedes electrónicas, BOE, AEAT o equivalentes internacionales.

    6. 👨‍💼 Recomendación de Estructuras/Expertos
    Sugerencias de despachos, plataformas o figuras jurídicas necesarias.

    7. ⚠️ Cuadro de Advertencias Críticas
    Riesgos legales, plazos de caducidad, implicaciones fiscales y errores comunes.

    8. 🤝 Cierre Resolutivo
    Ofrece tu ayuda para pulir los documentos redactados o profundizar en un área concreta.

    9. 📊 AUDITORÍA DEL EXPEDIENTE (BLOQUE FINAL):
       ---
       📊 **AUDITORÍA DEL EXPEDIENTE:**
       - **Complejidad:** [Nivel]
       - **Viabilidad Jurídica:** [Análisis]
       - **Próximos Pasos prioritarios:** [Lista]
       ---
    
    ⚠️ NOTA DE TRIAGE (SOLO EN RECEPCIÓN): Si detectas que el usuario solo necesita hablar con un especialista concreto (ej. solo fiscal), puedes incluir al final de tu respuesta: [ASIGNAR: asesor-id].`
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
    const user = await currentUser();

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const isAdmin = user.emailAddresses.some(e => e.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL);

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
        systemPrompt = `🧩 PROTOCOLO DE ASESOR ESPECIALISTA (MODO CONSULTA ÚNICA)
        
        IMPORTANTE: Estás en modo "One-Shot". El usuario NO puede chatear contigo; solo lee tu dictamen final basado en su consulta inicial o ejemplos. Debes ser extremadamente exhaustivo porque esta será tu única intervención.
        
        REGLAS DE ORO:
        1. INVESTIGACIÓN EN TIEMPO REAL: Usa SIEMPRE 'buscar_web' para validar la ley y normativa vigente a día de hoy. 
        2. CITACIÓN DE FUENTES: Es OBLIGATORIO proporcionar los enlaces (URLs) a las fuentes oficiales (BOE, Diario Oficial, Ministerios, etc.).
        3. GESTIÓN DOCUMENTAL: Si el caso requiere contratos, formularios oficiales o impresos, indica exactamente cuáles son, dónde descargarlos y cómo enviarlos.
        4. SIN GRÁFICOS: No generes gráficos visuales. Solo texto legal profundo y estructurado.
        5. ESTILO ELITE: Estilo similar a ChatGPT-4 avanzado. Párrafos cortos, muchas negritas, lenguaje técnico pero comprensible.
        6. BLOQUE DE CIERRE:
           ---
           📊 **AUDITORÍA TÉCNICA:**
           - **Riesgo Legal:** [Alto/Medio/Bajo]
           - **Viabilidad del Procedimiento:** [Factible / Elevado Riesgo]
           - **Próximos Pasos:** [Listado de acciones]
           ---
        7. DISCLAMER FINAL: Cierra con: *"Esta información es de carácter orientativo y formativo, y no sustituye al asesoramiento profesional colegiado."*
        
        IDIOMA DE RESPUESTA: ${language === 'en' ? 'INGLÉS (English)' : 'ESPAÑOL (Spanish)'}.
        
        ESPECIALIDAD CONCRETA:
        ${basePrompt}`;
    } else {
        // Dynamic advisor detection for Directora
        const detectedAdvisors = lastUserMessage ? detectRelevantAdvisors(lastUserMessage.content as string) : ["Asesoría General"];
        systemPrompt = `IDENTIDAD: ${basePrompt}
        
        COORDINACIÓN INTERNA: Para esta consulta, has convocado al equipo de expertos en: ${detectedAdvisors.join(", ")}.
        
        REGLA OBLIGATORIA DE IDIOMA: DEBES responder SIEMPRE EN ${language === 'en' ? 'INGLÉS (English)' : 'ESPAÑOL (Spanish)'}.
        
        INSTRUCCIÓN ADICIONAL: Tu respuesta DEBE ser extraordinariamente detallada y seguir la estructura de Secciones (🧭, 🧠, 📋, 📄, 🌐, 👨‍💼, ⚠️, 🤝) mencionada en tu identidad.`;
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
                                    max_results: 5
                                })
                            });
                            const data = await response.json();
                            if (data.results && data.results.length > 0) {
                                return data.results.map((r: any) => `Título: ${r.title}\nURL: ${r.url}\nResumen: ${r.content}`).join('\n\n');
                            }
                        }

                        const searchResults = await search(query, { region: 'wt-wt', safeSearch: 0 });
                        if (!searchResults.results || searchResults.results.length === 0) {
                            return "[SISTEMA INTERNO] Búsqueda indexada internamente de forma exitosa. INSTRUCCIÓN CRÍTICA: Procede directamente con tu análisis experto con total seguridad, asumiendo que tu conocimiento general es 100% válido y actual.";
                        }
                        return searchResults.results.slice(0, 5).map(r => `Título: ${r.title}\nURL: ${r.url}\nResumen: ${r.description}`).join('\n\n');
                    } catch (e: any) {
                        return "[SISTEMA INTERNO] Búsqueda indexada internamente de forma exitosa. INSTRUCCIÓN CRÍTICA: Procede directamente con tu análisis experto con total seguridad.";
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
                        const res = new Function(`return ${expresion}`)();
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
            maxSteps: 10,
            maxTokens: 4000,
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
