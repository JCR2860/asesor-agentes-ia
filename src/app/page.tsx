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
  Database,
  Copy,
  ChevronRight,
  UserPlus2,
  LockIcon,
  Volume2,
  VolumeX,
  Mic,
  HelpCircle,
  BookOpen,
  Cookie,
  Shield,
  Ship,
  Coins,
  Leaf
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserMenu } from "@/components/user-menu";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useLanguage } from "@/context/LanguageContext";
import { AudioBriefing } from "@/components/AudioBriefing";

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  const { t, language } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    // Zero-Log Security: Wipe all session traces on Home mount
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('lexia_chat_active');
      // Limpiar historiales de chat guardados
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('lexia_chat_store_')) {
          sessionStorage.removeItem(key);
        }
      });
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('lexia_handoff');
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert("La síntesis de voz no está soportada en tu navegador.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const text = language === "en"
        ? "Welcome to Lex I A, your Artificial Intelligence Legal platform. You have a global law firm in your pocket, operated by next generation AI. You can submit your case through our Central Reception, which will audit your files using all our experts simultaneously, or you can go directly to one of our specialists for technical queries. Our mission is to democratize premium tier legal consulting without waiting or limits. Scroll down and choose your consultation mode. We are ready to start."
        : "Bienvenidos a Lex I A, vuestra plataforma de Inteligencia Jurídica. Estás ante un despacho global en tu bolsillo, operado por Inteligencia artificial de última generación. Puedes hacer tus consultas complejas a través de nuestra Recepción Central, que auditará tu caso con todo nuestro panel simultáneamente, o puedes ir directamente a uno de nuestros especialistas si tu duda es muy concisa. Nuestra misión es democratizar la élite de la abogacía sin esperas y sin límites. Desplázate hacia abajo y selecciona tu modalidad de consulta. Estamos listos para comenzar.";

      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = language === "en" ? "en-US" : "es-ES";
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
      icon: <Landmark className="w-6 h-6 text-emerald-400" />,
      color: "from-emerald-900/40 to-emerald-800/20",
      border: "border-emerald-500/30"
    },
    {
      id: 'asesor-extranjeria',
      title: "GlobalVisa",
      subtitle: language === 'es' ? "Movilidad Global y Visados" : "Immigration & Global Mobility",
      description: t("agent.extra.desc"),
      icon: <Globe className="w-6 h-6 text-cyan-400" />,
      color: "from-cyan-900/40 to-cyan-800/20",
      border: "border-cyan-500/30"
    },

    {
      id: "asesor-mercantil",
      title: "CorpLex",
      subtitle: t("agent.merc.sub"),
      description: t("agent.merc.desc"),
      icon: <Briefcase className="w-6 h-6 text-blue-400" />,
      color: "from-blue-900/40 to-blue-800/20",
      border: "border-blue-500/30"
    },
    {
      id: "asesor-laboral",
      title: "Laboris",
      subtitle: t("agent.lab.sub"),
      description: t("agent.lab.desc"),
      icon: <Users className="w-6 h-6 text-orange-400" />,
      color: "from-orange-900/40 to-orange-800/20",
      border: "border-orange-500/30"
    },
    {
      id: "asesor-penal",
      title: "PenalShield",
      subtitle: t("agent.penal.sub"),
      description: t("agent.penal.desc"),
      icon: <Gavel className="w-6 h-6 text-red-400" />,
      color: "from-red-900/40 to-red-800/20",
      border: "border-red-500/30"
    },
    {
      id: "asesor-aeronautico",
      title: "AeroLex",
      subtitle: t("agent.aero.sub"),
      description: t("agent.aero.desc"),
      icon: <Plane className="w-6 h-6 text-sky-400" />,
      color: "from-sky-900/40 to-sky-800/20",
      border: "border-sky-500/30"
    },
    {
      id: "asesor-civil",
      title: "Civilitas",
      subtitle: t("agent.civil.sub"),
      description: t("agent.civil.desc"),
      icon: <Building className="w-6 h-6 text-indigo-400" />,
      color: "from-indigo-900/40 to-indigo-800/20",
      border: "border-indigo-500/30"
    },
    {
      id: "asesor-pi",
      title: "IPGuard",
      subtitle: t("agent.pi.sub"),
      description: t("agent.pi.desc"),
      icon: <Lightbulb className="w-6 h-6 text-yellow-400" />,
      color: "from-yellow-900/40 to-yellow-800/20",
      border: "border-yellow-500/30"
    },
    {
      id: "asesor-inmobiliario",
      title: "EstateLex",
      subtitle: t("agent.inmo.sub"),
      description: t("agent.inmo.desc"),
      icon: <HomeIcon className="w-6 h-6 text-purple-400" />,
      color: "from-purple-900/40 to-purple-800/20",
      border: "border-purple-500/30"
    },
    {
      id: "asesor-cripto",
      title: "CryptoLex",
      subtitle: t("agent.cripto.sub"),
      description: t("agent.cripto.desc"),
      icon: <Bitcoin className="w-6 h-6 text-amber-400" />,
      color: "from-amber-900/40 to-amber-800/20",
      border: "border-amber-500/30"
    },
    {
      id: "asesor-ciberseguridad",
      title: "CyberLex",
      subtitle: t("agent.ciber.sub"),
      description: t("agent.ciber.desc"),
      icon: <Shield className="w-6 h-6 text-teal-400" />,
      color: "from-teal-900/40 to-teal-800/20",
      border: "border-teal-500/30"
    },
    {
      id: "asesor-comercio",
      title: "TradeLex",
      subtitle: t("agent.comercio.sub"),
      description: t("agent.comercio.desc"),
      icon: <Ship className="w-6 h-6 text-fuchsia-400" />,
      color: "from-fuchsia-900/40 to-fuchsia-800/20",
      border: "border-fuchsia-500/30"
    },
    {
      id: "asesor-subvenciones",
      title: "GrantLex",
      subtitle: t("agent.subvenciones.sub"),
      description: t("agent.subvenciones.desc"),
      icon: <Coins className="w-6 h-6 text-lime-400" />,
      color: "from-lime-900/40 to-lime-800/20",
      border: "border-lime-500/30"
    },
    {
      id: "asesor-medioambiente",
      title: "EcoLex",
      subtitle: t("agent.medioambiente.sub"),
      description: t("agent.medioambiente.desc"),
      icon: <Leaf className="w-6 h-6 text-green-400" />,
      color: "from-green-900/40 to-green-800/20",
      border: "border-green-500/30"
    }
  ];

  const steps = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
      title: t("how.step1.title"),
      desc: t("how.step1.desc")
    },
    {
      icon: <Mic className="w-8 h-8 text-rose-400" />,
      title: language === 'es' ? "Consultas por Voz" : "Voice Consultations",
      desc: language === 'es' ? "Habla directamente con la Directora General pulsando el icono 🎤. Rapidez absoluta sin teclado." : "Speak directly to the Managing Partner by pressing 🎤. Absolute speed without a keyboard."
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-amber-400" />,
      title: language === 'es' ? "Biblioteca de Casos" : "Case Library",
      desc: language === 'es' ? "Acceda a más de 560 escenarios legales complejos para encontrar la solución que mejor se adapte a su situación." : "Access over 560 complex legal scenarios to find the solution that best fits your situation."
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
          {isSignedIn && (
            <Link href="/manual" className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] md:text-xs font-bold hover:bg-white/10 transition-colors uppercase tracking-widest text-neutral-300">
               <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
               <span className="hidden leading-none sm:inline">{language === 'es' ? 'Manual Usuario' : 'User Manual'}</span>
               <span className="leading-none sm:hidden">Manual</span>
            </Link>
          )}
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
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.6)] border border-white/20">
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

          {/* Strategic Audio Briefing Section - INTEGRATED */}
          <div className="w-full mb-8">
            <AudioBriefing language={language} />
          </div>

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
            <span className="text-sm font-bold text-white flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              OpenAI GPT-5.5
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <p className="text-xl md:text-2xl text-white font-bold mb-6">
              {language === 'es' ? 'El ecosistema legal definitivo:' : 'The ultimate legal ecosystem:'}
            </p>
            <div className="flex flex-col gap-3 items-center md:items-center">
                {[
                  { es: '14 Asesores IA especializados', en: '14 specialized AI Advisors' },
                  { es: 'Bóveda de plantillas legales premium', en: 'Premium legal template Vault' },
                  { es: '560+ Consultas de Referencia', en: '560+ Reference Queries' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-neutral-400 text-lg md:text-xl font-light bg-white/5 border border-white/10 px-6 py-2 rounded-2xl w-full sm:w-auto hover:bg-white/10 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>{language === 'es' ? item.es : item.en}</span>
                  </div>
                ))}
            </div>
            <p className="text-lg md:text-xl text-neutral-500 mt-8 font-medium">
              {language === 'es' ? 'Todo en un solo lugar, disponible 24/7 sin esperas.' : 'All in one place, available 24/7 without waiting.'}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mb-8 flex justify-center w-full"
          >
            <button
              onClick={toggleAudio}
              className={`flex items-center justify-center gap-3 px-6 py-2.5 rounded-full border transition-all shadow-xl group ${
                isPlayingAudio 
                  ? "bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20" 
                  : "bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-5 h-5 animate-pulse" />
                  <span className="font-semibold text-sm tracking-wide">
                    {language === "en" ? "Stop Audio Presentation" : "Detener Presentación en Audio"}
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-sm tracking-wide">
                    {language === "en" ? "Listen to Audio Presentation" : "Escuchar Presentación en Audio"}
                  </span>
                </>
              )}
            </button>
          </motion.div>
          
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
            className="flex flex-col items-center justify-center gap-6"
          >
            <div className="flex flex-col items-center justify-center gap-6">
              {!isSignedIn ? (
                <>
                  <SignUpButton mode="modal">
                    <button 
                      className="w-full sm:w-auto px-12 py-6 rounded-3xl bg-white text-black font-black text-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 group shadow-[0_0_60px_-10px_rgba(255,255,255,0.4)] hover:scale-[1.02]"
                    >
                      <UserPlus2 className="w-7 h-7 text-blue-600" />
                      {t("hero.btn.register")}
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button 
                      className="text-neutral-500 hover:text-white font-bold transition-colors flex items-center gap-2"
                    >
                      {t("hero.btn.access")}
                    </button>
                  </SignInButton>
                </>
              ) : null}

              {/* Info acceso */}
              {!isSignedIn && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 max-w-sm mx-auto text-center leading-relaxed">
                  <span className="shrink-0">⚠️</span>
                  <span>
                    <strong className="text-white">{language === 'es' ? 'Recuerda anotar tu contraseña.' : 'Remember your password.'}</strong> {language === 'es' ? 'Si la olvidas, podrás recuperarla por correo desde la pantalla de acceso.' : 'If you forget it, you can recover it via email from the login screen.'}
                  </span>
                </div>
              )}

              {isSignedIn && (
                <>
                  <div className="w-full max-w-4xl mx-auto mb-10 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 backdrop-blur-md text-center">
                      <div className="flex items-center justify-center gap-3 mb-3 text-blue-400 font-bold text-xs uppercase tracking-[0.2em]">
                          <Sparkles className="w-4 h-4" />
                          {language === 'es' ? 'Potencia de Inteligencia' : 'Intelligence Power'}
                      </div>
                      <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl mx-auto">
                          {language === 'es' 
                              ? "Nuestros Asesores Especialistas ofrecen respuestas técnicas precisas y rápidas. Para casos complejos, la Directora General utiliza GPT-5.5 Neural Engine con búsqueda avanzada para una profundidad jurídica extrema."
                              : "Our Specialist Advisors offer precise and rapid technical answers. For complex cases, the Managing Partner uses GPT-5.5 Neural Engine with advanced search for extreme legal depth."}
                      </p>
                  </div>

                  <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 w-full max-w-4xl mx-auto">
                    <Link
                      href="/chat/asesor-direccion"
                      className="flex-1 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 hover:border-blue-400 hover:bg-blue-900/50 transition-all flex flex-col items-center text-center gap-3 group shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.4)]"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Sparkles className="w-7 h-7 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{t("hero.c.mod_a.title")}</h3>
                        <p className="text-sm text-blue-200/70 mb-6 px-4">{t("hero.c.mod_a.desc")}</p>
                      </div>
                      <span className="mt-auto px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold opacity-90 group-hover:opacity-100 flex items-center gap-2 group-hover:translate-x-1 transition-all">
                         {t("hero.c.mod_a.btn")} <ArrowRight className="w-5 h-5" />
                      </span>
                    </Link>

                    <Link
                      href="/documentos"
                      className="flex-1 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-900/50 transition-all flex flex-col items-center text-center gap-3 group shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.4)] relative"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-7 h-7 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-200 transition-colors">{t("hero.c.docs.title")}</h3>
                        <p className="text-sm text-emerald-200/70 mb-6 px-4">{t("hero.c.docs.desc")}</p>
                      </div>
                      <span className="mt-auto px-8 py-3 rounded-2xl bg-emerald-600 text-white font-bold opacity-90 group-hover:opacity-100 flex items-center gap-2 group-hover:translate-x-1 transition-all">
                         {t("hero.c.docs.btn")} <ArrowRight className="w-5 h-5" />
                      </span>
                    </Link>

                    <Link
                      href="/guia"
                      className="flex-1 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/50 transition-all flex flex-col items-center text-center gap-3 group shadow-[0_0_30px_-5px_rgba(168,85,247,0.2)] hover:shadow-[0_0_40px_-5px_rgba(168,85,247,0.4)] relative"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="w-7 h-7 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">{t("hero.c.mod_b.title")}</h3>
                        <p className="text-sm text-purple-200/70 mb-6 px-4">{t("hero.c.mod_b.desc")}</p>
                      </div>
                      <span className="mt-auto px-8 py-3 rounded-2xl bg-purple-600 text-white font-bold opacity-90 group-hover:opacity-100 flex items-center gap-2 group-hover:translate-x-1 transition-all">
                         {t("hero.c.mod_b.btn")} <ArrowRight className="w-5 h-5" />
                      </span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {isSignedIn && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-4 mt-4"
              >
                <p className="text-neutral-500 text-sm font-medium">{t("hero.member_resource")}</p>
                <Link 
                  href="/guia"
                  className="group flex items-center gap-4 px-8 py-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Copy className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-base font-bold text-blue-300 group-hover:text-blue-200">{t("hero.guide_title")}</span>
                    <span className="block text-xs text-neutral-500 uppercase tracking-tighter">{t("hero.guide_desc_cta")}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-blue-400 transition-colors" />
                </Link>
              </motion.div>
            )}
          </motion.div>

          {isSignedIn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6"
            >
              <Link 
                href="/manual"
                className="group flex flex-col md:flex-row items-center gap-6 text-sm text-neutral-400 bg-neutral-900/60 backdrop-blur-md p-5 rounded-3xl border border-neutral-800/80 shadow-2xl hover:bg-neutral-800 transition-all border-blue-500/20"
              >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="text-left leading-tight">
                      <span className="block font-black text-white text-base">
                          {language === 'es' ? 'Manual de Usuario' : 'User Manual'}
                      </span>
                      <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                          {language === 'es' ? 'Aprender a Consultar' : 'Learn How to Query'}
                      </span>
                    </div>
                </div>
                <ArrowRight className="hidden md:block w-5 h-5 text-neutral-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          )}

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

          {/* New Privacy Assurance Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-8 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 max-w-2xl text-center backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-3 mb-2 text-emerald-400 font-bold text-sm uppercase tracking-widest">
              <LockIcon className="w-4 h-4" />
              {language === 'es' ? "Política de Privacidad Efímera" : "Ephemeral Privacy Policy"}
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {language === 'es' 
                ? "En LexIA no almacenamos ningún historial de tus consultas. Una vez cierras la sesión, la información se borra permanentemente. Por ello, es imperativo que descargues tu consulta en PDF; solo tú tendrás acceso a la información estratégica generada."
                : "At LexIA we do not store any history of your queries. Once you close the session, the information is permanently deleted. Therefore, it is imperative that you download your query as a PDF; only you will have access to the strategic information generated."}
            </p>
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
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto whitespace-pre-line mb-10">
              {t("agents.desc")}
            </p>

            {/* Difference Note */}
            <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 mb-16 text-center">
                <p className="text-xs text-neutral-500 leading-relaxed italic">
                    {language === 'es' 
                        ? "Nota: Los asesores especialistas operan bajo modelos de alta precisión técnica (1 crédito/msg). Si su consulta requiere una auditoría profunda, jurisprudencia reciente o búsquedas web exhaustivas, le recomendamos acudir a la Directora General (3 créditos/msg), impulsada por GPT-5.5 Neural Engine."
                        : "Note: Specialist advisors operate under high-precision technical models (1 credit/msg). If your query requires a deep audit, recent case law, or exhaustive web searches, we recommend going to the Managing Partner (3 credits/msg), powered by GPT-5.5 Neural Engine."}
                </p>
            </div>
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

                  <div className="mt-auto">
                    {isSignedIn ? (
                      <Link href={`/guia?agent=${agent.id}`} className="flex items-center justify-center w-full py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-bold transition-all border border-blue-500/30 gap-2">
                        {language === 'es' ? 'ANALIZAR CASO CON GUÍA' : 'ANALYZE CASE WITH GUIDE'} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <div className="text-[10px] text-center text-neutral-600 font-bold uppercase tracking-widest pt-2">
                        {language === 'es' ? 'Regístrate para consultar' : 'Register to consult'}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide / Manual Section */}
      <section className="px-6 py-24 bg-neutral-950/50 border-t border-neutral-800/50 relative overflow-hidden">
        {/* Decorative backgrounds */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-900/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Pro Tips
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t("guide.title")}</h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">{t("guide.desc")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="w-6 h-6 text-blue-400" />,
                title: t("guide.step1.title"),
                desc: t("guide.step1.desc"),
                border: "border-blue-500/20"
              },
              {
                icon: <FileText className="w-6 h-6 text-purple-400" />,
                title: t("guide.step2.title"),
                desc: t("guide.step2.desc"),
                border: "border-purple-500/20"
              },
              {
                icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
                title: t("guide.step3.title"),
                desc: t("guide.step3.desc"),
                border: "border-emerald-500/20"
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`bg-neutral-900/60 p-8 rounded-3xl border ${step.border} relative overflow-hidden group hover:bg-neutral-800/60 transition-colors`}
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-950 flex items-center justify-center mb-6 shadow-inner border border-neutral-800">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-neutral-400 leading-relaxed text-sm mb-6">{step.desc}</p>
                {i === 2 && isSignedIn && (
                  <Link 
                    href="/guia"
                    className="mt-auto px-6 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-bold transition-all border border-blue-500/30 flex items-center justify-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {t("guide.nav")}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-8 rounded-3xl bg-neutral-900/60 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-neutral-800/60 transition-colors"
          >
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                {t("guide.page.title")}
              </h3>
              <p className="text-neutral-400">
                {t("guide.page.subtitle")}
              </p>
            </div>
            {isSignedIn ? (
              <Link 
                href="/guia"
                className="px-8 py-4 rounded-2xl bg-white text-black font-bold hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center gap-2 group"
              >
                {t("guide.nav")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className="px-8 py-4 rounded-2xl bg-white text-black font-bold hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center gap-2 group">
                  {t("guide.nav")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignInButton>
            )}
          </motion.div>
        </div>
      </section>

      {/* Final Call to Action / Pricing Section */}
      <section id="precios" className="px-6 py-32 bg-gradient-to-b from-neutral-900/0 to-neutral-950 border-t border-neutral-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              {language === 'es' ? 'Planes de Acceso Profesional' : 'Professional Access Plans'}
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              {language === 'es' 
                ? 'Selecciona el pack de consultas que mejor se adapte a tus necesidades legales. Sin suscripciones mensuales, paga solo por lo que usas.'
                : 'Select the query pack that best fits your legal needs. No monthly subscriptions, pay only for what you use.'}
            </p>
          </div>

          {!isSignedIn ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  name: language === 'es' ? 'Pack Iniciación' : 'Starter Pack',
                  price: '9,50€',
                  queries: '25',
                  color: 'border-blue-500/20',
                  bg: 'bg-blue-500/5'
                },
                { 
                  name: language === 'es' ? 'Pack Profesional' : 'Professional Pack',
                  price: '16,50€',
                  queries: '50',
                  color: 'border-indigo-500/40 shadow-[0_0_40px_rgba(79,70,229,0.1)]',
                  bg: 'bg-indigo-500/10',
                  popular: true
                },
                { 
                  name: language === 'es' ? 'Pack Élite' : 'Elite Pack',
                  price: '29,50€',
                  queries: '100',
                  color: 'border-purple-500/20',
                  bg: 'bg-purple-500/5'
                }
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative p-8 rounded-3xl border ${plan.color} ${plan.bg} backdrop-blur-sm flex flex-col items-center text-center group hover:scale-[1.02] transition-all`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                      {language === 'es' ? 'Más Recomendado' : 'Most Recommended'}
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-neutral-300 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black text-white">{plan.price}</span>
                  </div>

                  <div className="w-full h-px bg-white/10 mb-8" />

                  <ul className="space-y-4 mb-10 w-full text-left">
                    <li className="flex items-center gap-3 text-sm text-neutral-300">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span><strong>{plan.queries} {language === 'es' ? 'Consultas' : 'Queries'}</strong> {language === 'es' ? 'disponibles' : 'available'}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-neutral-300">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span><strong>14 {language === 'es' ? 'Asesores Especialistas' : 'Specialized Advisors'}</strong></span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-neutral-300">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span><strong>{language === 'es' ? 'Directora General' : 'Managing Partner'}</strong> (GPT-5.5)</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-neutral-300">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span><strong>560+ {language === 'es' ? 'Ejemplos de éxito' : 'Success examples'}</strong></span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-neutral-300">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span><strong>{language === 'es' ? 'Bóveda de Plantillas' : 'Template Vault'}</strong> Premium</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-neutral-300">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span><strong>{language === 'es' ? 'Dictámenes en PDF' : 'PDF Reports'}</strong> {language === 'es' ? 'incluidos' : 'included'}</span>
                    </li>
                  </ul>

                  <SignUpButton mode="modal">
                    <button className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-neutral-200 transition-all shadow-xl group flex items-center justify-center gap-2">
                      {t("hero.btn.register")}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </SignUpButton>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Authenticated view (Keep it simple or link to Comprar) */
            <div className="max-w-3xl mx-auto p-12 rounded-3xl bg-neutral-900/60 border border-neutral-800 text-center backdrop-blur-xl">
               <h3 className="text-3xl font-bold mb-4">{t("pricing.user.dashboard")}</h3>
               <p className="text-neutral-400 mb-10">{t("pricing.box2.desc")}</p>
               <Link
                  href="/comprar"
                  className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xl hover:scale-[1.02] transition-all shadow-2xl"
                >
                  <Sparkles className="w-6 h-6" />
                  {t("pricing.user.manage")}
                </Link>
            </div>
          )}

          <div className="mt-20 text-center">
             <p className="text-xs text-neutral-600 font-bold uppercase tracking-widest">
               {t("how.cta.security")}
             </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action / Urgency */}
      <section className="px-6 py-32 bg-[#050505] relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full -z-10 translate-y-1/2" />
        
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight"
          >
            {t("how.cta.h2_1")} <br/> <span className="text-blue-500 text-shadow-glow">{t("how.cta.h2_2")}</span>
          </motion.h2>
          <p className="text-lg md:text-2xl text-neutral-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
            {t("home.cta.title")}
          </p>
          
          {isSignedIn && (
            <Link 
              href="/recepcion"
              className="inline-flex items-center gap-3 px-12 py-6 rounded-full bg-white text-black font-extrabold text-2xl hover:scale-105 transition-all shadow-[0_0_60px_rgba(255,255,255,0.2)]"
            >
              {t("home.cta.btn.recepcion")}
              <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
            </Link>
          )}
          
          <p className="mt-8 text-neutral-600 font-bold uppercase tracking-[0.2em] text-xs">
            {t("home.cta.sub")}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 border-t border-neutral-900 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-6">
                <Image src="/logo.png" alt="LexIA" width={40} height={40} className="rounded-xl shadow-lg" />
                <span className="text-2xl font-black text-white tracking-tighter">Lex<span className="text-blue-500">IA</span></span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed italic">
                &quot;{t("footer.quote")}&quot;
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
              <div>
                <h4 className="text-white font-bold mb-4">{t("footer.platform")}</h4>
                <ul className="space-y-4 text-neutral-500">
                  {isSignedIn ? (
                    <>
                      <li>
                        <Link href="/chat/asesor-direccion" className="hover:text-blue-400 transition-all flex items-center gap-2 group">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/0 group-hover:bg-blue-500 transition-all" />
                          {t("footer.reception")}
                        </Link>
                      </li>
                      <li>
                        <Link href="/guia" className="hover:text-blue-400 transition-all flex items-center gap-2 group">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/0 group-hover:bg-blue-500 transition-all" />
                          {t("footer.guide")}
                        </Link>
                      </li>
                      <li>
                        <Link href="/comprar" className="hover:text-blue-400 transition-all flex items-center gap-2 group">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/0 group-hover:bg-blue-500 transition-all" />
                          {t("footer.plans")}
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <SignInButton mode="modal">
                          <button className="hover:text-blue-400 transition-all flex items-center gap-2 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/0 group-hover:bg-blue-500 transition-all" />
                            {t("nav.login")}
                          </button>
                        </SignInButton>
                      </li>
                      <li>
                        <SignUpButton mode="modal">
                          <button className="hover:text-blue-400 transition-all flex items-center gap-2 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/0 group-hover:bg-blue-500 transition-all" />
                            {t("hero.btn.register")}
                          </button>
                        </SignUpButton>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">{t("footer.legal")}</h4>
                <ul className="space-y-4 text-neutral-500">
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
          
          <div className="pt-12 border-t border-neutral-900/50 flex flex-col items-center gap-10">
            <p className="text-[10px] text-neutral-700 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-5xl text-center">
              {t("footer.warn")}
            </p>
            
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
               <p className="text-neutral-500 text-sm font-medium tracking-tight">© {new Date().getFullYear()} {t("footer.rights")}</p>
               <div className="flex items-center gap-6">
                 <div className="h-4 w-[1px] bg-neutral-800 hidden md:block" />
                 <p className="text-neutral-600 text-[10px] flex items-center gap-2 uppercase tracking-widest font-bold">
                   {t("footer.powered")} <span className="text-white">OpenAI Neural Engine</span>
                 </p>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
