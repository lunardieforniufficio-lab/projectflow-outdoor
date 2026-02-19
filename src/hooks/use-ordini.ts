// Hook CRUD ordini fornitore — lista per cantiere, creazione, aggiornamento
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import type { OrdineFornitore, OrdineCreazione } from "@/types";

/** Chiavi query per ordini */
export const CHIAVI_ORDINI = {
    base: ["ordini"] as const,
    cantiere: (cantiereId: string) =>
        [...CHIAVI_ORDINI.base, cantiereId] as const,
};

/** Lista ordini per cantiere */
export function useOrdini(cantiereId: string | undefined) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_ORDINI.cantiere(cantiereId ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<OrdineFornitore[]>(
                `/cantieri/${cantiereId}/ordini`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        enabled: !!cantiereId,
        staleTime: 60 * 1000,
    });

    return {
        ordini: query.data ?? [],
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** Creazione ordine fornitore */
export function useCreaOrdine() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cantiereId,
            dati,
        }: {
            cantiereId: string;
            dati: OrdineCreazione;
        }) => {
            const token = await getToken();
            const risposta = await apiPost<OrdineFornitore>(
                `/cantieri/${cantiereId}/ordini`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({
                queryKey: CHIAVI_ORDINI.cantiere(variabili.cantiereId),
            });
        },
    });
}

/** Aggiornamento ordine */
export function useAggiornaOrdine() {
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
            dati: Partial<OrdineCreazione & { stato: string; dataConsegnaReale: string }>;
        }) => {
            const token = await getToken();
            const risposta = await apiPatch<OrdineFornitore>(
                `/ordini/${id}`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({
                queryKey: CHIAVI_ORDINI.cantiere(variabili.cantiereId),
            });
        },
    });
}
