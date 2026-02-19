// Empty State — placeholder per liste vuote
"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface EmptyStateProps {
    /** Titolo del placeholder */
    titolo: string;
    /** Descrizione opzionale */
    descrizione?: string;
    /** Icona (emoji o JSX) */
    icona?: ReactNode;
    /** Azione opzionale (es. bottone "Aggiungi") */
    azione?: ReactNode;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Placeholder per quando una lista è vuota */
export function EmptyState({
    titolo,
    descrizione,
    icona = "📭",
    azione,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-16 px-4 text-center",
                className
            )}
        >
            <div className="text-5xl mb-4">{icona}</div>
            <h3 className="text-lg font-semibold text-[var(--pf-text-primary)] mb-1">
                {titolo}
            </h3>
            {descrizione && (
                <p className="text-sm text-[var(--pf-text-muted)] max-w-sm mb-4">
                    {descrizione}
                </p>
            )}
            {azione && <div className="mt-2">{azione}</div>}
        </div>
    );
}
