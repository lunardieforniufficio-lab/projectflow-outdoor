// Hook CRUD cantieri — lista, dettaglio, creazione, aggiornamento, transizione stato
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import type {
    Cantiere,
    CantiereDettaglio,
    CantiereCreazione,
    CantiereAggiornamento,
    TransizioneStatoPayload,
    VincoloStatoRisposta,
    FiltriCantiere,
} from "@/types";

/** Chiavi query per cantieri */
export const CHIAVI_CANTIERI = {
    base: ["cantieri"] as const,
    lista: (filtri?: FiltriCantiere) => [...CHIAVI_CANTIERI.base, "lista", filtri] as const,
    dettaglio: (id: string) => [...CHIAVI_CANTIERI.base, "dettaglio", id] as const,
    vincoli: (id: string) => [...CHIAVI_CANTIERI.base, "vincoli", id] as const,
};

/** Lista cantieri con filtri */
export function useCantieri(filtri?: FiltriCantiere) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_CANTIERI.lista(filtri),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<Cantiere[]>("/cantieri", {
                token: token ?? undefined,
                parametri: {
                    stato_id: filtri?.statoId,
                    squadra_id: filtri?.squadraId,
                    search: filtri?.ricerca,
                    pagina: filtri?.pagina,
                    limite: filtri?.limite,
                    ordine: filtri?.ordine,
                },
            });
            return risposta;
        },
        staleTime: 2 * 60 * 1000,
    });

    return {
        cantieri: query.data?.data ?? [],
        meta: query.data?.meta,
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** Dettaglio cantiere con relazioni */
export function useCantiereDettaglio(id: string | undefined) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_CANTIERI.dettaglio(id ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<CantiereDettaglio>(
                `/cantieri/${id}`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        enabled: !!id,
        staleTime: 60 * 1000,
    });

    return {
        cantiere: query.data ?? null,
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** Vincoli per la prossima transizione */
export function useVincoliCantiere(cantiereId: string | undefined) {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: CHIAVI_CANTIERI.vincoli(cantiereId ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<VincoloStatoRisposta[]>(
                `/cantieri/${cantiereId}/vincoli`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        enabled: !!cantiereId,
        staleTime: 30 * 1000,
    });
}

/** Creazione cantiere */
export function useCreaCantiere() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dati: CantiereCreazione) => {
            const token = await getToken();
            const risposta = await apiPost<Cantiere>("/cantieri", dati, {
                token: token ?? undefined,
            });
            return risposta.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_CANTIERI.base });
        },
    });
}

/** Aggiornamento cantiere */
export function useAggiornaCantiere() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, dati }: { id: string; dati: CantiereAggiornamento }) => {
            const token = await getToken();
            const risposta = await apiPatch<Cantiere>(
                `/cantieri/${id}`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_CANTIERI.base });
            queryClient.invalidateQueries({
                queryKey: CHIAVI_CANTIERI.dettaglio(variabili.id),
            });
        },
    });
}

/** Transizione stato cantiere (FSM) */
export function useTransizioneStato() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cantiereId,
            payload,
        }: {
            cantiereId: string;
            payload: TransizioneStatoPayload;
        }) => {
            const token = await getToken();
            const risposta = await apiPost<Cantiere>(
                `/cantieri/${cantiereId}/stato`,
                payload,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_CANTIERI.base });
            queryClient.invalidateQueries({
                queryKey: CHIAVI_CANTIERI.dettaglio(variabili.cantiereId),
            });
            queryClient.invalidateQueries({
                queryKey: CHIAVI_CANTIERI.vincoli(variabili.cantiereId),
            });
        },
    });
}
