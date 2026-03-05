// Layout per ruolo Titolare — accesso completo (simile ad admin, senza pannello config)
"use client";

import { RuoloGuard } from "@/components/layouts/ruolo-guard";
import { type ReactNode } from "react";

interface TitolareLayoutProps {
    children: ReactNode;
}

/**
 * Layout per il titolare (Gabriele Forni).
 * Accesso completo a tutte le sezioni operative. No accesso config tecnica admin.
 */
export function TitolareLayout({ children }: TitolareLayoutProps) {
    return (
        <RuoloGuard
            ruoliAutorizzati={["titolare", "admin"]}
            messaggioNegato="Questa sezione è riservata alla direzione aziendale."
        >
            {children}
        </RuoloGuard>
    );
}
