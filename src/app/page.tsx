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
  FileText,
  Download,
  Scale,
  CheckCircle2,
  Sparkles,
  Globe,
  Lock,
  Database,
  ChevronRight,
  UserPlus2,
  Volume2,
  VolumeX,
  BookOpen,
  Cookie,
  Shield,
  Ship,
  Coins,
  Leaf,
  Search,
  FileDown,
  Trash2,
  Mail,
  Crown,
  HelpCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserMenu } from "@/components/user-menu";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useLanguage } from "@/context/LanguageContext";
import { AudioBriefing } from "@/components/AudioBriefing";

export default function Home() {
  const { isSignedIn } = useAuth();
  const { t, language } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const es = language === "es";

  useEffect(() => {
    // Zero-Log Security: Wipe all session traces on Home mount
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem("lexia_chat_active");
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("lexia_chat_store_")) {
          sessionStorage.removeItem(key);
        }
      });
    }
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("lexia_handoff");
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!("speechSynthesis" in window)) {
      alert("La síntesis de voz no está soportada en tu navegador.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const text = !es
        ? "Welcome to Lex I A, your Artificial Intelligence Legal platform. You have a global law firm in your pocket, operated by next generation AI. You can submit your case through our Central Reception, which will audit your files using all our experts simultaneously, or you can go directly to one of our specialists for technical queries. Our mission is to democratize premium tier legal consulting without waiting or limits. Scroll down and choose your consultation mode. We are ready to start."
        : "Bienvenidos a Lex I A, vuestra plataforma de Inteligencia Jurídica. Estás ante un despacho global en tu bolsillo, operado por Inteligencia artificial de última generación. Puedes hacer tus consultas complejas a través de nuestra Recepción Central, que auditará tu caso con todo nuestro panel simultáneamente, o puedes ir directamente a uno de nuestros especialistas si tu duda es muy concisa. Nuestra misión es democratizar la élite de la abogacía sin esperas y sin límites. Desplázate hacia abajo y selecciona tu modalidad de consulta. Estamos listos para comenzar.";

      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = !es ? "en-US" : "es-ES";
      msg.rate = 1.0;
      msg.pitch = 1.0;
      msg.onend = () => setIsPlayingAudio(false);
      msg.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(msg);
    }
  };

  const agents = [
    {
      id: "asesor-fiscal",
      title: "LexTributo",
      subtitle: t("agent.fiscal.sub"),
      description: t("agent.fiscal.desc"),
      icon: <Landmark className="w-5 h-5 text-emerald-400" />,
      border: "border-emerald-500/30"
    },
    {
      id: "asesor-extranjeria",
      title: "GlobalVisa",
      subtitle: es ? "Movilidad Global y Visados" : "Immigration & Global Mobility",
      description: t("agent.extra.desc"),
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
      border: "border-cyan-500/30"
    },
    {
      id: "asesor-mercantil",
      title: "CorpLex",
      subtitle: t("agent.merc.sub"),
      description: t("agent.merc.desc"),
      icon: <Briefcase className="w-5 h-5 text-gold-400" />,
      border: "border-gold-500/30"
    },
    {
      id: "asesor-laboral",
      title: "Laboris",
      subtitle: t("agent.lab.sub"),
      description: t("agent.lab.desc"),
      icon: <Users className="w-5 h-5 text-orange-400" />,
      border: "border-orange-500/30"
    },
    {
      id: "asesor-penal",
      title: "PenalShield",
      subtitle: t("agent.penal.sub"),
      description: t("agent.penal.desc"),
      icon: <Gavel className="w-5 h-5 text-red-400" />,
      border: "border-red-500/30"
    },
    {
      id: "asesor-aeronautico",
      title: "AeroLex",
      subtitle: t("agent.aero.sub"),
      description: t("agent.aero.desc"),
      icon: <Plane className="w-5 h-5 text-sky-400" />,
      border: "border-sky-500/30"
    },
    {
      id: "asesor-civil",
      title: "Civilitas",
      subtitle: t("agent.civil.sub"),
      description: t("agent.civil.desc"),
      icon: <Building className="w-5 h-5 text-gold-400" />,
      border: "border-gold-500/30"
    },
    {
      id: "asesor-pi",
      title: "IPGuard",
      subtitle: t("agent.pi.sub"),
      description: t("agent.pi.desc"),
      icon: <Lightbulb className="w-5 h-5 text-yellow-400" />,
      border: "border-yellow-500/30"
    },
    {
      id: "asesor-inmobiliario",
      title: "EstateLex",
      subtitle: t("agent.inmo.sub"),
      description: t("agent.inmo.desc"),
      icon: <HomeIcon className="w-5 h-5 text-purple-400" />,
      border: "border-purple-500/30"
    },
    {
      id: "asesor-cripto",
      title: "CryptoLex",
      subtitle: t("agent.cripto.sub"),
      description: t("agent.cripto.desc"),
      icon: <Bitcoin className="w-5 h-5 text-amber-400" />,
      border: "border-amber-500/30"
    },
    {
      id: "asesor-ciberseguridad",
      title: "CyberLex",
      subtitle: t("agent.ciber.sub"),
      description: t("agent.ciber.desc"),
      icon: <Shield className="w-5 h-5 text-teal-400" />,
      border: "border-teal-500/30"
    },
    {
      id: "asesor-comercio",
      title: "TradeLex",
      subtitle: t("agent.comercio.sub"),
      description: t("agent.comercio.desc"),
      icon: <Ship className="w-5 h-5 text-fuchsia-400" />,
      border: "border-fuchsia-500/30"
    },
    {
      id: "asesor-subvenciones",
      title: "GrantLex",
      subtitle: t("agent.subvenciones.sub"),
      description: t("agent.subvenciones.desc"),
      icon: <Coins className="w-5 h-5 text-lime-400" />,
      border: "border-lime-500/30"
    },
    {
      id: "asesor-medioambiente",
      title: "EcoLex",
      subtitle: t("agent.medioambiente.sub"),
      description: t("agent.medioambiente.desc"),
      icon: <Leaf className="w-5 h-5 text-green-400" />,
      border: "border-green-500/30"
    }
  ];

  const stats = [
    { value: "14", label: es ? "Asesores especializados" : "Specialized advisors" },
    { value: "560+", label: es ? "Casos de referencia" : "Reference cases" },
    { value: "24/7", label: es ? "Disponibilidad inmediata" : "Immediate availability" },
    { value: "0", label: es ? "Datos almacenados" : "Data stored" }
  ];

  const steps = [
    {
      n: "01",
      icon: <Mail className="w-5 h-5" />,
      title: es ? "Acceda solo con su email" : "Access with just your email",
      desc: es
        ? "Sin formularios interminables. Su email es el único dato que necesitamos para darle acceso; nada más."
        : "No endless forms. Your email is the only piece of data we need to grant access; nothing more."
    },
    {
      n: "02",
      icon: <Users className="w-5 h-5" />,
      title: es ? "Elija a su asesor" : "Choose your advisor",
      desc: es
        ? "14 especialistas técnicos para consultas concretas, o la Directora General para casos complejos que cruzan varias áreas."
        : "14 technical specialists for specific queries, or the Managing Partner for complex multi-area cases."
    },
    {
      n: "03",
      icon: <Search className="w-5 h-5" />,
      title: es ? "Reciba un dictamen completo" : "Receive a complete opinion",
      desc: es
        ? "Análisis con normativa vigente y fuentes oficiales (BOE, DOUE), escenarios, hoja de ruta y borradores de documentos listos para usar."
        : "Analysis with current legislation and official sources, scenarios, a roadmap and ready-to-use document drafts."
    },
    {
      n: "04",
      icon: <FileDown className="w-5 h-5" />,
      title: es ? "Descargue su PDF. Y desaparece" : "Download your PDF. Then it vanishes",
      desc: es
        ? "Al finalizar, su dictamen se descarga en PDF y la consulta se borra para siempre. Esa copia es la única que existirá."
        : "When you finish, your opinion downloads as a PDF and the consultation is erased forever. That copy is the only one that will exist."
    }
  ];

  const differentiators = [
    {
      icon: <Trash2 className="w-6 h-6 text-emerald-400" />,
      title: es ? "Privacidad Zero-Log real" : "True Zero-Log privacy",
      desc: es
        ? "No guardamos ni una línea de sus consultas. Sin historiales, sin base de datos de casos, sin rastro. Solo Stripe conserva sus datos de pago."
        : "We do not store a single line of your queries. No histories, no case database, no trace. Only Stripe retains your payment data."
    },
    {
      icon: <Scale className="w-6 h-6 text-gold-400" />,
      title: es ? "Fuentes oficiales citadas" : "Official sources cited",
      desc: es
        ? "Cada dictamen investiga la normativa vigente y cita artículos con enlaces al BOE, DOUE y organismos oficiales. Sin afirmaciones sin fuente."
        : "Every opinion researches current legislation and cites articles with links to official gazettes and bodies. No claims without a source."
    },
    {
      icon: <FileText className="w-6 h-6 text-sky-400" />,
      title: es ? "Documentos listos para usar" : "Ready-to-use documents",
      desc: es
        ? "No solo teoría: recibirá borradores completos de contratos, cartas, recursos e instancias que puede personalizar y presentar."
        : "Not just theory: you receive complete drafts of contracts, letters, appeals and filings you can customize and submit."
    },
    {
      icon: <Coins className="w-6 h-6 text-purple-400" />,
      title: es ? "Pago por uso, sin suscripción" : "Pay per use, no subscription",
      desc: es
        ? "Compre un pack de consultas y úselo cuando lo necesite. Sin cuotas mensuales, sin permanencia, sin sorpresas."
        : "Buy a query pack and use it whenever you need. No monthly fees, no lock-in, no surprises."
    }
  ];

  const faqs = [
    {
      q: es ? "¿Esto sustituye a un abogado?" : "Does this replace a lawyer?",
      a: es
        ? "No. LexIA es una herramienta de orientación y pre-diagnóstico de nivel profesional: analiza su caso, le da la normativa aplicable, escenarios y documentos base. Para representación legal oficial o defensa en juicio debe acudir a un abogado colegiado — y cada dictamen le recomienda despachos reales especializados en su caso."
        : "No. LexIA is a professional-grade guidance and pre-diagnosis tool: it analyzes your case and gives you applicable law, scenarios and base documents. For official legal representation you must go to a licensed lawyer — and each opinion recommends real specialized firms for your case."
    },
    {
      q: es ? "¿Qué pasa con mis datos y mis consultas?" : "What happens to my data and queries?",
      a: es
        ? "Nada se guarda. Sus consultas viven únicamente en su navegador mientras dura la sesión y se destruyen al salir. El único dato de cuenta es su email de acceso, y los datos de pago los custodia exclusivamente Stripe, líder mundial en pagos."
        : "Nothing is stored. Your queries live only in your browser during the session and are destroyed on exit. The only account data is your login email, and payment data is held exclusively by Stripe."
    },
    {
      q: es ? "¿Qué es un crédito y cuánto cuesta una consulta?" : "What is a credit and what does a query cost?",
      a: es
        ? "Cada mensaje a un asesor especialista consume 1 crédito. La Directora General, que coordina varias áreas a la vez con búsqueda web en tiempo real, consume 3 créditos por mensaje. El pack de 25 créditos cuesta 9,50 € — una consulta completa cuesta menos que un café."
        : "Each message to a specialist advisor uses 1 credit. The Managing Partner, who coordinates several areas with real-time web search, uses 3 credits per message. The 25-credit pack costs €9.50."
    },
    {
      q: es ? "¿Sirve para consultas fuera de España?" : "Does it work outside Spain?",
      a: es
        ? "Sí. Indique su país al iniciar la consulta y el dictamen se basará en la legislación y organismos de esa jurisdicción, con comparativas internacionales cuando aporten valor (fiscalidad, visados, sociedades, cripto...)."
        : "Yes. State your country when starting the consultation and the opinion will be based on that jurisdiction's legislation and bodies, with international comparisons where valuable."
    },
    {
      q: es ? "¿Puedo adjuntar documentos?" : "Can I attach documents?",
      a: es
        ? "Sí: contratos, notificaciones, sentencias o fotos de documentos en PDF, imagen o texto. Se analizan al momento, en memoria, y tampoco se almacenan en ningún servidor."
        : "Yes: contracts, notices, rulings or document photos as PDF, image or text. They are analyzed on the fly, in memory, and are never stored on any server."
    }
  ];

  const plans = [
    {
      name: es ? "Pack Iniciación" : "Starter Pack",
      price: "9,50€",
      queries: "25",
      perQuery: es ? "0,38€ / consulta" : "€0.38 / query",
      popular: false
    },
    {
      name: es ? "Pack Profesional" : "Professional Pack",
      price: "16,50€",
      queries: "50",
      perQuery: es ? "0,33€ / consulta" : "€0.33 / query",
      popular: true
    },
    {
      name: es ? "Pack Élite" : "Elite Pack",
      price: "29,50€",
      queries: "100",
      perQuery: es ? "0,29€ / consulta" : "€0.29 / query",
      popular: false
    }
  ];

  return (
    <main className="min-h-screen bg-[#070B14] text-neutral-100 font-sans selection:bg-gold-500/30 overflow-x-hidden">
      {/* ===== NAV ===== */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#070B14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo.png" alt="LexIA Logo" width={34} height={34} className="rounded-lg object-cover" />
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
              Lex<span className="text-gold-500">IA</span>
            </span>
          </div>

          {!isSignedIn && (
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-400">
              <a href="#como-funciona" className="hover:text-white transition-colors">{es ? "Cómo funciona" : "How it works"}</a>
              <a href="#directora" className="hover:text-white transition-colors">{es ? "La Directora" : "The Partner"}</a>
              <a href="#especialistas" className="hover:text-white transition-colors">{es ? "Especialistas" : "Specialists"}</a>
              <a href="#privacidad" className="hover:text-white transition-colors">{es ? "Privacidad" : "Privacy"}</a>
              <a href="#precios" className="hover:text-white transition-colors">{es ? "Precios" : "Pricing"}</a>
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {isSignedIn && (
              <Link href="/manual" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors uppercase tracking-widest text-neutral-300">
                <BookOpen className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                Manual
              </Link>
            )}
            <UserMenu />
          </div>
        </div>
      </header>

      {isSignedIn ? (
        /* ============================================================
           VISTA CLIENTE (SESIÓN INICIADA)
           ============================================================ */
        <>
          <section className="relative px-4 sm:px-6 pt-28 md:pt-36 pb-16 overflow-hidden">
            <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gold-500/5 blur-[120px] rounded-full -z-10" />
            <div className="max-w-6xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-widest mb-6">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {es ? "Sesión privada activa · Zero-Log" : "Private session active · Zero-Log"}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                  {es ? "Bienvenido a su despacho" : "Welcome to your firm"}
                </h1>
                <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto mb-12">
                  {es
                    ? "Elija cómo quiere trabajar hoy. Recuerde: al finalizar cada consulta, descargue su dictamen en PDF — será la única copia."
                    : "Choose how you want to work today. Remember: when you finish, download your PDF opinion — it will be the only copy."}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
                <Link
                  href="/chat/asesor-direccion"
                  className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-gold-500/15 to-transparent border border-gold-500/30 hover:border-gold-400 transition-all flex flex-col items-center text-center gap-3 shadow-[0_0_40px_-10px_rgba(212,175,55,0.25)]"
                >
                  <span className="absolute -top-3 px-3 py-1 rounded-full bg-gold-500 text-black text-[10px] font-black uppercase tracking-widest">
                    {es ? "Recomendado" : "Recommended"}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Crown className="w-7 h-7 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{t("hero.c.mod_a.title")}</h3>
                  <p className="text-sm text-neutral-400">{t("hero.c.mod_a.desc")}</p>
                  <span className="mt-auto pt-4 inline-flex items-center gap-2 text-gold-300 font-bold text-sm group-hover:gap-3 transition-all">
                    {t("hero.c.mod_a.btn")} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link
                  href="/guia"
                  className="group p-6 sm:p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-600 transition-all flex flex-col items-center text-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{t("hero.c.mod_b.title")}</h3>
                  <p className="text-sm text-neutral-400">{t("hero.c.mod_b.desc")}</p>
                  <span className="mt-auto pt-4 inline-flex items-center gap-2 text-purple-300 font-bold text-sm group-hover:gap-3 transition-all">
                    {t("hero.c.mod_b.btn")} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link
                  href="/documentos"
                  className="group p-6 sm:p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-600 transition-all flex flex-col items-center text-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{t("hero.c.docs.title")}</h3>
                  <p className="text-sm text-neutral-400">{t("hero.c.docs.desc")}</p>
                  <span className="mt-auto pt-4 inline-flex items-center gap-2 text-emerald-300 font-bold text-sm group-hover:gap-3 transition-all">
                    {t("hero.c.docs.btn")} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/comprar"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors"
                >
                  <Coins className="w-4 h-4" />
                  {es ? "Gestionar mis créditos" : "Manage my credits"}
                </Link>
                <Link
                  href="/manual"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-neutral-300 font-bold text-sm hover:bg-white/10 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-gold-400" />
                  {es ? "Manual de usuario" : "User manual"}
                </Link>
              </div>
            </div>
          </section>

          {/* Specialists grid (signed in) */}
          <section id="especialistas" className="px-4 sm:px-6 py-16 md:py-24 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 md:mb-16">
                <span className="text-gold-400 font-semibold tracking-wider text-xs uppercase mb-3 block">{t("agents.badge")}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("agents.title")}</h2>
                <p className="text-neutral-400 max-w-2xl mx-auto text-sm md:text-base">
                  {es
                    ? "Consultas técnicas concretas: 1 crédito por mensaje. Para casos que cruzan varias áreas, acuda a la Directora General (3 créditos)."
                    : "Specific technical queries: 1 credit per message. For multi-area cases, go to the Managing Partner (3 credits)."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {agents.map((agent, i) => (
                  <motion.div
                    key={agent.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                    className={`group p-5 rounded-2xl bg-neutral-900/40 border ${agent.border} hover:bg-neutral-900/80 transition-all flex flex-col`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-950/80 flex items-center justify-center border border-neutral-800 shrink-0">
                        {agent.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-white leading-tight">{agent.title}</h3>
                        <p className="text-[11px] font-medium text-neutral-400 truncate">{agent.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-neutral-500 text-xs leading-relaxed mb-4 flex-grow line-clamp-3">{agent.description}</p>
                    <Link
                      href={`/guia?agent=${agent.id}`}
                      className="flex items-center justify-center w-full py-2.5 rounded-xl bg-gold-600/15 hover:bg-gold-600/30 text-gold-400 text-[11px] font-bold transition-all border border-gold-500/30 gap-2"
                    >
                      {es ? "CONSULTAR" : "CONSULT"} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        /* ============================================================
           LANDING PÚBLICA (LA MEJOR PUBLICIDAD)
           ============================================================ */
        <>
          {/* ===== HERO ===== */}
          <section className="relative px-4 sm:px-6 pt-28 md:pt-40 pb-16 md:pb-24 overflow-hidden">
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-gold-500/[0.07] blur-[130px] rounded-full -z-10" />
            <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-[#141C2E]/60 blur-[120px] rounded-full -z-10" />

            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: -14, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative mb-6 md:mb-8 inline-block"
              >
                <div className="absolute inset-0 bg-gold-500/40 rounded-3xl blur-2xl -z-10" />
                <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.45)] border border-gold-500/30">
                  <Image src="/logo.png" alt="LexIA — Despacho Legal de IA" fill className="object-cover" priority />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-2 mb-6 md:mb-8"
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/80 border border-gold-500/20 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span className="text-xs sm:text-sm font-semibold tracking-wide text-gold-200">
                    {es ? "Despacho Legal de IA · Privacidad Zero-Log" : "AI Legal Firm · Zero-Log Privacy"}
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/80 border border-white/10 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs sm:text-sm font-semibold tracking-wide text-neutral-300">
                    {es ? "Impulsado por OpenAI GPT-5.6" : "Powered by OpenAI GPT-5.6"}
                  </span>
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.08] text-white"
              >
                {es ? "Un despacho de élite." : "An elite law firm."}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-600">
                  {es ? "En su bolsillo. Sin rastro." : "In your pocket. No trace."}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed"
              >
                {es ? (
                  <>
                    14 asesores jurídicos y técnicos de IA, coordinados por una Directora General que investiga
                    la normativa vigente en tiempo real. Dictámenes completos con fuentes oficiales, documentos
                    listos para usar y <strong className="text-white">cero datos almacenados</strong>: su PDF es la única copia.
                  </>
                ) : (
                  <>
                    14 AI legal and technical advisors, coordinated by a Managing Partner who researches current
                    legislation in real time. Complete opinions with official sources, ready-to-use documents and{" "}
                    <strong className="text-white">zero data stored</strong>: your PDF is the only copy.
                  </>
                )}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6"
              >
                <SignUpButton mode="modal">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-black text-base sm:text-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-2.5 shadow-[0_0_50px_-10px_rgba(255,255,255,0.35)] hover:scale-[1.02]">
                    <UserPlus2 className="w-5 h-5 text-gold-600" />
                    {es ? "Abrir mi expediente" : "Open my case file"}
                  </button>
                </SignUpButton>
                <a
                  href="#como-funciona"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-base hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  {es ? "Ver cómo funciona" : "See how it works"}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex items-center justify-center gap-2 text-sm text-neutral-500 mb-12 md:mb-16"
              >
                <SignInButton mode="modal">
                  <button className="hover:text-white font-semibold transition-colors underline underline-offset-4 decoration-neutral-700">
                    {es ? "¿Ya es cliente? Inicie sesión" : "Already a client? Sign in"}
                  </button>
                </SignInButton>
              </motion.div>

              {/* Stats strip */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5 max-w-3xl mx-auto"
              >
                {stats.map((s, i) => (
                  <div key={i} className="bg-[#0A1020] px-4 py-5 text-center">
                    <div className="text-2xl md:text-3xl font-black text-gold-400 font-display">{s.value}</div>
                    <div className="text-[10px] md:text-xs text-neutral-500 font-semibold uppercase tracking-wider mt-1">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ===== CÓMO FUNCIONA ===== */}
          <section id="como-funciona" className="px-4 sm:px-6 py-16 md:py-24 bg-[#090F1D] border-y border-white/5 scroll-mt-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 md:mb-16">
                <span className="text-gold-400 font-semibold tracking-wider text-xs uppercase mb-3 block">
                  {es ? "El proceso" : "The process"}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {es ? "De la duda al dictamen en minutos" : "From question to opinion in minutes"}
                </h2>
                <p className="text-neutral-400 max-w-2xl mx-auto text-sm md:text-base">
                  {es
                    ? "Mientras un despacho tradicional le da cita para la semana que viene, LexIA ya ha analizado su caso."
                    : "While a traditional firm schedules you for next week, LexIA has already analyzed your case."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="relative p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-gold-500/30 transition-colors"
                  >
                    <div className="text-5xl font-black text-white/5 font-display absolute top-4 right-5 select-none">{step.n}</div>
                    <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== DIFERENCIADORES ===== */}
          <section className="px-4 sm:px-6 py-16 md:py-24">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 md:mb-16">
                <span className="text-gold-400 font-semibold tracking-wider text-xs uppercase mb-3 block">
                  {es ? "Por qué LexIA" : "Why LexIA"}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {es ? "Lo que ningún otro asesor le ofrece" : "What no other advisor offers you"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {differentiators.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex gap-5 p-6 md:p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800"
                  >
                    <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0">
                      {d.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{d.title}</h3>
                      <p className="text-neutral-400 text-sm leading-relaxed">{d.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== LA DIRECTORA ===== */}
          <section id="directora" className="px-4 sm:px-6 py-16 md:py-24 bg-[#090F1D] border-y border-white/5 scroll-mt-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-gold-400 font-semibold tracking-wider text-xs uppercase mb-4">
                  <Crown className="w-4 h-4" />
                  {es ? "El servicio insignia" : "The flagship service"}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {es ? "La Directora General: 10 abogados senior en uno" : "The Managing Partner: 10 senior lawyers in one"}
                </h2>
                <p className="text-neutral-400 leading-relaxed mb-8 text-sm md:text-base">
                  {es
                    ? "Para casos que cruzan varias áreas — una herencia con inmuebles y fiscalidad internacional, un despido con implicaciones penales, una startup con socios extranjeros — la Directora coordina a todos los especialistas a la vez y emite un dictamen unificado de nivel de gran despacho. Opera con GPT-5.6 Sol, el modelo de IA más avanzado de OpenAI."
                    : "For cases that cross several areas — an inheritance with real estate and international taxation, a dismissal with criminal implications, a startup with foreign partners — the Partner coordinates every specialist at once and issues a unified big-firm-level opinion. She runs on GPT-5.6 Sol, OpenAI's most advanced AI model."}
                </p>
                <ul className="space-y-4">
                  {[
                    es ? "Investiga legislación y jurisprudencia vigente en tiempo real (BOE, DOUE, ministerios)" : "Researches current legislation and case law in real time",
                    es ? "Desarrolla varios escenarios con riesgos, plazos y probabilidades" : "Develops multiple scenarios with risks, deadlines and probabilities",
                    es ? "Redacta los documentos completos que su caso necesita" : "Drafts the complete documents your case needs",
                    es ? "Le recomienda despachos reales especializados si necesita representación" : "Recommends real specialized firms if you need representation"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm md:text-base text-neutral-300">
                      <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-b from-gold-500/15 via-neutral-900/60 to-neutral-900/60 border border-gold-500/25 shadow-[0_0_80px_-20px_rgba(212,175,55,0.3)]"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
                    <Crown className="w-7 h-7 text-gold-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">{es ? "Dirección LexIA" : "LexIA Managing Partner"}</div>
                    <div className="text-xs text-gold-300 font-semibold uppercase tracking-widest">
                      {es ? "GPT-5.6 Sol · La IA más avanzada de OpenAI" : "GPT-5.6 Sol · OpenAI's most advanced AI"}
                    </div>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: es ? "Coordinación inicial" : "Initial coordination", done: true },
                    { label: es ? "Análisis jurídico con fuentes" : "Legal analysis with sources", done: true },
                    { label: es ? "Hoja de ruta accionable" : "Actionable roadmap", done: true },
                    { label: es ? "Borradores documentales" : "Document drafts", done: true },
                    { label: es ? "Auditoría del expediente" : "Case file audit", done: true }
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                      <span className="text-neutral-300">{row.label}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-[11px] text-neutral-500 text-center uppercase tracking-widest font-bold">
                  {es ? "3 créditos por consulta · Especialistas: 1 crédito" : "3 credits per query · Specialists: 1 credit"}
                </p>
              </motion.div>
            </div>
          </section>

          {/* ===== AUDIO / MEDIA ===== */}
          <section className="px-4 sm:px-6 py-16 md:py-20">
            <div className="max-w-4xl mx-auto">
              <AudioBriefing language={language} />
              <div className="mt-6 flex justify-center">
                <button
                  onClick={toggleAudio}
                  className={`flex items-center justify-center gap-3 px-6 py-2.5 rounded-full border transition-all group ${
                    isPlayingAudio
                      ? "bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20"
                      : "bg-gold-500/10 border-gold-500/30 text-gold-300 hover:bg-gold-500/20"
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-5 h-5 animate-pulse" />
                      <span className="font-semibold text-sm">{!es ? "Stop Audio Presentation" : "Detener Presentación en Audio"}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-sm">{!es ? "Listen to Audio Presentation" : "Escuchar Presentación en Audio"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* ===== ESPECIALISTAS ===== */}
          <section id="especialistas" className="px-4 sm:px-6 py-16 md:py-24 bg-[#090F1D] border-y border-white/5 scroll-mt-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 md:mb-16">
                <span className="text-gold-400 font-semibold tracking-wider text-xs uppercase mb-3 block">{t("agents.badge")}</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {es ? "14 especialistas, cada uno el mejor en lo suyo" : "14 specialists, each the best at their field"}
                </h2>
                <p className="text-neutral-400 max-w-2xl mx-auto text-sm md:text-base">
                  {es
                    ? "Cada asesor está entrenado con un protocolo propio de su especialidad: analiza su caso con la profundidad de un técnico senior del área."
                    : "Each advisor is trained with its own specialty protocol: it analyzes your case with the depth of a senior area expert."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {agents.map((agent, i) => (
                  <motion.div
                    key={agent.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                    className={`p-5 rounded-2xl bg-neutral-900/40 border ${agent.border} hover:bg-neutral-900/80 transition-all flex flex-col`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-950/80 flex items-center justify-center border border-neutral-800 shrink-0">
                        {agent.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-white leading-tight">{agent.title}</h3>
                        <p className="text-[11px] font-medium text-neutral-400 truncate">{agent.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-neutral-500 text-xs leading-relaxed flex-grow">{agent.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== PRIVACIDAD ===== */}
          <section id="privacidad" className="px-4 sm:px-6 py-16 md:py-24 scroll-mt-16">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold tracking-wider text-xs uppercase mb-3">
                  <Lock className="w-4 h-4" />
                  {es ? "Privacidad radical" : "Radical privacy"}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  {es ? "Su caso no existe para nadie más" : "Your case exists for no one else"}
                </h2>
                <p className="text-neutral-400 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
                  {es
                    ? "Los asuntos legales son lo más íntimo que existe. Por eso LexIA se diseñó al revés que el resto de plataformas: sin base de datos de consultas. Lo que usted consulta, solo lo sabe usted."
                    : "Legal matters are as private as it gets. That is why LexIA was designed the opposite way to other platforms: with no query database. What you consult, only you know."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                {[
                  {
                    icon: <Database className="w-6 h-6 text-emerald-400" />,
                    title: es ? "Cero historiales" : "Zero histories",
                    desc: es
                      ? "Sus consultas nunca tocan una base de datos. Al cerrar la sesión, se destruyen de forma irreversible."
                      : "Your queries never touch a database. When you close the session they are irreversibly destroyed."
                  },
                  {
                    icon: <FileDown className="w-6 h-6 text-gold-400" />,
                    title: es ? "El PDF es la única copia" : "The PDF is the only copy",
                    desc: es
                      ? "Su dictamen se entrega en un PDF profesional que se genera al finalizar. Si usted no lo descarga, no existirá en ningún sitio."
                      : "Your opinion is delivered as a professional PDF generated on completion. If you don't download it, it will exist nowhere."
                  },
                  {
                    icon: <ShieldCheck className="w-6 h-6 text-sky-400" />,
                    title: es ? "Pagos solo en Stripe" : "Payments only in Stripe",
                    desc: es
                      ? "No vemos ni tocamos su tarjeta: el pago lo procesa Stripe, el mismo proveedor que usan Amazon o Google. Su cuenta solo guarda un email."
                      : "We never see or touch your card: payment is processed by Stripe. Your account holds only an email."
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="p-6 md:p-8 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/15 text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center mx-auto mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <p className="text-center text-xs text-neutral-600 font-semibold uppercase tracking-widest">
                {es ? "Cifrado SSL en tránsito · Sus consultas nunca entrenan modelos de IA" : "SSL encryption in transit · Your queries never train AI models"}
              </p>
            </div>
          </section>

          {/* ===== PRECIOS ===== */}
          <section id="precios" className="px-4 sm:px-6 py-16 md:py-24 bg-[#090F1D] border-y border-white/5 scroll-mt-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 md:mb-16">
                <span className="text-gold-400 font-semibold tracking-wider text-xs uppercase mb-3 block">
                  {es ? "Precios transparentes" : "Transparent pricing"}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {es ? "Pague solo por lo que consulta" : "Pay only for what you consult"}
                </h2>
                <p className="text-neutral-400 max-w-2xl mx-auto text-sm md:text-base">
                  {es
                    ? "Sin suscripciones ni permanencia. Un crédito = una consulta a un especialista. La Directora General: 3 créditos."
                    : "No subscriptions, no lock-in. One credit = one specialist query. Managing Partner: 3 credits."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-4xl mx-auto">
                {plans.map((plan, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative p-6 md:p-8 rounded-3xl border flex flex-col ${
                      plan.popular
                        ? "border-gold-500/40 bg-gradient-to-b from-gold-500/10 to-transparent shadow-[0_0_60px_-20px_rgba(212,175,55,0.35)]"
                        : "border-neutral-800 bg-neutral-900/40"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap">
                        {es ? "Más elegido" : "Most popular"}
                      </div>
                    )}
                    <h3 className="text-base font-bold text-neutral-300 mb-3">{plan.name}</h3>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl md:text-5xl font-black text-white font-display">{plan.price}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-6">
                      {plan.queries} {es ? "consultas" : "queries"} · {plan.perQuery}
                    </p>
                    <ul className="space-y-3 mb-8 text-sm text-neutral-300 flex-grow">
                      {[
                        es ? "14 asesores especialistas" : "14 specialist advisors",
                        es ? "Acceso a la Directora General" : "Managing Partner access",
                        es ? "Dictámenes en PDF incluidos" : "PDF opinions included",
                        es ? "Bóveda de plantillas premium" : "Premium template vault",
                        es ? "560+ casos de referencia" : "560+ reference cases"
                      ].map((f, j) => (
                        <li key={j} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <SignUpButton mode="modal">
                      <button
                        className={`w-full py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                          plan.popular
                            ? "bg-white text-black hover:bg-neutral-200"
                            : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                        }`}
                      >
                        {es ? "Empezar ahora" : "Start now"}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </SignUpButton>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== FAQ ===== */}
          <section className="px-4 sm:px-6 py-16 md:py-24">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 text-gold-400 font-semibold tracking-wider text-xs uppercase mb-3">
                  <HelpCircle className="w-4 h-4" />
                  FAQ
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {es ? "Preguntas frecuentes" : "Frequently asked questions"}
                </h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-2xl bg-neutral-900/40 border border-neutral-800 open:border-gold-500/30 transition-colors"
                  >
                    <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none text-white font-semibold text-sm md:text-base">
                      {faq.q}
                      <ChevronRight className="w-4 h-4 text-neutral-500 group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <p className="px-5 pb-5 text-neutral-400 text-sm leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* ===== CTA FINAL ===== */}
          <section className="px-4 sm:px-6 py-20 md:py-32 bg-[#04070E] relative overflow-hidden text-center border-t border-white/5">
            <div className="absolute inset-0 bg-gold-500/[0.04] blur-[120px] rounded-full -z-10 translate-y-1/2" />
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              >
                {es ? "Su primer dictamen," : "Your first opinion,"}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-600">
                  {es ? "a un minuto de distancia" : "one minute away"}
                </span>
              </motion.h2>
              <p className="text-base md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                {es
                  ? "Regístrese con su email, elija su asesor y plantee su caso. Sin esperas, sin citas, sin dejar rastro."
                  : "Sign up with your email, pick your advisor and present your case. No waiting, no appointments, no trace."}
              </p>
              <SignUpButton mode="modal">
                <button className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-black font-black text-lg md:text-xl hover:scale-[1.03] transition-all shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                  {es ? "Abrir mi expediente" : "Open my case file"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </SignUpButton>
              <p className="mt-6 text-neutral-600 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">
                {es ? "Sin suscripciones · Sin esperas · Precisión de élite" : "No subscriptions · No waiting · Elite precision"}
              </p>
            </div>
          </section>
        </>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="px-4 sm:px-6 py-16 md:py-20 border-t border-white/5 bg-[#04070E]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-14">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-5">
                <Image src="/logo.png" alt="LexIA" width={36} height={36} className="rounded-xl" />
                <span className="text-2xl font-black text-white tracking-tighter">Lex<span className="text-gold-500">IA</span></span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed italic">
                &quot;{t("footer.quote")}&quot;
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:gap-14 text-sm">
              <div>
                <h4 className="text-white font-bold mb-4">{t("footer.platform")}</h4>
                <ul className="space-y-3 text-neutral-500">
                  {isSignedIn ? (
                    <>
                      <li><Link href="/chat/asesor-direccion" className="hover:text-gold-400 transition-colors">{t("footer.reception")}</Link></li>
                      <li><Link href="/guia" className="hover:text-gold-400 transition-colors">{t("footer.guide")}</Link></li>
                      <li><Link href="/comprar" className="hover:text-gold-400 transition-colors">{t("footer.plans")}</Link></li>
                    </>
                  ) : (
                    <>
                      <li>
                        <SignInButton mode="modal">
                          <button className="hover:text-gold-400 transition-colors">{t("nav.login")}</button>
                        </SignInButton>
                      </li>
                      <li>
                        <SignUpButton mode="modal">
                          <button className="hover:text-gold-400 transition-colors">{t("hero.btn.register")}</button>
                        </SignUpButton>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">{t("footer.legal")}</h4>
                <ul className="space-y-3 text-neutral-500">
                  <li>
                    <Link href="/legal" className="hover:text-neutral-300 transition-colors flex items-center gap-2">
                      <Scale className="w-3.5 h-3.5" /> {t("footer.terms")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal" className="hover:text-neutral-300 transition-colors flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5" /> {t("footer.privacy")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal" className="hover:text-neutral-300 transition-colors flex items-center gap-2">
                      <Cookie className="w-3.5 h-3.5" /> {t("footer.cookies")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-8">
            <p className="text-[10px] text-neutral-700 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-5xl text-center">
              {t("footer.warn")}
            </p>
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
              <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} {t("footer.rights")}</p>
              <p className="text-neutral-600 text-[10px] flex items-center gap-2 uppercase tracking-widest font-bold">
                {t("footer.powered")} <span className="text-white">OpenAI GPT-5.6</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
