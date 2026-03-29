
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
        "hero.badge.pdf": "Sube y Analiza PDF o Fotos de Documentos",
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
        "nav.redeem.prompt": "Introduce tu código de consultas:",
        "nav.redeem.success": "¡Código canjeado con éxito! Se han añadido {added} consultas a tu cuenta.",
        "nav.redeem.error": "Error al canjear el código: ",
        "nav.redeem.invalid": "Código inválido o ya usado.",
        "nav.redeem.conn_error": "Error de conexión al canjear código.",

        "how.title": "¿Cómo funciona?",
        "how.subtitle": "Tu respuesta legal respaldada en tres simples pasos.",
        "how.step1.title": "1. Registro y Triage de Admisión",
        "how.step1.desc": "Al registrarte, serás recibido por nuestra Directora de Recepción. Ella realizará una entrevista técnica inicial para asignarte al socio especialista exacto según tu jurisdicción y materia.",
        "how.step2.title": "2. Sesión Estratégica Profunda",
        "how.step2.desc": "Una vez en el despacho de tu experto, sube tus contratos, fotos o explica tu situación. Nuestros modelos de élite cruzarán datos con legislación de 2024-2025 en tiempo real.",
        "how.step3.title": "3. Diagnóstico y Hoja de Ruta",
        "how.step3.desc": "Obtén un informe forense con estrategias legales, niveles de riesgo detallados y tácticas de defensa. Exporta todo a PDF para tu expediente personal.",

        "agents.badge": "Nuestros Especialistas Operan a Nivel Mundial",
        "agents.title": "Un Despacho Global en tu Bolsillo.",
        "agents.desc": "Cada socio ha sido entrenado con normativa internacional y de más de 190 países para ofrecer un análisis riguroso y exacto, sin importar dónde se encuentre su capital o sus intereses.",
        "agents.btn": "Consultar Experto",

        "agent.fiscal.sub": "Estratega Fiscal e Inversión Internacional",
        "agent.fiscal.desc": "Especialista en optimización de estructuras holding, tributación de criptoactivos, convenios para evitar la doble imposición y defensa frente a inspecciones de Hacienda. Capaz de analizar regímenes fiscales de más de 120 jurisdicciones para minimizar tu carga impositiva global.",
        "agent.extra.sub": "Socio de Movilidad Global y Visados",
        "agent.extra.desc": "Arquitecto de residencias por inversión (Golden Visa), visados para nómadas digitales y talento altamente cualificado. Gestiona procesos de nacionalidad complejos y reagrupaciones familiares internacionales con visión estratégica para perfiles de alto patrimonio.",
        "agent.merc.sub": "Director de Derecho Corporativo y M&A",
        "agent.merc.desc": "Experto en pactos de socios blindados, operaciones de fusión y adquisición, responsabilidad de administradores y cumplimiento normativo digital. El aliado perfecto para startups y multinacionales que buscan seguridad jurídica en sus operaciones comerciales.",
        "agent.lab.sub": "Asesor de Estrategia Laboral y RR.HH.",
        "agent.lab.desc": "Especialista en blindajes de alta dirección, auditoría de despidos complejos, reestructuraciones (ERE/ERTE) y optimización de costes de seguridad social. Protege tanto a la empresa como al trabajador con un enfoque en la prevención de litigios.",
        "agent.penal.sub": "Consultor de Compliance y Defensa Penal",
        "agent.penal.desc": "Experto en delitos económicos, blanqueo de capitales, fraude fiscal y cibercrimen. Diseña e implementa programas de cumplimiento (Compliance) robustos para mitigar la responsabilidad penal corporativa y personal de directivos.",
        "agent.aero.sub": "Especialista en Derecho Aeronáutico y Jets",
        "agent.aero.desc": "Asesor en compra/alquiler de jets privados, matriculación de aeronaves, drones comerciales y reclamaciones de alto impacto por Reglamento 261. Experto en regulaciones EASA y FAA para operaciones aéreas seguras y legales.",
        "agent.civil.sub": "Protector de Patrimonio, Herencias y Familia",
        "agent.civil.desc": "Especialista en planificación sucesoria internacional, testamentos complejos, herencias con activos en varios países y régimen de custodia en divorcios de alta conflictividad. Blindaje absoluto de tu patrimonio familiar.",
        "agent.pi.sub": "Guardián de Propiedad Intelectual y Tecnología",
        "agent.pi.desc": "Experto en registro global de marcas (EUIPO/USPTO), patentes tecnológicas, protección de código fuente (SaaS) y cumplimiento estricto de GDPR/Privacidad. Defiende tus activos intangibles frente a piratería y plagio industrial.",
        "agent.inmo.sub": "Analista de Inversión y Derecho Inmobiliario",
        "agent.inmo.desc": "Especialista en Due Diligence registral profunda, contratos de arras blindados, fiscalidad inmobiliaria e inversiones en activos turísticos (VUT). Analiza licencias urbanísticas y cargas ocultas para asegurar tu inversión inmobiliaria.",
        "agent.cripto.sub": "Navegador de Criptoactivos y Regulación Web3",
        "agent.cripto.desc": "Estratega en regulación MiCA, cumplimiento AML/KYC para grandes volúmenes, fiscalidad DeFi y protocolos de salida (Off-ramping) institucional de cripto a FIAT. El experto para navegar la economía descentralizada con seguridad legal.",

        "pricing.title": "¿Por qué pagar cientos de euros por una duda inicial?",
        "pricing.desc": "Los bufetes tradicionales cobran entre 100€ y 300€ solo por una consulta exploratoria. Nuestra tecnología democratiza el acceso a la ley, dándote respuestas precisas, al instante.",
        "pricing.feat1": "Respuestas en segundos, sin citas previas.",
        "pricing.feat2": "Análisis de riesgo legal objetivo y neutral.",
        "pricing.feat3": "Privacidad absoluta de tus datos.",
        "pricing.feat4": "Desde menos de 0,30€ por consulta (Pack).",
        "pricing.feat5": "Sube tus contratos o fotos de documentos (PDF/IMG) para una revisión profunda.",
        "pricing.feat6": "Exporta tus diagnósticos y respuestas en formato PDF.",
        "pricing.badge1.text": "25 Consultas por 6,90€",
        "pricing.badge2.text": "50 Consultas por 11,90€",
        "pricing.badge3.text": "100 Consultas por 19,90€",
        "pricing.box1.title": "Comienza Hoy",
        "pricing.box1.desc": "Regístrate y adquiere tu pack desde 6,90€ o canjea tu código personal.",
        "pricing.box1.btn": "Crear Cuenta y Empezar",
        "pricing.box2.title": "Packs Disponibles",
        "pricing.box2.desc": "Elige el plan que mejor se adapte a tus necesidades. Desbloquea el acceso a especialistas y la Guía Maestra.",
        "pricing.box2.btn": "Ver Especialistas",

        "guide.title": "Manual Premium: Cómo Exprimir a tu Asesor",
        "guide.desc": "Estás ante la IA jurídica más avanzada del mercado. Al adquirir un pack de consultas, tendrás acceso ilimitado a nuestra Guía Maestra con más de 200 casos de éxito y estrategias reales para:",
        "guide.step1.title": "1. Profundidad Contextual",
        "guide.step1.desc": "Indica siempre tu país, región y rol (particular, socio, CEO). A mayor contexto, más letal y quirúrgica será la estrategia que el asesor diseñe para tu caso.",
        "guide.step2.title": "2. Auditoría Documental (PDF/IMG)",
        "guide.step2.desc": "Sube el PDF o una foto de cualquier contrato y ordena a tu especialista detectar cláusulas abusivas, penalizaciones ocultas o riesgos de nulidad inmediata.",
        "guide.step3.title": "3. Exige Documentos a Medida",
        "guide.step3.desc": "Pide redactar burofaxes, cláusulas contractuales específicas, actas de juntas o cartas de despido blindadas. Tienes un despacho de élite a tu servicio.",

        "faq.title": "Preguntas Frecuentes sobre Derecho",
        "faq.desc": "Respuestas claras a las dudas legales más comunes. Si no encuentras lo que buscas, nuestros asesores IA están disponibles 24/7.",
        "faq.more": "Saber más",
        "faq.notfound": "¿No encuentras tu pregunta?",
        "faq.notfound.desc": "Nuestros 10 asesores IA especializados pueden responder cualquier consulta legal. Disponibles 24 horas, 7 días a la semana.",
        "faq.btn.auth": "Consultar con un Asesor IA",
        "faq.btn.noauth": "Registrarse y Consultar a un Asesor IA",
        
        "guide.nav": "Guía de Consultas",
        "guide.page.title": "Guía Maestra de Consultas Legales",
        "guide.page.subtitle": "Acceso exclusivo para miembros con pack activo. Una biblioteca masiva de pre-diagnósticos para que sepas exactamente qué preguntar a tus asesores.",
        "guide.copy.btn": "Copiar Pregunta",
        "guide.copy.success": "¡Pregunta copiada!",
        "guide.locked": "Contenido Bloqueado: Se requiere un Pack de Consultas activo para visualizar la Guía Maestra.",
        "guide.locked.btn": "Adquirir Pack de Consultas",
        
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
        "chat.initial": "Hola. Soy tu especialista designado. ¿En qué te puedo ayudar hoy? Si tienes un documento físico (multa, contrato, DNI), puedes enviarme una foto para que lo analice de inmediato.",
        "chat.footer": "LexIA Asesores puede cometer errores y es imperativo contrastar la respuesta de la IA. No sustituye al ejercicio técnico y profesional humano.",
        "chat.download": "Descargar PDF",
        "chat.examples": "Preguntas de ejemplo sugeridas:",
        "chat.error.empty": "Saldo Agotado",
        "chat.error.empty.desc": "No dispones de consultas suficientes para iniciar una sesión. Es necesario adquirir un Pack de Consultas para acceder a la sala del especialista.",
        "chat.error.no_credits_guide": "Necesitas un pack de consultas activo para acceder a la Guía Maestra.",
        "chat.error.no_credits_specialist": "Saldo insuficiente. Adquiere un pack para consultar con este especialista.",
        "chat.error.limit": "Límite de Sesión Alcanzado",
        "chat.error.limit.desc": "Has alcanzado el límite de 15 mensajes gratuitos para esta sesión. Por favor, vuelve al inicio e inicia una nueva sesión de consulta.",
        "chat.error.conn": "Error de conexión",
        "chat.upload.limit": "El archivo es demasiado grande. Máximo 5MB.",
        "chat.upload.unsupported": "Tipo de archivo no soportado. Usa PDF, TXT o imágenes (JPG/PNG).",
        "chat.upload.error": "Error al procesar el documento: ",
        "chat.upload.title": "Adjuntar Documento o Foto (PDF/IMG)",
        "chat.pdf.title": "Descargar respuesta en PDF",
        "chat.risk.green": "Nivel Seguro / Viabilidad",
        "chat.risk.yellow": "Nivel de Prudencia",
        "chat.risk.red": "Riesgo Alto / Peligro",
        "chat.risk.eval": "Evaluación de Riesgo: ",
        "chat.risk.pend": "Confianza: Pendiente",
        "chat.error.quota": "La cuenta maestra de OpenAI no tiene saldo disponible.",
        "chat.error.unknown": "Ocurrió un error inesperado al contactar con la IA. ",

        "buy.title": "Su Estrategia Legal, Sin Límites.",
        "buy.desc": "Elija el blindaje que mejor se adapte a sus necesidades. Cada crédito le da acceso total a cualquier socio del despacho.",
        "buy.current_balance": "Saldo Actual",
        "buy.queries_suffix": "Consultas",
        "buy.redeem.title": "¿Dispone de un código de activación?",
        "buy.redeem.desc": "Si ha adquirido un bono físico o dispone de un código promocional, canjéelo aquí.",
        "buy.redeem.placeholder": "Escriba su código aquí...",
        "buy.redeem.btn": "Canjear",
        "buy.btn.buy": "Adquirir Ahora",
        "buy.processing": "Procesando...",
        "buy.security.title": "Garantía de Privacidad y Seguridad",
        "buy.security.desc": "Sus datos nunca son utilizados para el entrenamiento de modelos de mercado. Operamos en un silo privado y encriptado de grado militar para proteger su confidencialidad absoluta.",
        
        "plan.25.title": "Pack Inicial",
        "plan.25.badge": "Popular",
        "plan.25.feat1": "Acceso a todos los especialistas",
        "plan.25.feat2": "Guía Maestra desbloqueada",
        "plan.25.feat3": "Exportación PDF ilimitada",
        
        "plan.50.title": "Pack Profesional",
        "plan.50.badge": "Mejor Valor",
        "plan.50.feat1": "Consultas prioritarias",
        "plan.50.feat2": "Soporte técnico preferente",
        "plan.50.feat3": "Contexto de misión profunda",
        
        "plan.100.title": "Pack Consultoría Élite",
        "plan.100.badge": "Ahorro Máximo",
        "plan.100.feat1": "Máximo ahorro por consulta",
        "plan.100.feat2": "Acceso total permanente",
        "plan.100.feat3": "Informes avanzados de riesgo",

        "recepcion.handoff.title": "Acceso a Despacho Especializado",
        "recepcion.handoff.assigned": "Asignado",
        "recepcion.handoff.btn": "Hablar con el experto ahora",
        "recepcion.handoff.warn": "Al iniciar, se descontará 1 crédito de su saldo.",
        "recepcion.handoff.no_credits": "Se requiere un pack activo para iniciar la sesión.",

        "guide.modal.title": "Derivación a Despacho",
        "guide.modal.desc": "Se le derivará al experto en {agent} para tratar esta consulta.",
        "guide.modal.cost": "Consumo: 1 Crédito de su Pack",
        "guide.modal.btn.go": "Ir al Socio Asesor ahora",
        "guide.modal.btn.copy": "Solo copiar pregunta",
        "guide.modal.btn.cancel": "Cancelar",

        "hero.btn.register": "Registrarme y Aperturar Expediente",
        "hero.btn.access": "Acceso Cliente",
        "hero.btn.recepcion": "Entrar a Recepción Oficial",
        "hero.status.ready": "La Directora está lista para recibirle",

        "home.cta.title": "Mientras un despacho profesional te da cita para la semana que viene, LexIA ya ha analizado tu caso, detectado los riesgos y redactado tu estrategia.",
        "home.cta.btn.recepcion": "Entrar a Recepción Ahora",
        "home.cta.btn.register": "Registrarme y Diagnosticar mi Caso",
        "home.cta.sub": "Sin suscripciones • Sin esperas • Precisión 2025",

        "footer.quote": "La democratización de la inteligencia jurídica de alto nivel. Un despacho de élite, disponible en cada bolsillo del mundo.",
        "footer.platform": "Plataforma",
        "footer.reception": "Recepción Oficial",
        "footer.guide": "Guía Maestra",
        "footer.plans": "Planes de Consulta",
        "footer.legal": "Legal",
        "footer.terms": "Términos",
        "footer.privacy": "Privacidad",
        "chat.confirm_exit": "¿Deseas descargar un PDF con todo tu expediente y asesoría antes de salir?",

        "hero.member_resource": "Recurso para Miembros:",
        "hero.guide_title": "Biblioteca de Consultas Maestras",
        "hero.guide_desc_cta": "Inspírese en 200 casos reales de éxito legal",

        "pricing.user.active": "Sesión de Usuario Activa",
        "pricing.user.dashboard": "Panel del Cliente",
        "pricing.user.manage": "Gestionar Mis Planes",
        "pricing.user.promo": "Utiliza tus consultas con cualquier especialista",

        "how.cta.h2_1": "No dejes tu futuro legal",
        "how.cta.h2_2": "al azar o a la espera.",
        "how.cta.security": "Pago seguro SSL • Sin permanencia",
        "how.cta.btn_register": "Registrarme y Acceder",

        "agent.title.fiscal": "Asesor Fiscal",
        "agent.title.merc": "Asesor Mercantil",
        "agent.title.lab": "Asesor Laboral",
        "agent.title.penal": "Asesor Penal",
        "agent.title.aero": "Asesor Aeronáutico",
        "agent.title.civil": "Asesor Civil",
        "agent.title.pi": "Asesor de Propiedad Intelectual",
        "agent.title.inmo": "Asesor Inmobiliario",
        "agent.title.cripto": "Asesor Cripto",
        "agent.title.extra": "Asesor de Extranjería",
        "agent.specialist_badge": "Especialista en el Despacho",

        "recepcion.welcome": "Bienvenido a LexIA. Soy la Directora del despacho. Es un placer recibirle. Antes de comenzar a analizar su caso, ¿tendría la amabilidad de decirme su nombre para dirigirme a usted adecuadamente?"
    },
    en: {

        "hero.badge": "Digital Law Firm Assisted by Generative AI",
        "hero.badge.pdf": "Upload and Analyze PDF or Document Photos",
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
        "nav.redeem.prompt": "Enter your query code:",
        "nav.redeem.success": "Code redeemed successfully! {added} queries added to your account.",
        "nav.redeem.error": "Error redeeming code: ",
        "nav.redeem.invalid": "Invalid or already used code.",
        "nav.redeem.conn_error": "Connection error while redeeming code.",

        "how.title": "How does it work?",
        "how.subtitle": "Your legal answer backed in three simple steps.",
        "how.step1.title": "1. Registration & Intake Triage",
        "how.step1.desc": "Upon registering, you will be received by our Reception Director. She will perform an initial technical interview to assign you to the exact specialist partner based on your jurisdiction and matter.",
        "how.step2.title": "2. Deep Strategic Session",
        "how.step2.desc": "Once in your expert's office, upload your contracts, photos or explain your situation. Our elite models will cross-reference data with 2024-2025 legislation in real time.",
        "how.step3.title": "3. Diagnosis & Roadmap",
        "how.step3.desc": "Obtain a forensic report with legal strategies, detailed risk levels and defense tactics. Export everything to PDF for your personal record.",

        "agents.badge": "Our Specialists Operate Worldwide",
        "agents.title": "A Global Firm in your Pocket.",
        "agents.desc": "Each partner has been trained on international regulations and over 190 countries to offer rigorous, exact analysis regardless of where your capital or interests are located.",
        "agents.btn": "Consult Expert",

        "agent.fiscal.sub": "International Tax & Investment Strategist",
        "agent.fiscal.desc": "Specialist in optimization of holding structures, crypto-asset taxation, double taxation agreements, and defense against Tax Office inspections. Capable of analyzing tax regimes of over 120 jurisdictions to minimize your global tax burden.",
        "agent.extra.sub": "Global Mobility & Visa Partner",
        "agent.extra.desc": "Architect of investment residences (Golden Visa), visas for digital nomads and highly qualified talent. Manages complex nationality processes and international family reunifications with strategic vision for high-net-worth profiles.",
        "agent.merc.sub": "Corporate Law & M&A Director",
        "agent.merc.desc": "Expert in bulletproof partner agreements, merger and acquisition operations, director liability and digital compliance. The perfect ally for startups and multinationals seeking legal certainty in their commercial operations.",
        "agent.lab.sub": "Labor Strategy & HR Advisor",
        "agent.lab.desc": "Specialist in executive protection, complex dismissal auditing, restructuring (ERE/ERTE) and social security cost optimization. Protects both the company and the worker with a focus on litigation prevention.",
        "agent.penal.sub": "Compliance & Criminal Defense Consultant",
        "agent.penal.desc": "Expert in economic crimes, money laundering, tax fraud and cybercrime. Designs and implements robust compliance programs to mitigate corporate and personal criminal liability for executives.",
        "agent.aero.sub": "Execution Aviation & Jet Specialist",
        "agent.aero.desc": "Advisor on private jet purchase/rental, aircraft registration, commercial drones and high-impact claims under Regulation 261. Expert in EASA and FAA regulations for safe and legal flight operations.",
        "agent.civil.sub": "Asset, Inheritance & Family Protector",
        "agent.civil.desc": "Specialist in international succession planning, complex wills, inheritances with assets in multiple countries and custody regimes in high-conflict divorces. Absolute shielding of your family assets.",
        "agent.pi.sub": "Intellectual Property & Technology Guardian",
        "agent.pi.desc": "Expert in global trademark registration (EUIPO/USPTO), technology patents, source code protection (SaaS) and strict GDPR/Privacy compliance. Defends your intangible assets against piracy and industrial plagiarism.",
        "agent.inmo.sub": "Investment & Real Estate Law Analyst",
        "agent.inmo.desc": "Specialist in deep registry Due Diligence, bulletproof earnest money contracts, real estate taxation and investments in tourist assets (VUT). Analyzes urban licenses and hidden charges to secure your real estate investment.",
        "agent.cripto.sub": "Blockchain Navigator & Web3 Regulation",
        "agent.cripto.desc": "Strategist in MiCA regulation, AML/KYC compliance for large volumes, DeFi taxation and institutional exit protocols (Off-ramping) from crypto to FIAT. The expert to navigate the decentralized economy with legal safety.",

        "pricing.title": "Why pay hundreds of euros for an initial question?",
        "pricing.desc": "Traditional law firms charge between €100 and €300 just for an exploratory consultation. Our technology democratizes access to the law, giving you precise answers, instantly.",
        "pricing.feat1": "Answers in seconds, no appointments needed.",
        "pricing.feat2": "Objective and neutral legal risk analysis.",
        "pricing.feat3": "Absolute privacy of your data.",
        "pricing.feat4": "From less than €0.30 per query (Pack).",
        "pricing.feat5": "Upload your contracts or document photos (PDF/IMG) for a deep legal review.",
        "pricing.feat6": "Export your diagnoses and answers in PDF format.",
        "pricing.badge1.text": "25 Queries for €6.90",
        "pricing.badge2.text": "50 Queries for €11.90",
        "pricing.badge3.text": "100 Queries for €19.90",
        "pricing.box1.title": "Start Today",
        "pricing.box1.desc": "Register and acquire your pack from €6.90 or redeem your personal code.",
        "pricing.box1.btn": "Create Account and Start",
        "pricing.box2.title": "Available Packs",
        "pricing.box2.desc": "Choose the plan that best suits your needs. Unlock access to specialists and the Master Guide.",
        "pricing.box2.btn": "View Specialists",

        "guide.title": "Premium Manual: Master Your Advisor",
        "guide.desc": "You are using the most advanced legal AI on the market. By acquiring a query pack, you will have unlimited access to our Master Guide with over 200 success cases and real strategies for:",
        "guide.step1.title": "1. Contextual Depth",
        "guide.step1.desc": "Always indicate your country, region, and role (individual, partner, CEO). More context results in a more lethal and surgical strategy designed for your case.",
        "guide.step2.title": "2. Document Audit (PDF/IMG)",
        "guide.step2.desc": "Upload the PDF or a photo of any contract and command your specialist to detect abusive clauses, hidden penalties, or immediate nullity risks.",
        "guide.step3.title": "3. Demand Custom Documents",
        "guide.step3.desc": "Ask for drafting intimidating legal notices, specific contractual clauses, board minutes, or golden parachute dismissal letters. You have an elite firm at your service.",

        "faq.title": "Frequently Asked legal Questions",
        "faq.desc": "Clear answers to the most common legal doubts. If you don't find what you are looking for, our AI advisors are available 24/7.",
        "faq.more": "Read more",
        "faq.notfound": "Can't find your question?",
        "faq.notfound.desc": "Our 10 specialized AI advisors can answer any legal query. Available 24 hours a day, 7 days a week.",
        "faq.btn.auth": "Consult with an AI Advisor",
        "faq.btn.noauth": "Register and Consult an AI Advisor",

        "guide.nav": "Query Guide",
        "guide.page.title": "Master Guide for Legal Inquiries",
        "guide.page.subtitle": "Exclusive access for members with an active pack. A massive library of pre-diagnoses so you know exactly what to ask your advisors.",
        "guide.copy.btn": "Copy Question",
        "guide.copy.success": "Question copied!",
        "guide.locked": "Locked Content: An active Query Pack is required to view the Master Guide.",
        "guide.locked.btn": "Purchase Query Pack",

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
        "chat.initial": "Hello. I am your designated specialist. How can I help you today? If you have a physical document (fine, contract, ID), you can send me a photo so I can analyze it immediately.",
        "chat.footer": "LexIA Advisors can make mistakes and it's imperative to contrast the AI's response. It does not substitute human technical and professional judgment.",
        "chat.download": "Download PDF",
        "chat.examples": "Suggested example questions:",
        "chat.error.empty": "Balance Depleted",
        "chat.error.empty.desc": "You do not have enough queries to start a session. Please click 'Buy' in the top menu to recharge your account.",
        "chat.error.limit": "Session Limit Reached",
        "chat.error.limit.desc": "You have reached the limit of 15 free messages for this session. Please go back to start and initiate a new consultation session.",
        "chat.error.conn": "Connection Error",
        "chat.upload.limit": "File is too large. Maximum 5MB.",
        "chat.upload.unsupported": "File type not supported. Use PDF, TXT or images (JPG/PNG).",
        "chat.upload.error": "Error processing document: ",
        "chat.upload.title": "Attach Document or Photo (PDF/IMG)",
        "chat.pdf.title": "Download response in PDF",
        "chat.risk.green": "Secured / Viability Level",
        "chat.risk.yellow": "Prudence Level",
        "chat.risk.red": "High Risk / Danger",
        "chat.risk.eval": "Risk Assessment: ",
        "chat.risk.pend": "Confidence: Pending",
        "chat.error.quota": "The main OpenAI account has no available balance.",
        "chat.error.unknown": "An unexpected error occurred when contacting the IA. ",

        "buy.title": "Your Legal Strategy, Without Limits.",
        "buy.desc": "Choose the protection that best suits your needs. Each credit gives you full access to any partner in the firm.",
        "buy.current_balance": "Current Balance",
        "buy.queries_suffix": "Queries",
        "buy.redeem.title": "Do you have an activation code?",
        "buy.redeem.desc": "If you have purchased a physical voucher or have a promotional code, redeem it here.",
        "buy.redeem.placeholder": "Type your code here...",
        "buy.redeem.btn": "Redeem",
        "buy.btn.buy": "Purchase Now",
        "buy.processing": "Processing...",
        "buy.security.title": "Privacy and Security Guarantee",
        "buy.security.desc": "Your data is never used for training market models. We operate in a military-grade private and encrypted silo to protect your absolute confidentiality.",

        "plan.25.title": "Starter Pack",
        "plan.25.badge": "Popular",
        "plan.25.feat1": "Access to all specialists",
        "plan.25.feat2": "Master Guide unlocked",
        "plan.25.feat3": "Unlimited PDF export",

        "plan.50.title": "Professional Pack",
        "plan.50.badge": "Best Value",
        "plan.50.feat1": "Priority consultations",
        "plan.50.feat2": "Preferred technical support",
        "plan.50.feat3": "Deep mission context",

        "plan.100.title": "Elite Consulting Pack",
        "plan.100.badge": "Maximum Savings",
        "plan.100.feat1": "Maximum savings per query",
        "plan.100.feat2": "Permanent full access",
        "plan.100.feat3": "Advanced risk reports",

        "recepcion.handoff.title": "Access to Specialized Office",
        "recepcion.handoff.assigned": "Assigned",
        "recepcion.handoff.btn": "Talk to expert now",
        "recepcion.handoff.warn": "Upon starting, 1 credit will be deducted from your balance.",
        "recepcion.handoff.no_credits": "An active pack is required to start the session.",

        "guide.modal.title": "Office Referral",
        "guide.modal.desc": "You will be referred to the expert in {agent} to handle this inquiry.",
        "guide.modal.cost": "Cost: 1 Pack Credit",
        "guide.modal.btn.go": "Go to Advisor Partner now",
        "guide.modal.btn.copy": "Only copy question",
        "guide.modal.btn.cancel": "Cancel",

        "hero.btn.register": "Register and Open Case File",
        "hero.btn.access": "Client Access",
        "hero.btn.recepcion": "Enter Official Reception",
        "hero.status.ready": "The Director is ready to receive you",

        "home.cta.title": "While a professional firm gives you an appointment for next week, LexIA has already analyzed your case, detected risks, and drafted your strategy.",
        "home.cta.btn.recepcion": "Enter Reception Now",
        "home.cta.btn.register": "Register and Diagnose my Case",
        "home.cta.sub": "No subscriptions • No waiting • 2025 Precision",

        "footer.quote": "The democratization of high-level legal intelligence. An elite law firm, available in every pocket in the world.",
        "footer.platform": "Platform",
        "footer.reception": "Official Reception",
        "footer.guide": "Master Guide",
        "footer.plans": "Query Plans",
        "footer.legal": "Legal",
        "footer.terms": "Terms",
        "footer.privacy": "Privacy",
        "chat.confirm_exit": "Do you want to download a PDF with your full case file and advice before leaving?",

        "hero.member_resource": "Member Resource:",
        "hero.guide_title": "Master Queries Library",
        "hero.guide_desc_cta": "Get inspired by 200 real legal success cases",

        "pricing.user.active": "Active User Session",
        "pricing.user.dashboard": "Client Dashboard",
        "pricing.user.manage": "Manage My Plans",
        "pricing.user.promo": "Use your queries with any specialist",

        "how.cta.h2_1": "Don't leave your legal future",
        "how.cta.h2_2": "to chance or waiting.",
        "how.cta.security": "Secure SSL payment • No commitment",
        "how.cta.btn_register": "Register and Access",

        "agent.title.fiscal": "Tax Advisor",
        "agent.title.merc": "Corporate Advisor",
        "agent.title.lab": "Labor Advisor",
        "agent.title.penal": "Criminal Advisor",
        "agent.title.aero": "Aviation Advisor",
        "agent.title.civil": "Civil Advisor",
        "agent.title.pi": "IP Advisor",
        "agent.title.inmo": "Real Estate Advisor",
        "agent.title.cripto": "Crypto Advisor",
        "agent.title.extra": "Immigration Advisor",
        "agent.specialist_badge": "Firm Specialist",

        "recepcion.welcome": "Welcome to LexIA. I am the Firm's Director. It is a pleasure to receive you. Before we begin analyzing your case, would you be so kind as to tell me your name so I may address you properly?"
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
