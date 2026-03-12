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
  FileText,
  Download,
  Scale,
  CheckCircle2,
  Clock,
  Sparkles,
  Globe,
  Lock,
  Database
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@clerk/nextjs";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  const { t } = useLanguage();

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
      id: "asesor-extranjeria",
      title: "GlobalVisa",
      subtitle: "Experto en Extranjería y Migración",
      description: "Visados, permisos de trabajo, nacionalidad, Golden Visa y residencia en cualquier país.",
      icon: <Globe className="w-6 h-6 text-cyan-400" />,
      color: "from-cyan-900/40 to-cyan-800/20",
      border: "border-cyan-500/30"
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
    }
  ];

  const steps = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
      title: t("how.step1.title"),
      desc: t("how.step1.desc")
    },
    {
      icon: <FileSearch className="w-8 h-8 text-purple-400" />,
      title: t("how.step2.title"),
      desc: t("how.step2.desc")
    },
    {
      icon: <Scale className="w-8 h-8 text-emerald-400" />,
      title: t("how.step3.title"),
      desc: t("how.step3.desc")
    }
  ];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-neutral-100 font-sans selection:bg-neutral-800 overflow-x-hidden">
      {/* Navigation / Auth Header */}
      <header className="absolute top-0 w-full p-6 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-neutral-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-800/80 shadow-lg">
          <Image src="/logo.png" alt="LexIA Logo" width={32} height={32} className="rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] object-cover" />
          <span className="font-extrabold text-xl tracking-tight text-white">Lex<span className="text-blue-500">IA</span></span>
        </div>
        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-32 lg:pt-48 pb-20 lg:pb-32 overflow-hidden flex flex-col items-center">
        {/* Background Premium Gradients */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-radial from-blue-900/20 via-indigo-900/10 to-transparent blur-3xl -z-10 rounded-full" />
        <div className="absolute top-40 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-violet-900/20 to-transparent blur-3xl -z-10 rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-8 relative"
          >
            {/* Glowing effect behind the logo */}
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute inset-0 bg-blue-500 rounded-3xl blur-2xl -z-10" 
            />
            {/* Bigger logo */}
            <div className="relative w-36 h-36 md:w-48 md:h-48 mx-auto rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.5)] border border-white/20">
              <Image 
                src="/logo.png" 
                alt="LexIA Logo Principal" 
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/80 border border-neutral-700/50 backdrop-blur-md mb-8 shadow-2xl shadow-blue-900/20"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
              {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          >
            {t("hero.title1")} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
              {t("hero.title2")}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <span className="text-sm font-medium text-neutral-500">{t("hero.powered")}</span>
            <span className="text-sm font-bold text-white flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              OpenAI
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-6 font-light"
          >
            {t("hero.desc")}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-10"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full shadow-lg shadow-purple-900/10">
              <FileText className="w-5 h-5" />
              {t("hero.badge.pdf")}
            </span>
            <span className="flex items-center gap-2 text-sm font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-full shadow-lg shadow-rose-900/10">
              <Download className="w-5 h-5" />
              {t("hero.badge.dl")}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {!isSignedIn ? (
               <>
                 <button 
                   onClick={() => alert(t("admin.alert.start"))}
                   className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 group shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                 >
                   {t("hero.btn.start")}
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </button>
                 <span className="text-sm text-neutral-500 font-medium">{t("hero.btn.sub")}</span>
               </>
            ) : (
                <a
                  href="#especialistas"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 group shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]"
                >
                  {t("hero.btn.choose")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-neutral-400 bg-neutral-900/60 backdrop-blur-md p-5 rounded-2xl border border-neutral-800/80 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-left leading-tight">
                <span className="block font-bold text-neutral-200">{t("hero.security.privacy.title")}</span>
                <span>{t("hero.security.privacy.desc")}</span>
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-neutral-800" />
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-left leading-tight">
                <span className="block font-bold text-neutral-200">{t("hero.security.encryption.title")}</span>
                <span>{t("hero.security.encryption.desc")}</span>
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-neutral-800" />
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-left leading-tight">
                <span className="block font-bold text-neutral-200">{t("hero.security.notraining.title")}</span>
                <span>{t("hero.security.notraining.desc")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-6 py-24 bg-neutral-900/20 border-y border-neutral-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("how.title")}</h2>
            <p className="text-neutral-400 text-lg">{t("how.subtitle")}</p>
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
            <span className="text-blue-400 font-semibold tracking-wider text-sm uppercase mb-2 block">{t("agents.badge")}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t("agents.title")}</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              {t("agents.desc")}
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
                    {t("agents.btn")}
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t("pricing.title")}</h2>
              <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                {t("pricing.desc")}
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  t("pricing.feat1"),
                  t("pricing.feat2"),
                  t("pricing.feat3"),
                  t("pricing.feat4"),
                  t("pricing.feat5"),
                  t("pricing.feat6")
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
                      {t("pricing.badge1")}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">{t("pricing.box1.title")}</h3>
                    <p className="text-neutral-400 text-sm">{t("pricing.box1.desc")}</p>
                  </div>
                  <button 
                    onClick={() => alert(t("admin.alert.login"))}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-center block transition-all shadow-lg shadow-blue-900/20"
                  >
                    {t("pricing.box1.btn")}
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                      {t("pricing.badge2")}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">{t("pricing.box2.title")}</h3>
                    <p className="text-neutral-400 text-sm">{t("pricing.box2.desc")}</p>
                  </div>
                  <a
                    href="#especialistas"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-center block transition-all shadow-lg shadow-blue-900/20"
                  >
                    {t("pricing.box2.btn")}
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
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t("faq.title")}</h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">{t("faq.desc")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: t("faq.q.fiscal"),
                questions: [t("faq.q.fiscal.1"), t("faq.q.fiscal.2"), t("faq.q.fiscal.3")]
              },
              {
                title: t("faq.q.mercantil"),
                questions: [t("faq.q.mercantil.1"), t("faq.q.mercantil.2"), t("faq.q.mercantil.3")]
              },
              {
                title: t("faq.q.laboral"),
                questions: [t("faq.q.laboral.1"), t("faq.q.laboral.2"), t("faq.q.laboral.3")]
              },
              {
                title: t("faq.q.penal"),
                questions: [t("faq.q.penal.1"), t("faq.q.penal.2"), t("faq.q.penal.3")]
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
                  {t("faq.more")} &rarr;
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
             <h3 className="text-2xl font-bold text-white mb-4">{t("faq.notfound")}</h3>
             <p className="text-neutral-400 mb-6">{t("faq.notfound.desc")}</p>
             {isSignedIn ? (
                <a href="#especialistas" className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm lg:text-base hover:bg-neutral-200 transition-all inline-block">
                  {t("faq.btn.auth")}
                </a>
             ) : (
                <button 
                  onClick={() => alert(t("admin.alert.faq"))}
                  className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm lg:text-base hover:bg-neutral-200 transition-all inline-block"
                >
                  {t("faq.btn.noauth")}
                </button>
             )}
          </div>
        </div>
      </section>

      {/* Trust & Legal Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 px-6 py-12 text-center">
        <p className="text-neutral-500 text-xs md:text-sm max-w-4xl mx-auto leading-relaxed">
          {t("footer.warn")}
        </p>
        <p className="text-neutral-600 text-xs mt-6 flex flex-col md:flex-row items-center justify-center gap-2">
          <span>© {new Date().getFullYear()} {t("footer.rights")}</span>
          <span className="hidden md:block">•</span>
          <span>{t("footer.powered")} <strong>OpenAI</strong></span>
        </p>
      </footer>
    </main>
  );
}
