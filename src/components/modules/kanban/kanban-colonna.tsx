// Kanban Colonna — singola colonna del kanban board
"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { KanbanCard } from "./kanban-card";
import type { Cantiere } from "@/types";

interface CantiereConRelazioni {
    cantiere: Cantiere;
    nomeCliente: string;
    tipoProdotto: string;
    nomeSquadra: string | null;
    coloreSquadra: string | null;
}

interface KanbanColonnaProps {
    /** ID dello stato (usato come ID colonna) */
    statoId: string;
    /** Label dello stato */
    statoLabel: string;
    /** Colore dello stato */
    statoColore: string;
    /** Cantieri in questa colonna */
    cantieri: CantiereConRelazioni[];
    /** Callback click cantiere */
    onCantiereClick: (id: string) => void;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Singola colonna del kanban board — droppable con header colorato */
export function KanbanColonna({
    statoId,
    statoLabel,
    statoColore,
    cantieri,
    onCantiereClick,
    className,
}: KanbanColonnaProps) {
    const { isOver, setNodeRef } = useDroppable({ id: statoId });

    return (
        <div
            className={cn(
                "flex flex-col min-w-[280px] max-w-[320px] rounded-xl",
                "bg-[var(--pf-bg-elevated)] border border-[var(--pf-border)]",
                isOver && "ring-2 ring-[var(--pf-accent-primary)] ring-offset-1 ring-offset-[var(--pf-bg-primary)]",
                className
            )}
        >
            {/* Header colonna */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--pf-border)]">
                <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: statoColore }}
                />
                <span className="text-sm font-semibold text-[var(--pf-text-primary)] truncate">
                    {statoLabel}
                </span>
                <span
                    className="ml-auto flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-bold"
                    style={{
                        backgroundColor: `color-mix(in srgb, ${statoColore} 15%, transparent)`,
                        color: statoColore,
                    }}
                >
                    {cantieri.length}
                </span>
            </div>

            {/* Lista cards — area droppable */}
            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 p-2.5 space-y-2.5 overflow-y-auto min-h-[120px]",
                    "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--pf-border)]"
                )}
            >
                <SortableContext
                    items={cantieri.map((c) => c.cantiere.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {cantieri.map((c) => (
                        <KanbanCard
                            key={c.cantiere.id}
                            cantiere={c.cantiere}
                            nomeCliente={c.nomeCliente}
                            tipoProdotto={c.tipoProdotto}
                            nomeSquadra={c.nomeSquadra}
                            coloreSquadra={c.coloreSquadra}
                            onCantiereClick={onCantiereClick}
                        />
                    ))}
                </SortableContext>

                {cantieri.length === 0 && (
                    <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-[var(--pf-border)] text-xs text-[var(--pf-text-muted)]">
                        Nessun cantiere
                    </div>
                )}
            </div>
        </div>
    );
}
