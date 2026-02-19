// Hook CRUD fatture — lista per cantiere, creazione, aggiornamento
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import type { Fattura, FatturaCreazione } from "@/types";
import { CHIAVI_CANTIERI } from "./use-cantieri";

/** Chiavi query per fatture */
export const CHIAVI_FATTURE = {
    base: ["fatture"] as const,
    cantiere: (cantiereId: string) =>
        [...CHIAVI_FATTURE.base, cantiereId] as const,
};

/** Lista fatture per cantiere */
export function useFatture(cantiereId: string | undefined) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_FATTURE.cantiere(cantiereId ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<Fattura[]>(
                `/cantieri/${cantiereId}/fatture`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        enabled: !!cantiereId,
        staleTime: 60 * 1000,
    });

    return {
        fatture: query.data ?? [],
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** Creazione fattura */
export function useCreaFattura() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cantiereId,
            dati,
        }: {
            cantiereId: string;
            dati: FatturaCreazione;
        }) => {
            const token = await getToken();
            const risposta = await apiPost<Fattura>(
                `/cantieri/${cantiereId}/fatture`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({
                queryKey: CHIAVI_FATTURE.cantiere(variabili.cantiereId),
            });
            // Invalida anche cantiere (acconto potrebbe cambiare)
            queryClient.invalidateQueries({
                queryKey: CHIAVI_CANTIERI.dettaglio(variabili.cantiereId),
            });
        },
    });
}

/** Aggiornamento fattura */
export function useAggiornaFattura() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            cantiereId,
            dati,
        }: {
            id: string;
            cantiereId: string;
            dati: Partial<FatturaCreazione & { dataPagamento: string; stato: string }>;
        }) => {
            const token = await getToken();
            const risposta = await apiPatch<Fattura>(
                `/fatture/${id}`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({
                queryKey: CHIAVI_FATTURE.cantiere(variabili.cantiereId),
            });
            queryClient.invalidateQueries({
                queryKey: CHIAVI_CANTIERI.dettaglio(variabili.cantiereId),
            });
        },
    });
}
