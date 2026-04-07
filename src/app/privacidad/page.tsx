"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, FileSearch, Database, Server, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacidadPage() {
  const { language } = useLanguage();

  const isEs = language === "es";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-300 font-sans">
      <header className="px-6 py-4 border-b border-neutral-900 bg-[#0A0A0A] sticky top-0 z-50 flex items-center gap-4">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-neutral-900 transition-colors text-neutral-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="font-bold text-sm text-neutral-300 tracking-wider uppercase">
          {isEs ? "Protocolo de Seguridad" : "Security Protocol"}
        </span>
      </header>

      {/* Banner de aviso: volver y aceptar */}
      <div className="bg-emerald-950/80 border-b border-emerald-500/30 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-emerald-300 text-sm font-medium text-center sm:text-left">
          {isEs
            ? "👆 Una vez hayas leído el manifiesto, vuelve atrás y pulsa «Entendido, mi consulta es privada» para comenzar."
            : "👆 Once you have read the manifesto, go back and click «Understood, my consultation is private» to begin."}
        </p>
        <Link
          href="/"
          className="shrink-0 flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          {isEs ? "Volver y Aceptar" : "Go Back & Accept"}
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-6">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight flex items-center justify-center gap-3">
            {isEs ? "Manifiesto Zero-Log" : "Zero-Log Manifesto"}
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {isEs 
              ? "Nuestra premisa es sencilla: no podemos ser forzados a revelar lo que no tenemos. La confidencialidad es la piedra angular de la abogacía de élite, y la hemos codificado en nuestro núcleo."
              : "Our premise is simple: we cannot be forced to reveal what we do not have. Confidentiality is the cornerstone of elite legal practice, and we have encoded it into our core."}
          </p>
        </motion.div>

        <div className="space-y-8">
          <Section 
            icon={<Lock className="w-6 h-6 text-emerald-400" />}
            title={isEs ? "1. Destrucción Efímera de Datos (Zero-Log)" : "1. Ephemeral Data Destruction (Zero-Log)"}
            content={isEs
              ? "En LexIA no existe el historial de chats. Una vez que cierras la ventana de tu consulta o navegas fuera de la plataforma, todos los vectores cognitivos y los detalles de tu caso son destruidos permanentemente de la memoria de nuestros servidores. No se guardan registros (logs) ni se almacenan en ninguna base de datos interna."
              : "In LexIA there is no chat history. Once you close your query window or navigate away from the platform, all cognitive vectors and details of your case are permanently destroyed from our servers' memory. No records (logs) are kept and they are not stored in any internal database."}
          />

          <Section 
            icon={<Database className="w-6 h-6 text-blue-400" />}
            title={isEs ? "2. Procesamiento Sin Almacenamiento" : "2. Processing Without Storage"}
            content={isEs
              ? "Los documentos y respuestas que introduces para el análisis de los asesores se procesan temporalmente en la memoria durante la sesión. Su único propósito es extraer el contexto para la consultoría. Automática e irrevocablemente, se elude cualquier tipo de guardado persistente."
              : "The documents and replies you input for the advisors' analysis are processed temporarily in memory during the session. Their sole purpose is to extract context for consulting. Automatically and irrevocably, any persistent saving is bypassed."}
          />

          <Section 
            icon={<Server className="w-6 h-6 text-purple-400" />}
            title={isEs ? "3. Ningún Entrenamiento de IA (Non-Training Policy)" : "3. No AI Training (Non-Training Policy)"}
            content={isEs
              ? "Bajo ninguna circunstancia utilizamos tus consultas legales, datos corporativos, información fiscal o detalles personales para entrenar futuros modelos de Inteligencia Artificial (LLM). Mantenemos estrictos controles para asegurar que tus datos no se usan para aprendizaje de máquina."
              : "Under no circumstances do we use your legal queries, corporate data, tax information or personal details to train future Artificial Intelligence (LLM) models. We maintain strict controls to ensure that your data is not used for machine learning."}
          />

          <Section 
            icon={<FileSearch className="w-6 h-6 text-amber-400" />}
            title={isEs ? "4. Responsabilidad de Descarga (PDF)" : "4. Download Responsibility (PDF)"}
            content={isEs
              ? "Dado que nuestro sistema es volátil y ultra-privado por diseño, delegamos en ti la responsabilidad de guardar la valiosa estrategia que LexIA te proporciona. Te recomendamos usar siempre el botón 'Exportar Dictamen PDF'. Una vez guardado en tu equipo local, el conocimiento es tuyo y LexIA olvida la sesión."
              : "Given that our system is volatile and ultra-private by design, we delegate to you the responsibility of saving the valuable strategy LexIA provides. We always recommend using the 'Export PDF Report' button. Once saved on your local device, the knowledge is yours and LexIA forgets the session."}
          />
        </div>
      </main>
    </div>
  );
}

function Section({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-xl relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-neutral-800 group-hover:bg-emerald-500/50 transition-colors" />
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 shadow-inner group-hover:border-emerald-500/20 transition-colors">
          {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      <p className="text-neutral-400 leading-relaxed text-base md:text-lg ml-0 md:ml-[72px]">
        {content}
      </p>
    </motion.div>
  );
}
