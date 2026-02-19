// Hook CRUD rilievi — dettaglio, creazione, aggiornamento
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import type { Rilievo, RilievoCreazione } from "@/types";

/** Chiavi query per rilievi */
export const CHIAVI_RILIEVI = {
    base: ["rilievi"] as const,
    cantiere: (cantiereId: string) =>
        [...CHIAVI_RILIEVI.base, cantiereId] as const,
};

/** Rilievo di un cantiere (uno per cantiere) */
export function useRilievo(cantiereId: string | undefined) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_RILIEVI.cantiere(cantiereId ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<Rilievo>(
                `/cantieri/${cantiereId}/rilievo`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        enabled: !!cantiereId,
        staleTime: 5 * 60 * 1000,
    });

    return {
        rilievo: query.data ?? null,
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** Creazione rilievo */
export function useCreaRilievo() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cantiereId,
            dati,
        }: {
            cantiereId: string;
            dati: RilievoCreazione;
        }) => {
            const token = await getToken();
            const risposta = await apiPost<Rilievo>(
                `/cantieri/${cantiereId}/rilievo`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({
                queryKey: CHIAVI_RILIEVI.cantiere(variabili.cantiereId),
            });
        },
    });
}

/** Aggiornamento rilievo */
export function useAggiornaRilievo() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cantiereId,
            dati,
        }: {
            cantiereId: string;
            dati: RilievoCreazione;
        }) => {
            const token = await getToken();
            const risposta = await apiPatch<Rilievo>(
                `/cantieri/${cantiereId}/rilievo`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({
                queryKey: CHIAVI_RILIEVI.cantiere(variabili.cantiereId),
            });
        },
    });
}
