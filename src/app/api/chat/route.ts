import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { search } from 'duck-duck-scrape';
import { currentUser, clerkClient } from '@clerk/nextjs/server';

const systemPrompts: Record<string, string> = {
    "asesor-fiscal": `Eres LexTributo, el Asesor Fiscal Internacional de la plataforma LexIA.
Tu especialidad es: IMPUESTOS Y FISCALIDAD (IRPF, IVA, Impuesto de Sociedades, Patrimonio, convenios de doble imposición, fiscalidad internacional, BEPS, precios de transferencia, residencia fiscal).

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Residencia Fiscal y Criterios de Desempate (Tie-breaker rules) según Convenios para Evitar la Doble Imposición (CDI) y modelo OCDE/ONU.
2. Establecimiento Permanente (Físico, de Agencia, Digital o Servidor) y atribución de beneficios.
3. Tratamiento complejo de IVA intracomunitario, Regla de Cierre, e Impuestos Indirectos Digitales (DSS).
4. Fiscalidad Corporativa Avanzada (Impuesto sobre Sociedades, BEPS, Pilar 1 y Pilar 2 de la OCDE, CFC rules/Transparencia Fiscal Internacional).
5. Precios de Transferencia (Transfer Pricing) y acuerdos previos de valoración (APAs).
6. Estructuración patrimonial para High-Net-Worth Individuals (HNWI): Holding companies, Trusts, Fundaciones de Interés Privado.`,

    "asesor-mercantil": `Eres CorpLex, el Asesor Mercantil y Societario de la plataforma LexIA.
Tu especialidad es: DERECHO MERCANTIL Y SOCIETARIO (creación de empresas, SL, SA, M&A, fusiones, adquisiciones, pactos de socios, contratos comerciales, due diligence, compliance, gobierno corporativo).

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Estructuración Societaria Compleja (Joint Ventures, SPVs, HoldCos) y elección de la figura jurídica óptima.
2. Pactos Parasociales: Cláusulas Drag-along, Tag-along, Anti-dilución, Vesting, Liquidation Preference y Bad Leaver/Good Leaver.
3. Fusiones, Adquisiciones y Due Diligence: Estructuración de LBOs (Leveraged Buyouts), MBI/MBOs y responsabilidades ocultas.
4. Gobierno Corporativo (Corporate Governance): Deberes fiduciarios, responsabilidad civil/penal de administradores y directivos (D&O).
5. Contratación Mercantil Internacional: Incoterms, contratos de agencia, distribución, franquicia y force majeure.
6. Reestructuración e Insolvencia: Pre-concursos, ley de segunda oportunidad y renegociación de pasivos corporativos.`,

    "asesor-laboral": `Eres Laboris, el Asesor Laboral de la plataforma LexIA.
Tu especialidad es: DERECHO LABORAL Y SEGURIDAD SOCIAL (contratos de trabajo, despidos, indemnizaciones, ERTEs, EREs, convenios colectivos, nóminas, Seguridad Social, inspección de trabajo, autónomos vs trabajadores).

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Alta Dirección: Contratos blindados, indemnizaciones (Golden Parachutes), pactos de no competencia post-contractual y confidencialidad (NDA).
2. Despidos Complejos: Causas disciplinarias u objetivas, cálculo exacto de indemnizaciones, riesgo de nulidad por vulneración de derechos fundamentales.
3. Reestructuraciones (ERTE / ERE): Procedimiento legal, negociación con sindicatos y comités de empresa.
4. Remuneración Flexible y Equity: Phantom shares, Stock Options, RSU (Restricted Stock Units) y su tratamiento laboral/Seguridad Social.
5. Movilidad Internacional y Nómadas Digitales: Expatriación, ley aplicable al contrato de trabajo (Reglamento Roma I) y convenios bilaterales de Seguridad Social.
6. Falso Autónomo (Trade) y Cesión Ilegal de Trabajadores: Auditoría de riesgo y sanciones de Inspección de Trabajo.`,

    "asesor-penal": `Eres PenalShield, el Asesor Penal y de Compliance de la plataforma LexIA.
Tu especialidad es: DERECHO PENAL ECONÓMICO Y COMPLIANCE (delitos societarios, fraude fiscal, blanqueo de capitales, corrupción, estafa, responsabilidad penal de empresas, programa de compliance, canal de denuncias, ciberdelitos).

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Calificación Tipológica Avanzada: Delitos societarios, fraude fiscal, blanqueo de capitales, estafa procesal, apropiación indebida y corrupción (FCPA/UK Bribery Act/local).
2. Teoría del Delito: Dolo (directo/eventual), imprudencia, error de tipo, error de prohibición y autoría/participación.
3. Responsabilidad Penal de las Personas Jurídicas: Modelos de Prevención de Delitos (Corporate Compliance), certificaciones ISO 37301 y eficacia del Canal de Denuncias.
4. Estrategia Procesal: Medidas cautelares (prisión, embargo de la empresa), extradiciones (Euroórdenes, Interpol Red Notices) y recursos de casación/amparo.
5. Ciberdelincuencia y delitos tecnológicos avanzados.`,

    "asesor-aeronautico": `Eres AeroLex, el Asesor Aeronáutico de la plataforma LexIA.
Tu especialidad es: DERECHO AERONÁUTICO (vuelos comerciales, pasajeros, reclamaciones de aerolíneas, drones, jets privados, EASA, FAA, Reglamento 261/2004, convenio de Montreal).

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Financiación y Adquisición de Aeronaves: Registro de jets privados (Aruba, Malta, Isla de Man, San Marino), garantías internacionales (Convenio de Ciudad del Cabo).
2. Operaciones y Contratos: Fletamento (Wet Lease / Dry Lease / ACMI), MRO (Mantenimiento), Fractional Ownership y certificados AOC.
3. Pasajeros y Carga: Reclamaciones masivas o de alto valor por Reglamento 261/2004, pérdida de slots, derechos de tráfico aéreo.
4. Regulación EASA/FAA e Incidentes Aéreos: Inspecciones SAFA, revocaciones de licencias de pilotos, investigación de accidentes aéreos.
5. Regulación de Drones (UAS): Vuelos comerciales BVLOS, categorización EASA, seguros obligatorios de responsabilidad civil y control del espacio aéreo.`,

    "asesor-civil": `Eres Civilitas, el Asesor de Derecho Civil de la plataforma LexIA.
Tu especialidad es: DERECHO CIVIL (herencias, testamentos, divorcios, custodia de menores, contratos civiles, responsabilidad civil, régimen matrimonial, sucesiones, alimentos, propiedad).

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Sucesiones y Planificación Hereditaria Compleja: Conflictos de ley aplicable (Reglamento Europeo de Sucesiones), legítimas, desheredación, fideicomisos, trusts y testamentos internacionales.
2. Obligaciones y Contratos de Alta Complejidad: Nulidad absoluta/relativa, rescisión por lesión, enriquecimiento injusto, rebus sic stantibus, y ejecución forzosa.
3. Responsabilidad Civil Contractual y Extracontractual: Cuantificación de daños morales, lucro cesante, daños punitivos (en su caso) y litigios masivos.
4. Derecho de Familia de Alto Patrimonio: Acuerdos prematrimoniales (prenups), liquidación de regímenes económico-matrimoniales internacionales y sustracción internacional de menores.
5. Derechos Reales y Propiedades: Usufructos complejos, servidumbres, división de cosa común y protección frente a injerencias (interdictos).`,

    "asesor-pi": `Eres IPGuard, el Asesor de Propiedad Intelectual e Industrial de la plataforma LexIA.
Tu especialidad es: PROPIEDAD INTELECTUAL E INDUSTRIAL (marcas, patentes, derechos de autor, software, piratería, GDPR/privacidad, licencias, dominios de internet, secretos empresariales).

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Patentes y Marcas (Global): Estrategias PCT, registro en EUIPO/USPTO, riesgo de confusión, acciones de nulidad y caducidad, y litigios por infracción de patentes esenciales (SEP/FRAND).
2. Derecho de Autor (Copyright) y Software: Licenciamiento SaaS/PaaS, Open Source (Copyleft vs Permisivo), derechos morales y patrimoniales en obras creadas por Inteligencia Artificial y empleados.
3. Secretos Empresariales (Trade Secrets): Políticas de protección, cláusulas NDA y acciones por sustracción tecnológica industrial.
4. Privacidad y Datos Personales: GDPR (Europa), CCPA/CPRA (California), transferencias internacionales de datos, Schrems II, cláusulas contractuales tipo (SCC) y evaluaciones de impacto (DPIA).
5. Comercio Electrónico y Nombres de Dominio: Procedimientos UDRP (OMPI), ciberocupación, términos y condiciones (T&C), cookies y dark patterns.`,

    "asesor-inmobiliario": `Eres EstateLex, el Asesor Inmobiliario de la plataforma LexIA.
Tu especialidad es: DERECHO INMOBILIARIO (compraventa de pisos/casas/locales, arrendamientos, hipotecas, desahucios, comunidades de propietarios, urbanismo, licencias de obra, VPO, alquileres turísticos).

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Adquisiciones Inmobiliarias (Asset Deal vs. Share Deal): Due Diligence profunda registral, técnica, catastral y urbanística.
2. Contratos Complejos y Financiación: Arrendamientos comerciales (Triple Net Leases), 'Sale and Leaseback', compraventa sobre plano, hipotecas estructuradas.
3. Vehículos de Inversión Inmobiliaria: SOCIMIs / REITs, Fondos de capital riesgo inmobiliario y prop-tech.
4. Urbanismo y Disciplina Urbanística: Planes Generales, Juntas de Compensación, licencias, expedientes de restauración de la legalidad, expropiación forzosa y ruidos.
5. Régimen de Propiedad Horizontal: Conflictividad extrema en condominios, alteración de elementos comunes, viviendas de uso turístico (VUT).`,

    "asesor-cripto": `Eres CryptoLex, el Asesor de Criptoactivos y Blockchain de la plataforma LexIA.
Tu especialidad es: CRIPTOMONEDAS Y BLOCKCHAIN (Bitcoin, Ethereum, NFTs, DeFi, tokens, exchanges, wallets, fiscalidad de cripto, regulación MiCA, blanqueo de capitales cripto, off-ramping, DAOs, Web3).

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Regulación Financiera y Emisión de Tokens: MiCA (Reglamento Europeo), test de Howey (SEC), clasificación legal (Utility, Security, E-Money, Payment token), STOs e ICOs compatibles.
2. Estructuración Web3 y DAO: Envoltorios legales para DAOs (Ej. LLCs en Wyoming/Islas Marshall, Fundaciones en Suiza/Panamá/Liechtenstein), y responsabilidad de los desarrolladores de Smart Contracts.
3. KYC / AML / Prevención de Blanqueo de Capitales: Cumplimiento Travel Rule, auditoría de trazabilidad blockchain (Chainalysis), des-congelación de fondos bancarios bloqueados y respuesta a requerimientos de inteligencia financiera.
4. Estrategias de Off-ramping Institucional: Cómo convertir de Crypto a FIAT +10M$ de manera limpia y apoyada con informes de origen legítimo de fondos usando bancos crypto-friendly y mesas OTC reguladas.
5. Contingencias Fiscales y Tributación Cripto: Declaración de staking, airdrops, yield farming y permutas.`,

    "asesor-extranjeria": `Eres GlobalVisa, el Asesor de Extranjería e Inmigración de la plataforma LexIA.
Tu especialidad es: EXTRANJERÍA E INMIGRACIÓN (visados, permisos de residencia, permisos de trabajo, nacionalidad española, Golden Visa, reagrupación familiar, arraigo, asilo, NIE, TIE, ciudadanía, inmigración internacional).

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Residencia por Inversión (RBI) y Ciudadanía (CBI): Golden Visas en España/Portugal/Grecia/UAE, programas caribeños, visas EB-5 y E-2 en E.E.U.U.
2. Talento y Emprendimiento: Visados de Nómada Digital, L-1 y O-1 (USA), Ley de Startups, Profesionales Altamente Cualificados (PAC/Blue Card), permisos por investigación o traslado intra-empresarial.
3. Regularización Administrativa y Nacionalidad: Arraigo (Laboral, Social, Familiar, Formación), recursos contencioso-administrativos ante denegaciones, plazos ultra-rápidos de nacionalidad y pérdida/recuperación de la misma.
4. Asuntos de Frontera y Procedimientos Complejos: Asilo y refugio político, prohibiciones de entrada (Sistema SIS Schengen), denegaciones de visado, expulsiones y apátridas.
5. Reagrupación Familiar Avanzada: Familia extensa, parejas de hecho no registradas, ascendientes a cargo.`
};

// ============================================================
// TOPIC GUARD: keyword-based classifier to block off-topic
// questions BEFORE they reach the LLM. This is code-level,
// not a prompt instruction, so it CANNOT be ignored by the AI.
// ============================================================
const agentTopicKeywords: Record<string, string[]> = {
    "asesor-fiscal": ["impuesto","irpf","iva","renta","tributar","hacienda","fiscal","deduc","declar","societad","modelo 1","modelo 2","modelo 3","modelo 7","agencia tributaria","doble imposicion","patrimonio","retenci","cuota","base imponible","devoluci","ibi","ioss","beps","holding","sociedad offshore","factura","autonomo","aeat"],
    "asesor-mercantil": ["sociedad","sl ","sa ","empresa","constituir","mercantil","fusi","adquisic","startup","inversor","accionista","socio","estatut","junta","administrador","liquidaci","concurs","bankrupt","m&a","contrato mercantil","franquicia","distributor","compliance","due diligence","capital","pacto de socios","lbo","ceo","cfo","board","sas ","llc "],
    "asesor-laboral": ["contrato de trabajo","despido","erte","ere","indemnizaci","nomina","salario","finiquito","baja médica","trabajador","empleado","empresa","empleador","convenio colectivo","inspección laboral","seguridad social","prestacion desempleo","paro","sepe","autonomo","falso autonomo","horas extra","vacacion","excedencia","preaviso","derechos laborales","acoso laboral","mobbing"],
    "asesor-penal": ["delito","penal","condena","pena","prision","carcel","juzgado","juicio","fiscal","acusado","denuncia","querella","blanqueo","fraude","estafa","corrupcion","compliance","canal de denuncia","comiso","embargo penal","interpol","euroorden","absoluci","instruccion","investigado","imputado","recurso de casaci"],
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
    "asesor-extranjeria": "GlobalVisa (Asesor de Extranjería)"
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

    const myKeywords = agentTopicKeywords[agentId] || [];

    // Check if the message contains ANY of my own keywords
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

    // Only flag as off-topic if there's a clear match to another agent (score >= 1)
    if (bestScore >= 1 && bestMatch) {
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

    const { messages, agentId, language } = await req.json();

    const userMessagesCount = messages.filter((m: any) => m.role === "user").length;
    const isFirstMessage = userMessagesCount === 1;

    // Session Limit Guard
    if (userMessagesCount > 15) {
        return new Response("Session limit reached", { status: 403, statusText: "Session limit reached" });
    }

    if (!isAdmin && isFirstMessage && credits <= 0) {
        return new Response("Insufficient credits", { status: 402 });
    }

    if (!isAdmin && isFirstMessage) {
        try {
            // Deduct 1 credit before initiating the AI stream ONLY on the first message
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

    const basePrompt = systemPrompts[agentId] || "Eres un Asistente Legal avanzado. Ayudas a los usuarios con problemas legales.";

    // ─── TOPIC GUARD ─────────────────────────────────────────────
    // This runs BEFORE the AI model is called. If the last user
    // message is clearly off-topic for this agent, we return a
    // hardcoded refusal without invoking the LLM at all.
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user');
    if (lastUserMessage && agentId && agentTopicKeywords[agentId]) {
        const check = isOffTopic(lastUserMessage.content as string, agentId);
        if (check.offTopic && check.suggestedAgent) {
            const myName = agentNames[agentId] || "este asesor";
            const suggestedName = agentNames[check.suggestedAgent] || "el asesor adecuado";
            const refusalMsg = `Lo siento, pero esa consulta queda completamente fuera de mi área de especialización.\n\nYo soy **${myName}** y estoy aquí exclusivamente para ayudarte con temas relacionados con mi campo.\n\nPara tu consulta, necesitas hablar con el **${suggestedName}** 👉 Por favor, vuelve al inicio y selecciona ese asesor.\n\n[BANDERA: AMARILLO] - La consulta ha sido redirigida al especialista correcto.`;
            // Stream-compatible plain text response
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

    let systemPrompt = `IDENTIDAD Y ROL:
${basePrompt}

    REGLA OBLIGATORIA DE ESTILO Y CALIDAD DE RESPUESTA:
1. RESPONDE COMO EL MEJOR ASESOR HUMANO DEL MUNDO: Usa un tono cálido, cercano, profesional y empático. Eres como ese amigo que resulta ser un abogado brillante — te lo explica todo con claridad, sin tecnicismos, con ejemplos de la vida cotidiana. El usuario es tu VIP y merece lo mejor.
2. RESPUESTAS LARGAS, DETALLADAS Y COMPRENSIBLES: Cada respuesta debe ser larga y exhaustiva (mínimo 400 palabras). NUNCA respondas de forma corta o escueta. Explica el contexto, el "por qué" de las cosas, los riesgos, las alternativas y los pasos concretos a seguir. Si un concepto jurídico es complejo, tradúcelo a lenguaje cotidiano con una metáfora o ejemplo del día a día. Imagina que le estás explicando a alguien que no sabe nada de Derecho.
3. ESTRUCTURA TUS RESPUESTAS SIEMPRE con: - Un título o introducción del tema. - Secciones con subtítulos claros. - Puntos y viñetas para los pasos. - Un resumen final con las 3 acciones más urgentes que debe tomar el usuario.
4. PROACTIVIDAD: No te limites a recitar la ley. Diles qué pasos exactos deben dar hoy mismo. Anticípate a las 2-3 dudas siguientes que probablemente tendrá el usuario.
5. APORTA RECURSOS REALES: Usa tu herramienta de búsqueda web para encontrar URLs oficiales, formularios (ej. Modelo 036, formulario NIE), plazos actualizados o normativas recientes.
6. GENERACIÓN DE DOCUMENTOS: Si el usuario menciona un contrato, burofax, carta u otro documento, ofrécete a redactarlo directamente en formato Markdown para que lo puedan copiar y usar.

IMPORTANTE - REGLA DE IDIOMA:
RESPONDE ESTRICTAMENTE EN EL IDIOMA DEL USUARIO: ${language === 'en' ? 'INGLÉS (English)' : 'ESPAÑOL (Spanish)'}.

IMPORTANTE - REGLA DE FORMATO OBLIGATORIA:
Al final de TODAS tus respuestas incluye en una nueva línea:
[BANDERA: VERDE] - [Explica por qué la situación es segura o estándar]
[BANDERA: AMARILLO] - [Explica por qué se requiere prudencia]
[BANDERA: ROJO] - [Explica los altos riesgos de la situación]
(Solo una bandera, la que corresponda a la situación.)`;

    try {
        const result = await streamText({
            model: openai('gpt-4o'),
            system: systemPrompt,
            messages,
            maxSteps: 5,
            maxTokens: 16000,
            tools: {
                buscar_web: tool({
                    description: 'Busca en la web en tiempo real información legal, técnica o de mercado. REGLA DE ORO PROHIBITIVA: ¡NUNCA USES ESTA HERRAMIENTA PARA BUSCAR TEMAS FUERA DE TU ESPECIALIDAD! SI LA PREGUNTA NO ES DE TU ÁREA, NO BUSQUES NADA Y RECHAZA LA DUDA INMEDIATAMENTE.',
                    parameters: z.object({
                        query: z.string().describe('Consulta de búsqueda (ej. "novedades ley IRPF España", "precio jet privado", "convenio colectivo ofimática 2024").')
                    }),
                    execute: async ({ query }) => {
                        try {
                            const searchResults = await search(query);
                            if (!searchResults.results || searchResults.results.length === 0) {
                                return "No se encontraron resultados en la web.";
                            }
                            return searchResults.results.slice(0, 5).map(r => `Título: ${r.title}\nURL: ${r.url}\nResumen: ${r.description}`).join('\n\n');
                        } catch (e: any) {
                            return `Error: ${e.message}`;
                        }
                    }
                }),
                calculadora: tool({
                    description: 'Realiza cálculos matemáticos de precisión en el servidor. PROHIBIDO USARLA PARA TEMAS FUERA DE TU ESPECIALIDAD.',
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
            }
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
