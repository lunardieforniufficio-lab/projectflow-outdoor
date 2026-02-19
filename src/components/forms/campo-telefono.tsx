// Campo Telefono — validazione con libphonenumber-js
"use client";

import { useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Input } from "@/components/ui/input";
import { CampoFormWrapper } from "./campo-form-wrapper";
import { cn } from "@/lib/utils";

interface CampoTelefonoProps {
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
    /** Label personalizzata */
    label?: string;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Campo telefono con validazione formato italiano */
export function CampoTelefono({
    valore,
    onCambia,
    errore,
    obbligatorio = false,
    disabilitato = false,
    label = "Telefono",
    className,
}: CampoTelefonoProps) {
    const [erroreLocale, setErroreLocale] = useState<string | null>(null);

    function gestisciBlur() {
        if (!valore || valore.trim() === "") {
            setErroreLocale(null);
            return;
        }
        const numero = parsePhoneNumberFromString(valore, "IT");
        if (!numero?.isValid()) {
            setErroreLocale("Numero non valido");
        } else {
            // Formatta il numero
            onCambia(numero.formatInternational());
            setErroreLocale(null);
        }
    }

    return (
        <CampoFormWrapper
            label={label}
            errore={errore ?? erroreLocale ?? undefined}
            obbligatorio={obbligatorio}
            className={className}
        >
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--pf-text-muted)]">
                    🇮🇹
                </span>
                <Input
                    type="tel"
                    value={valore}
                    onChange={(e) => {
                        onCambia(e.target.value);
                        setErroreLocale(null);
                    }}
                    onBlur={gestisciBlur}
                    placeholder="+39 333 123 4567"
                    disabled={disabilitato}
                    className={cn(
                        "pl-10",
                        (errore ?? erroreLocale) && "border-red-400 focus-visible:ring-red-400"
                    )}
                />
            </div>
        </CampoFormWrapper>
    );
}
