
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "es" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

export const translations: Record<Language, Record<string, string>> = {
    es: {

        "hero.badge": "Despacho Legal Digital Asistido por IA Generativa",
        "hero.badge.pdf": "Sube y Analiza Documentos PDF",
        "hero.badge.dl": "Descarga Diagnósticos en PDF",
        "hero.security.privacy.title": "Privacidad 100% Absoluta",
        "hero.security.privacy.desc": "No compartimos ni vendemos tu información.",
        "hero.security.encryption.title": "Cifrado Criptográfico",
        "hero.security.encryption.desc": "Tus datos viajan con encriptación SSL de grado militar.",
        "hero.security.notraining.title": "Cero Entrenamiento IA",
        "hero.security.notraining.desc": "Tus consultas NUNCA se usan para entrenar modelos.",
        "hero.title1": "Tu Asesoría Legal y Corporativa de",
        "hero.title2": "Alta Precisión. Disponible 24/7.",
        "hero.powered": "Impulsado por la tecnología avanzada de",
        "hero.desc": "Resuelve dudas fiscales, redacta contratos o analiza riesgos mercantiles e inmobiliarios en segundos. Empieza hoy y obtén un pre-diagnóstico profesional.",
        "hero.btn.start": "Comenzar Análisis (Desde 6,90€)",
        "hero.btn.sub": "Accede a 10 ramas del derecho en segundos.",
        "hero.btn.choose": "Elegir Especialista",

        "nav.login": "Iniciar Sesión",
        "nav.buy": "Comprar",
        "nav.queries": "Consultas",
        "nav.redeem": "Canjear Código...",
        "nav.admin": "Panel de Administración",

        "how.title": "¿Cómo funciona?",
        "how.subtitle": "Tu respuesta legal respaldada en tres simples pasos.",
        "how.step1.title": "1. Selecciona a tu Experto",
        "how.step1.desc": "Nuestros asistentes IA especializados cubren desde fiscalidad corporativa hasta aviación ejecutiva.",
        "how.step2.title": "2. Explica tu Caso o Sube Documentos",
        "how.step2.desc": "Describe tu problema. Nuestros modelos analizarán riesgos y cruzarán datos con normativas oficiales al instante.",
        "how.step3.title": "3. Obtén un Diagnóstico Preciso",
        "how.step3.desc": "Recibe un informe claro con la estrategia legal a seguir, opciones viables y alertas de riesgo.",

        "agents.badge": "Nuestros Especialistas Operan a Nivel Mundial",
        "agents.title": "Un Despacho Global en tu Bolsillo.",
        "agents.desc": "Cada IA ha sido entrenada con normativa internacional y de más de 190 países para ofrecer un análisis riguroso y exacto, sin importar dónde te encuentres ni a dónde vayas.",
        "agents.btn": "Consultar Experto",

        "agent.fiscal.sub": "Estratega Fiscal Internacional",
        "agent.fiscal.desc": "IVA intracomunitario, IRPF/IS, convenios de doble imposición y riesgo fiscal.",
        "agent.extra.sub": "Experto en Extranjería y Migración",
        "agent.extra.desc": "Visados, permisos de trabajo, nacionalidad, Golden Visa y residencia en cualquier país.",
        "agent.merc.sub": "Mentor Societario y Mercantil",
        "agent.merc.desc": "Sociedades, M&A, responsabilidad de administradores y compliance digital.",
        "agent.lab.sub": "Defensor de Derechos Laborales",
        "agent.lab.desc": "Despidos, ERTE/ERE, seguridad social y cálculos de indemnización automática.",
        "agent.penal.sub": "Guardián Penal y Compliance",
        "agent.penal.desc": "Delitos económicos, blanqueo de capitales y responsabilidad penal corporativa.",
        "agent.aero.sub": "Aviación Ejecutiva y Pasajeros",
        "agent.aero.desc": "Derechos de pasajeros, drones, alquiler/compra de jets privados y regulaciones EASA/FAA.",
        "agent.civil.sub": "Protector de Patrimonio y Familia",
        "agent.civil.desc": "Herencias, testamentos, regímenes de divisas y custodia internacional.",
        "agent.pi.sub": "Guardián Creativo y de Marcas",
        "agent.pi.desc": "Marcas, patentes, derechos de autor y licencias de software internacional.",
        "agent.inmo.sub": "Analista de Bienes Raíces",
        "agent.inmo.desc": "Compraventa, hipotecas, urbanismo, cargas registrales y simulación de costes.",
        "agent.cripto.sub": "Navegador Blockchain",
        "agent.cripto.desc": "Tributación DeFi, paso de cripto a fiat, off-ramping institucional y AML/KYC.",

        "pricing.title": "¿Por qué pagar cientos de euros por una duda inicial?",
        "pricing.desc": "Los bufetes tradicionales cobran entre 100€ y 300€ solo por una consulta exploratoria. Nuestra tecnología democratiza el acceso a la ley, dándote respuestas precisas, al instante.",
        "pricing.feat1": "Respuestas en segundos, sin citas previas.",
        "pricing.feat2": "Análisis de riesgo legal objetivo y neutral.",
        "pricing.feat3": "Privacidad absoluta de tus datos.",
        "pricing.feat4": "Desde menos de 0,30€ por consulta (Pack).",
        "pricing.feat5": "Sube tus contratos o documentos (PDF/TXT) para una revisión legal profunda.",
        "pricing.feat6": "Exporta tus diagnósticos y respuestas en formato PDF.",
        "pricing.badge1": "Comienza Tu Asesoría",
        "pricing.box1.title": "Comienza Hoy",
        "pricing.box1.desc": "Regístrate y adquiere tu pack desde 6,90€ o canjea tu código personal.",
        "pricing.box1.btn": "Crear Cuenta y Empezar",
        "pricing.badge2": "50 Consultas por 11,90€",
        "pricing.box2.title": "Packs Disponibles",
        "pricing.box2.desc": "Elige el plan que mejor se adapte a tus necesidades desde el menú superior. Desde 6,90€.",
        "pricing.box2.btn": "Ver Especialistas",

        "guide.title": "Manual Premium: Cómo Exprimir a tu Asesor",
        "guide.desc": "Estás ante la IA jurídica más avanzada. Para obtener resultados propios de los mejores despachos, sigue estos consejos:",
        "guide.step1.title": "1. Contexto y Jurisdicción",
        "guide.step1.desc": "Indica siempre tu país o región y da detalles precisos. A mayor contexto, más letal será la estrategia.",
        "guide.step2.title": "2. Sube tus Contratos (PDF)",
        "guide.step2.desc": "No te fíes de lo que firmas. Adjunta el PDF y exige al asesor que detecte cláusulas abusivas o riesgos.",
        "guide.step3.title": "3. Solicita Redacciones",
        "guide.step3.desc": "Pide a tu asesor que te redacte burofaxes, actas, cartas de despido o contratos a medida.",

        "faq.title": "Preguntas Frecuentes sobre Derecho",
        "faq.desc": "Respuestas claras a las dudas legales más comunes. Si no encuentras lo que buscas, nuestros asesores IA están disponibles 24/7.",
        "faq.more": "Saber más",
        "faq.notfound": "¿No encuentras tu pregunta?",
        "faq.notfound.desc": "Nuestros 10 asesores IA especializados pueden responder cualquier consulta legal. Disponibles 24 horas, 7 días a la semana.",
        "faq.btn.auth": "Consultar con un Asesor IA",
        "faq.btn.noauth": "Registrarse y Consultar a un Asesor IA",
        
        "faq.q.fiscal": "Derecho Fiscal",
        "faq.q.fiscal.1": "¿Qué impuestos pago como autónomo?",
        "faq.q.fiscal.2": "¿Cómo declaro ingresos del extranjero?",
        "faq.q.fiscal.3": "¿Puedo deducir el IVA de mi coche?",

        "faq.q.mercantil": "Derecho Mercantil",
        "faq.q.mercantil.1": "¿SL o autónomo? ¿Qué me conviene?",
        "faq.q.mercantil.2": "¿Cómo protejo mi idea de negocio?",
        "faq.q.mercantil.3": "¿Qué cláusulas debe tener un contrato de socios?",

        "faq.q.laboral": "Derecho Laboral",
        "faq.q.laboral.1": "¿Me pueden despedir estando de baja?",
        "faq.q.laboral.2": "¿Cuánto me corresponde de finiquito?",
        "faq.q.laboral.3": "¿Qué hacer ante un despido improcedente?",

        "faq.q.penal": "Derecho Penal",
        "faq.q.penal.1": "¿Qué hacer si me acusan de un delito?",
        "faq.q.penal.2": "¿Cuándo prescribe un delito?",
        "faq.q.penal.3": "¿Cómo poner una denuncia?",

        "admin.alert.start": "Por favor, inicia sesión con el botón redondo de arriba a la derecha para comenzar tus consultas.",
        "admin.alert.login": "Por favor, inicia sesión con el botón redondo superior (arriba a la derecha) para poder acceder a tus planes de consultas.",
        "admin.alert.faq": "Debes iniciar sesión arriba a la derecha para empezar a consultar con nuestros asesores.",

        "footer.warn": "⚠️ Esta plataforma ofrece orientación basada en modelos de IA entrenados en normativa pública internacional y jurisprudencia. La información generada tiene fines educativos y de pre-diagnóstico legal. El uso de esta plataforma NO constituye asesoramiento legal profesional formal ni establece una relación abogado-cliente. Las decisiones basadas en documentos o respuestas emitidas con riesgo legal deben ser siempre validadas por profesionales debidamente colegiados.",
        "footer.rights": "Plataforma de Inteligencia Jurídica. Todos los derechos reservados.",
        "footer.powered": "Desarrollado con inteligencia artificial de",

        "chat.back": "Volver al inicio",
        "chat.online": "Agente en Línea",
        "chat.disclaimer": "Las interacciones en esta sala no constituyen consejo legal personalizado ni establecen relación abogado-cliente. Verifica las decisiones críticas con un profesional colegiado.",
        "chat.input.placeholder": "Describe tu problema o consulta para el ",
        "chat.btn.send": "Enviar",
        "chat.warning": "Atención: Iniciar una consulta en esta sala consume 1 crédito de tu saldo. Las siguientes interacciones dentro de esta misma sesión (hasta 15) son gratuitas.",
        "chat.footer": "LexIA Asesores puede cometer errores y es imperativo contrastar la respuesta de la IA. No sustituye al ejercicio técnico y profesional humano.",
        "chat.download": "Descargar PDF",
        "chat.examples": "Preguntas de ejemplo sugeridas:",
        "chat.error.empty": "Saldo Agotado",
        "chat.error.empty.desc": "No dispones de consultas suficientes para iniciar una sesión. Haz clic en 'Comprar' en el menú superior para recargar.",
        "chat.error.limit": "Límite de Sesión Alcanzado",
        "chat.error.limit.desc": "Has alcanzado el límite de 15 mensajes gratuitos para esta sesión. Por favor, vuelve al inicio e inicia una nueva sesión de consulta.",
        "chat.error.conn": "Error de conexión",
        "chat.upload.limit": "El archivo es demasiado grande. Máximo 5MB.",
        "chat.upload.unsupported": "Aún no soportamos visión de imágenes directamente. Por favor sube un PDF o texto.",
        "chat.upload.error": "Error al procesar el documento: ",
        "chat.upload.title": "Adjuntar Documento (PDF/TXT)",
        "chat.pdf.title": "Descargar respuesta en PDF",
        "chat.risk.green": "Nivel Seguro / Viabilidad",
        "chat.risk.yellow": "Nivel de Prudencia",
        "chat.risk.red": "Riesgo Alto / Peligro",
        "chat.risk.eval": "Evaluación de Riesgo: ",
        "chat.risk.pend": "Confianza: Pendiente",
        "chat.error.quota": "La cuenta maestra de OpenAI no tiene saldo disponible.",
        "chat.error.unknown": "Ocurrió un error inesperado al contactar con la IA. "

    },
    en: {

        "hero.badge": "Digital Law Firm Assisted by Generative AI",
        "hero.badge.pdf": "Upload and Analyze PDF Documents",
        "hero.badge.dl": "Download Diagnoses in PDF",
        "hero.security.privacy.title": "100% Absolute Privacy",
        "hero.security.privacy.desc": "We do not share or sell your information.",
        "hero.security.encryption.title": "Cryptographic Encryption",
        "hero.security.encryption.desc": "Data is secured with military-grade SSL encryption.",
        "hero.security.notraining.title": "Zero AI Training",
        "hero.security.notraining.desc": "Your queries are NEVER used to train models.",
        "hero.title1": "Your Legal and Corporate Advisory of",
        "hero.title2": "High Precision. Available 24/7.",
        "hero.powered": "Powered by advanced technology from",
        "hero.desc": "Solve tax doubts, draft contracts, or analyze commercial and real estate risks in seconds. Start today and get a professional pre-diagnosis.",
        "hero.btn.start": "Start Analysis (From €6.90)",
        "hero.btn.sub": "Access 10 branches of law in seconds.",
        "hero.btn.choose": "Choose Specialist",

        "nav.login": "Log In",
        "nav.buy": "Buy",
        "nav.queries": "Queries",
        "nav.redeem": "Redeem Code...",
        "nav.admin": "Admin Panel",

        "how.title": "How does it work?",
        "how.subtitle": "Your legal answer backed in three simple steps.",
        "how.step1.title": "1. Select your Expert",
        "how.step1.desc": "Our specialized AI assistants cover everything from corporate tax to executive aviation.",
        "how.step2.title": "2. Explain your Case or Upload Documents",
        "how.step2.desc": "Describe your problem. Our models will analyze risks and cross-reference data with official regulations instantly.",
        "how.step3.title": "3. Get a Precise Diagnosis",
        "how.step3.desc": "Receive a clear report with the legal strategy to follow, viable options, and risk alerts.",

        "agents.badge": "Our Specialists Operate Worldwide",
        "agents.title": "A Global Firm in your Pocket.",
        "agents.desc": "Each AI has been trained on international regulations and over 190 countries to offer rigorous, exact analysis wherever you go.",
        "agents.btn": "Consult Expert",

        "agent.fiscal.sub": "International Tax Strategist",
        "agent.fiscal.desc": "Intra-community VAT, Income/Corporate Tax, double taxation agreements, and tax risk.",
        "agent.extra.sub": "Immigration and Visa Expert",
        "agent.extra.desc": "Visas, work permits, nationality, Golden Visa, and residency in any country.",
        "agent.merc.sub": "Corporate & Commercial Mentor",
        "agent.merc.desc": "Companies, M&A, directors' liability, and digital compliance.",
        "agent.lab.sub": "Labor Rights Defender",
        "agent.lab.desc": "Dismissals, ERTE/ERE, social security, and automatic severance calculations.",
        "agent.penal.sub": "Criminal & Compliance Guardian",
        "agent.penal.desc": "Economic crimes, money laundering, and corporate criminal liability.",
        "agent.aero.sub": "Executive Aviation & Passengers",
        "agent.aero.desc": "Passenger rights, drones, private jet rental/purchase, and EASA/FAA regulations.",
        "agent.civil.sub": "Asset & Family Protector",
        "agent.civil.desc": "Inheritances, wills, currency regimes, and international custody.",
        "agent.pi.sub": "Creative & Brand Guardian",
        "agent.pi.desc": "Trademarks, patents, copyrights, and international software licensing.",
        "agent.inmo.sub": "Real Estate Analyst",
        "agent.inmo.desc": "Sales, mortgages, urban planning, registry charges, and cost simulation.",
        "agent.cripto.sub": "Blockchain Navigator",
        "agent.cripto.desc": "DeFi taxation, crypto-to-fiat, institutional off-ramping, and AML/KYC.",

        "pricing.title": "Why pay hundreds of euros for an initial question?",
        "pricing.desc": "Traditional law firms charge between €100 and €300 just for an exploratory consultation. Our technology democratizes access to the law, giving you precise answers, instantly.",
        "pricing.feat1": "Answers in seconds, no appointments needed.",
        "pricing.feat2": "Objective and neutral legal risk analysis.",
        "pricing.feat3": "Absolute privacy of your data.",
        "pricing.feat4": "From less than €0.30 per query (Pack).",
        "pricing.feat5": "Upload your contracts or documents (PDF/TXT) for a deep legal review.",
        "pricing.feat6": "Export your diagnoses and answers in PDF format.",
        "pricing.badge1": "Start Your Advisory",
        "pricing.box1.title": "Start Today",
        "pricing.box1.desc": "Register and acquire your pack from €6.90 or redeem your personal code.",
        "pricing.box1.btn": "Create Account and Start",
        "pricing.badge2": "50 Queries for €11.90",
        "pricing.box2.title": "Available Packs",
        "pricing.box2.desc": "Choose the plan that best suits your needs from the top menu. From €6.90.",
        "pricing.box2.btn": "View Specialists",

        "guide.title": "Premium Manual: Master Your Advisor",
        "guide.desc": "You are dealing with the most advanced legal AI. To get top-tier firm results, follow these tips:",
        "guide.step1.title": "1. Context & Jurisdiction",
        "guide.step1.desc": "Always indicate your country or region and give precise details. More context equals a more lethal strategy.",
        "guide.step2.title": "2. Upload your Contracts (PDF)",
        "guide.step2.desc": "Don't blindly trust what you sign. Attach the PDF and command the advisor to detect abusive clauses.",
        "guide.step3.title": "3. Request Drafting",
        "guide.step3.desc": "Ask your advisor to draft legal notices, meeting minutes, dismissal letters, or custom contracts.",

        "faq.title": "Frequently Asked legal Questions",
        "faq.desc": "Clear answers to the most common legal doubts. If you don't find what you are looking for, our AI advisors are available 24/7.",
        "faq.more": "Read more",
        "faq.notfound": "Can't find your question?",
        "faq.notfound.desc": "Our 10 specialized AI advisors can answer any legal query. Available 24 hours a day, 7 days a week.",
        "faq.btn.auth": "Consult with an AI Advisor",
        "faq.btn.noauth": "Register and Consult an AI Advisor",

        "faq.q.fiscal": "Tax Law",
        "faq.q.fiscal.1": "What taxes do I pay as a freelancer?",
        "faq.q.fiscal.2": "How do I declare income from abroad?",
        "faq.q.fiscal.3": "Can I deduct the VAT on my car?",

        "faq.q.mercantil": "Commercial Law",
        "faq.q.mercantil.1": "LLC or freelancer? What suits me?",
        "faq.q.mercantil.2": "How do I protect my business idea?",
        "faq.q.mercantil.3": "What clauses should a partner contract have?",

        "faq.q.laboral": "Labor Law",
        "faq.q.laboral.1": "Can I be fired while on medical leave?",
        "faq.q.laboral.2": "How much severance pay am I entitled to?",
        "faq.q.laboral.3": "What to do faced with unfair dismissal?",

        "faq.q.penal": "Criminal Law",
        "faq.q.penal.1": "What to do if I'm accused of a crime?",
        "faq.q.penal.2": "When does a crime expire?",
        "faq.q.penal.3": "How to file a police report?",

        "admin.alert.start": "Please log in with the round button on the top right to begin your queries.",
        "admin.alert.login": "Please log in with the top round button (top right) to access your query plans.",
        "admin.alert.faq": "You must log in at the top right to start consulting with our advisors.",

        "footer.warn": "⚠️ This platform offers orientation based on AI models trained on public international regulations and jurisprudence. Information generated is for educational and legal pre-diagnosis purposes. The use of this platform DOES NOT constitute formal professional legal advice nor does it establish an attorney-client relationship. Decisions based on documents or responses issued with legal risk must always be validated by properly licensed professionals.",
        "footer.rights": "Legal Intelligence Platform. All rights reserved.",
        "footer.powered": "Developed with artificial intelligence from",

        "chat.back": "Back to start",
        "chat.online": "Agent Online",
        "chat.disclaimer": "Interactions in this room do not constitute personalized legal advice nor establish an attorney-client relationship. Verify critical decisions with a licensed professional.",
        "chat.input.placeholder": "Describe your problem or query for ",
        "chat.btn.send": "Send",
        "chat.warning": "Warning: Starting a query in this room consumes 1 credit from your balance. The following interactions within this same session (up to 15) are free.",
        "chat.footer": "LexIA Advisors can make mistakes and it's imperative to contrast the AI's response. It does not substitute human technical and professional judgment.",
        "chat.download": "Download PDF",
        "chat.examples": "Suggested example questions:",
        "chat.error.empty": "Balance Depleted",
        "chat.error.empty.desc": "You do not have enough queries to start a session. Please click 'Buy' in the top menu to recharge your account.",
        "chat.error.limit": "Session Limit Reached",
        "chat.error.limit.desc": "You have reached the limit of 15 free messages for this session. Please go back to start and initiate a new consultation session.",
        "chat.error.conn": "Connection Error",
        "chat.upload.limit": "File is too large. Maximum 5MB.",
        "chat.upload.unsupported": "We do not support direct image vision yet. Please upload a PDF or text document.",
        "chat.upload.error": "Error processing document: ",
        "chat.upload.title": "Attach Document (PDF/TXT)",
        "chat.pdf.title": "Download response in PDF",
        "chat.risk.green": "Secured / Viability Level",
        "chat.risk.yellow": "Prudence Level",
        "chat.risk.red": "High Risk / Danger",
        "chat.risk.eval": "Risk Assessment: ",
        "chat.risk.pend": "Confidence: Pending",
        "chat.error.quota": "The main OpenAI account has no available balance.",
        "chat.error.unknown": "An unexpected error occurred when contacting the AI. "

    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("es");

    useEffect(() => {
        const savedLang = localStorage.getItem("lexia_lang") as Language;
        if (savedLang && (savedLang === "es" || savedLang === "en")) {
            setLanguage(savedLang);
        } else {
            const browserLang = navigator.language.split("-")[0];
            if (browserLang === "en") {
                setLanguage("en");
            }
        }
    }, []);

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("lexia_lang", lang);
    };

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
