"use client";

import { SignInButton, UserButton, useUser, useAuth } from "@clerk/nextjs";
import { Sparkles, ShoppingCart, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function UserMenu() {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const { language, setLanguage, t } = useLanguage();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // If publicMetadata is undefined, we assume 2 free credits for new users.
    const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const credits = user?.publicMetadata?.credits !== undefined
        ? Number(user.publicMetadata.credits)
        : 0; // Cambiado a 0 por defecto

    const handleBuyCredits = async (plan: string) => {
        try {
            setIsLoading(plan);
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Error creating checkout session", error);
        } finally {
            setIsLoading(null);
            setShowMenu(false);
        }
    };

    const handleRedeemCode = async () => {
        const code = prompt(t("nav.redeem.prompt"));
        if (!code) return;

        try {
            setIsLoading("redeem");
            const res = await fetch("/api/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
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
            setIsLoading(null);
            setShowMenu(false);
        }
    };

    if (!isLoaded) return <div className="w-24 h-10 animate-pulse bg-neutral-800 rounded-full" />;

    if (!isSignedIn) {
        return (
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setLanguage(language === "es" ? "en" : "es")}
                    className="w-10 h-10 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 flex items-center justify-center text-lg hover:bg-neutral-800 transition-colors shadow-lg"
                    title={language === "es" ? "Switch to English" : "Cambiar a Español"}
                >
                    {language === "es" ? "🇬🇧" : "🇪🇸"}
                </button>
                <SignInButton mode="modal">
                    <button className="px-6 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        {t("nav.login")}
                    </button>
                </SignInButton>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {/* Credit Display & Buy Button */}
            <div className="flex items-center bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-full p-1 pl-4 shadow-lg shrink-0" ref={menuRef}>
                <div className="flex items-center gap-2 mr-3">
                    <Sparkles className={`w-4 h-4 ${isAdmin || credits > 0 ? "text-yellow-400" : "text-neutral-500"}`} />
                    <span className="text-sm font-semibold text-neutral-200">
                        {isAdmin ? "∞" : credits} <span className="hidden sm:inline font-normal text-neutral-400">{t("nav.queries")}</span>
                    </span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        disabled={isLoading !== null}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {t("nav.buy")}
                        <ChevronDown className="w-3 h-3 ml-0.5" />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl p-2 shadow-xl z-50 overflow-hidden">
                            <button
                                onClick={() => handleBuyCredits('pack-25')}
                                disabled={isLoading !== null}
                                className="w-full text-left px-3 py-2.5 hover:bg-neutral-800 text-sm text-neutral-300 flex justify-between items-center transition-colors border-b border-neutral-800/50"
                            >
                                <span>25 {t("nav.queries")}</span>
                                <span className="font-semibold text-white">6.90€</span>
                            </button>
                            <button
                                onClick={() => handleBuyCredits('pack-50')}
                                disabled={isLoading !== null}
                                className="w-full text-left px-3 py-2.5 hover:bg-neutral-800 text-sm text-yellow-400 flex justify-between items-center transition-colors border-b border-neutral-800/50"
                            >
                                <span>50 {t("nav.queries")}</span>
                                <span className="font-semibold text-white">11.90€</span>
                            </button>
                            <button
                                onClick={() => handleBuyCredits('pack-100')}
                                disabled={isLoading !== null}
                                className="w-full text-left px-3 py-2.5 hover:bg-neutral-800 text-sm text-blue-400 flex justify-between items-center transition-colors border-b border-neutral-800/50"
                            >
                                <span>100 {t("nav.queries")}</span>
                                <span className="font-semibold text-white">19.90€</span>
                            </button>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="w-full text-left px-3 py-2.5 bg-neutral-800/30 hover:bg-neutral-800 text-sm text-blue-400 flex justify-between items-center transition-colors border-b border-neutral-800/50"
                                >
                                    <span>{t("nav.admin")}</span>
                                </Link>
                            )}
                            <button
                                onClick={handleRedeemCode}
                                disabled={isLoading !== null}
                                className="w-full text-left px-3 py-2.5 bg-neutral-800/50 hover:bg-neutral-700 text-sm text-emerald-400 flex justify-between items-center transition-colors border-b border-neutral-800/50"
                            >
                                <span>{t("nav.redeem")}</span>
                            </button>
                            <Link
                                href="/guia"
                                onClick={() => setShowMenu(false)}
                                className="w-full text-left px-3 py-2.5 hover:bg-neutral-800 text-sm text-blue-400 flex justify-between items-center transition-colors"
                            >
                                <span>{t("guide.nav")}</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Language Switcher */}
            <button
                onClick={() => setLanguage(language === "es" ? "en" : "es")}
                className="w-10 h-10 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 flex items-center justify-center text-lg hover:bg-neutral-800 transition-colors shadow-lg"
                title={language === "es" ? "Switch to English" : "Cambiar a Español"}
            >
                {language === "es" ? "🇬🇧" : "🇪🇸"}
            </button>

            {/* Clerk Avatar Profile */}
            <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 p-1.5 rounded-full flex items-center justify-center">
                <UserButton />
            </div>
        </div>
    );
}
