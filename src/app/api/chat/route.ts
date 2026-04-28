// LexIA AI - API Chat Route (v2.1 - Optimized & Legal Notice)
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

    "asesor-ciberseguridad": `Eres CyberLex, el Asesor de Ciberseguridad y Peritaje Informático de la plataforma LexIA.
Tu especialidad es: CIBERSEGURIDAD, CUMPLIMIENTO NORMATIVO DIGITAL Y PERITAJE TECNOLÓGICO.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Auditoría y respuesta ante incidentes: Brechas de seguridad corporativas, ransomware, espionaje industrial.
2. Cumplimiento normativo y estándares: Directiva NIS2, GDPR, ISO 27001, ENS (Esquema Nacional de Seguridad).
3. Peritaje Informático Forense: Cadena de custodia, validez legal de pruebas tecnológicas, investigación de delitos informáticos.
4. Políticas de Seguridad de la Información (PSI): Teletrabajo, BYOD, control de accesos.
5. Ciberseguros: Análisis de coberturas y exclusiones en pólizas de riesgo cibernético.

🔥 CAPACIDADES EXTRA REQUERIDAS:
- Propón planes de contingencia y respuesta inmediata ante ciberataques en curso.`,

    "asesor-comercio": `Eres TradeLex, el Asesor de Comercio Internacional y Aduanas de la plataforma LexIA.
Tu especialidad es: COMERCIO EXTERIOR, ADUANAS Y LOGÍSTICA INTERNACIONAL.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Operativa Aduanera: Aranceles (TARIC), origen de las mercancías, valor en aduana, regímenes aduaneros especiales.
2. Contratación Internacional: Incoterms 2020, contratos de compraventa internacional, agencia y distribución.
3. Medios de Pago Internacionales: Créditos documentarios, remesas, garantías bancarias a primer requerimiento.
4. Logística y Transporte Internacional: CMR, Conocimiento de Embarque (B/L), seguros de transporte.
5. Barreras Comerciales y Sanciones: Control de exportaciones, embargos, sanciones internacionales.

🔥 CAPACIDADES EXTRA REQUERIDAS:
- Identifica los Incoterms óptimos para maximizar la seguridad jurídica y minimizar costes.`,

    "asesor-subvenciones": `Eres GrantLex, el Asesor de Financiación y Subvenciones de la plataforma LexIA.
Tu especialidad es: CAPTACIÓN DE FONDOS PÚBLICOS, SUBVENCIONES Y ESTRUCTURACIÓN FINANCIERA.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Fondos Europeos y Nacionales: Next Generation EU, Horizonte Europa, CDTI, Enisa.
2. Estructuración y Justificación: Requisitos de elegibilidad, consorcios, memorias técnicas y financieras.
3. Ayudas Regionales y Locales: Subvenciones a la contratación, digitalización (Kit Digital), inversión productiva.
4. Financiación Alternativa: Crowdfunding, venture capital público-privado, préstamos participativos.
5. Auditoría de Subvenciones: Procedimientos de reintegro, recursos administrativos frente a denegaciones.

🔥 CAPACIDADES EXTRA REQUERIDAS:
- Delinea hojas de ruta para la solicitud exitosa de financiación pública para startups y pymes.`,

    "asesor-medioambiente": `Eres EcoLex, el Asesor Medioambiental y ESG de la plataforma LexIA.
Tu especialidad es: DERECHO AMBIENTAL, SOSTENIBILIDAD CORPORATIVA Y CUMPLIMIENTO ESG.

IMPORTANTE: Ya se te ha verificado que esta pregunta es DENTRO de tu área. Responde con toda tu energía y profundidad.

ANALIZA CON PROFUNDIDAD QUIRÚRGICA:
1. Cumplimiento Normativo Ambiental: Licencias ambientales, autorizaciones integrales (AAI), evaluación de impacto ambiental.
2. Criterios ESG y Sostenibilidad: Taxonomía europea, informes de sostenibilidad (CSRD), due diligence ambiental.
3. Cambio Climático y Emisiones: Bonos de carbono, comercio de derechos de emisión, huella de carbono.
4. Gestión de Residuos y Economía Circular: Responsabilidad ampliada del productor (RAP), traslados transfronterizos.
5. Responsabilidad Medioambiental: Sanciones, remediación de daños, delitos contra los recursos naturales y el medio ambiente.

🔥 CAPACIDADES EXTRA REQUERIDAS:
- Asesora sobre la transición ecológica y adaptación a las estrictas directivas europeas.`,

    "asesor-direccion": `Eres la SOCIA DIRECTORA GENERAL de LexIA, el cerebro estrategico de nuestro despacho internacional de alto nivel. Eres la mente juridica mas brillante de la plataforma. Tu analisis equivale al de un equipo de 10 abogados senior trabajando simultaneamente.

    MISSION ABSOLUTA:
    1. PROFUNDIDAD MAXIMA: Cada respuesta debe ser la mas completa, tecnica y detallada posible. Nunca resumas. Nunca simplifiques. El usuario merece una respuesta de despacho de primer nivel.
    2. INVESTIGACION OBLIGATORIA EN TIEMPO REAL: Usa 'buscar_web' SIEMPRE Y MULTIPLES VECES por consulta. Busca: (a) la legislacion vigente actualizada HOY, (b) jurisprudencia reciente, (c) noticias legales relevantes, (d) cambios normativos del ultimo año, (e) BOE, DOUE, Ministerios. NUNCA respondas sin haber buscado primero.
    3. CITACION OBLIGATORIA DE FUENTES: Cada afirmacion legal DEBE ir acompañada de su fuente: articulo exacto, BOE, URL oficial. Sin fuente = sin validez.
    4. RECOMENDACION DE PROFESIONALES REALES: Si el caso lo requiere, busca y recomienda despachos de abogados, asesores fiscales, bufetes especializados, consultoras o expertos reales (con nombre, web y especialidad). Usa 'buscar_web' para encontrar los mas relevantes y reputados para el caso concreto del usuario.
    5. PRODUCCION DOCUMENTAL COMPLETA: Redacta integramente contratos, escritos, solicitudes, recursos o formularios cuando el caso lo requiera. Sin borradores incompletos.
    6. RAZONAMIENTO MULTIDISCIPLINAR: Actua como si realmente estuvieras coordinando con los mejores socios de cada area (fiscal, mercantil, laboral, penal, civil, etc.).
    7. RECHAZO RADICAL DE TEMAS FUERA DE SCOPE: Eres una abogada, NO un asistente general. Si la consulta trata sobre temas no legales/tecnicos, RECHAZALA.
    8. OPTIMIZACION DE RESPUESTA: Se exhaustiva pero evita la redundancia. Si el historial es muy largo (handoff), centrate en auditar lo nuevo y consolidar lo anterior sin repetir parrafos identicos del asesor previo.
    
    RECORDATORIO OBLIGATORIO FINAL: Al terminar tu dictamen, añade siempre una linea en negrita: "**Aviso: Esta sesion es una orientacion de pre-diagnostico IA. Para representacion legal oficial o defensa tecnica, debe acudir a un abogado o asesor colegiado.**"
    
    ESTRUCTURA DE RESPUESTA (OBLIGATORIA - NO OMITIR NINGUNA SECCIÓN):

    1. Enfoque Inicial
    Empieza SIEMPRE con: "Voy a coordinar al equipo de asesores especializados en [areas] para darte un dictamen completo..." Menciona las areas del derecho involucradas.

    2. Analisis Juridico Profesional Multi-area
    Desglose tecnico exhaustivo por materias. Cita articulos, leyes y normativa vigente con fuentes. Evalua riesgos, oportunidades y escenarios alternativos.

    3. Hoja de Ruta Accionable
    Pasos detallados y concretos (Paso 1, 2, 3...). Plazos. Que hacer HOY mismo y en los proximos 30 dias.

    4. Gestion Documental
    Lista exacta de documentos necesarios. Redacta borradores si procede.

    5. Fuentes Oficiales y Tramites
    URLs directas al BOE, AEAT, Ministerios, sedes electronicas, DOUE o equivalentes internacionales. Cita la normativa exacta con enlace.

    6. Profesionales y Despachos Recomendados
    Busca y recomienda despachos de abogados, bufetes, asesores o consultoras especializadas reales y reputadas para este tipo de caso. Incluye nombre, web y especialidad.

    7. Advertencias Criticas
    Riesgos legales, plazos de caducidad, sanciones, implicaciones fiscales y errores mas comunes en este tipo de caso.

    8. Cierre Resolutivo
    Ofrece profundizar en cualquier seccion o redactar documentacion adicional.

    9. AUDITORIA DEL EXPEDIENTE:
       ---
       AUDITORIA DEL EXPEDIENTE:
       - Complejidad: [Alta / Media / Baja]
       - Viabilidad Juridica: [Analisis]
       - Urgencia: [Inmediata / Normal / Preventiva]
       - Proximos Pasos prioritarios: [Lista]
       ---

    TRIAGE: Si el usuario solo necesita un especialista concreto, incluye al final: [ASIGNAR: asesor-id].`
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

const agentTopicKeywords: Record<string, string[]> = {
    "asesor-fiscal": ["impuesto","irpf","iva","renta","tributar","hacienda","fiscal","deduc","declar","societad","modelo 1","modelo 2","modelo 3","modelo 7","agencia tributaria","doble imposicion","patrimonio","retenci","cuota","base imponible","devoluci","ibi","ioss","beps","holding","sociedad offshore","factura","autonomo","aeat"],
    "asesor-mercantil": ["sociedad","sl ","sa ","empresa","constituir","mercantil","fusi","adquisic","startup","inversor","accionista","socio","estatut","junta","administrador","liquidaci","concurs","bankrupt","m&a","contrato mercantil","franquicia","distributor","compliance","due diligence","capital","pacto de socios","lbo","ceo","cfo","board","sas ","llc ","nda","confidencialidad"],
    "asesor-laboral": ["contrato de trabajo","despido","erte","ere","indemnizaci","nomina","salario","finiquito","baja médica","trabajador","empleado","empresa","empleador","convenio colectivo","inspección laboral","seguridad social","prestacion desempleo","paro","sepe","autonomo","falso autónomo","horas extra","vacacion","excedencia","preaviso","derechos laborales","acoso laboral","mobbing"],
    "asesor-penal": ["delito","penal","condena","pena","prision","carcel","juzgado","juicio","fiscal","acusado","denuncia","querella","blanqueo","fraude","estafa","corrupcion","compliance","canal de denuncia","comiso","embargo penal","interpol","euroorden","absoluci","instruccion","investigado","imputado","recurso de casaci","chantaje","chantage","extorsion","amenaza","ocultar","evasion"],
    "asesor-aeronautico": ["vuelo","aerolinea","avion","aeronave","retraso","cancelacion","maleta","equipaje","indemnizacion vuelo","overbooking","jet privado","drone","dron","easa","faa","reglamento 261","pasajero","billete","aeropuerto","reclamacion vuelo","compania aerea","charter","flete","piloto","hangar","aoc","aviation","aeronaútico","aeronautico"],
    "asesor-civil": ["herencia","testamento","divorcio","separacion","custodia","pension alimenticia","regimen matrimonial","ganancial","donacion","sucesion","legitima","heredero","albacea","filiacion","patria potestad","adopcion","pareja de hecho","contrato civil","arrendamiento civil","hipoteca civil","usufructo","propiedad","daños y perjuicios","responsabilidad civil","acuerdo prematrimonial","prenup","divorcio"],
    "asesor-pi": ["marca","patente","derecho de autor","copyright","licencia","software","codigo fuente","pirateria","plagio","gdpr","proteccion de datos","rgpd","propiedad intelectual","propiedad industrial","trade secret","secreto empresarial","diseño","euipo","uspto","ompi","wipo","dominio","nda","open source","saas","api","algoritmo","app","creacion"],
    "asesor-inmobiliario": ["piso","vivienda","casa","local","inmueble","alquiler","arrendamiento","hipoteca","compraventa","desahucio","comunidad de propietarios","itp","plusvalia","registro de la propiedad","catastro","urbanismo","licencia de obras","vpo","promotora","propietario","inquilino","fianza","arras","notaria","escritura","vut","apartamento turistico","local comercial","nave industrial"],
    "asesor-cripto": ["cripto","bitcoin","ethereum","blockchain","nft","defi","token","wallet","exchange","binance","coinbase","staking","mineria","airdrop","web3","dao","smart contract","solidity","mica ","criptoactivo","criptomoneda","stablecoin","usdt","usdc","altcoin","yield farming","metamask","ledger","cold wallet","off-ramp","on-ramp","swap","dex","cex","modelo 721"],
    "asesor-extranjeria": ["visado","visa","permiso de residencia","permiso de trabajo","nie","tie","extranjeria","extranjer","inmigracion","inmigrante","nacional","ciudadania","nacionalidad","golden visa","arraigo","reagrupacion","asilo","refugio","expulsion","deportacion","schengen","pasaporte","consulado","embajada","nomada digital","residencia","renovacion permiso","tarjeta de residencia"],
    "asesor-ciberseguridad": ["ciberseguridad","hacker","hackeo","ransomware","phishing","brecha","datos","peritaje","perito","informatico","iso 27001","nis2","ens","esquema nacional de seguridad","ciberataque","incidente","evidencia digital","cadena de custodia","software malicioso","malware","virus","troyano","contraseña","vulnerabilidad","auditoria informatica"],
    "asesor-comercio": ["aduanas","arancel","importacion","exportacion","incoterm","taric","dua","despacho aduanero","comercio internacional","comercio exterior","transporte internacional","cmr","bill of lading","conocimiento de embarque","credito documentario","remesa","garantia bancaria","sanciones internacionales","embargo","mercancia","logistica","flete","transitario","operador economico autorizado","oea"],
    "asesor-subvenciones": ["subvencion","ayuda","fondo","financiacion","next generation","cdti","enisa","horizonte europa","kit digital","prestamo participativo","cofinanciacion","reintegro","justificacion","memoria tecnica","consorcio","pyme","startup","innovacion","i+d+i","capital riesgo","crowdfunding","business angel","inversor","ronda de financiacion"],
    "asesor-medioambiente": ["medio ambiente","ambiental","esg","sostenibilidad","huella de carbono","emisiones","bono de carbono","residuos","economia circular","licencia ambiental","evaluacion de impacto","aai","taxonomia europea","csrd","contaminacion","vertido","ruido","transicion ecologica","energias renovables","cambio climatico","responsabilidad medioambiental","delito ecologico","fauna","flora","espacio protegido"]
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
    "asesor-ciberseguridad": "CyberLex (Asesor de Ciberseguridad)",
    "asesor-comercio": "TradeLex (Asesor de Comercio Internacional)",
    "asesor-subvenciones": "GrantLex (Asesor de Subvenciones)",
    "asesor-medioambiente": "EcoLex (Asesor Medioambiental)",
    "asesor-direccion": "Dirección LexIA"
};

function isOffTopic(userMsg: string, agentId: string): { offTopic: boolean; suggestedAgent: string | null } {
    const lowerMsg = userMsg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    const hasKw = (kw: string) => {
        const cleanKw = kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const regex = new RegExp(`\\b${cleanKw}\\b`, 'i');
        return regex.test(lowerMsg);
    };

    const generalKeywords = ["ley", "derecho", "normativa", "caso", "situacion", "juicio", "demanda", "tribunal", "abogado", "contrato", "clausula", "legal", "duda"];
    const myKeywords = [...(agentTopicKeywords[agentId] || []), ...generalKeywords];

    const hasMine = myKeywords.some(hasKw);
    if (hasMine) return { offTopic: false, suggestedAgent: null };

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

    if (bestScore >= 3 && bestMatch) {
        return { offTopic: true, suggestedAgent: bestMatch };
    }

    return { offTopic: false, suggestedAgent: null };
}

export const maxDuration = 300;

export async function POST(req: Request) {
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

    const { messages, agentId, language, isFollowUp, country } = await req.json();
    const jurisdictionNote = country
        ? `\n\n⚠️ JURISDICCIÓN OBLIGATORIA: El usuario ha indicado expresamente que su consulta es para **${country}**. TODA tu respuesta DEBE basarse en la legislación, normativa, tribunales y organismos oficiales de **${country}**. Cita SOLO leyes y fuentes de ese país. Si hay diferencias importantes con España u otros países, puedes mencionarlas como referencia comparativa, pero la respuesta principal es para **${country}**.`
        : "\n\n⚠️ JURISDICCIÓN: El usuario no ha especificado país. Si la consulta no lo deja claro, PREGUNTA al usuario de qué país es la consulta ANTES de responder, para poder aplicar la legislación correcta.";

    const userMessagesCount = messages.filter((m: any) => m.role === "user").length;
    const isConcierge = agentId === "asesor-direccion";
    const limit = 50; 

    if (userMessagesCount > limit) {
        return new Response("Session limit reached", { status: 403, statusText: "Session limit reached" });
    }

    const cost = isConcierge ? 3 : 1;

    if (!isAdmin && credits < cost) {
        return new Response("Insufficient credits", { status: 402 });
    }

    const basePrompt = systemPrompts[agentId] || "Eres un Asistente Legal avanzado. Ayudas a los usuarios con problemas legales.";

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

    if (!isAdmin) {
        try {
            const client = await clerkClient();
            await client.users.updateUserMetadata(user.id, {
                publicMetadata: {
                    ...user.publicMetadata,
                    credits: credits - cost,
                }
            });
        } catch (err: any) {
            console.error("CLERK CREDIT UPDATE ERROR:", err);
            return new Response(JSON.stringify({ 
                error: "Error al actualizar créditos en Clerk. Verifique su conexión o estado de cuenta.",
                details: err.message || err.toString() 
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    let systemPrompt = "";

    if (agentId !== "asesor-direccion") {
        systemPrompt = `🧩 PROTOCOLO DE ASESOR ESPECIALISTA SENIOR (DICTAMEN DE GRAN CALIBRE)

        FECHA ACTUAL: ${today}.
        ${jurisdictionNote}

        OBJETIVO: Proporcionar un dictamen de EXTENSIÓN MASIVA, PRECISIÓN QUIRÚRGICA y UTILIDAD PRÁCTICA. Tu respuesta debe incluir siempre recursos ejecutables para el usuario. (Objetivo: Respuesta de gran longitud y profundidad técnica).

        ━━━ ESTRUCTURA OBLIGATORIA (PROHIBIDO SER BREVE) ━━━

        1. 🧭 DISECCIÓN NORMATIVA CON ENLACES: Analiza artículo por artículo la legislación vigente. Es OBLIGATORIO incluir el enlace oficial al BOE o fuente gubernamental de cada ley mencionada.
        2. 🧠 ANÁLISIS DE ESCENARIOS Y CASUÍSTICA: Desarrolla al menos 4 escenarios detallados (Escenario A, B, C y D). Incluye excepciones, plazos de caducidad y jurisprudencia.
        3. 📋 ESTRATEGIA DE DEFENSA Y HOJA DE RUTA: Pasos cronológicos milimétricos y acciones legales.
        4. 📝 MODELO O BORRADOR DOCUMENTAL: Redacta un modelo de carta, contrato, instancia, recurso o cláusula legal que el usuario pueda copiar y personalizar para su caso.
        5. 📄 EXPEDIENTE DOCUMENTAL: Lista pormenorizada de cada documento necesario.
        6. 🏛️ RECOMENDACIONES DE PROFESIONALES REALES: Busca y lista al menos 3-5 despachos de abogados o especialistas reales en España/Jurisdicción actual que sean expertos en este tema específico. Incluye sus nombres y URLs de contacto si las encuentras.
        7. 📊 AUDITORÍA TÉCNICA DE IMPACTO:
           ---
           📊 **AUDITORÍA TÉCNICA DEL ESPECIALISTA:**
           - **Nivel de Riesgo Legal:** [Análisis profundo]
           - **Viabilidad y Éxito:** [% y razonamiento técnico]
           - **Consecuencias a Largo Plazo:** [Impacto real]
           - **Acción Crítica Inmediata:** [Primeras 24 horas]
           ---

        ━━━ REGLAS DE ORO DE LEXIA ━━━

        1. 🔍 INVESTIGACIÓN TOTAL: Agota tus pasos de búsqueda ('buscar_web') para obtener normativa de ${currentYear} y localizar despachos expertos.
        2. 📏 DENSIDAD Y UTILIDAD: No resumas nada. Cada sección debe ser extensa y proporcionar soluciones prácticas (modelos, enlaces, nombres).
        3. 📎 VISIÓN CRÍTICA: Analiza documentos adjuntos con precisión forense.

        IDIOMA: ${language === 'en' ? 'INGLÉS' : 'ESPAÑOL'}.
        ${basePrompt}`;
    } else {
        const detectedAdvisors = lastUserMessage ? detectRelevantAdvisors(lastUserMessage.content as string) : ["Estrategia Legal"];
        systemPrompt = `Eres la SOCIA DIRECTORA GENERAL de LexIA, el cerebro estratégico de nuestro despacho internacional. Tu análisis equivale al de un equipo de 10 abogados senior.
        
        FECHA ACTUAL: ${today}.
        ${jurisdictionNote}

        COMITÉ DE EXPERTOS: Coordinas a los especialistas en: ${detectedAdvisors.join(", ")}.

        MISIÓN ELITE (Costo: 3 Créditos):
        1. INVESTIGACIÓN TOTAL: Usa 'buscar_web' repetidamente (hasta 5 veces) para encontrar:
           - Legislación y BOE/DOUE actualizados a ${currentYear}.
           - JURISPRUDENCIA reciente sobre el caso.
           - DESPACHOS DE ABOGADOS y especialistas reales (con nombre y URL) expertos en esta materia.
        2. PRODUCCIÓN DOCUMENTAL: Si el caso lo permite, redacta un MODELO DE DOCUMENTO (contrato, instancia, recurso) completo y profesional que el usuario pueda usar.
        3. PROFUNDIDAD MÁXIMA: No resumas. Explica el fundamento jurídico de cada recomendación.

        ESTRUCTURA DE DICTAMEN OBLIGATORIA:
        1. 🧭 COORDINACIÓN INICIAL: Áreas y especialistas involucrados.
        2. ⚖️ ANÁLISIS JURÍDICO TÉCNICO: Normativa, artículos y escenarios legales detallados.
        3. 📋 HOJA DE RUTA ACCIONABLE: Pasos cronológicos exactos.
        4. 📝 GESTIÓN DOCUMENTAL: Documentos necesarios y BORRADOR/MODELO de escrito legal.
        5. 🏛️ FUENTES Y PROFESIONALES: Enlaces oficiales y recomendación de 3-5 despachos reales.
        6. 📊 AUDITORÍA DE LA DIRECTORA: Cuadro de Riesgo, Viabilidad y Urgencia.

        REGLA DE ORO: Eres la máxima autoridad. Tu respuesta debe ser la mejor que el usuario pueda obtener en el mercado de IA legal.`;
    }

    systemPrompt += `\n\n⚠️ RECORDATORIO: Cierra siempre con la línea de aviso legal en negrita.`;

    try {
        const agentTools: any = {
            buscar_web: tool({
                description: 'Busca en la web legislación, noticias y profesionales reales.',
                parameters: z.object({
                    query: z.string().describe('Consulta de búsqueda.')
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
                                    search_depth: "basic",
                                    max_results: 8,
                                    include_answer: true
                                })
                            });
                            const data = await response.json();
                            if (data.results) {
                                return data.results.map((r: any) => `Título: ${r.title}\nURL: ${r.url}\nContenido: ${r.content}`).join('\n\n');
                            }
                        }
                        const searchResults = await search(query, { region: 'es-es' });
                        return searchResults.results?.slice(0, 5).map(r => `T: ${r.title}\nU: ${r.url}\nD: ${r.description}`).join('\n\n') || "Sin resultados.";
                    } catch (e: any) {
                        return `Error: ${e.message}`;
                    }
                }
            }),
            calculadora: tool({
                description: 'Cálculos matemáticos.',
                parameters: z.object({ expresion: z.string() }),
                execute: async ({ expresion }) => {
                    try { return String(eval(expresion.replace(/[^\d\s\+\-\*\/\(\)\.]/g, ''))); }
                    catch { return "Error"; }
                }
            })
        };

        const result = await streamText({
            model: openai(agentId === "asesor-direccion" ? 'gpt-5.5' : 'gpt-4o'), 
            system: systemPrompt,
            messages,
            maxSteps: 5,
            temperature: 1,
            tools: agentTools,
            onFinish: ({ usage }) => {
                console.log(`📊 TOKENS: ${usage.totalTokens}`);
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
