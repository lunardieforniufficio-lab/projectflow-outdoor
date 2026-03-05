// Layout per ruolo Venditore — cantieri commerciali, clienti, report vendite
"use client";

import { RuoloGuard } from "@/components/layouts/ruolo-guard";
import { type ReactNode } from "react";

interface VenditoreLayoutProps {
    children: ReactNode;
}

/**
 * Layout per i venditori (Alberto Bini, Davide Guidotti, Gabriele Albanese).
 * Accesso a: cantieri (assegnati + lead/vendita), clienti, calendario, report.
 * Nessun accesso a: admin, contabilità, logistica, squadre.
 */
export function VenditoreLayout({ children }: VenditoreLayoutProps) {
    return (
        <RuoloGuard
            ruoliAutorizzati={["venditore", "titolare", "admin"]}
            messaggioNegato="Questa sezione è riservata all'area commerciale."
        >
            {children}
        </RuoloGuard>
    );
}
