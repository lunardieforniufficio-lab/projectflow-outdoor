// Skeleton Loader — loading placeholder animato
"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
    /** Tipo di contenuto da simulare */
    tipo?: "riga" | "card" | "tabella" | "form" | "badge";
    /** Numero di elementi placeholder */
    righe?: number;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Loading skeleton con varianti per diversi layout */
export function SkeletonLoader({
    tipo = "riga",
    righe = 3,
    className,
}: SkeletonLoaderProps) {
    if (tipo === "badge") {
        return (
            <div className={cn("flex gap-2", className)}>
                {Array.from({ length: righe }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
            </div>
        );
    }

    if (tipo === "card") {
        return (
            <div className={cn("grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", className)}>
                {Array.from({ length: righe }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface-secondary)] p-4 space-y-3"
                    >
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                        <div className="flex gap-2 pt-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (tipo === "tabella") {
        return (
            <div className={cn("space-y-2", className)}>
                {/* Header */}
                <div className="flex gap-4 py-2">
                    {[120, 180, 100, 80, 60].map((larghezza, i) => (
                        <Skeleton key={i} className="h-4" style={{ width: larghezza }} />
                    ))}
                </div>
                {/* Righe */}
                {Array.from({ length: righe }).map((_, i) => (
                    <div key={i} className="flex gap-4 py-3 border-t border-[var(--pf-border)]">
                        {[120, 180, 100, 80, 60].map((larghezza, j) => (
                            <Skeleton key={j} className="h-3.5" style={{ width: larghezza }} />
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    if (tipo === "form") {
        return (
            <div className={cn("space-y-4", className)}>
                {Array.from({ length: righe }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                ))}
            </div>
        );
    }

    // Default: righe semplici
    return (
        <div className={cn("space-y-3", className)}>
            {Array.from({ length: righe }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}
