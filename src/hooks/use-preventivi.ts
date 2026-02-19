// Hook CRUD preventivi — lista per cantiere, creazione, aggiornamento
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import type { Preventivo, PreventivoCreazione } from "@/types";

/** Chiavi query per preventivi */
export const CHIAVI_PREVENTIVI = {
    base: ["preventivi"] as const,
    cantiere: (cantiereId: string) =>
        [...CHIAVI_PREVENTIVI.base, cantiereId] as const,
};

/** Lista preventivi per cantiere */
export function usePreventivi(cantiereId: string | undefined) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_PREVENTIVI.cantiere(cantiereId ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<Preventivo[]>(
                `/cantieri/${cantiereId}/preventivi`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        enabled: !!cantiereId,
        staleTime: 60 * 1000,
    });

    return {
        preventivi: query.data ?? [],
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** Creazione preventivo */
export function useCreaPreventivo() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cantiereId,
            dati,
        }: {
            cantiereId: string;
            dati: PreventivoCreazione;
        }) => {
            const token = await getToken();
            const risposta = await apiPost<Preventivo>(
                `/cantieri/${cantiereId}/preventivi`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({
                queryKey: CHIAVI_PREVENTIVI.cantiere(variabili.cantiereId),
            });
        },
    });
}

/** Aggiornamento preventivo */
export function useAggiornaPreventivo() {
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
            dati: Partial<PreventivoCreazione & { stato: string }>;
        }) => {
            const token = await getToken();
            const risposta = await apiPatch<Preventivo>(
                `/preventivi/${id}`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({
                queryKey: CHIAVI_PREVENTIVI.cantiere(variabili.cantiereId),
            });
        },
    });
}
