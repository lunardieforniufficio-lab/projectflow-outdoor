// Layout per ruolo Tecnico — ufficio tecnico, rilievi, progetti
"use client";

import { RuoloGuard } from "@/components/layouts/ruolo-guard";
import { type ReactNode } from "react";

interface TecnicoLayoutProps {
    children: ReactNode;
}

/**
 * Layout per il tecnico (Michele Ciolini).
 * Accesso a: cantieri (dettaglio, rilievi, progetti), calendario, media.
 * Nessun accesso a: admin, contabilità, fatture, fornitori finanziari.
 */
export function TecnicoLayout({ children }: TecnicoLayoutProps) {
    return (
        <RuoloGuard
            ruoliAutorizzati={["tecnico", "titolare", "admin"]}
            messaggioNegato="Questa sezione è riservata all'ufficio tecnico."
        >
            {children}
        </RuoloGuard>
    );
}
