// Pill Tabs — tabs a pillola animati
"use client";

import { cn } from "@/lib/utils";

interface TabConfig {
    id: string;
    label: string;
    conteggio?: number;
}

interface PillTabsProps {
    /** Configurazione tabs */
    tabs: TabConfig[];
    /** ID del tab attivo */
    tabAttivo: string;
    /** Callback cambio tab */
    onTabChange: (id: string) => void;
    /** Dimensione */
    dimensione?: "sm" | "md";
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Tabs a pillola con conteggio opzionale */
export function PillTabs({
    tabs,
    tabAttivo,
    onTabChange,
    dimensione = "md",
    className,
}: PillTabsProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-lg bg-[var(--pf-surface-secondary)] p-1",
                className
            )}
        >
            {tabs.map((tab) => {
                const isAttivo = tab.id === tabAttivo;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "relative flex items-center gap-1.5 rounded-md font-medium transition-all duration-200",
                            dimensione === "sm" && "px-3 py-1 text-xs",
                            dimensione === "md" && "px-4 py-1.5 text-sm",
                            isAttivo
                                ? "bg-[var(--pf-accent-primary)] text-white shadow-sm"
                                : "text-[var(--pf-text-secondary)] hover:text-[var(--pf-text-primary)]"
                        )}
                    >
                        {tab.label}
                        {tab.conteggio !== undefined && (
                            <span
                                className={cn(
                                    "inline-flex items-center justify-center rounded-full text-[10px] font-bold min-w-[18px] h-[18px] px-1",
                                    isAttivo
                                        ? "bg-white/20 text-white"
                                        : "bg-[var(--pf-surface-tertiary)] text-[var(--pf-text-muted)]"
                                )}
                            >
                                {tab.conteggio}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
