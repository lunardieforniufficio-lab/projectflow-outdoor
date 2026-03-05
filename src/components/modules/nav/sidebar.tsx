// Sidebar navigazione principale — desktop e mobile
// Filtra voci in base al ruolo simulato (se attivo)
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    HardHat,
    Columns3,
    Users,
    Truck,
    UserCog,
    Calendar,
    MessageSquare,
    Settings,
    ChevronLeft,
    Menu,
    X,
    LogOut,
    BarChart3,
    UsersRound,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import {
    useStoreSimulazione,
    ruoliSimulabili,
} from "@/stores/simulazione-store";

/** Voce navigazione */
interface VoceNav {
    id: string;
    label: string;
    icona: React.ReactNode;
    href: string;
    badge?: number;
}

/** Tutte le voci navigazione */
const tutteLeVoci: VoceNav[] = [
    { id: "dashboard", label: "Dashboard", icona: <LayoutDashboard size={20} />, href: "/" },
    { id: "cantieri", label: "Cantieri", icona: <HardHat size={20} />, href: "/cantieri" },
    { id: "kanban", label: "Kanban", icona: <Columns3 size={20} />, href: "/kanban" },
    { id: "clienti", label: "Clienti", icona: <Users size={20} />, href: "/clienti" },
    { id: "fornitori", label: "Fornitori", icona: <Truck size={20} />, href: "/fornitori" },
    { id: "squadre", label: "Squadre", icona: <UserCog size={20} />, href: "/squadre" },
    { id: "organigramma", label: "Organigramma", icona: <UsersRound size={20} />, href: "/organigramma" },
    { id: "calendario", label: "Calendario", icona: <Calendar size={20} />, href: "/calendario" },
    { id: "ai", label: "AI Chat", icona: <MessageSquare size={20} />, href: "/ai" },
    { id: "report", label: "Report", icona: <BarChart3 size={20} />, href: "/report" },
];

const voceAdmin: VoceNav = {
    id: "admin",
    label: "Impostazioni",
    icona: <Settings size={20} />,
    href: "/admin/configurazioni",
};

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const { signOut } = useClerk();
    const [isCollassata, setIsCollassata] = useState(false);
    const [isMobileAperta, setIsMobileAperta] = useState(false);

    // Simulazione ruolo
    const { ruoloSimulato } = useStoreSimulazione();

    /** Voci filtrate in base al ruolo simulato */
    const vociFiltrate = useMemo(() => {
        if (!ruoloSimulato) return tutteLeVoci;
        const ruolo = ruoliSimulabili.find((r) => r.codice === ruoloSimulato);
        if (!ruolo) return tutteLeVoci;
        return tutteLeVoci.filter((v) => ruolo.sezioniVisibili.includes(v.id));
    }, [ruoloSimulato]);

    /** Mostra sezione admin? */
    const mostraAdmin = useMemo(() => {
        if (!ruoloSimulato) return true;
        const ruolo = ruoliSimulabili.find((r) => r.codice === ruoloSimulato);
        return ruolo?.sezioniVisibili.includes("admin") ?? false;
    }, [ruoloSimulato]);

    /** Verifica se un path è attivo */
    function isAttivo(href: string): boolean {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    }

    /** Contenuto sidebar condiviso tra desktop e mobile */
    function ContenutoSidebar() {
        return (
            <>
                {/* Spacer per barra simulazione */}
                <div className="h-9" />

                {/* Logo */}
                <div className="flex h-16 items-center gap-3 px-4 border-b border-[var(--pf-border)]">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span
                            className="font-bold text-lg tracking-tight"
                            style={{ color: "var(--pf-text-primary)" }}
                        >
                            L
                        </span>
                        <span
                            className="font-bold text-lg"
                            style={{ color: "var(--pf-accent-primary)" }}
                        >
                            &amp;
                        </span>
                        {!isCollassata && (
                            <span
                                className="font-bold text-lg tracking-tight"
                                style={{ color: "var(--pf-text-primary)" }}
                            >
                                F
                            </span>
                        )}
                    </div>
                    {!isCollassata && (
                        <span
                            className="text-xs font-medium truncate"
                            style={{ color: "var(--pf-text-muted)" }}
                        >
                            ProjectFlow
                        </span>
                    )}
                </div>

                {/* Navigazione principale */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {vociFiltrate.map((voce) => (
                        <Link
                            key={voce.id}
                            href={voce.href}
                            onClick={() => setIsMobileAperta(false)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                "hover:bg-[var(--pf-bg-hover)]",
                                isAttivo(voce.href)
                                    ? "bg-[var(--pf-accent-primary-subtle)] text-[var(--pf-accent-primary)]"
                                    : "text-[var(--pf-text-secondary)]"
                            )}
                        >
                            <span className={cn(
                                "flex-shrink-0",
                                isAttivo(voce.href)
                                    ? "text-[var(--pf-accent-primary)]"
                                    : "text-[var(--pf-text-muted)]"
                            )}>
                                {voce.icona}
                            </span>
                            {!isCollassata && (
                                <span className="truncate">{voce.label}</span>
                            )}
                            {!isCollassata && voce.badge && voce.badge > 0 && (
                                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[var(--pf-accent-red)] text-white font-semibold">
                                    {voce.badge}
                                </span>
                            )}
                        </Link>
                    ))}

                    {/* Separatore + Admin (se visibile) */}
                    {mostraAdmin && (
                        <>
                            <div className="my-4 border-t border-[var(--pf-border)]" />
                            <Link
                                href={voceAdmin.href}
                                onClick={() => setIsMobileAperta(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    "hover:bg-[var(--pf-bg-hover)]",
                                    isAttivo(voceAdmin.href)
                                        ? "bg-[var(--pf-accent-primary-subtle)] text-[var(--pf-accent-primary)]"
                                        : "text-[var(--pf-text-secondary)]"
                                )}
                            >
                                <span className="flex-shrink-0 text-[var(--pf-text-muted)]">
                                    {voceAdmin.icona}
                                </span>
                                {!isCollassata && (
                                    <span className="truncate">{voceAdmin.label}</span>
                                )}
                            </Link>
                        </>
                    )}
                </nav>

                {/* Footer: collapse toggle + logout */}
                <div className="border-t border-[var(--pf-border)] p-3 space-y-1">
                    {/* Collapse toggle (solo desktop) */}
                    <button
                        onClick={() => setIsCollassata(!isCollassata)}
                        className="hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[var(--pf-text-muted)] hover:bg-[var(--pf-bg-hover)] transition-colors"
                    >
                        <ChevronLeft
                            size={20}
                            className={cn(
                                "transition-transform duration-300",
                                isCollassata && "rotate-180"
                            )}
                        />
                        {!isCollassata && <span>Comprimi</span>}
                    </button>

                    {/* Logout */}
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[var(--pf-text-muted)] hover:bg-[var(--pf-accent-red)]/10 hover:text-[var(--pf-accent-red)] transition-colors"
                    >
                        <LogOut size={20} />
                        {!isCollassata && <span>Esci</span>}
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            {/* === MOBILE: Topbar + Sheet === */}
            <div className="lg:hidden fixed top-9 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 bg-[var(--pf-bg-surface)] border-b border-[var(--pf-border)]">
                <button
                    onClick={() => setIsMobileAperta(true)}
                    className="p-2 rounded-lg hover:bg-[var(--pf-bg-hover)] text-[var(--pf-text-secondary)]"
                >
                    <Menu size={22} />
                </button>
                <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm" style={{ color: "var(--pf-text-primary)" }}>L</span>
                    <span className="font-bold text-sm" style={{ color: "var(--pf-accent-primary)" }}>&amp;</span>
                    <span className="font-bold text-sm" style={{ color: "var(--pf-text-primary)" }}>F</span>
                    <span className="text-xs ml-1" style={{ color: "var(--pf-text-muted)" }}>ProjectFlow</span>
                </div>
                <div className="w-10" />
            </div>

            {/* Mobile overlay */}
            {isMobileAperta && (
                <div
                    className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsMobileAperta(false)}
                >
                    <div
                        className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--pf-bg-surface)] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsMobileAperta(false)}
                            className="absolute top-13 right-4 p-1 rounded-lg hover:bg-[var(--pf-bg-hover)] text-[var(--pf-text-muted)]"
                        >
                            <X size={18} />
                        </button>
                        <ContenutoSidebar />
                    </div>
                </div>
            )}

            {/* === DESKTOP: Sidebar fissa === */}
            <aside
                className={cn(
                    "hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40",
                    "bg-[var(--pf-bg-surface)] border-r border-[var(--pf-border)]",
                    "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isCollassata ? "w-[72px]" : "w-[260px]",
                    className
                )}
            >
                <ContenutoSidebar />
            </aside>
        </>
    );
}
