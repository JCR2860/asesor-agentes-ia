"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, Info, FileText, Download, X, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AudioBriefingProps {
    language: "es" | "en";
}

export const AudioBriefing: React.FC<AudioBriefingProps> = ({ language }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Load saved time on mount
    React.useEffect(() => {
        const savedTime = localStorage.getItem("lexia_audio_time");
        if (savedTime && audioRef.current) {
            audioRef.current.currentTime = parseFloat(savedTime);
        }
    }, []);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            localStorage.setItem("lexia_audio_time", audioRef.current.currentTime.toString());
        }
    };

    const images = [
        { src: "/assets/marketing/lexia_presentation_cover_1775317526505.png", title: language === "es" ? "Visión Boutique" : "Boutique Vision" },
        { src: "/assets/marketing/lexia_directora_advisor_visual_1775317551352.png", title: language === "es" ? "Dirección Estratégica" : "Strategic Direction" },
        { src: "/assets/marketing/lexia_technology_integration_1775317573661.png", title: language === "es" ? "Tecnología GPT-4o" : "GPT-4o Technology" },
        { src: "/assets/marketing/lexia_privacy_pdf_output_1775317596745.png", title: language === "es" ? "Privacidad Efímera" : "Ephemeral Privacy" }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto my-12 px-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 via-neutral-900/40 to-emerald-500/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-8 group"
            >
                {/* Visual Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/30 transition-colors" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full" />

                {/* Disc/Play Button */}
                <div className="relative shrink-0">
                    <motion.div 
                        animate={isPlaying ? { rotate: 360 } : {}}
                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                        className="w-32 h-32 rounded-full bg-neutral-950 border-4 border-neutral-800 flex items-center justify-center p-1 shadow-2xl"
                    >
                        <div className="w-full h-full rounded-full border border-neutral-700 flex items-center justify-center bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Volume2 className={`w-4 h-4 ${isPlaying ? "text-blue-400 animate-pulse" : "text-neutral-500"}`} />
                            </div>
                        </div>
                    </motion.div>
                    
                    <button 
                        onClick={togglePlay}
                        className="absolute inset-0 m-auto w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-20 group-hover:bg-blue-400 group-hover:text-white"
                    >
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
                    </button>
                    
                    <audio 
                        ref={audioRef} 
                        src={language === 'es' ? "/assets/marketing/lexia_overview.m4a?v=2" : "/assets/marketing/lexia_overview_en.m4a?v=2"} 
                        onEnded={() => {
                            setIsPlaying(false);
                            localStorage.removeItem("lexia_audio_time");
                        }}
                        onTimeUpdate={handleTimeUpdate}
                        className="hidden"
                    />
                </div>

                {/* Content */}
                <div className="flex-grow text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/30">
                            Audio Briefing 2026
                        </span>
                        <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-emerald-500" : "bg-neutral-600"}`} />
                            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">HD Mastering</span>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                        {language === "es" ? "¿Por qué LexIA es la Boutique Legal más avanzada?" : "Why is LexIA the most advanced Legal Boutique?"}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                        {language === "es" 
                            ? "Escucha nuestro briefing estratégico generado por IA sobre cómo protegemos tus activos y optimizamos tu fiscalidad sin dejar rastro digital."
                            : "Listen to our AI-generated strategic briefing on how we protect your assets and optimize your taxes without leaving a digital footprint."}
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <button 
                            onClick={() => setShowVideoModal(true)}
                            className="flex items-center gap-2 text-xs font-bold text-white hover:text-purple-400 transition-colors uppercase tracking-widest"
                        >
                            <Video className="w-4 h-4" />
                            {language === "es" ? "Ver Vídeo Promocional" : "Watch Promo Video"}
                        </button>
                        <div className="w-1 h-1 rounded-full bg-neutral-700" />
                        <button 
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 text-xs font-bold text-white hover:text-blue-400 transition-colors uppercase tracking-widest"
                        >
                            <Info className="w-4 h-4" />
                            {language === "es" ? "Ver Presentación" : "View Slides"}
                        </button>
                        <div className="w-1 h-1 rounded-full bg-neutral-700" />
                        <a 
                            href={language === 'es' ? "/assets/marketing/lexia_presentation.pdf" : "/assets/marketing/lexia_presentation_en.pdf"} 
                            target="_blank"
                            className="flex items-center gap-2 text-xs font-bold text-white hover:text-emerald-400 transition-colors uppercase tracking-widest"
                        >
                            <Download className="w-4 h-4" />
                            {language === "es" ? "Dossier PDF" : "PDF Dossier"}
                        </a>
                    </div>
                </div>
            </motion.div>

            {/* Presentation Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-5xl bg-neutral-900/50 border border-neutral-800 rounded-[2rem] overflow-hidden shadow-2xl"
                        >
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-50 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="grid md:grid-cols-2 gap-4 p-4 md:p-8">
                                {images.map((img, i) => (
                                    <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden border border-white/5">
                                        <img src={img.src} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
                                                <span className="text-lg font-bold text-white">{img.title}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 border-t border-white/5 flex items-center justify-between bg-black/40">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-white text-sm">LexIA Elite Architecture 2026</span>
                                        <span className="text-xs text-neutral-500 uppercase tracking-widest">Documento Estratégico Oficial</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 bg-neutral-800 text-neutral-300 font-bold text-xs rounded-xl hover:bg-neutral-700 transition-all uppercase tracking-widest"
                                    >
                                        {language === "es" ? "Volver al Inicio" : "Back to Home"}
                                    </button>
                                    <a 
                                        href={language === 'es' ? "/assets/marketing/lexia_presentation.pdf" : "/assets/marketing/lexia_presentation_en.pdf"} 
                                        download
                                        className="px-6 py-3 bg-white text-black font-black text-xs rounded-xl hover:bg-blue-400 hover:text-white transition-all uppercase tracking-widest shadow-xl"
                                    >
                                        {language === "es" ? "Descargar FULL PDF" : "Download FULL PDF"}
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Video Modal */}
            <AnimatePresence>
                {showVideoModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-[2rem] overflow-hidden shadow-2xl"
                        >
                            <button 
                                onClick={() => setShowVideoModal(false)}
                                className="absolute top-6 right-6 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white z-50 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="aspect-video w-full">
                                <video 
                                    src="/assets/marketing/lexia_promo.mp4" 
                                    controls 
                                    autoPlay 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
