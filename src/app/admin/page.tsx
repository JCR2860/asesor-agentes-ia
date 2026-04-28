"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus, RefreshCw } from "lucide-react";

export default function AdminPage() {
    const { user, isLoaded } = useUser();
    const [codes, setCodes] = useState<any[]>([]);
    const [stats, setStats] = useState({ 
        totalUsers: 0, 
        totalPurchased: 0, 
        totalGifted: 0, 
        totalCurrentCredits: 0,
        packs: { 25: 0, 50: 0, 100: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [newCode, setNewCode] = useState("");
    const [newCredits, setNewCredits] = useState("10");
    const [isCreating, setIsCreating] = useState(false);
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [isUpdatingConfig, setIsUpdatingConfig] = useState(false);

    useEffect(() => {
        if (isLoaded) {
            fetchCodes();
            fetchStats();
            fetchConfig();
        }
    }, [isLoaded]);

    const fetchConfig = async () => {
        try {
            const res = await fetch("/api/admin/config");
            const data = await res.json();
            if (data.config) {
                setIsMaintenanceMode(data.config.isMaintenanceMode);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchCodes = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/codes");
            const data = await res.json();
            if (data.codes) {
                setCodes(data.codes);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            const data = await res.json();
            if (data && !data.error) {
                setStats(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCode.trim() || !newCredits) return;

        setIsCreating(true);
        try {
            const res = await fetch("/api/admin/codes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: newCode.trim().toUpperCase(), credits: newCredits })
            });
            const data = await res.json();
            if (data.success && data.codes) {
                setCodes(data.codes);
                setNewCode("");
                setNewCredits("10");
            } else {
                alert(data.error || "Error al crear el código");
            }
        } catch (e) {
            console.error(e);
            alert("Error de conexión");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (code: string) => {
        if (!confirm(`¿Eliminar código ${code}?`)) return;

        try {
            const res = await fetch("/api/admin/codes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
            });
            const data = await res.json();
            if (data.success && data.codes) {
                setCodes(data.codes);
            } else {
                alert(data.error || "Error al eliminar");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const toggleMaintenanceMode = async () => {
        setIsUpdatingConfig(true);
        try {
            const res = await fetch("/api/admin/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isMaintenanceMode: !isMaintenanceMode })
            });
            const data = await res.json();
            if (data.success) {
                setIsMaintenanceMode(!isMaintenanceMode);
            }
        } catch (e) {
            console.error(e);
            alert("Error al actualizar la configuración");
        } finally {
            setIsUpdatingConfig(false);
        }
    };

    if (!isLoaded) return <div className="p-10 text-white">Cargando perfil...</div>;

    const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!isAdmin) {
        return <div className="p-10 text-red-500 font-bold">ACCESO DENEGADO. Solo administradores.</div>;
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 bg-neutral-900 hover:bg-neutral-800 rounded-full transition-colors border border-neutral-800">
                        <ArrowLeft className="w-5 h-5 text-neutral-300" />
                    </Link>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                        Panel de Administración
                    </h1>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                        <p className="text-neutral-400 text-sm font-medium mb-1">Usuarios Registrados</p>
                        <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl relative overflow-hidden group">
                        <p className="text-neutral-400 text-sm font-medium mb-1">Tokens Comprados</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-blue-400">{stats.totalPurchased}</p>
                            <span className="text-xs text-neutral-500 font-bold">TOKENS</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-col gap-1.5">
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-neutral-500 uppercase tracking-tighter">Pack 25</span>
                                <span className="text-blue-400/80">{stats.packs[25]} ventas</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-neutral-500 uppercase tracking-tighter">Pack 50</span>
                                <span className="text-blue-400/80">{stats.packs[50]} ventas</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-neutral-500 uppercase tracking-tighter">Pack 100</span>
                                <span className="text-blue-400/80">{stats.packs[100]} ventas</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                        <p className="text-neutral-400 text-sm font-medium mb-1">Tokens Regalados (Códigos)</p>
                        <p className="text-3xl font-bold text-emerald-400">{stats.totalGifted}</p>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                        <p className="text-neutral-400 text-sm font-medium mb-1">Créditos en Circulación</p>
                        <p className="text-3xl font-bold text-purple-400">{stats.totalCurrentCredits}</p>
                    </div>
                </div>

                {/* App Control Section */}
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold mb-1">Estado de la Aplicación</h2>
                        <p className="text-neutral-400 text-sm">
                            Activa o desactiva el acceso a los asesores para mantenimiento o emergencias.
                        </p>
                    </div>
                    <button
                        onClick={toggleMaintenanceMode}
                        disabled={isUpdatingConfig}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                            isMaintenanceMode 
                                ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20" 
                                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        }`}
                    >
                        {isUpdatingConfig ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : isMaintenanceMode ? (
                            "APLICACIÓN DESACTIVADA"
                        ) : (
                            "APLICACIÓN ACTIVA"
                        )}
                    </button>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-emerald-400" />
                        Crear Nuevo Código
                    </h2>
                    <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm text-neutral-400 mb-1">Nombre del Código (ej: VIP-50)</label>
                            <input
                                type="text"
                                required
                                value={newCode}
                                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                                placeholder="Escribe el código..."
                                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 uppercase"
                            />
                        </div>
                        <div className="w-full sm:w-32">
                            <label className="block text-sm text-neutral-400 mb-1">Consultas</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={newCredits}
                                onChange={(e) => setNewCredits(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="bg-blue-600 hover:bg-blue-500 font-bold px-6 py-2.5 rounded-lg transition-colors w-full sm:w-auto h-11 flex justify-center items-center"
                        >
                            {isCreating ? "Creando..." : "Crear"}
                        </button>
                    </form>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Códigos Activos</h2>
                        <button onClick={fetchCodes} className="p-2 hover:bg-neutral-800 rounded-full border border-neutral-700 transition-colors">
                            <RefreshCw className={`w-4 h-4 text-neutral-400 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-neutral-500 text-center py-10">Cargando códigos...</div>
                    ) : codes.length === 0 ? (
                        <div className="text-neutral-500 text-center py-10">No hay códigos activos.</div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-neutral-800">
                            <table className="w-full text-left bg-neutral-950">
                                <thead>
                                    <tr className="bg-neutral-900/50 border-b border-neutral-800 text-sm font-semibold text-neutral-400">
                                        <th className="p-4">Código</th>
                                        <th className="p-4">Consultas</th>
                                        <th className="p-4">Fecha de Creación</th>
                                        <th className="p-4 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {codes.map((c) => (
                                        <tr key={c.code} className="border-b border-neutral-800/50 hover:bg-neutral-900/20 last:border-0">
                                            <td className="p-4 font-mono text-emerald-400 font-bold">{c.code}</td>
                                            <td className="p-4">{c.credits}</td>
                                            <td className="p-4 text-neutral-500 text-sm">
                                                {new Date(c.createdAt || Date.now()).toLocaleString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(c.code)}
                                                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                    title="Eliminar código (no podrá usarse)"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
