// Campo Data — date picker con react-day-picker e localizzazione italiana
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CampoFormWrapper } from "./campo-form-wrapper";
import { cn } from "@/lib/utils";

interface CampoDataProps {
    /** Data selezionata */
    valore: Date | null;
    /** Callback al cambio */
    onCambia: (data: Date | null) => void;
    /** Messaggio di errore esterno */
    errore?: string;
    /** Se il campo è obbligatorio */
    obbligatorio?: boolean;
    /** Se il campo è disabilitato */
    disabilitato?: boolean;
    /** Label personalizzata */
    label?: string;
    /** Placeholder */
    placeholder?: string;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Campo data con popover calendario italiano */
export function CampoData({
    valore,
    onCambia,
    errore,
    obbligatorio = false,
    disabilitato = false,
    label = "Data",
    placeholder = "Seleziona data",
    className,
}: CampoDataProps) {
    const [aperto, setAperto] = useState(false);

    return (
        <CampoFormWrapper
            label={label}
            errore={errore}
            obbligatorio={obbligatorio}
            className={className}
        >
            <Popover open={aperto} onOpenChange={setAperto}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabilitato}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !valore && "text-[var(--pf-text-muted)]",
                            errore && "border-red-400"
                        )}
                    >
                        <svg
                            className="mr-2 h-4 w-4 text-[var(--pf-text-muted)]"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M8 2v4M16 2v4" />
                            <rect width="18" height="18" x="3" y="4" rx="2" />
                            <path d="M3 10h18" />
                        </svg>
                        {valore
                            ? format(valore, "dd MMMM yyyy", { locale: it })
                            : placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 bg-[var(--pf-surface-secondary)] border-[var(--pf-border)]"
                    align="start"
                >
                    <DayPicker
                        mode="single"
                        selected={valore ?? undefined}
                        onSelect={(data) => {
                            onCambia(data ?? null);
                            setAperto(false);
                        }}
                        locale={it}
                        className="p-3"
                        classNames={{
                            day: "h-9 w-9 text-center text-sm p-0 relative rounded-md hover:bg-[var(--pf-surface-tertiary)] focus:bg-[var(--pf-accent-primary)] focus:text-white",
                            selected: "bg-[var(--pf-accent-primary)] text-white hover:bg-[var(--pf-accent-primary)]",
                            today: "bg-[var(--pf-surface-tertiary)] font-bold",
                            chevron: "text-[var(--pf-text-muted)]",
                        }}
                    />
                </PopoverContent>
            </Popover>
        </CampoFormWrapper>
    );
}
