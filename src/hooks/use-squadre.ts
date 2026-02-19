// Hook CRUD squadre — lista, dettaglio, creazione, aggiornamento
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import type { Squadra, SquadraCreazione } from "@/types";

/** Chiavi query per squadre */
export const CHIAVI_SQUADRE = {
    base: ["squadre"] as const,
    lista: () => [...CHIAVI_SQUADRE.base, "lista"] as const,
    dettaglio: (id: string) => [...CHIAVI_SQUADRE.base, "dettaglio", id] as const,
};

/** Lista squadre */
export function useSquadre() {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_SQUADRE.lista(),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<Squadra[]>("/squadre", {
                token: token ?? undefined,
            });
            return risposta.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    return {
        squadre: query.data ?? [],
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** Dettaglio squadra con membri */
export function useSquadraDettaglio(id: string | undefined) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_SQUADRE.dettaglio(id ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<Squadra>(
                `/squadre/${id}`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        enabled: !!id,
    });

    return {
        squadra: query.data ?? null,
        isCaricamento: query.isLoading,
        errore: query.error,
    };
}

/** Creazione squadra */
export function useCreaSquadra() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dati: SquadraCreazione) => {
            const token = await getToken();
            const risposta = await apiPost<Squadra>("/squadre", dati, {
                token: token ?? undefined,
            });
            return risposta.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_SQUADRE.base });
        },
    });
}

/** Aggiornamento squadra */
export function useAggiornaSquadra() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, dati }: { id: string; dati: Partial<SquadraCreazione> }) => {
            const token = await getToken();
            const risposta = await apiPatch<Squadra>(
                `/squadre/${id}`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_SQUADRE.base });
            queryClient.invalidateQueries({
                queryKey: CHIAVI_SQUADRE.dettaglio(variabili.id),
            });
        },
    });
}
