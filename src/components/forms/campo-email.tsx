// Campo Email — validazione Zod built-in
"use client";

import { Input } from "@/components/ui/input";
import { CampoFormWrapper } from "./campo-form-wrapper";
import { cn } from "@/lib/utils";

interface CampoEmailProps {
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

/** Campo email con icona */
export function CampoEmail({
    valore,
    onCambia,
    errore,
    obbligatorio = false,
    disabilitato = false,
    label = "Email",
    className,
}: CampoEmailProps) {
    return (
        <CampoFormWrapper
            label={label}
            errore={errore}
            obbligatorio={obbligatorio}
            className={className}
        >
            <div className="relative">
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--pf-text-muted)]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <Input
                    type="email"
                    value={valore}
                    onChange={(e) => onCambia(e.target.value)}
                    placeholder="nome@esempio.it"
                    disabled={disabilitato}
                    className={cn(
                        "pl-10",
                        errore && "border-red-400 focus-visible:ring-red-400"
                    )}
                />
            </div>
        </CampoFormWrapper>
    );
}
