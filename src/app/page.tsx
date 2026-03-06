"use client";

import { motion } from "framer-motion";
import {
  Landmark,
  Briefcase,
  Users,
  Gavel,
  Plane,
  Building,
  Lightbulb,
  Home as HomeIcon,
  Bitcoin,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { UserMenu } from "@/components/user-menu";

export default function Home() {
  const agents = [
    {
      id: "asesor-fiscal",
      title: "Asesor Fiscal",
      description: "IVA intracomunitario, IRPF/IS, convenios de doble imposición y riesgo fiscal.",
      icon: <Landmark className="w-6 h-6 text-emerald-400" />,
      color: "from-emerald-900/40 to-emerald-800/20",
      border: "border-emerald-500/30"
    },
    {
      id: "asesor-mercantil",
      title: "Asesor Mercantil",
      description: "Sociedades, M&A, responsabilidad de administradores y compliance digital.",
      icon: <Briefcase className="w-6 h-6 text-blue-400" />,
      color: "from-blue-900/40 to-blue-800/20",
      border: "border-blue-500/30"
    },
    {
      id: "asesor-laboral",
      title: "Asesor Laboral",
      description: "Despidos, ERTE/ERE, seguridad social y cálculos de indemnización automática.",
      icon: <Users className="w-6 h-6 text-orange-400" />,
      color: "from-orange-900/40 to-orange-800/20",
      border: "border-orange-500/30"
    },
    {
      id: "asesor-penal",
      title: "Asesor Penal",
      description: "Delitos económicos, blanqueo de capitales y responsabilidad penal corporativa.",
      icon: <Gavel className="w-6 h-6 text-red-400" />,
      color: "from-red-900/40 to-red-800/20",
      border: "border-red-500/30"
    },
    {
      id: "asesor-aeronautico",
      title: "Asesor Aeronáutico",
      description: "Derechos de pasajeros (Reglamento 261/2004), drones y equipaje.",
      icon: <Plane className="w-6 h-6 text-sky-400" />,
      color: "from-sky-900/40 to-sky-800/20",
      border: "border-sky-500/30"
    },
    {
      id: "asesor-civil",
      title: "Asesor Civil",
      description: "Herencias, testamentos, regímenes de divisas y custodia internacional.",
      icon: <Building className="w-6 h-6 text-indigo-400" />,
      color: "from-indigo-900/40 to-indigo-800/20",
      border: "border-indigo-500/30"
    },
    {
      id: "asesor-pi",
      title: "Asesor PI",
      description: "Marcas, patentes, derechos de autor y licencias de software internacional.",
      icon: <Lightbulb className="w-6 h-6 text-yellow-400" />,
      color: "from-yellow-900/40 to-yellow-800/20",
      border: "border-yellow-500/30"
    },
    {
      id: "asesor-inmobiliario",
      title: "Asesor Inmobiliario",
      description: "Compraventa, hipotecas, urbanismo y simulación de costes e ITP.",
      icon: <HomeIcon className="w-6 h-6 text-purple-400" />,
      color: "from-purple-900/40 to-purple-800/20",
      border: "border-purple-500/30"
    },
    {
      id: "asesor-cripto",
      title: "Asesor Cripto y Web3",
      description: "Paso de cripto a fiat (Grandes capitales), bancos amigables, tributación y MiCA.",
      icon: <Bitcoin className="w-6 h-6 text-amber-400" />,
      color: "from-amber-900/40 to-amber-800/20",
      border: "border-amber-500/30"
    }
  ];
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-neutral-800">
      {/* Navigation / Auth Header */}
      <header className="absolute top-0 right-0 p-6 z-50">
        <UserMenu />
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-transparent blur-3xl -z-10 rounded-full" />

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/50 border border-neutral-800 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium tracking-wide text-neutral-300">Jurisdicciones Activas: UE, USA, LATAM y Asia</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
          >
            Inteligencia Jurídica <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Escalable y Precisa
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12"
          >
            El ecosistema de Agentes de IA especializados que analiza riesgos,
            identifica normativas y proporciona recomendaciones objetivas
            en 8 áreas clave del derecho.
          </motion.p>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative group p-6 rounded-3xl bg-neutral-900/40 backdrop-blur-sm border ${agent.border} hover:bg-gradient-to-br transition-all duration-300 overflow-hidden`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${agent.color} transition-opacity duration-300`} />

                <div className="relative z-10 flex flex-col h-full gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-800/50 flex items-center justify-center border border-neutral-700/50">
                    {agent.icon}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-100">{agent.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed flex-grow">
                    {agent.description}
                  </p>

                  <div className="pt-4 mt-auto">
                    <Link
                      href={`/chat/${agent.id}`}
                      className="text-sm font-semibold tracking-wide text-neutral-300 hover:text-white transition-colors flex items-center gap-2 group/btn"
                    >
                      Iniciar Consulta
                      <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Legal Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 px-6 py-12 text-center">
        <p className="text-neutral-500 text-sm max-w-3xl mx-auto">
          ⚠️ Esta plataforma ofrece orientación basada en IA mediante el análisis de la normativa pública.
          No constituye asesoramiento legal personalizado ni sustituye la relación formal entre abogado y cliente.
          Las respuestas emitidas de alto riesgo deben ser siempre validadas por un profesional colegiado en la jurisdicción correspondiente.
        </p>
      </footer>
    </main>
  );
}
