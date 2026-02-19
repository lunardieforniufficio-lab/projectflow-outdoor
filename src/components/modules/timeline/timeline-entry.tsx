// Timeline Entry — singola voce nella timeline del cantiere
"use client";

import { cn } from "@/lib/utils";
import {
    ArrowRightLeft,
    MessageSquare,
    Camera,
    Package,
    Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import type { TimelineEntry as TimelineEntryType } from "@/types";

/** Icona per tipo entry */
const ICONE_TIPO: Record<string, React.ReactNode> = {
    cambio_stato: <ArrowRightLeft size={14} />,
    nota: <MessageSquare size={14} />,
    foto: <Camera size={14} />,
    ordine: <Package size={14} />,
};

/** Colore dot per tipo entry */
const COLORI_TIPO: Record<string, string> = {
    cambio_stato: "var(--pf-accent-blue)",
    nota: "var(--pf-accent-primary)",
    foto: "var(--pf-accent-purple)",
    ordine: "var(--pf-accent-yellow)",
};

/** Label tipo in italiano */
const LABEL_TIPO: Record<string, string> = {
    cambio_stato: "Cambio stato",
    nota: "Nota",
    foto: "Foto",
    ordine: "Ordine",
};

interface TimelineEntryProps {
    /** Entry della timeline */
    entry: TimelineEntryType;
    /** Mostra linea connettore sotto */
    isUltima?: boolean;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Singola entry della timeline con dot, icona e timestamp */
export function TimelineEntryCard({
    entry,
    isUltima = false,
    className,
}: TimelineEntryProps) {
    const colore = COLORI_TIPO[entry.tipo] ?? "var(--pf-text-muted)";
    const icona = ICONE_TIPO[entry.tipo] ?? <Clock size={14} />;
    const labelTipo = LABEL_TIPO[entry.tipo] ?? entry.tipo;

    const tempoPassato = formatDistanceToNow(new Date(entry.creatoIl), {
        addSuffix: true,
        locale: it,
    });

    return (
        <div className={cn("relative flex gap-4", className)}>
            {/* Linea verticale connettore */}
            {!isUltima && (
                <div
                    className="absolute left-[15px] top-[32px] bottom-0 w-px"
                    style={{ backgroundColor: "var(--pf-border)" }}
                />
            )}

            {/* Dot con icona */}
            <div
                className="relative z-10 flex-shrink-0 flex items-center justify-center w-[30px] h-[30px] rounded-full"
                style={{
                    backgroundColor: `color-mix(in srgb, ${colore} 15%, transparent)`,
                    color: colore,
                }}
            >
                {icona}
            </div>

            {/* Contenuto */}
            <div className="flex-1 pb-6 min-w-0">
                {/* Header: tipo + autore + timestamp */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                        className="text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: colore }}
                    >
                        {labelTipo}
                    </span>
                    <span className="text-[10px] text-[var(--pf-text-muted)]">
                        •
                    </span>
                    <span className="text-xs font-medium text-[var(--pf-text-secondary)]">
                        {entry.autoreNome}
                    </span>
                    <span className="text-[10px] text-[var(--pf-text-muted)] ml-auto">
                        {tempoPassato}
                    </span>
                </div>

                {/* Contenuto */}
                <p className="text-sm text-[var(--pf-text-primary)] leading-relaxed">
                    {entry.contenuto}
                </p>

                {/* Metadata speciale per foto */}
                {entry.tipo === "foto" && entry.metadata && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-[var(--pf-text-muted)]">
                        <Camera size={12} />
                        <span>
                            {(entry.metadata as Record<string, number>).mediaCount} file allegati
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
