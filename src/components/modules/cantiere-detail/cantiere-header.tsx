// Cantiere Header — header dettaglio con codice, badge stato, progress e azioni
"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BadgeStato } from "@/components/ui/badge-stato";
import { ProgressArc } from "@/components/ui/progress-arc";
import type { CantiereDettaglio } from "@/types";

interface CantiereHeaderProps {
    /** Cantiere con relazioni */
    cantiere: CantiereDettaglio;
    /** Totale stati nella pipeline (per calcolo %) */
    totaleStati: number;
    /** Posizione corrente nella pipeline (1-based) */
    posizioneStato: number;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Formatta importo in € italiano */
function formatValuta(valore: number): string {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(valore);
}

/** Header del dettaglio cantiere — codice, stato, progress, info chiave */
export function CantiereHeader({
    cantiere,
    totaleStati,
    posizioneStato,
    className,
}: CantiereHeaderProps) {
    const percentualeAvanzamento = Math.round(
        (posizioneStato / totaleStati) * 100
    );

    return (
        <div
            className={cn(
                "rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)] p-5",
                className
            )}
        >
            {/* Top: back link + codice */}
            <div className="flex items-center gap-3 mb-4">
                <Link
                    href="/cantieri"
                    className="p-2 rounded-lg hover:bg-[var(--pf-bg-hover)] text-[var(--pf-text-muted)] transition-colors"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="font-mono text-lg font-bold text-[var(--pf-accent-primary)]">
                        {cantiere.codice}
                    </span>
                    <BadgeStato
                        label={cantiere.stato.label}
                        colore={cantiere.stato.colore}
                        conGlow
                    />
                </div>
            </div>

            {/* Main content: info + progress */}
            <div className="flex items-start gap-6">
                {/* Info cantiere */}
                <div className="flex-1 min-w-0 space-y-2">
                    <h1 className="text-xl font-bold text-[var(--pf-text-primary)]">
                        {cantiere.cliente.cognome} {cantiere.cliente.nome}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-[var(--pf-text-secondary)] flex-wrap">
                        <span>{cantiere.tipoProdotto.label}</span>
                        {cantiere.importoTotale && (
                            <>
                                <span className="text-[var(--pf-text-muted)]">
                                    •
                                </span>
                                <span className="font-medium tabular-nums">
                                    {formatValuta(cantiere.importoTotale)}
                                </span>
                            </>
                        )}
                        {cantiere.squadra && (
                            <>
                                <span className="text-[var(--pf-text-muted)]">
                                    •
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                cantiere.squadra.colore ?? "#666",
                                        }}
                                    />
                                    {cantiere.squadra.nome}
                                </span>
                            </>
                        )}
                    </div>
                    {cantiere.indirizzoCantiere && (
                        <p className="text-xs text-[var(--pf-text-muted)]">
                            📍 {cantiere.indirizzoCantiere}
                        </p>
                    )}
                </div>

                {/* Progress arc */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <ProgressArc
                        percentuale={percentualeAvanzamento}
                        dimensione={64}
                        colore={cantiere.stato.colore}
                        spessore={5}
                    />
                    <span className="text-[10px] text-[var(--pf-text-muted)] font-medium">
                        Avanzamento
                    </span>
                </div>
            </div>
        </div>
    );
}
