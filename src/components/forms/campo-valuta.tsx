// Campo Valuta — input numerico con simbolo euro e formattazione
"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { CampoFormWrapper } from "./campo-form-wrapper";
import { cn } from "@/lib/utils";

interface CampoValutaProps {
    /** Valore numerico (in centesimi o unità) */
    valore: number | null;
    /** Callback al cambio */
    onCambia: (valore: number | null) => void;
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

/** Campo importo con simbolo € e formattazione italiana */
export function CampoValuta({
    valore,
    onCambia,
    errore,
    obbligatorio = false,
    disabilitato = false,
    label = "Importo",
    className,
}: CampoValutaProps) {
    const [testoInput, setTestoInput] = useState(
        valore !== null ? formattaNumero(valore) : ""
    );
    const inputRef = useRef<HTMLInputElement>(null);

    function formattaNumero(num: number): string {
        return num.toLocaleString("it-IT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    function gestisciCambio(testo: string) {
        // Permetti solo numeri, virgola e punto
        const pulito = testo.replace(/[^\d.,]/g, "");
        setTestoInput(pulito);
    }

    function gestisciBlur() {
        if (!testoInput || testoInput.trim() === "") {
            onCambia(null);
            return;
        }
        // Converti formato italiano (virgola → punto) per parsing
        const normalizzato = testoInput.replace(/\./g, "").replace(",", ".");
        const numero = parseFloat(normalizzato);
        if (isNaN(numero)) {
            onCambia(null);
            setTestoInput("");
        } else {
            onCambia(numero);
            setTestoInput(formattaNumero(numero));
        }
    }

    function gestisciFocus() {
        // Mostra il numero puro per editing
        if (valore !== null) {
            setTestoInput(valore.toString().replace(".", ","));
        }
    }

    return (
        <CampoFormWrapper
            label={label}
            errore={errore}
            obbligatorio={obbligatorio}
            className={className}
        >
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--pf-text-muted)]">
                    €
                </span>
                <Input
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    value={testoInput}
                    onChange={(e) => gestisciCambio(e.target.value)}
                    onBlur={gestisciBlur}
                    onFocus={gestisciFocus}
                    placeholder="0,00"
                    disabled={disabilitato}
                    className={cn(
                        "pl-8 text-right font-mono",
                        errore && "border-red-400 focus-visible:ring-red-400"
                    )}
                />
            </div>
        </CampoFormWrapper>
    );
}
