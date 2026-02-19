// Timeline Lista — lista verticale di eventi con filtro per tipo
"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { PillTabs } from "@/components/ui/pill-tabs";
import { TimelineEntryCard } from "./timeline-entry";
import type { TimelineEntry } from "@/types";

interface TimelineListaProps {
    /** Lista entries timeline */
    entries: TimelineEntry[];
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Configurazione filtri tipo */
const FILTRI_TIPO = [
    { id: "tutti", label: "Tutti" },
    { id: "nota", label: "Note" },
    { id: "cambio_stato", label: "Stati" },
    { id: "foto", label: "Foto" },
    { id: "ordine", label: "Ordini" },
];

/** Lista verticale di eventi timeline con filtro per tipo */
export function TimelineLista({ entries, className }: TimelineListaProps) {
    const [filtroTipo, setFiltroTipo] = useState("tutti");

    // Filtra entries per tipo
    const entriesFiltrate = useMemo(() => {
        const ordinate = [...entries].sort(
            (a, b) => new Date(b.creatoIl).getTime() - new Date(a.creatoIl).getTime()
        );

        if (filtroTipo === "tutti") return ordinate;
        return ordinate.filter((e) => e.tipo === filtroTipo);
    }, [entries, filtroTipo]);

    // Conteggi per tabs
    const tabsConConteggio = FILTRI_TIPO.map((filtro) => ({
        ...filtro,
        conteggio:
            filtro.id === "tutti"
                ? entries.length
                : entries.filter((e) => e.tipo === filtro.id).length,
    })).filter((tab) => tab.id === "tutti" || tab.conteggio > 0);

    return (
        <div className={cn("space-y-4", className)}>
            {/* Filtri */}
            <PillTabs
                tabs={tabsConConteggio}
                tabAttivo={filtroTipo}
                onTabChange={setFiltroTipo}
                dimensione="sm"
            />

            {/* Lista */}
            <div>
                {entriesFiltrate.map((entry, indice) => (
                    <TimelineEntryCard
                        key={entry.id}
                        entry={entry}
                        isUltima={indice === entriesFiltrate.length - 1}
                    />
                ))}

                {entriesFiltrate.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-sm text-[var(--pf-text-muted)]">
                            Nessun evento trovato
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
