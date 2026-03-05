// Layout per ruolo Amministrazione — gestione documentale e operativa interna
"use client";

import { RuoloGuard } from "@/components/layouts/ruolo-guard";
import { type ReactNode } from "react";

interface AmministrazioneLayoutProps {
    children: ReactNode;
}

/**
 * Layout per l'amministrazione (Martina Forni).
 * Accesso a: cantieri (stato documentale), clienti, preventivi, fatture, report.
 * Nessun accesso a: admin sistema, logistica magazzino, squadre operative.
 */
export function AmministrazioneLayout({ children }: AmministrazioneLayoutProps) {
    return (
        <RuoloGuard
            ruoliAutorizzati={["amministrazione", "contabilita", "titolare", "admin"]}
            messaggioNegato="Questa sezione è riservata all'amministrazione aziendale."
        >
            {children}
        </RuoloGuard>
    );
}
