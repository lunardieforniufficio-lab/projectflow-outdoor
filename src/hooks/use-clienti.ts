// Hook CRUD clienti — lista, dettaglio, creazione, aggiornamento
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import type { Cliente, ClienteCreazione, FiltriClienti } from "@/types";

/** Chiavi query per clienti */
export const CHIAVI_CLIENTI = {
    base: ["clienti"] as const,
    lista: (filtri?: FiltriClienti) => [...CHIAVI_CLIENTI.base, "lista", filtri] as const,
    dettaglio: (id: string) => [...CHIAVI_CLIENTI.base, "dettaglio", id] as const,
};

/** Lista clienti con filtri */
export function useClienti(filtri?: FiltriClienti) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_CLIENTI.lista(filtri),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<Cliente[]>("/clienti", {
                token: token ?? undefined,
                parametri: {
                    search: filtri?.ricerca,
                    pagina: filtri?.pagina,
                    limite: filtri?.limite,
                },
            });
            return risposta;
        },
        staleTime: 3 * 60 * 1000,
    });

    return {
        clienti: query.data?.data ?? [],
        meta: query.data?.meta,
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** Dettaglio cliente */
export function useClienteDettaglio(id: string | undefined) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_CLIENTI.dettaglio(id ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<Cliente>(
                `/clienti/${id}`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });

    return {
        cliente: query.data ?? null,
        isCaricamento: query.isLoading,
        errore: query.error,
    };
}

/** Creazione cliente */
export function useCreaCliente() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dati: ClienteCreazione) => {
            const token = await getToken();
            const risposta = await apiPost<Cliente>("/clienti", dati, {
                token: token ?? undefined,
            });
            return risposta.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_CLIENTI.base });
        },
    });
}

/** Aggiornamento cliente */
export function useAggiornaCliente() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, dati }: { id: string; dati: Partial<ClienteCreazione> }) => {
            const token = await getToken();
            const risposta = await apiPatch<Cliente>(
                `/clienti/${id}`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_CLIENTI.base });
            queryClient.invalidateQueries({
                queryKey: CHIAVI_CLIENTI.dettaglio(variabili.id),
            });
        },
    });
}
