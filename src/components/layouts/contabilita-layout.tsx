// Layout per ruolo Contabilità — fatture, pagamenti, report finanziari
"use client";

import { RuoloGuard } from "@/components/layouts/ruolo-guard";
import { type ReactNode } from "react";

interface ContabilitaLayoutProps {
    children: ReactNode;
}

/**
 * Layout per la contabilità (Lara Cappellini).
 * Accesso a: fatture, preventivi, report finanziari, cantieri (sola lettura importi).
 * Nessun accesso a: admin sistema, logistica operativa, squadre, media.
 */
export function ContabilitaLayout({ children }: ContabilitaLayoutProps) {
    return (
        <RuoloGuard
            ruoliAutorizzati={["contabilita", "amministrazione", "titolare", "admin"]}
            messaggioNegato="Questa sezione è riservata alla contabilità aziendale."
        >
            {children}
        </RuoloGuard>
    );
}
