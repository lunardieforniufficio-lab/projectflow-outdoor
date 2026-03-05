// Hook CRUD fornitori — lista, dettaglio, creazione, aggiornamento, eliminazione
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import type { Fornitore, FornitoreCreazione, FiltriFornitori } from "@/types";

/** Chiavi query per fornitori */
export const CHIAVI_FORNITORI = {
    base: ["fornitori"] as const,
    lista: (filtri?: FiltriFornitori) => [...CHIAVI_FORNITORI.base, "lista", filtri] as const,
    dettaglio: (id: string) => [...CHIAVI_FORNITORI.base, "dettaglio", id] as const,
};

/** Lista fornitori */
export function useFornitori(filtri?: FiltriFornitori) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_FORNITORI.lista(filtri),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<Fornitore[]>("/fornitori", {
                token: token ?? undefined,
                parametri: {
                    search: filtri?.ricerca,
                    attivo: filtri?.attivo !== undefined ? String(filtri.attivo) : undefined,
                    pagina: filtri?.pagina,
                    limite: filtri?.limite,
                },
            });
            return risposta;
        },
        staleTime: 3 * 60 * 1000,
    });

    return {
        fornitori: query.data?.data ?? [],
        meta: query.data?.meta,
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** Dettaglio fornitore */
export function useFornitoreDettaglio(id: string | undefined) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_FORNITORI.dettaglio(id ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<Fornitore>(
                `/fornitori/${id}`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        enabled: !!id,
    });

    return {
        fornitore: query.data ?? null,
        isCaricamento: query.isLoading,
        errore: query.error,
    };
}

/** Creazione fornitore */
export function useCreaFornitore() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dati: FornitoreCreazione) => {
            const token = await getToken();
            const risposta = await apiPost<Fornitore>("/fornitori", dati, {
                token: token ?? undefined,
            });
            return risposta.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_FORNITORI.base });
        },
    });
}

/** Aggiornamento fornitore */
export function useAggiornaFornitore() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, dati }: { id: string; dati: Partial<FornitoreCreazione> }) => {
            const token = await getToken();
            const risposta = await apiPatch<Fornitore>(
                `/fornitori/${id}`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_FORNITORI.base });
            queryClient.invalidateQueries({
                queryKey: CHIAVI_FORNITORI.dettaglio(variabili.id),
            });
        },
    });
}

/** Eliminazione fornitore */
export function useEliminaFornitore() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const token = await getToken();
            const risposta = await apiDelete<void>(
                `/fornitori/${id}`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_FORNITORI.base });
        },
    });
}
