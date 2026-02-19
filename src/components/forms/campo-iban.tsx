// Campo IBAN — validazione con ibantools
"use client";

import { useState } from "react";
import { isValidIBAN } from "ibantools";
import { Input } from "@/components/ui/input";
import { CampoFormWrapper } from "./campo-form-wrapper";
import { cn } from "@/lib/utils";

interface CampoIbanProps {
    /** Valore corrente */
    valore: string;
    /** Callback al cambio */
    onCambia: (valore: string) => void;
    /** Messaggio di errore esterno */
    errore?: string;
    /** Se il campo è obbligatorio */
    obbligatorio?: boolean;
    /** Se il campo è disabilitato */
    disabilitato?: boolean;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Campo IBAN con validazione e formattazione */
export function CampoIban({
    valore,
    onCambia,
    errore,
    obbligatorio = false,
    disabilitato = false,
    className,
}: CampoIbanProps) {
    const [erroreLocale, setErroreLocale] = useState<string | null>(null);

    function gestisciCambio(nuovoValore: string) {
        // Rimuovi spazi, auto-uppercase
        const pulito = nuovoValore.replace(/\s/g, "").toUpperCase();
        // Formatta con spazi ogni 4 caratteri per leggibilità
        const formattato = pulito.replace(/(.{4})/g, "$1 ").trim();
        onCambia(formattato);
        setErroreLocale(null);
    }

    function gestisciBlur() {
        const pulito = valore.replace(/\s/g, "").toUpperCase();
        if (!pulito) {
            setErroreLocale(null);
            return;
        }
        if (!isValidIBAN(pulito)) {
            setErroreLocale("IBAN non valido");
        } else {
            setErroreLocale(null);
        }
    }

    return (
        <CampoFormWrapper
            label="IBAN"
            errore={errore ?? erroreLocale ?? undefined}
            obbligatorio={obbligatorio}
            descrizione="Es. IT60 X054 2811 1010 0000 0123 456"
            className={className}
        >
            <Input
                type="text"
                value={valore}
                onChange={(e) => gestisciCambio(e.target.value)}
                onBlur={gestisciBlur}
                placeholder="IT60 X054 2811 1010 0000 0123 456"
                disabled={disabilitato}
                className={cn(
                    "font-mono uppercase tracking-wider",
                    (errore ?? erroreLocale) && "border-red-400 focus-visible:ring-red-400"
                )}
            />
        </CampoFormWrapper>
    );
}
