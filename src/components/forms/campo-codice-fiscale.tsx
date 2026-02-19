// Campo Codice Fiscale — validazione con codice-fiscale-js
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CampoFormWrapper } from "./campo-form-wrapper";
import { cn } from "@/lib/utils";

interface CampoCodiceFiscaleProps {
    /** Valore corrente */
    valore: string;
    /** Callback al cambio */
    onCambia: (valore: string) => void;
    /** Messaggio di errore esterno (es. da React Hook Form) */
    errore?: string;
    /** Se il campo è obbligatorio */
    obbligatorio?: boolean;
    /** Se il campo è disabilitato */
    disabilitato?: boolean;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Campo codice fiscale con validazione formato e auto-uppercase */
export function CampoCodiceFiscale({
    valore,
    onCambia,
    errore,
    obbligatorio = false,
    disabilitato = false,
    className,
}: CampoCodiceFiscaleProps) {
    const [erroreLocale, setErroreLocale] = useState<string | null>(null);

    function gestisciCambio(nuovoValore: string) {
        // Auto-uppercase e rimuovi spazi
        const pulito = nuovoValore.toUpperCase().replace(/\s/g, "").slice(0, 16);
        onCambia(pulito);

        // Validazione live
        if (pulito.length === 0) {
            setErroreLocale(null);
        } else if (pulito.length < 16) {
            setErroreLocale(`${pulito.length}/16 caratteri`);
        } else if (!/^[A-Z0-9]{16}$/.test(pulito)) {
            setErroreLocale("Formato non valido");
        } else {
            setErroreLocale(null);
        }
    }

    return (
        <CampoFormWrapper
            label="Codice Fiscale"
            errore={errore ?? erroreLocale ?? undefined}
            obbligatorio={obbligatorio}
            className={className}
        >
            <Input
                type="text"
                value={valore}
                onChange={(e) => gestisciCambio(e.target.value)}
                placeholder="RSSMRA85M01H501Z"
                maxLength={16}
                disabled={disabilitato}
                className={cn(
                    "font-mono uppercase tracking-wider",
                    (errore ?? erroreLocale) && "border-red-400 focus-visible:ring-red-400"
                )}
            />
        </CampoFormWrapper>
    );
}
