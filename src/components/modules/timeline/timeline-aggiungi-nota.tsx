// Timeline Aggiungi Nota — mini-form inline per note rapide
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineAggiungiNotaProps {
    /** Callback invio nota */
    onInvia: (contenuto: string) => void;
    /** Placeholder textarea */
    placeholder?: string;
    /** Disabilitato */
    isDisabilitato?: boolean;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Mini-form inline per aggiungere una nota rapida alla timeline */
export function TimelineAggiungiNota({
    onInvia,
    placeholder = "Scrivi una nota...",
    isDisabilitato = false,
    className,
}: TimelineAggiungiNotaProps) {
    const [contenuto, setContenuto] = useState("");

    function gestisciInvio() {
        const testoTrimmed = contenuto.trim();
        if (!testoTrimmed) return;
        onInvia(testoTrimmed);
        setContenuto("");
    }

    function gestisciKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        // Ctrl+Enter o Cmd+Enter per inviare
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            gestisciInvio();
        }
    }

    return (
        <div
            className={cn(
                "rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)] p-4",
                className
            )}
        >
            <textarea
                value={contenuto}
                onChange={(e) => setContenuto(e.target.value)}
                onKeyDown={gestisciKeyDown}
                placeholder={placeholder}
                disabled={isDisabilitato}
                rows={2}
                className={cn(
                    "w-full resize-none bg-transparent text-sm text-[var(--pf-text-primary)]",
                    "placeholder:text-[var(--pf-text-muted)]",
                    "focus:outline-none",
                    "disabled:opacity-50"
                )}
            />
            <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-[var(--pf-text-muted)]">
                    Ctrl+Enter per inviare
                </span>
                <Button
                    onClick={gestisciInvio}
                    disabled={!contenuto.trim() || isDisabilitato}
                    size="sm"
                    className="gap-1.5"
                    style={{
                        backgroundColor: contenuto.trim()
                            ? "var(--pf-accent-primary)"
                            : undefined,
                        color: contenuto.trim() ? "white" : undefined,
                    }}
                >
                    <Send size={14} />
                    Invia
                </Button>
            </div>
        </div>
    );
}
