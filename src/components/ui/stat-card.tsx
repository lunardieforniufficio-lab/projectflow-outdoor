// Card statistica riusabile — usata nella dashboard
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    titolo: string;
    valore: string | number;
    descrizione?: string;
    icona: LucideIcon;
    coloreIcona?: string;
    trend?: {
        valore: number;
        positivo: boolean;
    };
    className?: string;
}

export function StatCard({
    titolo,
    valore,
    descrizione,
    icona: Icona,
    coloreIcona = "var(--pf-accent-primary)",
    trend,
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-[var(--pf-border)]",
                "bg-[var(--pf-bg-surface)] p-5",
                "transition-all duration-200 hover:border-[var(--pf-border-focus)]/30",
                className
            )}
        >
            {/* Glow sottile in alto */}
            <div
                className="absolute top-0 left-0 right-0 h-[1px] opacity-40"
                style={{
                    background: `linear-gradient(90deg, transparent, ${coloreIcona}, transparent)`,
                }}
            />

            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--pf-text-muted)]">
                        {titolo}
                    </p>
                    <p className="text-2xl font-bold text-[var(--pf-text-primary)] tabular-nums">
                        {valore}
                    </p>
                    {descrizione && (
                        <p className="text-xs text-[var(--pf-text-secondary)]">
                            {descrizione}
                        </p>
                    )}
                    {trend && (
                        <p
                            className={cn(
                                "text-xs font-medium",
                                trend.positivo ? "text-emerald-400" : "text-red-400"
                            )}
                        >
                            {trend.positivo ? "↑" : "↓"} {Math.abs(trend.valore)}%{" "}
                            <span className="text-[var(--pf-text-muted)]">vs mese prec.</span>
                        </p>
                    )}
                </div>

                <div
                    className="flex-shrink-0 rounded-lg p-2.5"
                    style={{
                        backgroundColor: `color-mix(in srgb, ${coloreIcona} 12%, transparent)`,
                    }}
                >
                    <Icona
                        size={22}
                        style={{ color: coloreIcona }}
                    />
                </div>
            </div>
        </div>
    );
}
