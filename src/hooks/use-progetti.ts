// Hook CRUD progetti — lista per cantiere, creazione
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet, apiPost } from "@/lib/api";
import type { Progetto, ProgettoCreazione } from "@/types";

/** Chiavi query per progetti */
export const CHIAVI_PROGETTI = {
    base: ["progetti"] as const,
    cantiere: (cantiereId: string) =>
        [...CHIAVI_PROGETTI.base, cantiereId] as const,
};

/** Lista progetti per cantiere */
export function useProgetti(cantiereId: string | undefined) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_PROGETTI.cantiere(cantiereId ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<Progetto[]>(
                `/cantieri/${cantiereId}/progetti`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        enabled: !!cantiereId,
        staleTime: 5 * 60 * 1000,
    });

    return {
        progetti: query.data ?? [],
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** Creazione progetto */
export function useCreaProgetto() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cantiereId,
            dati,
        }: {
            cantiereId: string;
            dati: ProgettoCreazione;
        }) => {
            const token = await getToken();
            const risposta = await apiPost<Progetto>(
                `/cantieri/${cantiereId}/progetti`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({
                queryKey: CHIAVI_PROGETTI.cantiere(variabili.cantiereId),
            });
        },
    });
}
