// Layout per ruolo Centralino — primo contatto, visibilità cantieri in entrata
"use client";

import { RuoloGuard } from "@/components/layouts/ruolo-guard";
import { type ReactNode } from "react";

interface CentralinoLayoutProps {
    children: ReactNode;
}

/**
 * Layout per il centralino (Martina Cialdi).
 * Accesso a: cantieri in stato LEAD, clienti (sola lettura), calendario.
 * Nessun accesso a: admin, contabilità, logistica, squadre, fornitori.
 */
export function CentralinoLayout({ children }: CentralinoLayoutProps) {
    return (
        <RuoloGuard
            ruoliAutorizzati={["centralino", "titolare", "admin"]}
            messaggioNegato="Questa sezione non è accessibile dal centralino."
        >
            {children}
        </RuoloGuard>
    );
}
