// Floating Pill Nav — navigazione flottante che si nasconde/riappare
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface VoceNav {
    id: string;
    label: string;
    icona?: ReactNode;
}

interface FloatingPillNavProps {
    /** Voci di navigazione */
    voci: VoceNav[];
    /** Voce attualmente attiva */
    voceAttiva: string;
    /** Callback navigazione */
    onNavigazione: (id: string) => void;
    /** Ms prima di nascondere automaticamente */
    autoHideMs?: number;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Nav flottante a pillola con auto-hide */
export function FloatingPillNav({
    voci,
    voceAttiva,
    onNavigazione,
    autoHideMs = 3000,
    className,
}: FloatingPillNavProps) {
    const [isVisibile, setIsVisibile] = useState(true);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-hide dopo inattività
    useEffect(() => {
        const avviaTimer = () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            setIsVisibile(true);
            timerRef.current = setTimeout(() => setIsVisibile(false), autoHideMs);
        };

        avviaTimer();

        const gestore = () => avviaTimer();
        window.addEventListener("mousemove", gestore);
        window.addEventListener("scroll", gestore);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            window.removeEventListener("mousemove", gestore);
            window.removeEventListener("scroll", gestore);
        };
    }, [autoHideMs]);

    return (
        <nav
            className={cn(
                "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300",
                isVisibile
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0 pointer-events-none",
                className
            )}
        >
            <div className="flex items-center gap-1 rounded-full bg-[var(--pf-surface-secondary)]/90 backdrop-blur-xl border border-[var(--pf-border)] px-2 py-1.5 shadow-2xl">
                {voci.map((voce) => {
                    const isAttiva = voce.id === voceAttiva;
                    return (
                        <button
                            key={voce.id}
                            onClick={() => onNavigazione(voce.id)}
                            className={cn(
                                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                                isAttiva
                                    ? "bg-[var(--pf-accent-primary)] text-white shadow-md"
                                    : "text-[var(--pf-text-secondary)] hover:text-[var(--pf-text-primary)] hover:bg-[var(--pf-surface-tertiary)]"
                            )}
                        >
                            {voce.icona && <span className="text-base">{voce.icona}</span>}
                            <span className={cn(!isAttiva && "hidden sm:inline")}>
                                {voce.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
