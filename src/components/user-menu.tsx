"use client";

import { SignInButton, UserButton, useUser, useAuth } from "@clerk/nextjs";
import { Sparkles, ShoppingCart, ChevronDown, Menu, X, Gift, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export function UserMenu() {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const { language, setLanguage, t } = useLanguage();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // --- REDEEM STATE (inline, no window.prompt) ---
    const [showRedeemPanel, setShowRedeemPanel] = useState(false);
    const [redeemCode, setRedeemCode] = useState("");
    const [redeemStatus, setRedeemStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [redeemMessage, setRedeemMessage] = useState("");
    const redeemInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showRedeemPanel && redeemInputRef.current) {
            setTimeout(() => redeemInputRef.current?.focus(), 100);
        }
    }, [showRedeemPanel]);

    const pathname = usePathname();
    const router = useRouter();

    const handleSafeNav = (href: string) => {
        setShowMobileMenu(false);
        setShowMenu(false);
        router.push(href);
    };

    const handleDirectoraClick = () => {
        const isChatActive = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('lexia_chat_active') === 'true';
        const isCurrentlySpecialist = pathname.includes('/chat/') && !pathname.includes('asesor-direccion');

        if (isCurrentlySpecialist && isChatActive) {
            // Strategic Handoff Mode
            const confirmed = window.confirm(
                language === 'es'
                    ? "✨ ESTRATEGIA: ¿Deseas elevar este dictamen técnico a la Directora General para una auditoría estratégica profunda?"
                    : "✨ STRATEGY: Do you want to elevate this technical report to the Managing Partner for a deep strategic audit?"
            );
            if (confirmed) {
                setShowMobileMenu(false);
                setShowMenu(false);
                router.push('/chat/asesor-direccion?handoff=true');
                return;
            }
        }
        
        // Standard navigation
        handleSafeNav('/chat/asesor-direccion');
    };

    const handleOpenMobileMenu = () => {
        setShowMobileMenu(true);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (showMobileMenu) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [showMobileMenu]);

    const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const credits = user?.publicMetadata?.credits !== undefined
        ? Number(user.publicMetadata.credits)
        : 0;

    const handleBuyCredits = async (plan: string) => {
        try {
            setIsLoading(plan);
            
            const isChatActive = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('lexia_chat_active') === 'true';
            if (isChatActive) {
                const confirmed = window.confirm(
                    language === 'es'
                        ? "⚠️ ATENCIÓN: Tienes un informe activo.\n\nSi procedes al pago ahora, se perderá el chat actual. Te recomendamos DESCARGAR EL PDF antes (en la flecha ← de arriba).\n\n¿Deseas continuar con la compra?"
                        : "⚠️ WARNING: You have an active report.\n\nIf you proceed to checkout now, the current chat will be lost. We recommend DOWNLOADING THE PDF first (using the ← arrow above).\n\nDo you want to continue with the purchase?"
                );
                if (!confirmed) {
                    setIsLoading(null);
                    return;
                }
            }

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
            setShowMobileMenu(false);
        }
    };

    const handleRedeemSubmit = async () => {
        const code = redeemCode.trim().toUpperCase();
        if (!code) return;
        setRedeemStatus("loading");
        setRedeemMessage("");
        try {
            const res = await fetch("/api/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setRedeemStatus("success");
                setRedeemMessage(
                    language === 'es'
                        ? `¡Código canjeado! Se han añadido ${data.added} consultas a tu cuenta.`
                        : `Code redeemed! ${data.added} queries added to your account.`
                );
                setRedeemCode("");
                setTimeout(() => { window.location.reload(); }, 2000);
            } else {
                setRedeemStatus("error");
                setRedeemMessage(data.error || (language === 'es' ? "Código inválido o ya utilizado." : "Invalid or already used code."));
            }
        } catch {
            setRedeemStatus("error");
            setRedeemMessage(language === 'es' ? "Error de conexión. Inténtalo de nuevo." : "Connection error. Please try again.");
        }
    };

    const openRedeemPanel = () => {
        setShowRedeemPanel(true);
        setRedeemStatus("idle");
        setRedeemMessage("");
        setRedeemCode("");
        setShowMenu(false);
    };

    const closeRedeemPanel = () => {
        setShowRedeemPanel(false);
        setRedeemStatus("idle");
        setRedeemMessage("");
        setRedeemCode("");
    };

    if (!isLoaded) return <div className="w-24 h-10 animate-pulse bg-neutral-800 rounded-full" />;

    if (!isSignedIn) {
        return (
            <div className="flex items-center gap-2 sm:gap-3">
                <button
                    onClick={() => setLanguage(language === "es" ? "en" : "es")}
                    className="w-10 h-10 shrink-0 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 flex items-center justify-center text-lg hover:bg-neutral-800 transition-colors shadow-lg"
                    title={language === "es" ? "Switch to English" : "Cambiar a Español"}
                >
                    {language === "es" ? "🇬🇧" : "🇪🇸"}
                </button>
                <SignInButton mode="modal">
                    <button className="px-5 py-2.5 sm:px-6 sm:py-2.5 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] text-sm sm:text-base">
                        {t("nav.login")}
                    </button>
                </SignInButton>
            </div>
        );
    }

    return (
        <>
            {/* -------------------- DESKTOP VIEW -------------------- */}
            <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-full p-1 pl-4 shadow-lg shrink-0" ref={menuRef}>
                    <div className="flex items-center gap-2 mr-3">
                        <Sparkles className={`w-4 h-4 ${isAdmin || credits > 0 ? "text-yellow-400" : "text-neutral-500"}`} />
                        <span className="text-sm font-semibold text-neutral-200">
                            {isAdmin ? "∞" : credits} <span className="font-normal text-neutral-400">{t("nav.queries")}</span>
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
                            <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl p-2 shadow-xl z-50 overflow-hidden">
                                {typeof sessionStorage !== 'undefined' && sessionStorage.getItem('lexia_chat_active') === 'true' && pathname.includes('/chat/') ? (
                                    <div className="p-4 flex flex-col gap-3">
                                        <div className="flex items-center gap-2 font-black text-[10px] text-amber-500 uppercase tracking-widest">
                                            <AlertCircle className="w-4 h-4" />
                                            {language === 'es' ? 'Consulta en curso' : 'Active session'}
                                        </div>
                                        <p className="text-[11px] text-neutral-400 leading-relaxed font-medium">
                                            {language === 'es' 
                                                ? 'Opciones de navegación bloqueadas durante el dictamen. Finalice su sesión (←) para habilitarlas.' 
                                                : 'Navigation options are locked during report generation. End session (←) to enable.'}
                                        </p>
                                        <div className="h-px bg-neutral-800 w-full my-1" />
                                        <button 
                                            onClick={() => setShowMenu(false)}
                                            className="w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold uppercase transition-all"
                                        >
                                            {language === 'es' ? 'Volver al Dictamen' : 'Back to Report'}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button onClick={() => handleBuyCredits('pack-25')} disabled={isLoading !== null} className="w-full text-left px-3 py-2.5 hover:bg-neutral-800 text-sm text-neutral-300 flex justify-between items-center transition-colors border-b border-neutral-800/50">
                                            <span>25 {t("nav.queries")}</span><span className="font-semibold text-white">6.90€</span>
                                        </button>
                                        <button onClick={() => handleBuyCredits('pack-50')} disabled={isLoading !== null} className="w-full text-left px-3 py-2.5 hover:bg-neutral-800 text-sm text-yellow-400 flex justify-between items-center transition-colors border-b border-neutral-800/50">
                                            <span>50 {t("nav.queries")}</span><span className="font-semibold text-white">11.90€</span>
                                        </button>
                                        <button onClick={() => handleBuyCredits('pack-100')} disabled={isLoading !== null} className="w-full text-left px-3 py-2.5 hover:bg-neutral-800 text-sm text-blue-400 flex justify-between items-center transition-colors border-b border-neutral-800/50">
                                            <span>100 {t("nav.queries")}</span><span className="font-semibold text-white">19.90€</span>
                                        </button>
                                        {isAdmin && (
                                            <Link href="/admin" className="w-full block text-left px-3 py-2.5 bg-neutral-800/30 hover:bg-neutral-800 text-sm text-blue-400 transition-colors border-b border-neutral-800/50">
                                                {t("nav.admin")}
                                            </Link>
                                        )}
                                        <button onClick={handleDirectoraClick} className="w-full text-left px-3 py-2.5 hover:bg-neutral-800 text-sm text-blue-400 font-bold flex items-center gap-2 transition-colors border-b border-neutral-800/50">
                                            ⚡ {language === 'es' ? 'Consultar Directora' : 'Consult Director'}
                                        </button>
                                        <button onClick={openRedeemPanel} disabled={isLoading !== null} className="w-full text-left px-3 py-2.5 bg-neutral-800/50 hover:bg-neutral-700 text-sm text-emerald-400 flex items-center gap-2 transition-colors border-b border-neutral-800/50">
                                            <Gift className="w-3.5 h-3.5" />{language === 'es' ? 'Canjear código' : 'Redeem code'}
                                        </button>
                                        <button onClick={() => handleSafeNav("/guia")} className="w-full text-left px-3 py-2.5 hover:bg-neutral-800 text-sm text-neutral-300 transition-colors">
                                            {t("guide.nav")}
                                        </button>
                                    </>
                                )}
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

                {/* Clerk Avatar */}
                <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 p-1.5 rounded-full flex items-center justify-center">
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Link
                                label={language === 'es' ? 'Mis Consultas' : 'My Queries'}
                                labelIcon={<Sparkles className="w-4 h-4" />}
                                href="/comprar"
                            />
                        </UserButton.MenuItems>
                    </UserButton>
                </div>
            </div>

            {/* -------------------- MOBILE HAMBURGER -------------------- */}
            <div className="flex md:hidden items-center gap-2">
                <button
                    onClick={handleOpenMobileMenu}
                    className="w-11 h-11 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 flex items-center justify-center text-white shadow-lg relative overflow-hidden group"
                >
                    <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* Mobile Sidebar */}
            {showMobileMenu && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowMobileMenu(false); closeRedeemPanel(); }} />
                    <div className="relative w-[300px] h-full bg-neutral-950 border-l border-neutral-800 p-6 flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-extrabold text-xl text-white tracking-tight">Lex<span className="text-blue-500">IA</span></span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setLanguage(language === "es" ? "en" : "es")}
                                    className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-sm font-bold text-neutral-300 flex items-center gap-1.5"
                                >
                                    {language === "es" ? "🇬🇧 EN" : "🇪🇸 ES"}
                                </button>
                                <button onClick={() => { setShowMobileMenu(false); closeRedeemPanel(); }} className="p-2 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-6 px-1">
                            {language === 'es' ? 'Asesoría Legal Inteligente' : 'Smart Legal Advisory'}
                        </p>

                        {/* Account */}
                        <div className="flex flex-col gap-4 mb-8">
                            <div className="flex items-center gap-4 bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800">
                                <div className="shrink-0 scale-125 ml-1">
                                    <UserButton>
                                        <UserButton.MenuItems>
                                            <UserButton.Link label={language === 'es' ? 'Mis Consultas' : 'My Queries'} labelIcon={<Sparkles className="w-4 h-4" />} href="/comprar" />
                                        </UserButton.MenuItems>
                                    </UserButton>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest">{t("nav.queries")}</span>
                                    <div className="flex items-center gap-1.5 text-yellow-400 font-black text-lg">
                                        <Sparkles className="w-4 h-4" />
                                        <span>{isAdmin ? "Ilimitadas" : credits}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Store */}
                        <div className="flex flex-col gap-3 mb-8">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-2">{t("nav.buy")} Tokens</span>
                            <button onClick={() => handleBuyCredits('pack-25')} className="w-full text-left p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex justify-between items-center shadow-sm">
                                <span className="font-medium text-neutral-200">25 {t("nav.queries")}</span>
                                <span className="text-white font-black bg-neutral-800 px-3 py-1 rounded-lg">6.90€</span>
                            </button>
                            <button onClick={() => handleBuyCredits('pack-50')} className="w-full text-left p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex justify-between items-center shadow-sm border-l-2 border-l-yellow-500">
                                <span className="font-bold text-yellow-400">50 {t("nav.queries")}</span>
                                <span className="text-white font-black bg-neutral-800 px-3 py-1 rounded-lg">11.90€</span>
                            </button>
                            <button onClick={() => handleBuyCredits('pack-100')} className="w-full text-left p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex justify-between items-center shadow-sm border-l-2 border-l-blue-500">
                                <span className="font-bold text-blue-400">100 {t("nav.queries")}</span>
                                <span className="text-white font-black bg-neutral-800 px-3 py-1 rounded-lg">19.90€</span>
                            </button>
                        </div>

                        {/* Navigation & Actions - Blocked during active chat */}
                        {typeof sessionStorage !== 'undefined' && sessionStorage.getItem('lexia_chat_active') === 'true' && pathname.includes('/chat/') ? (
                            <div className="flex flex-col gap-4 mb-8">
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-2">{language === 'es' ? 'Estado del Sistema' : 'System Status'}</span>
                                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex flex-col gap-3 shadow-inner">
                                    <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                        <AlertCircle className="w-4 h-4" />
                                        {language === 'es' ? 'Consulta en curso' : 'Active session'}
                                    </div>
                                    <p className="text-xs leading-relaxed font-medium">
                                        {language === 'es' 
                                            ? 'Las opciones de navegación y canje están bloqueadas durante el dictamen. Finalice su sesión (flecha ←) para habilitarlas.' 
                                            : 'Navigation and redeem options are locked during report generation. End your session (← arrow) to enable them.'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Navigation */}
                                <div className="flex flex-col gap-3 mb-8">
                                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-2">{language === 'es' ? 'Navegación' : 'Navigation'}</span>
                                    <button onClick={() => handleSafeNav("/")} className="w-full text-left p-4 rounded-xl bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 text-sm font-semibold text-neutral-300 transition-colors flex items-center gap-2">
                                        🏠 {language === 'es' ? 'Inicio' : 'Home'}
                                    </button>
                                    <button onClick={handleDirectoraClick} className="w-full text-left p-4 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-sm font-semibold text-blue-400 transition-colors flex items-center gap-2">
                                        ⚡ {language === 'es' ? 'Directora LexIA (Chat)' : 'LexIA Director (Chat)'}
                                    </button>
                                    <button onClick={() => handleSafeNav("/guia")} className="w-full text-left p-4 rounded-xl bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 text-sm font-semibold text-purple-400 transition-colors">
                                        {t("guide.nav")}
                                    </button>
                                    <button onClick={() => handleSafeNav("/manual")} className="w-full text-left p-4 rounded-xl bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 text-sm font-semibold text-amber-400 transition-colors">
                                        {language === 'es' ? 'Manual Usuario' : 'User Manual'}
                                    </button>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3 mb-8">
                                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-2">{language === 'es' ? 'Acciones' : 'Actions'}</span>
                                    {!showRedeemPanel ? (
                                        <button
                                            onClick={openRedeemPanel}
                                            className="w-full text-left p-4 rounded-xl bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-500/20 text-sm font-semibold text-emerald-400 transition-colors flex items-center gap-2"
                                        >
                                            <Gift className="w-4 h-4" />
                                            {t("nav.redeem")}
                                        </button>
                                    ) : (
                                        <div className="p-4 rounded-xl bg-neutral-900 border border-emerald-500/30 flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Gift className="w-3.5 h-3.5" />
                                                    {language === 'es' ? 'Canjear Código' : 'Redeem Code'}
                                                </span>
                                                <button onClick={closeRedeemPanel} className="text-neutral-600 hover:text-white transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <input
                                                ref={redeemInputRef}
                                                type="text"
                                                value={redeemCode}
                                                onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleRedeemSubmit(); }}
                                                placeholder="XXXX-XXXX-XXXX"
                                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white font-mono tracking-widest placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                                                disabled={redeemStatus === "loading" || redeemStatus === "success"}
                                            />
                                            {redeemMessage && (
                                                <div className={`text-xs p-2.5 rounded-lg flex items-start gap-2 ${redeemStatus === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                    {redeemStatus === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                                                    {redeemMessage}
                                                </div>
                                            )}
                                            <button
                                                onClick={handleRedeemSubmit}
                                                disabled={!redeemCode.trim() || redeemStatus === "loading" || redeemStatus === "success"}
                                                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                {redeemStatus === "loading" ? (
                                                    <><Loader2 className="w-4 h-4 animate-spin" />{language === 'es' ? 'Canjeando...' : 'Redeeming...'}</>
                                                ) : redeemStatus === "success" ? (
                                                    <><CheckCircle2 className="w-4 h-4" />{language === 'es' ? '¡Canjeado!' : 'Redeemed!'}</>
                                                ) : (
                                                    language === 'es' ? 'Canjear →' : 'Redeem →'
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    {isAdmin && (
                                        <button onClick={() => handleSafeNav("/admin")} className="w-full text-left p-4 rounded-xl bg-indigo-900/20 border border-indigo-500/20 text-sm font-semibold text-indigo-400 mt-2">
                                            {t("nav.admin")}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Language Switcher */}
                        <div className="mt-auto pt-6 border-t border-neutral-900">
                            <button
                                onClick={() => { setLanguage(language === "es" ? "en" : "es"); setShowMobileMenu(false); }}
                                className="w-full p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center gap-3 text-sm font-bold text-neutral-300 shadow-md"
                            >
                                {language === "es" ? "Switch to English 🇬🇧" : "Cambiar a Español 🇪🇸"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Redeem Modal (overlay, independent) */}
            {showRedeemPanel && !showMobileMenu && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-neutral-900 border border-emerald-500/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 relative">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-t-2xl" />
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Gift className="w-5 h-5 text-emerald-400" />
                                {language === 'es' ? 'Canjear Código de Acceso' : 'Redeem Access Code'}
                            </h3>
                            <button onClick={closeRedeemPanel} className="p-1.5 rounded-full text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs text-neutral-500">
                            {language === 'es' ? 'Introduce tu código promocional para añadir consultas a tu cuenta.' : 'Enter your promotional code to add queries to your account.'}
                        </p>
                        <input
                            ref={redeemInputRef}
                            type="text"
                            value={redeemCode}
                            onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleRedeemSubmit(); }}
                            placeholder="XXXX-XXXX-XXXX"
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white font-mono tracking-widest placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                            disabled={redeemStatus === "loading" || redeemStatus === "success"}
                            autoFocus
                        />
                        {redeemMessage && (
                            <div className={`text-xs p-3 rounded-xl flex items-start gap-2 ${redeemStatus === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {redeemStatus === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                                {redeemMessage}
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button onClick={closeRedeemPanel} className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 text-sm font-semibold transition-all">
                                {language === 'es' ? 'Cancelar' : 'Cancel'}
                            </button>
                            <button
                                onClick={handleRedeemSubmit}
                                disabled={!redeemCode.trim() || redeemStatus === "loading" || redeemStatus === "success"}
                                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
                            >
                                {redeemStatus === "loading" ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" />{language === 'es' ? 'Canjeando...' : 'Redeeming...'}</>
                                ) : redeemStatus === "success" ? (
                                    <><CheckCircle2 className="w-4 h-4" /> ¡OK!</>
                                ) : (
                                    language === 'es' ? 'Canjear →' : 'Redeem →'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
