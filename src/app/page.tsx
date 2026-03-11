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
  ArrowRight,
  ShieldCheck,
  FileSearch,
  Scale,
  CheckCircle2,
  Clock,
  Sparkles,
  Globe
} from "lucide-react";
import Link from "next/link";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();

  const agents = [
    {
      id: "asesor-fiscal",
      title: "LexTributo",
      subtitle: "Estratega Fiscal Internacional",
      description: "IVA intracomunitario, IRPF/IS, convenios de doble imposición y riesgo fiscal.",
      icon: <Landmark className="w-6 h-6 text-emerald-400" />,
      color: "from-emerald-900/40 to-emerald-800/20",
      border: "border-emerald-500/30"
    },
    {
      id: "asesor-mercantil",
      title: "CorpLex",
      subtitle: "Mentor Societario y Mercantil",
      description: "Sociedades, M&A, responsabilidad de administradores y compliance digital.",
      icon: <Briefcase className="w-6 h-6 text-blue-400" />,
      color: "from-blue-900/40 to-blue-800/20",
      border: "border-blue-500/30"
    },
    {
      id: "asesor-laboral",
      title: "Laboris",
      subtitle: "Defensor de Derechos Laborales",
      description: "Despidos, ERTE/ERE, seguridad social y cálculos de indemnización automática.",
      icon: <Users className="w-6 h-6 text-orange-400" />,
      color: "from-orange-900/40 to-orange-800/20",
      border: "border-orange-500/30"
    },
    {
      id: "asesor-penal",
      title: "PenalShield",
      subtitle: "Guardián Penal y Compliance",
      description: "Delitos económicos, blanqueo de capitales y responsabilidad penal corporativa.",
      icon: <Gavel className="w-6 h-6 text-red-400" />,
      color: "from-red-900/40 to-red-800/20",
      border: "border-red-500/30"
    },
    {
      id: "asesor-aeronautico",
      title: "AeroLex",
      subtitle: "Aviación Ejecutiva y Pasajeros",
      description: "Derechos de pasajeros, drones, alquiler/compra de jets privados y regulaciones EASA/FAA.",
      icon: <Plane className="w-6 h-6 text-sky-400" />,
      color: "from-sky-900/40 to-sky-800/20",
      border: "border-sky-500/30"
    },
    {
      id: "asesor-civil",
      title: "Civilitas",
      subtitle: "Protector de Patrimonio y Familia",
      description: "Herencias, testamentos, regímenes de divisas y custodia internacional.",
      icon: <Building className="w-6 h-6 text-indigo-400" />,
      color: "from-indigo-900/40 to-indigo-800/20",
      border: "border-indigo-500/30"
    },
    {
      id: "asesor-pi",
      title: "IPGuard",
      subtitle: "Guardián Creativo y de Marcas",
      description: "Marcas, patentes, derechos de autor y licencias de software internacional.",
      icon: <Lightbulb className="w-6 h-6 text-yellow-400" />,
      color: "from-yellow-900/40 to-yellow-800/20",
      border: "border-yellow-500/30"
    },
    {
      id: "asesor-inmobiliario",
      title: "EstateLex",
      subtitle: "Analista de Bienes Raíces",
      description: "Compraventa, hipotecas, urbanismo, cargas registrales y simulación de costes.",
      icon: <HomeIcon className="w-6 h-6 text-purple-400" />,
      color: "from-purple-900/40 to-purple-800/20",
      border: "border-purple-500/30"
    },
    {
      id: "asesor-cripto",
      title: "CryptoLex",
      subtitle: "Navegador Blockchain",
      description: "Tributación DeFi, paso de cripto a fiat, off-ramping institucional y AML/KYC.",
      icon: <Bitcoin className="w-6 h-6 text-amber-400" />,
      color: "from-amber-900/40 to-amber-800/20",
      border: "border-amber-500/30"
    },
    {
      id: "asesor-extranjeria",
      title: "GlobalVisa",
      subtitle: "Experto en Extranjería y Migración",
      description: "Visados, permisos de trabajo, nacionalidad, Golden Visa y residencia en cualquier país.",
      icon: <Globe className="w-6 h-6 text-cyan-400" />,
      color: "from-cyan-900/40 to-cyan-800/20",
      border: "border-cyan-500/30"
    }
  ];

  const steps = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
      title: "1. Selecciona a tu Experto",
      desc: "Nuestros asistentes IA especializados cubren desde fiscalidad corporativa hasta aviación ejecutiva."
    },
    {
      icon: <FileSearch className="w-8 h-8 text-purple-400" />,
      title: "2. Explica tu Caso o Sube Documentos",
      desc: "Describe tu problema. Nuestros modelos analizarán riesgos y cruzarán datos con normativas oficiales al instante."
    },
    {
      icon: <Scale className="w-8 h-8 text-emerald-400" />,
      title: "3. Obtén un Diagnóstico Preciso",
      desc: "Recibe un informe claro con la estrategia legal a seguir, opciones viables y alertas de riesgo."
    }
  ];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-neutral-100 font-sans selection:bg-neutral-800 overflow-x-hidden">
      {/* Navigation / Auth Header */}
      <header className="absolute top-0 right-0 p-6 z-50 flex items-center gap-4">
        <UserMenu />
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-32 lg:pt-48 pb-20 lg:pb-32 overflow-hidden flex flex-col items-center">
        {/* Background Premium Gradients */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-radial from-blue-900/20 via-indigo-900/10 to-transparent blur-3xl -z-10 rounded-full" />
        <div className="absolute top-40 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-violet-900/20 to-transparent blur-3xl -z-10 rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/80 border border-neutral-700/50 backdrop-blur-md mb-8 shadow-2xl shadow-blue-900/20"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
              Despacho Legal Digital Asistido por IA Generativa
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          >
            Tu Asesoría Legal y Corporativa de <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
              Alta Precisión. Disponible 24/7.
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <span className="text-sm font-medium text-neutral-500">Impulsado por la tecnología avanzada de</span>
            <span className="text-sm font-bold text-white flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              OpenAI
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 font-light"
          >
            Resuelve dudas fiscales, redacta contratos o analiza riesgos mercantiles e inmobiliarios en segundos. Empieza hoy y obtén un pre-diagnóstico profesional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {!isSignedIn ? (
               <>
                 <button 
                   onClick={() => alert("Por favor, inicia sesión con el botón redondo de arriba a la derecha para comenzar tus consultas.")}
                   className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 group shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                 >
                   Comenzar Análisis Legal
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </button>
                 <span className="text-sm text-neutral-500 font-medium">Accede a 10 ramas del derecho en segundos.</span>
               </>
            ) : (
                <a
                  href="#especialistas"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 group shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]"
                >
                  Elegir Especialista
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-6 py-24 bg-neutral-900/20 border-y border-neutral-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Cómo funciona?</h2>
            <p className="text-neutral-400 text-lg">Tu respuesta legal respaldada en tres simples pasos.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0" />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative text-center flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 shadow-xl z-10">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Arsenal (Agents Grid) */}
      <section id="especialistas" className="px-6 py-32 relative text-center sm:text-left">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-blue-400 font-semibold tracking-wider text-sm uppercase mb-2 block">Nuestros Especialistas Operan a Nivel Mundial</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Un Despacho Global en tu Bolsillo.</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Cada IA ha sido entrenada con normativa internacional y de más de 190 países para ofrecer un análisis riguroso y exacto, sin importar dónde te encuentres ni a dónde vayas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className={`relative group p-8 rounded-3xl bg-neutral-900/40 backdrop-blur-md border ${agent.border} hover:bg-neutral-800/60 transition-all duration-300`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${agent.color} transition-opacity duration-500 rounded-3xl`} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-950/80 flex items-center justify-center border border-neutral-800 mb-6 shadow-inner">
                    {agent.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{agent.title}</h3>
                  <p className="text-sm font-medium text-neutral-300 mb-4">{agent.subtitle}</p>
                  <p className="text-neutral-500 leading-relaxed mb-8 flex-grow">
                    {agent.description}
                  </p>

                  <Link
                    href={`/chat/${agent.id}`}
                    className="mt-auto inline-flex items-center justify-center w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/5"
                  >
                    Consultar Experto
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition / Pricing Teaser */}
      <section className="px-6 py-24 bg-gradient-to-b from-neutral-900/0 to-neutral-900/40 border-t border-neutral-800/50">
        <div className="max-w-5xl mx-auto bg-neutral-900/80 border border-neutral-700/50 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] -z-10 rounded-full" />

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Por qué pagar cientos de euros por una duda inicial?</h2>
              <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                Los bufetes tradicionales cobran entre 100€ y 300€ solo por una consulta exploratoria. Nuestra tecnología democratiza el acceso a la ley, dándote respuestas precisas, al instante.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Respuestas en segundos, sin citas previas.",
                  "Análisis de riesgo legal objetivo y neutral.",
                  "Privacidad absoluta de tus datos.",
                  "Desde menos de 0,30€ por consulta (Pack)."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-950/80 p-8 rounded-2xl border border-neutral-800 shadow-2xl">
              {!isSignedIn ? (
                <>
                  <div className="text-center mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                      Comienza Tu Asesoría
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">Comienza Hoy</h3>
                    <p className="text-neutral-400 text-sm">Regístrate y adquiere tu pack desde 6,90€ o canjea tu código personal.</p>
                  </div>
                  <button 
                    onClick={() => alert("Por favor, inicia sesión con el botón redondo superior (arriba a la derecha) para poder acceder a tus planes de consultas.")}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-center block transition-all shadow-lg shadow-blue-900/20"
                  >
                    Crear Cuenta y Empezar
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                      Adquiere Consultas
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">Packs Disponibles</h3>
                    <p className="text-neutral-400 text-sm">Elige el plan que mejor se adapte a tus necesidades desde el menú superior. Desde 6,90€.</p>
                  </div>
                  <a
                    href="#especialistas"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-center block transition-all shadow-lg shadow-blue-900/20"
                  >
                    Ver Especialistas
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-24 bg-neutral-900/20 border-t border-neutral-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Preguntas Frecuentes sobre Derecho</h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">Respuestas claras a las dudas legales más comunes. Si no encuentras lo que buscas, nuestros asesores IA están disponibles 24/7.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Derecho Fiscal",
                questions: ["¿Qué impuestos pago como autónomo?", "¿Cómo declaro ingresos del extranjero?", "¿Puedo deducir el IVA de mi coche?"]
              },
              {
                title: "Derecho Mercantil",
                questions: ["¿SL o autónomo? ¿Qué me conviene?", "¿Cómo protejo mi idea de negocio?", "¿Qué cláusulas debe tener un contrato de socios?"]
              },
              {
                title: "Derecho Laboral",
                questions: ["¿Me pueden despedir estando de baja?", "¿Cuánto me corresponde de finiquito?", "¿Qué hacer ante un despido improcedente?"]
              },
              {
                title: "Derecho Penal",
                questions: ["¿Qué hacer si me acusan de un delito?", "¿Cuándo prescribe un delito?", "¿Cómo poner una denuncia?"]
              },
            ].map((faq, i) => (
              <div key={i} className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800/50">
                <h3 className="text-xl font-bold text-blue-400 mb-4">{faq.title}</h3>
                <ul className="space-y-3">
                  {faq.questions.map((q, j) => (
                    <li key={j} className="text-neutral-300 hover:text-white transition-colors cursor-pointer text-sm font-medium">
                      • {q}
                    </li>
                  ))}
                </ul>
                <Link href="/chat/asesor-fiscal" className="text-blue-500 hover:text-blue-400 text-sm mt-4 inline-block font-semibold">
                  Saber más &rarr;
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
             <h3 className="text-2xl font-bold text-white mb-4">¿No encuentras tu pregunta?</h3>
             <p className="text-neutral-400 mb-6">Nuestros 10 asesores IA especializados pueden responder cualquier consulta legal. Disponibles 24 horas, 7 días a la semana.</p>
             {isSignedIn ? (
                <a href="#especialistas" className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm lg:text-base hover:bg-neutral-200 transition-all inline-block">
                  Consultar con un Asesor IA
                </a>
             ) : (
                <button 
                  onClick={() => alert("Debes iniciar sesión arriba a la derecha para empezar a consultar con nuestros asesores.")}
                  className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm lg:text-base hover:bg-neutral-200 transition-all inline-block"
                >
                  Registrarse y Consultar a un Asesor IA
                </button>
             )}
          </div>
        </div>
      </section>

      {/* Trust & Legal Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 px-6 py-12 text-center">
        <p className="text-neutral-500 text-xs md:text-sm max-w-4xl mx-auto leading-relaxed">
          ⚠️ Esta plataforma ofrece orientación basada en modelos de IA entrenados en normativa pública internacional y jurisprudencia.
          La información generada tiene fines educativos y de pre-diagnóstico legal. El uso de esta plataforma <strong>NO constituye asesoramiento legal profesional formal</strong> ni establece una relación abogado-cliente. Las decisiones basadas en documentos o respuestas emitidas con riesgo legal deben ser siempre validadas por profesionales debidamente colegiados.
        </p>
        <p className="text-neutral-600 text-xs mt-6 flex flex-col md:flex-row items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} Plataforma de Inteligencia Jurídica. Todos los derechos reservados.</span>
          <span className="hidden md:block">•</span>
          <span>Desarrollado con inteligencia artificial de <strong>OpenAI</strong></span>
        </p>
      </footer>
    </main>
  );
}
