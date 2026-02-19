// Pagina dettaglio cantiere — carica cantiere da mock e compone i moduli
"use client";

import { use, useMemo } from "react";
import { notFound } from "next/navigation";
import { CantiereHeader } from "@/components/modules/cantiere-detail/cantiere-header";
import { CantiereTabs } from "@/components/modules/cantiere-detail/cantiere-tabs";
import {
    cantieriDettaglioDemo,
    statiCantiereDemo,
    timelineDemo,
} from "@/lib/dati-mock";
import type { CantiereDettaglio } from "@/types";

interface PaginaCantiereProps {
    params: Promise<{ id: string }>;
}

export default function PaginaCantiere({ params }: PaginaCantiereProps) {
    const { id } = use(params);

    // Carica cantiere da mock (verrà sostituito da API)
    const cantiere = useMemo(
        () => cantieriDettaglioDemo.find((c) => c.id === id),
        [id]
    );

    if (!cantiere) {
        notFound();
    }

    // Posizione nella pipeline per progress arc
    const posizioneStato = useMemo(() => {
        const stato = statiCantiereDemo.find((s) => s.id === cantiere.statoId);
        return stato?.ordine ?? 1;
    }, [cantiere.statoId]);

    // Timeline entries per questo cantiere
    const timelineEntries = useMemo(
        () => timelineDemo.filter((t) => t.cantiereId === id),
        [id]
    );

    return (
        <div className="space-y-6">
            <CantiereHeader
                cantiere={cantiere}
                totaleStati={statiCantiereDemo.length}
                posizioneStato={posizioneStato}
            />
            <CantiereTabs
                cantiere={cantiere}
                timelineEntries={timelineEntries}
            />
        </div>
    );
}
