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
        "hero.title1": "Tu Asesoría Legal y Corporativa de",
        "hero.title2": "Alta Precisión. Disponible 24/7.",
        "hero.powered": "Impulsado por la tecnología avanzada de",
        "hero.desc": "Resuelve dudas fiscales, redacta contratos o analiza riesgos mercantiles e inmobiliarios en segundos. Empieza hoy y obtén un pre-diagnóstico profesional.",
        "hero.btn.start": "Comenzar Análisis Legal",
        "hero.btn.sub": "Accede a 10 ramas del derecho en segundos.",
        "hero.btn.choose": "Elegir Especialista",
        "nav.login": "Iniciar Sesión",
        "nav.buy": "Comprar",
        "nav.queries": "Consultas",
        "nav.redeem": "Canjear Código...",
        "nav.admin": "Panel de Administración",
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
        "chat.error.empty.desc": "No dispones de consultas suficientes para iniciar una sesión. Por favor, haz clic en 'Comprar' en el menú superior para recargar tu cuenta.",
        "chat.error.limit": "Límite de Sesión Alcanzado",
        "chat.error.limit.desc": "Has alcanzado el límite de 15 mensajes gratuitos para esta sesión. Por favor, vuelve al inicio e inicia una nueva sesión de consulta.",
        "chat.error.conn": "Error de conexión",
        "chat.upload.limit": "El archivo es demasiado grande. Máximo 5MB.",
        "chat.upload.unsupported": "Aún no soportamos visión de imágenes directamente. Por favor sube un documento PDF o archivo de texto.",
        "chat.upload.error": "Error al procesar el documento: "
    },
    en: {
        "hero.badge": "Digital Law Firm Assisted by Generative AI",
        "hero.title1": "Your Legal and Corporate Advisory of",
        "hero.title2": "High Precision. Available 24/7.",
        "hero.powered": "Powered by advanced technology from",
        "hero.desc": "Solve tax doubts, draft contracts, or analyze commercial and real estate risks in seconds. Start today and get a professional pre-diagnosis.",
        "hero.btn.start": "Start Legal Analysis",
        "hero.btn.sub": "Access 10 branches of law in seconds.",
        "hero.btn.choose": "Choose Specialist",
        "nav.login": "Log In",
        "nav.buy": "Buy",
        "nav.queries": "Queries",
        "nav.redeem": "Redeem Code...",
        "nav.admin": "Admin Panel",
        "chat.back": "Back to Home",
        "chat.online": "Agent Online",
        "chat.disclaimer": "Interactions in this room do not constitute personalized legal advice nor establish an attorney-client relationship. Verify critical decisions with a licensed professional.",
        "chat.input.placeholder": "Describe your problem or question for ",
        "chat.btn.send": "Send",
        "chat.warning": "Warning: Starting a query in this room consumes 1 credit from your balance. The following interactions within this same session (up to 15) are free.",
        "chat.footer": "LexIA Advisors can make mistakes, and it is imperative to verify the AI's response. It does not replace technical and professional human judgment.",
        "chat.download": "Download PDF",
        "chat.examples": "Suggested example questions:",
        "chat.error.empty": "Out of Balance",
        "chat.error.empty.desc": "You do not have enough queries to start a session. Please click 'Buy' in the top menu to recharge your account.",
        "chat.error.limit": "Session Limit Reached",
        "chat.error.limit.desc": "You have reached the limit of 15 free messages for this session. Please go back to the home page and start a new consultation session.",
        "chat.error.conn": "Connection Error",
        "chat.upload.limit": "The file is too large. Maximum 5MB.",
        "chat.upload.unsupported": "We do not support direct image vision yet. Please upload a PDF or text document.",
        "chat.upload.error": "Error processing document: "
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
