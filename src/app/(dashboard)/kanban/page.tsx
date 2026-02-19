// Pagina Kanban — board con colonne per stato cantiere
"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Columns3 } from "lucide-react";
import { KanbanBoard } from "@/components/modules/kanban/kanban-board";
import {
    cantieriDemo,
    statiCantiereDemo,
    clientiDemo,
    tipiProdottoDemo,
    squadreDemo,
} from "@/lib/dati-mock";
import type { Cantiere } from "@/types";

export default function PaginaKanban() {
    const router = useRouter();

    // Stato locale cantieri (per gestire drag-and-drop senza API)
    const [cantieriLocali, setCantieriLocali] = useState<Cantiere[]>(cantieriDemo);

    // Cantieri con relazioni risolte
    const cantieriRisolti = useMemo(
        () =>
            cantieriLocali.map((cantiere) => {
                const cliente = clientiDemo.find((c) => c.id === cantiere.clienteId);
                const tipo = tipiProdottoDemo.find((t) => t.id === cantiere.tipoProdottoId);
                const squadra = squadreDemo.find((s) => s.id === cantiere.squadraId);

                return {
                    cantiere,
                    nomeCliente: cliente
                        ? `${cliente.cognome} ${cliente.nome}`
                        : "—",
                    tipoProdotto: tipo?.label ?? "—",
                    nomeSquadra: squadra?.nome ?? null,
                    coloreSquadra: squadra?.colore ?? null,
                };
            }),
        [cantieriLocali]
    );

    // Config stati per le colonne
    const statiConfig = useMemo(
        () =>
            statiCantiereDemo.map((s) => ({
                id: s.id,
                codice: s.codice,
                label: s.label,
                colore: s.colore,
                ordine: s.ordine,
            })),
        []
    );

    // Gestione drag-and-drop (aggiorna stato locale)
    const gestisciDragEnd = useCallback(
        (cantiereId: string, nuovoStatoId: string) => {
            setCantieriLocali((prev) =>
                prev.map((c) =>
                    c.id === cantiereId ? { ...c, statoId: nuovoStatoId } : c
                )
            );
        },
        []
    );

    // Click cantiere → dettaglio
    const gestisciClickCantiere = useCallback(
        (id: string) => {
            router.push(`/cantieri/${id}`);
        },
        [router]
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--pf-text-primary)] flex items-center gap-3">
                    <Columns3
                        size={28}
                        className="text-[var(--pf-accent-primary)]"
                    />
                    Kanban
                </h1>
                <p className="text-sm text-[var(--pf-text-secondary)] mt-1">
                    {cantieriLocali.length} cantieri — trascina per cambiare stato
                </p>
            </div>

            {/* Board */}
            <KanbanBoard
                cantieri={cantieriRisolti}
                stati={statiConfig}
                onCantiereClick={gestisciClickCantiere}
                onDragEnd={gestisciDragEnd}
            />
        </div>
    );
}
