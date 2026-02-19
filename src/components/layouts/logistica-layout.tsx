// Layout per ruolo Logistica — acquisti, ordini fornitori, consegne
"use client";

import { RuoloGuard } from "@/components/layouts/ruolo-guard";
import { type ReactNode } from "react";

interface LogisticaLayoutProps {
    children: ReactNode;
}

/**
 * Layout per la logistica (Simone Cocci).
 * Accesso a: fornitori, ordini, cantieri (stato logistico), calendario consegne.
 * Nessun accesso a: admin, clienti, contabilità, report commerciali.
 */
export function LogisticaLayout({ children }: LogisticaLayoutProps) {
    return (
        <RuoloGuard
            ruoliAutorizzati={["logistica", "titolare", "admin"]}
            messaggioNegato="Questa sezione è riservata alla logistica e acquisti."
        >
            {children}
        </RuoloGuard>
    );
}
