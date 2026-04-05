"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RecepcionPage() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace('/chat/asesor-direccion');
    }, [router]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center font-sans">
            <div className="flex items-center gap-3 animate-pulse">
                <img src="/logo.png" alt="LexIA" className="w-8 h-8 rounded-lg" />
                <span className="text-xl font-bold text-white tracking-tight">Lex<span className="text-blue-500">IA</span> - Redirigiendo a Auditoría...</span>
            </div>
        </div>
    );
}
