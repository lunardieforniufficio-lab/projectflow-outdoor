// Hook CRITICO — carica configurazioni da DB via n8n
// Usato ovunque per stati, ruoli, tipi prodotto, aree — ZERO HARDCODING
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet } from "@/lib/api";
import type { TipoConfigurazione, MappaConfigurazione } from "@/types";

/** Chiavi query per TanStack Query */
export const CHIAVI_CONFIG = {
    base: ["configurazione"] as const,
    tipo: (tipo: TipoConfigurazione) => [...CHIAVI_CONFIG.base, tipo] as const,
    transizioni: () => [...CHIAVI_CONFIG.base, "transizioni"] as const,
    permessi: (ruoloId: string) => [...CHIAVI_CONFIG.base, "permessi", ruoloId] as const,
};

/**
 * Hook per caricare configurazioni dal database
 *
 * @example
 * // Carica tutti gli stati cantiere
 * const { dati, isCaricamento, errore } = useConfigurazione("stati_cantiere");
 *
 * // Carica ruoli
 * const { dati: ruoli } = useConfigurazione("ruoli");
 */
export function useConfigurazione<T extends TipoConfigurazione>(
    tipo: T,
    opzioni?: { abilitato?: boolean }
) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_CONFIG.tipo(tipo),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<MappaConfigurazione[T][]>(
                `/config/${tipo}`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minuti di cache
        enabled: opzioni?.abilitato !== false,
    });

    return {
        dati: query.data ?? [],
        isCaricamento: query.isLoading,
        isPending: query.isPending,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/**
 * Hook per caricare le transizioni FSM con vincoli
 */
export function useTransizioni(opzioni?: { abilitato?: boolean }) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_CONFIG.transizioni(),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<MappaConfigurazione["transizioni"][]>(
                "/config/transizioni",
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        staleTime: 5 * 60 * 1000,
        enabled: opzioni?.abilitato !== false,
    });

    return {
        dati: query.data ?? [],
        isCaricamento: query.isLoading,
        errore: query.error,
    };
}

/**
 * Hook per cercare un item config per ID
 *
 * @example
 * const stato = useConfigPerId("stati_cantiere", cantiereStatoId);
 */
export function useConfigPerId<T extends TipoConfigurazione>(
    tipo: T,
    id: string | undefined
): MappaConfigurazione[T] | undefined {
    const { dati } = useConfigurazione(tipo);

    if (!id || dati.length === 0) return undefined;

    return (dati as Array<{ id: string }>).find((item) => item.id === id) as
        | MappaConfigurazione[T]
        | undefined;
}
