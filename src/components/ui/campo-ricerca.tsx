// Campo Ricerca — input con debounce integrato
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CampoRicercaProps {
    /** Valore corrente */
    valore: string;
    /** Callback al cambio (debounced) */
    onCambia: (valore: string) => void;
    /** Placeholder */
    placeholder?: string;
    /** Delay debounce in ms */
    debounceMs?: number;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Input di ricerca con debounce e icona lente */
export function CampoRicerca({
    valore,
    onCambia,
    placeholder = "Cerca...",
    debounceMs = 300,
    className,
}: CampoRicercaProps) {
    const [valoreLocale, setValoreLocale] = useState(valore);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sincronizza quando il valore esterno cambia
    useEffect(() => {
        setValoreLocale(valore);
    }, [valore]);

    // Debounce
    function gestisciCambio(nuovoValore: string) {
        setValoreLocale(nuovoValore);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onCambia(nuovoValore);
        }, debounceMs);
    }

    function pulisci() {
        setValoreLocale("");
        onCambia("");
    }

    return (
        <div className={cn("relative", className)}>
            {/* Icona lente */}
            <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--pf-text-muted)]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>

            <input
                type="text"
                value={valoreLocale}
                onChange={(e) => gestisciCambio(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    "w-full rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface-secondary)]",
                    "pl-10 pr-8 py-2 text-sm text-[var(--pf-text-primary)]",
                    "placeholder:text-[var(--pf-text-muted)]",
                    "focus:outline-none focus:ring-1 focus:ring-[var(--pf-accent-primary)] focus:border-[var(--pf-accent-primary)]",
                    "transition-colors duration-200"
                )}
            />

            {/* Bottone pulisci */}
            {valoreLocale && (
                <button
                    onClick={pulisci}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-[var(--pf-text-muted)] hover:text-[var(--pf-text-primary)] hover:bg-[var(--pf-surface-tertiary)] transition-colors"
                >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
