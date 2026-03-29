"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, ShieldCheck, Zap, CreditCard, Lock, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { UserMenu } from "@/components/user-menu";
import { UserButton, useUser } from "@clerk/nextjs";

export default function ComprarPage() {
    const { t, language } = useLanguage();
    const { user } = useUser();

    const [loadingPackId, setLoadingPackId] = useState<string | null>(null);
    const [redeemCode, setRedeemCode] = useState("");
    const [isRedeeming, setIsRedeeming] = useState(false);

    const packs = [
        {
            id: "pack-25",
            title: t("plan.25.title"),
            queries: 25,
            price: "6,90€",
            feat: [t("plan.25.feat1"), t("plan.25.feat2"), t("plan.25.feat3")],
            color: "from-blue-600/20 via-blue-500/10 to-transparent",
            border: "border-blue-500/20",
            badge: t("plan.25.badge")
        },
        {
            id: "pack-50",
            title: t("plan.50.title"),
            queries: 50,
            price: "11,90€",
            feat: [t("plan.50.feat1"), t("plan.50.feat2"), t("plan.50.feat3")],
            color: "from-indigo-600/20 via-indigo-500/10 to-transparent",
            border: "border-indigo-500/30",
            badge: t("plan.50.badge")
        },
        {
            id: "pack-100",
            title: t("plan.100.title"),
            queries: 100,
            price: "19,90€",
            feat: [t("plan.100.feat1"), t("plan.100.feat2"), t("plan.100.feat3")],
            color: "from-purple-600/20 via-purple-500/10 to-transparent",
            border: "border-purple-500/40",
            badge: t("plan.100.badge")
        }
    ];

    const handlePurchase = async (id: string) => {
        try {
            setLoadingPackId(id);
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: id })
            });

            const data = await response.json();
            
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(t("nav.redeem.error") + " (Gateway)");
            }
        } catch (error) {
            console.error(error);
            alert(t("nav.redeem.conn_error"));
        } finally {
            setLoadingPackId(null);
        }
    };

    const handleRedeem = async () => {
        if (!redeemCode.trim()) return;
        try {
            setIsRedeeming(true);
            const res = await fetch("/api/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: redeemCode.trim() })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                alert(t("nav.redeem.success").replace("{added}", data.added));
                window.location.reload();
            } else {
                alert(t("nav.redeem.error") + (data.error || t("nav.redeem.invalid")));
            }
        } catch (error) {
            alert(t("nav.redeem.conn_error"));
        } finally {
            setIsRedeeming(null as any); // Reset to false
            setIsRedeeming(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-600/30">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-neutral-900 transition-all text-neutral-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xl tracking-tight">Lex<span className="text-blue-500">IA</span></span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="hidden md:flex flex-col items-end text-[10px] uppercase tracking-widest text-neutral-500 font-bold mr-4">
                        <span>{t("buy.current_balance")}</span>
                        <span className="text-blue-400">{String(user?.publicMetadata?.credits || 0)} {t("buy.queries_suffix")}</span>
                    </div>
                    <UserButton />
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-20 relative">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6 border border-blue-500/20"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Transacción Blindada SSL
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-100 to-neutral-400"
                    >
                        {t("buy.title").split(',').map((part, i) => (
                             <span key={i}>{part}{i === 0 && <br/>}</span>
                        ))}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10"
                    >
                        {t("buy.desc")}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {packs.map((pack, idx) => (
                        <motion.div
                            key={pack.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-8 rounded-[2.5rem] bg-neutral-900/60 border ${pack.border} backdrop-blur-md relative overflow-hidden group hover:bg-neutral-800/60 transition-all flex flex-col`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${pack.color} opacity-30 -z-10`} />
                            
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-neutral-400 text-xs font-black uppercase tracking-widest mb-2">{pack.title}</h3>
                                    <h4 className="text-4xl font-black text-white">{pack.queries} <span className="text-sm font-medium opacity-50 uppercase tracking-tighter">{t("buy.queries_suffix")}</span></h4>
                                </div>
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                                    <Zap className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 flex-grow">
                                {pack.feat.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 text-neutral-300 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto">
                                <div className="mb-6 flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-white">{pack.price}</span>
                                    <span className="text-neutral-500 text-xs font-bold line-through">
                                        {(parseFloat(pack.price) * 1.5).toFixed(2)}€
                                    </span>
                                </div>
                                <button 
                                    onClick={() => handlePurchase(pack.id)}
                                    disabled={loadingPackId !== null}
                                    className={`w-full py-5 rounded-2xl font-black text-center flex items-center justify-center gap-3 transition-all hover:scale-[1.03] shadow-xl group ${loadingPackId === pack.id ? 'bg-neutral-800 text-neutral-500' : 'bg-white text-black hover:bg-neutral-200'}`}
                                >
                                    {loadingPackId === pack.id ? (
                                        <div className="flex items-center gap-2 animate-pulse">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span>{t("buy.processing")}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            {t("buy.btn.buy")}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Activation Code Section */}
                <div className="max-w-2xl mx-auto p-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl mb-32">
                    <div className="bg-neutral-950 p-8 rounded-[1.4rem] text-center">
                        <h3 className="text-xl font-bold mb-2">{t("buy.redeem.title")}</h3>
                        <p className="text-neutral-500 text-sm mb-6">{t("buy.redeem.desc")}</p>
                        <div className="flex gap-2 max-w-md mx-auto">
                            <input 
                                type="text" 
                                value={redeemCode}
                                onChange={(e) => setRedeemCode(e.target.value)}
                                placeholder={t("buy.redeem.placeholder")}
                                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                            <button 
                                onClick={handleRedeem}
                                disabled={isRedeeming || !redeemCode.trim()}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-neutral-800 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                            >
                                {isRedeeming && <Loader2 className="w-4 h-4 animate-spin" />}
                                {t("buy.redeem.btn")}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trust Footer */}
                <div className="mt-32 p-12 rounded-[3.5rem] bg-neutral-900/30 border border-white/5 text-center flex flex-col items-center">
                    <Lock className="w-12 h-12 text-emerald-500 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                    <h3 className="text-2xl font-bold mb-4">{t("buy.security.title")}</h3>
                    <p className="text-neutral-500 max-w-2xl mx-auto mb-10 text-sm leading-relaxed italic">
                        &quot;{t("buy.security.desc")}&quot;
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                        <img src="https://static-00.iconduck.com/assets.00/stripe-icon-512x212-92167d4r.png" alt="Stripe" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" className="h-6" />
                    </div>
                </div>
            </main>
        </div>
    );
}
