// Export Toolbar — OBBLIGATORIO su ogni lista/tabella
// Permette export in CSV, Excel (xlsx) e JSON
"use client";

import { esporta, type ColonnaExport, type FormatoExport } from "@/lib/export-utils";
import { cn } from "@/lib/utils";

interface ExportToolbarProps {
    /** Dati da esportare */
    dati: Record<string, unknown>[];
    /** Nome base del file di export */
    nomeFile: string;
    /** Definizione colonne per CSV/Excel */
    colonne: ColonnaExport[];
    /** Formati abilitati */
    formatiAbilitati?: FormatoExport[];
    /** Classe CSS aggiuntiva */
    className?: string;
}

const ICONE_FORMATO: Record<FormatoExport, { label: string; icona: string }> = {
    csv: { label: "CSV", icona: "📄" },
    excel: { label: "Excel", icona: "📊" },
    json: { label: "JSON", icona: "📋" },
};

/** Toolbar di export — CSV, Excel, JSON */
export function ExportToolbar({
    dati,
    nomeFile,
    colonne,
    formatiAbilitati = ["csv", "excel", "json"],
    className,
}: ExportToolbarProps) {
    if (dati.length === 0) return null;

    function gestisciExport(formato: FormatoExport) {
        esporta(formato, dati, colonne, nomeFile);
    }

    return (
        <div className={cn("flex items-center gap-1", className)}>
            <span className="text-xs text-[var(--pf-text-muted)] mr-1">Esporta:</span>
            {formatiAbilitati.map((formato) => (
                <button
                    key={formato}
                    onClick={() => gestisciExport(formato)}
                    className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium",
                        "border border-[var(--pf-border)] bg-[var(--pf-surface-secondary)]",
                        "text-[var(--pf-text-secondary)]",
                        "hover:bg-[var(--pf-surface-tertiary)] hover:text-[var(--pf-text-primary)]",
                        "transition-colors duration-150"
                    )}
                    title={`Esporta in ${ICONE_FORMATO[formato].label}`}
                >
                    <span>{ICONE_FORMATO[formato].icona}</span>
                    <span>{ICONE_FORMATO[formato].label}</span>
                </button>
            ))}
            <span className="text-[10px] text-[var(--pf-text-muted)] ml-1">
                ({dati.length} righe)
            </span>
        </div>
    );
}
