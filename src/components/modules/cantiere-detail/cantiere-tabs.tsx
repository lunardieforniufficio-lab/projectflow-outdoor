// Cantiere Tabs — container tabs per sezioni del dettaglio cantiere
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PillTabs } from "@/components/ui/pill-tabs";
import { TimelineLista } from "@/components/modules/timeline/timeline-lista";
import { TimelineAggiungiNota } from "@/components/modules/timeline/timeline-aggiungi-nota";
import { CantiereInfo } from "./cantiere-info";
import type { CantiereDettaglio, TimelineEntry } from "@/types";

interface CantiereTabsProps {
    /** Cantiere con relazioni */
    cantiere: CantiereDettaglio;
    /** Timeline entries del cantiere */
    timelineEntries: TimelineEntry[];
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Tab disponibili */
const TABS = [
    { id: "timeline", label: "Timeline" },
    { id: "info", label: "Informazioni" },
    { id: "documenti", label: "Documenti" },
];

/** Container tabs per le sezioni del dettaglio cantiere */
export function CantiereTabs({
    cantiere,
    timelineEntries,
    className,
}: CantiereTabsProps) {
    const [tabAttivo, setTabAttivo] = useState("timeline");

    // Conteggi per tabs
    const tabsConConteggio = TABS.map((tab) => ({
        ...tab,
        conteggio:
            tab.id === "timeline" ? timelineEntries.length : undefined,
    }));

    return (
        <div className={cn("space-y-4", className)}>
            {/* Tabs */}
            <PillTabs
                tabs={tabsConConteggio}
                tabAttivo={tabAttivo}
                onTabChange={setTabAttivo}
            />

            {/* Contenuto tab */}
            {tabAttivo === "timeline" && (
                <div className="space-y-4">
                    <TimelineAggiungiNota
                        onInvia={(contenuto) => {
                            // TODO: collegare a API reale
                            console.log("Nuova nota:", contenuto);
                        }}
                    />
                    <TimelineLista entries={timelineEntries} />
                </div>
            )}

            {tabAttivo === "info" && (
                <CantiereInfo cantiere={cantiere} />
            )}

            {tabAttivo === "documenti" && (
                <div className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)] p-8 text-center">
                    <p className="text-sm text-[var(--pf-text-muted)]">
                        📄 Sezione documenti — disponibile dopo collegamento Google Drive
                    </p>
                </div>
            )}
        </div>
    );
}
