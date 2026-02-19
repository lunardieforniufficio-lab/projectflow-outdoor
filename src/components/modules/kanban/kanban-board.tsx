// Kanban Board — board con colonne per stato cantiere, drag-and-drop
"use client";

import { useState, useMemo, useCallback } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { KanbanColonna } from "./kanban-colonna";
import type { Cantiere } from "@/types";

interface StatoConfig {
    id: string;
    codice: string;
    label: string;
    colore: string;
    ordine: number;
}

interface CantiereRisolto {
    cantiere: Cantiere;
    nomeCliente: string;
    tipoProdotto: string;
    nomeSquadra: string | null;
    coloreSquadra: string | null;
}

interface KanbanBoardProps {
    /** Cantieri con relazioni risolte */
    cantieri: CantiereRisolto[];
    /** Configurazione stati (colonne) */
    stati: StatoConfig[];
    /** Callback click cantiere */
    onCantiereClick: (id: string) => void;
    /** Callback drag-and-drop (cambio stato) */
    onDragEnd?: (cantiereId: string, nuovoStatoId: string) => void;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Board kanban con colonne per stato cantiere e drag-and-drop */
export function KanbanBoard({
    cantieri,
    stati,
    onCantiereClick,
    onDragEnd,
    className,
}: KanbanBoardProps) {
    const [idDragging, setIdDragging] = useState<string | null>(null);

    // Sensori con distanza minima per evitare drag accidentale su click
    const sensori = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    // Stessa ordine della pipeline
    const statiOrdinati = useMemo(
        () => [...stati].sort((a, b) => a.ordine - b.ordine),
        [stati]
    );

    // Cantieri raggruppati per stato
    const cantieriPerStato = useMemo(() => {
        const mappa = new Map<string, CantiereRisolto[]>();
        for (const stato of statiOrdinati) {
            mappa.set(stato.id, []);
        }
        for (const c of cantieri) {
            const lista = mappa.get(c.cantiere.statoId);
            if (lista) {
                lista.push(c);
            }
        }
        return mappa;
    }, [cantieri, statiOrdinati]);

    // Cantiere in drag
    const cantiereDragging = useMemo(
        () => cantieri.find((c) => c.cantiere.id === idDragging) ?? null,
        [cantieri, idDragging]
    );

    const gestisciDragStart = useCallback((event: DragStartEvent) => {
        setIdDragging(event.active.id as string);
    }, []);

    const gestisciDragEnd = useCallback(
        (event: DragEndEvent) => {
            setIdDragging(null);
            const { active, over } = event;
            if (!over) return;

            const cantiereId = active.id as string;
            const nuovoStatoId = over.id as string;

            // Verifica che la colonna esista
            const statoEsiste = stati.some((s) => s.id === nuovoStatoId);
            if (!statoEsiste) return;

            // Verifica che sia un cambio effettivo
            const cantiere = cantieri.find((c) => c.cantiere.id === cantiereId);
            if (!cantiere || cantiere.cantiere.statoId === nuovoStatoId) return;

            onDragEnd?.(cantiereId, nuovoStatoId);
        },
        [cantieri, stati, onDragEnd]
    );

    return (
        <DndContext
            sensors={sensori}
            collisionDetection={closestCorners}
            onDragStart={gestisciDragStart}
            onDragEnd={gestisciDragEnd}
        >
            <div
                className={cn(
                    "flex gap-4 overflow-x-auto pb-4",
                    "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--pf-border)]",
                    className
                )}
            >
                {statiOrdinati.map((stato) => (
                    <KanbanColonna
                        key={stato.id}
                        statoId={stato.id}
                        statoLabel={stato.label}
                        statoColore={stato.colore}
                        cantieri={cantieriPerStato.get(stato.id) ?? []}
                        onCantiereClick={onCantiereClick}
                    />
                ))}
            </div>

            {/* Drag overlay — card fantasma durante il drag */}
            <DragOverlay>
                {cantiereDragging && (
                    <div className="rounded-lg border border-[var(--pf-accent-primary)]/50 bg-[var(--pf-bg-surface)] p-3.5 shadow-xl opacity-90 w-[280px]">
                        <span className="font-mono text-xs font-bold text-[var(--pf-accent-primary)]">
                            {cantiereDragging.cantiere.codice}
                        </span>
                        <p className="text-sm font-medium text-[var(--pf-text-primary)] mt-1 truncate">
                            {cantiereDragging.nomeCliente}
                        </p>
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}
