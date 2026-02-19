// Kanban Card — card draggable per singolo cantiere
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { GripVertical, MapPin } from "lucide-react";
import type { Cantiere } from "@/types";

interface KanbanCardProps {
    /** Cantiere da visualizzare */
    cantiere: Cantiere;
    /** Nome cliente */
    nomeCliente: string;
    /** Tipo prodotto */
    tipoProdotto: string;
    /** Nome squadra */
    nomeSquadra: string | null;
    /** Colore squadra */
    coloreSquadra: string | null;
    /** Callback click card */
    onCantiereClick: (id: string) => void;
}

/** Formatta importo in € italiano */
function formatValuta(valore: number): string {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(valore);
}

/** Card draggable per il kanban — mostra info principali del cantiere */
export function KanbanCard({
    cantiere,
    nomeCliente,
    tipoProdotto,
    nomeSquadra,
    coloreSquadra,
    onCantiereClick,
}: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: cantiere.id });

    const stile = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={stile}
            className={cn(
                "group rounded-lg border border-[var(--pf-border)] bg-[var(--pf-bg-surface)]",
                "p-3.5 cursor-pointer transition-all duration-200",
                "hover:border-[var(--pf-border-focus)]/40 hover:shadow-md",
                isDragging && "opacity-50 shadow-lg ring-2 ring-[var(--pf-accent-primary)]/30"
            )}
            onClick={() => onCantiereClick(cantiere.id)}
        >
            {/* Header: codice + drag handle */}
            <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-[var(--pf-accent-primary)]">
                    {cantiere.codice}
                </span>
                <button
                    className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-[var(--pf-bg-hover)] text-[var(--pf-text-muted)] transition-opacity"
                    {...attributes}
                    {...listeners}
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical size={14} />
                </button>
            </div>

            {/* Cliente */}
            <p className="text-sm font-medium text-[var(--pf-text-primary)] truncate">
                {nomeCliente}
            </p>

            {/* Tipo prodotto */}
            <p className="text-xs text-[var(--pf-text-secondary)] mt-0.5 truncate">
                {tipoProdotto}
            </p>

            {/* Footer: importo + squadra */}
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[var(--pf-border-light)]">
                <span className="text-xs font-medium tabular-nums text-[var(--pf-text-secondary)]">
                    {cantiere.importoTotale ? formatValuta(cantiere.importoTotale) : "—"}
                </span>

                {nomeSquadra ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--pf-text-muted)]">
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: coloreSquadra ?? "#666" }}
                        />
                        {nomeSquadra}
                    </span>
                ) : cantiere.cittaCantiere ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--pf-text-muted)]">
                        <MapPin size={10} />
                        {cantiere.cittaCantiere}
                    </span>
                ) : null}
            </div>
        </div>
    );
}
