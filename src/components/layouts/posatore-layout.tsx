// Layout per ruoli Posatori — mobile-first, caposquadra + installatori
"use client";

import { RuoloGuard } from "@/components/layouts/ruolo-guard";
import { type ReactNode } from "react";

interface PosatoreLayoutProps {
    children: ReactNode;
}

/**
 * Layout per capisquadra e installatori (Francesco Sinagra, Roberto Giglioni, ecc.).
 * Ottimizzato per uso mobile in cantiere.
 * Accesso a: cantieri assegnati (sola lettura + timeline), calendario squadra, media upload.
 * Nessun accesso a: admin, clienti, fornitori, contabilità, report finanziari.
 */
export function PosatoreLayout({ children }: PosatoreLayoutProps) {
    return (
        <RuoloGuard
            ruoliAutorizzati={["caposquadra", "installatore", "titolare", "admin"]}
            messaggioNegato="Questa sezione non è accessibile ai posatori."
        >
            {/* Ottimizzazioni mobile per l'uso in cantiere */}
            <div className="posatore-layout">
                {children}
            </div>
        </RuoloGuard>
    );
}
