"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export function ZeroLogModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    // No mostrar en la página de privacidad
    if (pathname === "/privacidad") {
      setIsOpen(false);
      return;
    }
    // Verificar si ya se aceptó en esta sesión de navegador (se borra al cerrar la pestaña)
    const hasAccepted = sessionStorage.getItem("lexia_zerolog_accepted");
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, [pathname]);

  const handleAccept = () => {
    sessionStorage.setItem("lexia_zerolog_accepted", "true");
    setIsOpen(false);
  };

  const handleReadManifesto = () => {
    // Cerrar el modal y marcar que va a leer el manifiesto
    // No marcamos como "aceptado" para que el modal reaparezca al volver
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 items-center text-center overflow-hidden"
          >
            {/* Fondo con brillo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-emerald-500/10 blur-[50px] -z-10" />

            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {language === "es" ? "Protección Zero-Log Activa" : "Zero-Log Protection Active"}
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {language === "es"
                  ? "Su privacidad y la de sus asuntos es absoluta. Aplicamos una estricta política Zero-Log: ninguna de las consultas ni documentos que suba será registrada en nuestra base de datos. Al salir, toda la sesión será destruida para siempre."
                  : "Your privacy and that of your affairs is absolute. We apply a strict Zero-Log policy: none of your queries or uploaded documents will be recorded in our database. Upon exit, the entire session will be destroyed forever."}
              </p>
            </div>

            <div className="w-full space-y-3 mt-2">
              <div className="flex items-start gap-3 bg-neutral-800/50 p-4 rounded-xl border border-neutral-700/50 text-left">
                <Lock className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-neutral-200">
                    {language === "es" ? "Máxima Confidencialidad" : "Maximum Confidentiality"}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    {language === "es"
                      ? "Le recomendamos descargar su Dictamen en PDF antes de salir, ya que luego será irrecuperable."
                      : "We strongly recommend downloading your PDF Report before leaving, as it will be unrecoverable."}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3 mt-4">
              <button
                onClick={handleAccept}
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                {language === "es" ? "Entendido, mi consulta es privada" : "Understood, my consultation is private"}
              </button>
              
              <Link 
                href="/privacidad" 
                onClick={handleReadManifesto}
                className="w-full py-3 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-1"
              >
                {language === "es" ? "Leer el manifiesto de privacidad Zero-Log" : "Read the Zero-Log privacy manifesto"}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
