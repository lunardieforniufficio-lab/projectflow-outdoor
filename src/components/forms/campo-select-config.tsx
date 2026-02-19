// Campo Select Config — select generico che carica opzioni da tabella DB
// Fondamentale per il principio ZERO HARDCODING
"use client";

import { cn } from "@/lib/utils";
import { CampoFormWrapper } from "./campo-form-wrapper";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface CampoSelectConfigProps {
    /** Valore selezionato */
    valore: string;
    /** Callback al cambio */
    onCambia: (valore: string) => void;
    /** Label del campo */
    label?: string;
    /** Opzioni da mostrare (caricate dal hook useConfigurazione) */
    opzioni: { id: string; label: string; colore?: string }[];
    /** Se sta caricando */
    isCaricamento?: boolean;
    /** Messaggio di errore */
    errore?: string;
    /** Se il campo è obbligatorio */
    obbligatorio?: boolean;
    /** Se il campo è disabilitato */
    disabilitato?: boolean;
    /** Placeholder */
    placeholder?: string;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Select generico per configurazioni da DB — ZERO hardcoding */
export function CampoSelectConfig({
    valore,
    onCambia,
    label,
    opzioni,
    isCaricamento = false,
    errore,
    obbligatorio = false,
    disabilitato = false,
    placeholder = "Seleziona...",
    className,
}: CampoSelectConfigProps) {
    if (isCaricamento) {
        return (
            <CampoFormWrapper label={label} obbligatorio={obbligatorio} className={className}>
                <Skeleton className="h-10 w-full rounded-md" />
            </CampoFormWrapper>
        );
    }

    return (
        <CampoFormWrapper
            label={label}
            errore={errore}
            obbligatorio={obbligatorio}
            className={className}
        >
            <Select
                value={valore}
                onValueChange={onCambia}
                disabled={disabilitato}
            >
                <SelectTrigger
                    className={cn(
                        errore && "border-red-400 focus:ring-red-400"
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-[var(--pf-surface-secondary)] border-[var(--pf-border)]">
                    {opzioni.map((opzione) => (
                        <SelectItem key={opzione.id} value={opzione.id}>
                            <span className="flex items-center gap-2">
                                {opzione.colore && (
                                    <span
                                        className="h-2.5 w-2.5 rounded-full inline-block"
                                        style={{ backgroundColor: opzione.colore }}
                                    />
                                )}
                                {opzione.label}
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </CampoFormWrapper>
    );
}
