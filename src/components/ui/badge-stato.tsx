// Badge Stato — pill colorata con colore da DB (ZERO hardcoding)
"use client";

import { cn } from "@/lib/utils";

interface BadgeStatoProps {
    /** Label dello stato (es. "Lead", "Vendita") */
    label: string;
    /** Colore esadecimale dallo stato DB */
    colore: string;
    /** Dimensione badge */
    dimensione?: "sm" | "md";
    /** Effetto glow */
    conGlow?: boolean;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Badge colorato per lo stato di un cantiere — colori dal DB */
export function BadgeStato({
    label,
    colore,
    dimensione = "md",
    conGlow = false,
    className,
}: BadgeStatoProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full font-medium tracking-wide uppercase",
                dimensione === "sm" && "px-2 py-1 text-[10px]",
                dimensione === "md" && "px-3 py-1.5 text-xs",
                conGlow && "shadow-lg",
                className
            )}
            style={{
                backgroundColor: `${colore}20`,
                color: colore,
                borderWidth: "1px",
                borderColor: `${colore}40`,
                ...(conGlow
                    ? { boxShadow: `0 0 12px ${colore}30, 0 0 4px ${colore}20` }
                    : {}),
            }}
        >
            <span
                className="mr-1.5 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: colore }}
            />
            {label}
        </span>
    );
}
