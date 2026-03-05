// Layout per ruolo Magazziniere — gestione materiali e consegne
"use client";

import { RuoloGuard } from "@/components/layouts/ruolo-guard";
import { type ReactNode } from "react";

interface MagazziniereLayoutProps {
    children: ReactNode;
}

/**
 * Layout per il magazziniere (Leonardo Manzone).
 * Accesso a: ordini fornitori (sola lettura), cantieri (stato materiali), calendario.
 * Nessun accesso a: admin, clienti, contabilità, fatture, report finanziari.
 */
export function MagazziniereLayout({ children }: MagazziniereLayoutProps) {
    return (
        <RuoloGuard
            ruoliAutorizzati={["magazziniere", "logistica", "titolare", "admin"]}
            messaggioNegato="Questa sezione non è accessibile al magazzino."
        >
            {children}
        </RuoloGuard>
    );
}
