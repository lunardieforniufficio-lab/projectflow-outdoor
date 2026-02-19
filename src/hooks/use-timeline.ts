// Hook timeline cantiere — lista paginata e creazione entry
"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet, apiPost } from "@/lib/api";
import type { TimelineEntry, TimelineCreazione } from "@/types";

/** Chiavi query per timeline */
export const CHIAVI_TIMELINE = {
    base: ["timeline"] as const,
    cantiere: (cantiereId: string) =>
        [...CHIAVI_TIMELINE.base, cantiereId] as const,
    filtrata: (cantiereId: string, tipo?: string) =>
        [...CHIAVI_TIMELINE.base, cantiereId, tipo] as const,
};

/** Timeline cantiere con paginazione infinita */
export function useTimeline(
    cantiereId: string | undefined,
    opzioni?: { tipo?: string; limite?: number }
) {
    const { getToken } = useAuth();
    const limite = opzioni?.limite ?? 20;

    const query = useInfiniteQuery({
        queryKey: CHIAVI_TIMELINE.filtrata(cantiereId ?? "", opzioni?.tipo),
        queryFn: async ({ pageParam }) => {
            const token = await getToken();
            const risposta = await apiGet<TimelineEntry[]>(
                `/cantieri/${cantiereId}/timeline`,
                {
                    token: token ?? undefined,
                    parametri: {
                        tipo: opzioni?.tipo,
                        limite,
                        cursore: pageParam as string | undefined,
                    },
                }
            );
            return risposta.data;
        },
        enabled: !!cantiereId,
        staleTime: 30 * 1000,
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (ultimaPagina) => {
            if (ultimaPagina.length < limite) return undefined;
            return ultimaPagina[ultimaPagina.length - 1]?.id;
        },
    });

    return {
        entries: query.data?.pages.flat() ?? [],
        isCaricamento: query.isLoading,
        haAltrePagine: query.hasNextPage,
        caricaProssima: query.fetchNextPage,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** Creazione entry timeline */
export function useCreaTimelineEntry() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cantiereId,
            dati,
        }: {
            cantiereId: string;
            dati: TimelineCreazione;
        }) => {
            const token = await getToken();
            const risposta = await apiPost<TimelineEntry>(
                `/cantieri/${cantiereId}/timeline`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({
                queryKey: CHIAVI_TIMELINE.cantiere(variabili.cantiereId),
            });
        },
    });
}
