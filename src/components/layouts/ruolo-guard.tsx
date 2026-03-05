// Componente generico per proteggere sezioni in base al ruolo
"use client";

import { type ReactNode } from "react";
import { useRuolo } from "@/hooks/use-ruolo";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldX } from "lucide-react";

interface RuoloGuardProps {
    /** Ruoli autorizzati ad accedere */
    ruoliAutorizzati: string[];
    /** Contenuto da mostrare se autorizzato */
    children: ReactNode;
    /** Messaggio personalizzato di accesso negato */
    messaggioNegato?: string;
}

/**
 * Guard generico: mostra i children solo se il ruolo corrente è nella lista autorizzati.
 * Mostra skeleton durante il caricamento, messaggio di errore se non autorizzato.
 */
export function RuoloGuard({
    ruoliAutorizzati,
    children,
    messaggioNegato,
}: RuoloGuardProps) {
    const { ruoloCodice, ruoloLabel, isCaricamento } = useRuolo();

    if (isCaricamento) {
        return (
            <div className="space-y-4 p-6">
                <SkeletonLoader righe={4} />
            </div>
        );
    }

    const isAutorizzato = ruoloCodice
        ? ruoliAutorizzati.includes(ruoloCodice)
        : false;

    if (!isAutorizzato) {
        return (
            <EmptyState
                icona={<ShieldX size={40} />}
                titolo="Accesso non autorizzato"
                descrizione={
                    messaggioNegato ??
                    `Il ruolo "${ruoloLabel ?? "Sconosciuto"}" non ha accesso a questa sezione.`
                }
            />
        );
    }

    return <>{children}</>;
}
