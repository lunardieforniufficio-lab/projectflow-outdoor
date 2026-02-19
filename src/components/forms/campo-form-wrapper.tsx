// Campo wrapper base per React Hook Form — usato da tutti i campi form
"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CampoFormWrapperProps {
    /** Label del campo */
    label?: string;
    /** Messaggio di errore */
    errore?: string;
    /** Descrizione sotto il campo */
    descrizione?: string;
    /** Se il campo è obbligatorio */
    obbligatorio?: boolean;
    /** Contenuto del campo */
    children: ReactNode;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Wrapper comune per tutti i campi form — label, errore, descrizione */
export function CampoFormWrapper({
    label,
    errore,
    descrizione,
    obbligatorio,
    children,
    className,
}: CampoFormWrapperProps) {
    return (
        <div className={cn("space-y-1.5", className)}>
            {label && (
                <label className="text-sm font-medium text-[var(--pf-text-primary)]">
                    {label}
                    {obbligatorio && (
                        <span className="ml-0.5 text-red-400">*</span>
                    )}
                </label>
            )}
            {children}
            {descrizione && !errore && (
                <p className="text-xs text-[var(--pf-text-muted)]">{descrizione}</p>
            )}
            {errore && (
                <p className="text-xs text-red-400">{errore}</p>
            )}
        </div>
    );
}
