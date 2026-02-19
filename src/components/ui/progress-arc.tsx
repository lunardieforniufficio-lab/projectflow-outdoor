// Progress Arc — arco SVG circolare per percentuali
"use client";

import { cn } from "@/lib/utils";

interface ProgressArcProps {
    /** Percentuale da 0 a 100 */
    percentuale: number;
    /** Dimensione in pixel */
    dimensione?: number;
    /** Colore dell'arco */
    colore?: string;
    /** Spessore dell'arco */
    spessore?: number;
    /** Mostra la percentuale al centro */
    mostraLabel?: boolean;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Arco circolare SVG per visualizzare percentuali */
export function ProgressArc({
    percentuale,
    dimensione = 72,
    colore = "var(--pf-accent-primary)",
    spessore = 4,
    mostraLabel = true,
    className,
}: ProgressArcProps) {
    const raggio = (dimensione - spessore) / 2;
    const circonferenza = 2 * Math.PI * raggio;
    const percentualeClamped = Math.max(0, Math.min(100, percentuale));
    const offset = circonferenza - (percentualeClamped / 100) * circonferenza;
    const centro = dimensione / 2;

    return (
        <div
            className={cn("relative inline-flex items-center justify-center", className)}
            style={{ width: dimensione, height: dimensione }}
        >
            <svg
                width={dimensione}
                height={dimensione}
                className="-rotate-90"
            >
                {/* Traccia di sfondo */}
                <circle
                    cx={centro}
                    cy={centro}
                    r={raggio}
                    fill="none"
                    stroke="var(--pf-border)"
                    strokeWidth={spessore}
                    opacity={0.3}
                />
                {/* Arco progress */}
                <circle
                    cx={centro}
                    cy={centro}
                    r={raggio}
                    fill="none"
                    stroke={colore}
                    strokeWidth={spessore}
                    strokeLinecap="round"
                    strokeDasharray={circonferenza}
                    strokeDashoffset={offset}
                    className="transition-[stroke-dashoffset] duration-500 ease-out"
                />
            </svg>
            {mostraLabel && (
                <span
                    className="absolute text-xs font-semibold"
                    style={{ color: colore }}
                >
                    {Math.round(percentualeClamped)}%
                </span>
            )}
        </div>
    );
}
